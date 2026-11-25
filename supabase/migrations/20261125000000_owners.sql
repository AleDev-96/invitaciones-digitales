-- Pantalla de los dueños (spec 005): palabra clave por invitación con bloqueo, invitados y regalos anotados a mano,
-- y funciones que comprueban la palabra clave en cada llamada.

alter table public.invitations
  add column owner_key_hash text,
  add column owner_failed_attempts integer not null default 0,
  add column owner_locked_until timestamptz;

-- Una confirmación sin huella es una que anotaron los dueños.
alter table public.rsvps alter column token_hash drop not null;

-- Una elección es de una confirmación o está anotada a mano con el nombre de quien regala.
alter table public.gift_reservations
  alter column rsvp_id drop not null,
  add column giver_name text,
  add constraint gift_reservations_giver_name_check
    check (giver_name is null or (char_length(giver_name) between 2 and 60 and giver_name = btrim(giver_name))),
  add constraint gift_reservations_owner_check
    check ((rsvp_id is null) <> (giver_name is null));

create function public.normalize_guest_name(p_name text)
returns text
language sql
immutable
set search_path = ''
as $$
  select regexp_replace(btrim(coalesce(p_name, '')), '\s+', ' ', 'g');
$$;

create function public.normalize_owner_key(p_key text)
returns text
language sql
immutable
set search_path = ''
as $$
  select lower(btrim(coalesce(p_key, '')));
$$;

-- Carga o cambia la palabra clave. Solo desde el SQL Editor de Supabase.
create function public.set_owner_key(p_slug text, p_key text)
returns void
language plpgsql
volatile
set search_path = ''
as $$
declare
  v_key text := public.normalize_owner_key(p_key);
begin
  if char_length(v_key) < 6 then
    raise exception 'La palabra clave tiene que tener al menos 6 caracteres.';
  end if;
  update public.invitations
  set owner_key_hash = extensions.crypt(v_key, extensions.gen_salt('bf')),
      owner_failed_attempts = 0,
      owner_locked_until = null
  where slug = p_slug;
  if not found then
    raise exception 'No existe la invitación %.', p_slug;
  end if;
end;
$$;

-- 'ok', 'wrong' o 'locked'. Cinco fallos seguidos bloquean 15 minutos; un ingreso correcto reinicia la cuenta.
create function public.owner_check(inv public.invitations, p_key text)
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  v_failed integer;
begin
  if inv.owner_locked_until is not null and inv.owner_locked_until > now() then
    return 'locked';
  end if;

  if inv.owner_key_hash is not null
    and extensions.crypt(public.normalize_owner_key(p_key), inv.owner_key_hash) = inv.owner_key_hash then
    if inv.owner_failed_attempts <> 0 or inv.owner_locked_until is not null then
      update public.invitations
      set owner_failed_attempts = 0, owner_locked_until = null
      where id = inv.id;
    end if;
    return 'ok';
  end if;

  update public.invitations
  set owner_failed_attempts = case when owner_failed_attempts + 1 >= 5 then 0 else owner_failed_attempts + 1 end,
      owner_locked_until = case when owner_failed_attempts + 1 >= 5 then now() + interval '15 minutes' end
  where id = inv.id
  returning owner_failed_attempts into v_failed;
  return case when v_failed = 0 then 'locked' else 'wrong' end;
end;
$$;

-- La invitación visible bloqueada para la llamada, o null.
create function public.owner_invitation(p_slug text)
returns public.invitations
language sql
volatile
set search_path = ''
as $$
  select i.* from public.invitations i
  where i.slug = p_slug and public.invitation_visibility(i) = 'visible'
  for update;
$$;

