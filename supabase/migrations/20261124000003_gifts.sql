-- Lista de regalos (spec 004): tablas cerradas al público, cupo por regalo, tope por persona y funciones por slug.

alter table public.invitations
  add column gifts_per_guest integer not null default 3,
  add column gifts_closes_at timestamptz,
  add constraint invitations_gifts_per_guest_check check (gifts_per_guest > 0);

create table public.gifts (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  position integer not null default 0,
  name text not null,
  description text,
  max_reservations integer not null default 1,
  created_at timestamptz not null default now(),

  constraint gifts_name_check
    check (char_length(name) between 1 and 80 and name = btrim(name)),
  constraint gifts_description_check
    check (description is null or char_length(description) <= 200),
  constraint gifts_max_reservations_check
    check (max_reservations > 0)
);

create index gifts_invitation_id_idx on public.gifts (invitation_id, position);

create table public.gift_reservations (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references public.gifts (id) on delete cascade,
  rsvp_id uuid not null references public.rsvps (id) on delete cascade,
  created_at timestamptz not null default now(),

  constraint gift_reservations_once_per_guest unique (gift_id, rsvp_id)
);

create index gift_reservations_rsvp_id_idx on public.gift_reservations (rsvp_id);

alter table public.gifts enable row level security;
alter table public.gift_reservations enable row level security;
revoke all on table public.gifts from public, anon, authenticated;
revoke all on table public.gift_reservations from public, anon, authenticated;

-- Abierta si la invitación usa gifts, hasta gifts_closes_at o, si está vacía, hasta las 00:00 del día del evento.
create function public.invitation_gifts_open(inv public.invitations)
returns boolean
language sql
stable
set search_path = ''
as $$
  select 'gifts' = any(inv.features)
    and now() < coalesce(
      inv.gifts_closes_at,
      date_trunc('day', inv.event_at at time zone inv.timezone) at time zone inv.timezone
    );
$$;

-- La respuesta de quien tiene ese código en esa invitación, o null.
create function public.rsvp_for_token(inv public.invitations, p_token text)
returns public.rsvps
language sql
stable
set search_path = ''
as $$
  select r.*
  from public.rsvps r
  where r.invitation_id = inv.id
    and public.rsvp_token_valid(p_token)
    and r.token_hash = public.rsvp_token_hash(p_token);
$$;

-- Lista pública: nunca devuelve nombres ni cuántas veces se eligió cada regalo.
create function public.get_gifts(p_slug text, p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  inv public.invitations;
  guest public.rsvps;
  v_can_reserve text;
begin
  select * into inv from public.invitations where slug = p_slug;
  if not found or public.invitation_visibility(inv) <> 'visible' then
    return null;
  end if;

  guest := public.rsvp_for_token(inv, p_token);
  v_can_reserve := case
    when not ('rsvp' = any(inv.features)) then 'disabled'
    when guest.id is null then 'no_rsvp'
    when not guest.attending then 'not_attending'
    else 'attending'
  end;

  return jsonb_build_object(
    'open', public.invitation_gifts_open(inv),
    'can_reserve', v_can_reserve,
    'per_guest', inv.gifts_per_guest,
    'gifts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id,
        'name', g.name,
        'description', g.description,
        'available', (select count(*) from public.gift_reservations gr where gr.gift_id = g.id) < g.max_reservations,
        'mine', guest.id is not null and exists (
          select 1 from public.gift_reservations gr where gr.gift_id = g.id and gr.rsvp_id = guest.id
        )
      ) order by g.position, g.created_at)
      from public.gifts g
      where g.invitation_id = inv.id and 'gifts' = any(inv.features)
    ), '[]'::jsonb)
  );
end;
$$;

-- Reserva un regalo para quien respondió "Sí, asistiré". Bloquea la respuesta y el regalo (en ese orden)
-- para que el tope por persona y el cupo del regalo se cuenten sin pedidos simultáneos.
create function public.reserve_gift(p_slug text, p_gift_id uuid, p_token text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  inv public.invitations;
  guest public.rsvps;
  gift public.gifts;
begin
  select * into inv from public.invitations where slug = p_slug;
  if not found or public.invitation_visibility(inv) <> 'visible' then
    return null;
  end if;

  if not public.rsvp_token_valid(p_token) or p_gift_id is null then
    return jsonb_build_object('status', 'invalid_request');
  end if;
  if not public.invitation_gifts_open(inv) then
    return jsonb_build_object('status', 'closed');
  end if;
  if not ('rsvp' = any(inv.features)) then
    return jsonb_build_object('status', 'no_rsvp');
  end if;

  select * into guest from public.rsvps
  where invitation_id = inv.id and token_hash = public.rsvp_token_hash(p_token)
  for update;
  if not found then
    return jsonb_build_object('status', 'no_rsvp');
  end if;
  if not guest.attending then
    return jsonb_build_object('status', 'not_attending');
  end if;

  select * into gift from public.gifts
  where id = p_gift_id and invitation_id = inv.id
  for update;
  if not found then
    return jsonb_build_object('status', 'invalid_request');
  end if;

  if exists (select 1 from public.gift_reservations where gift_id = gift.id and rsvp_id = guest.id) then
    return jsonb_build_object('status', 'reserved');
  end if;
  if (select count(*) from public.gift_reservations where rsvp_id = guest.id) >= inv.gifts_per_guest then
    return jsonb_build_object('status', 'limit_reached');
  end if;
  if (select count(*) from public.gift_reservations where gift_id = gift.id) >= gift.max_reservations then
    return jsonb_build_object('status', 'sold_out');
  end if;

  insert into public.gift_reservations (gift_id, rsvp_id) values (gift.id, guest.id);
  return jsonb_build_object('status', 'reserved');
end;
$$;

-- Quita la reserva propia de un regalo. Repetir no falla.
create function public.release_gift(p_slug text, p_gift_id uuid, p_token text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  inv public.invitations;
  guest public.rsvps;
begin
  select * into inv from public.invitations where slug = p_slug;
  if not found or public.invitation_visibility(inv) <> 'visible' then
    return null;
  end if;

  if not public.rsvp_token_valid(p_token) or p_gift_id is null then
    return jsonb_build_object('status', 'invalid_request');
  end if;
  if not public.invitation_gifts_open(inv) then
    return jsonb_build_object('status', 'closed');
  end if;

  select * into guest from public.rsvps
  where invitation_id = inv.id and token_hash = public.rsvp_token_hash(p_token)
  for update;
  if not found then
    return jsonb_build_object('status', 'no_rsvp');
  end if;

  delete from public.gift_reservations gr
  using public.gifts g
  where gr.gift_id = g.id
    and g.id = p_gift_id
    and g.invitation_id = inv.id
    and gr.rsvp_id = guest.id;
  return jsonb_build_object('status', 'released');
end;
$$;

revoke all on function public.invitation_gifts_open(public.invitations) from public, anon, authenticated;
revoke all on function public.rsvp_for_token(public.invitations, text) from public, anon, authenticated;
revoke all on function public.get_gifts(text, text) from public;
revoke all on function public.reserve_gift(text, uuid, text) from public;
revoke all on function public.release_gift(text, uuid, text) from public;
grant execute on function public.get_gifts(text, text) to anon, authenticated;
grant execute on function public.reserve_gift(text, uuid, text) to anon, authenticated;
grant execute on function public.release_gift(text, uuid, text) to anon, authenticated;