create function public.get_owner_panel(p_slug text, p_key text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  inv public.invitations := public.owner_invitation(p_slug);
  v_check text;
begin
  if inv.id is null then
    return null;
  end if;
  v_check := public.owner_check(inv, p_key);
  if v_check <> 'ok' then
    return jsonb_build_object('status', v_check);
  end if;

  return jsonb_build_object(
    'status', 'ok',
    'expected_guests', inv.expected_guests,
    'rsvp_open', public.invitation_rsvp_open(inv),
    'rsvp_closed', inv.rsvp_closed,
    'rsvp_closes_at', coalesce(inv.rsvp_closes_at, inv.event_at),
    'rsvps', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id,
        'name', r.guest_name,
        'attending', r.attending,
        'manual', r.token_hash is null,
        'created_at', r.created_at
      ) order by r.created_at desc, r.id)
      from public.rsvps r
      where r.invitation_id = inv.id
    ), '[]'::jsonb),
    'gifts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id,
        'name', g.name,
        'description', g.description,
        'max_reservations', g.max_reservations,
        'reservations', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', gr.id,
            'name', coalesce(r.guest_name, gr.giver_name),
            'manual', gr.rsvp_id is null
          ) order by gr.created_at, gr.id)
          from public.gift_reservations gr
          left join public.rsvps r on r.id = gr.rsvp_id
          where gr.gift_id = g.id
        ), '[]'::jsonb)
      ) order by g.position, g.created_at)
      from public.gifts g
      where g.invitation_id = inv.id
    ), '[]'::jsonb)
  );
end;
$$;

-- Borra una confirmación; sus elecciones se borran en cascada. Repetir no falla.
create function public.owner_delete_rsvp(p_slug text, p_key text, p_rsvp_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  inv public.invitations := public.owner_invitation(p_slug);
  v_check text;
begin
  if inv.id is null then
    return null;
  end if;
  v_check := public.owner_check(inv, p_key);
  if v_check <> 'ok' then
    return jsonb_build_object('status', v_check);
  end if;
  delete from public.rsvps where id = p_rsvp_id and invitation_id = inv.id;
  return jsonb_build_object('status', 'ok');
end;
$$;

-- Cambia nombre o respuesta. Pasar a "No asistirá" libera sus elecciones.
create function public.owner_update_rsvp(p_slug text, p_key text, p_rsvp_id uuid, p_name text, p_attending boolean)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  inv public.invitations := public.owner_invitation(p_slug);
  v_check text;
  v_name text := public.normalize_guest_name(p_name);
begin
  if inv.id is null then
    return null;
  end if;
  v_check := public.owner_check(inv, p_key);
  if v_check <> 'ok' then
    return jsonb_build_object('status', v_check);
  end if;
  if char_length(v_name) not between 2 and 60 then
    return jsonb_build_object('status', 'invalid_name');
  end if;
  if p_attending is null then
    return jsonb_build_object('status', 'invalid_request');
  end if;

  update public.rsvps set guest_name = v_name, attending = p_attending
  where id = p_rsvp_id and invitation_id = inv.id;
  if not found then
    return jsonb_build_object('status', 'not_found');
  end if;
  if not p_attending then
    delete from public.gift_reservations where rsvp_id = p_rsvp_id;
  end if;
  return jsonb_build_object('status', 'ok');
end;
$$;

-- Agrega una confirmación sin navegador asociado, aunque las confirmaciones estén cerradas.
create function public.owner_add_rsvp(p_slug text, p_key text, p_name text, p_attending boolean)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  inv public.invitations := public.owner_invitation(p_slug);
  v_check text;
  v_name text := public.normalize_guest_name(p_name);
begin
  if inv.id is null then
    return null;
  end if;
  v_check := public.owner_check(inv, p_key);
  if v_check <> 'ok' then
    return jsonb_build_object('status', v_check);
  end if;
  if char_length(v_name) not between 2 and 60 then
    return jsonb_build_object('status', 'invalid_name');
  end if;
  if p_attending is null then
    return jsonb_build_object('status', 'invalid_request');
  end if;

  insert into public.rsvps (invitation_id, guest_name, attending, token_hash)
  values (inv.id, v_name, p_attending, null);
  return jsonb_build_object('status', 'ok');
end;
$$;

-- Quita una elección de un regalo de esa invitación, aunque la lista esté cerrada. Repetir no falla.
create function public.owner_release_gift(p_slug text, p_key text, p_reservation_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  inv public.invitations := public.owner_invitation(p_slug);
  v_check text;
begin
  if inv.id is null then
    return null;
  end if;
  v_check := public.owner_check(inv, p_key);
  if v_check <> 'ok' then
    return jsonb_build_object('status', v_check);
  end if;
  delete from public.gift_reservations gr
  using public.gifts g
  where gr.id = p_reservation_id and gr.gift_id = g.id and g.invitation_id = inv.id;
  return jsonb_build_object('status', 'ok');
end;
$$;

-- Anota una elección a mano. Cuenta para el cupo del regalo, no para el tope por persona.
create function public.owner_reserve_gift(p_slug text, p_key text, p_gift_id uuid, p_name text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  inv public.invitations := public.owner_invitation(p_slug);
  v_check text;
  v_name text := public.normalize_guest_name(p_name);
  gift public.gifts;
begin
  if inv.id is null then
    return null;
  end if;
  v_check := public.owner_check(inv, p_key);
  if v_check <> 'ok' then
    return jsonb_build_object('status', v_check);
  end if;
  if char_length(v_name) not between 2 and 60 then
    return jsonb_build_object('status', 'invalid_name');
  end if;

  select * into gift from public.gifts
  where id = p_gift_id and invitation_id = inv.id
  for update;
  if not found then
    return jsonb_build_object('status', 'not_found');
  end if;
  if (select count(*) from public.gift_reservations where gift_id = gift.id) >= gift.max_reservations then
    return jsonb_build_object('status', 'sold_out');
  end if;

  insert into public.gift_reservations (gift_id, rsvp_id, giver_name) values (gift.id, null, v_name);
  return jsonb_build_object('status', 'ok');
end;
$$;

create function public.owner_set_rsvp_closed(p_slug text, p_key text, p_closed boolean)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  inv public.invitations := public.owner_invitation(p_slug);
  v_check text;
begin
  if inv.id is null then
    return null;
  end if;
  v_check := public.owner_check(inv, p_key);
  if v_check <> 'ok' then
    return jsonb_build_object('status', v_check);
  end if;
  if p_closed is null then
    return jsonb_build_object('status', 'invalid_request');
  end if;
  if not p_closed and now() >= coalesce(inv.rsvp_closes_at, inv.event_at) then
    return jsonb_build_object('status', 'past_deadline');
  end if;
  update public.invitations set rsvp_closed = p_closed where id = inv.id;
  return jsonb_build_object('status', 'ok');
end;
$$;

revoke all on function public.normalize_guest_name(text) from public, anon, authenticated;
revoke all on function public.normalize_owner_key(text) from public, anon, authenticated;
revoke all on function public.set_owner_key(text, text) from public, anon, authenticated;
revoke all on function public.owner_check(public.invitations, text) from public, anon, authenticated;
revoke all on function public.owner_invitation(text) from public, anon, authenticated;
revoke all on function public.get_owner_panel(text, text) from public;
revoke all on function public.owner_delete_rsvp(text, text, uuid) from public;
revoke all on function public.owner_update_rsvp(text, text, uuid, text, boolean) from public;
revoke all on function public.owner_add_rsvp(text, text, text, boolean) from public;
revoke all on function public.owner_release_gift(text, text, uuid) from public;
revoke all on function public.owner_reserve_gift(text, text, uuid, text) from public;
revoke all on function public.owner_set_rsvp_closed(text, text, boolean) from public;
grant execute on function public.get_owner_panel(text, text) to anon, authenticated;
grant execute on function public.owner_delete_rsvp(text, text, uuid) to anon, authenticated;
grant execute on function public.owner_update_rsvp(text, text, uuid, text, boolean) to anon, authenticated;
grant execute on function public.owner_add_rsvp(text, text, text, boolean) to anon, authenticated;
grant execute on function public.owner_release_gift(text, text, uuid) to anon, authenticated;
grant execute on function public.owner_reserve_gift(text, text, uuid, text) to anon, authenticated;
grant execute on function public.owner_set_rsvp_closed(text, text, boolean) to anon, authenticated;
