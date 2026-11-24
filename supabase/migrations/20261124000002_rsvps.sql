-- Confirmación de asistencia (spec 003): tabla cerrada al público, cierre manual y funciones por slug.

alter table public.invitations add column rsvp_closed boolean not null default false;

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  guest_name text not null,
  attending boolean not null,
  token_hash text not null unique,
  created_at timestamptz not null default now(),

  constraint rsvps_guest_name_check
    check (char_length(guest_name) between 2 and 60 and guest_name = btrim(guest_name))
);

create index rsvps_invitation_id_idx on public.rsvps (invitation_id);

alter table public.rsvps enable row level security;
revoke all on table public.rsvps from public, anon, authenticated;

-- Abiertas si la invitación usa rsvp, hasta rsvp_closes_at (o la hora del evento si está vacía), salvo cierre manual.
create function public.invitation_rsvp_open(inv public.invitations)
returns boolean
language sql
stable
set search_path = ''
as $$
  select 'rsvp' = any(inv.features)
    and not inv.rsvp_closed
    and now() < coalesce(inv.rsvp_closes_at, inv.event_at);
$$;

-- La base guarda solo la huella del código del navegador.
create function public.rsvp_token_hash(p_token text)
returns text
language sql
immutable
set search_path = ''
as $$
  select encode(sha256(convert_to(p_token, 'UTF8')), 'hex');
$$;

create function public.rsvp_token_valid(p_token text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(p_token ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', false);
$$;

create or replace function public.get_invitation(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select case public.invitation_visibility(i)
    when 'visible' then jsonb_build_object(
      'status', 'published',
      'slug', i.slug,
      'template_key', i.template_key,
      'theme_key', i.theme_key,
      'event_at', i.event_at,
      'timezone', i.timezone,
      'rsvp_closes_at', i.rsvp_closes_at,
      'rsvp_open', public.invitation_rsvp_open(i),
      'expected_guests', i.expected_guests,
      'takedown_on', i.takedown_on,
      'preview_title', i.preview_title,
      'preview_description', i.preview_description,
      'preview_image_url', i.preview_image_url,
      'content', i.content,
      'features', to_jsonb(i.features)
    )
    when 'unavailable' then jsonb_build_object('status', 'archived')
  end
  from public.invitations i
  where i.slug = p_slug;
$$;

-- Guarda la respuesta. El mismo código devuelve la respuesta ya guardada (doble clic o reintento).
create function public.submit_rsvp(p_slug text, p_name text, p_attending boolean, p_token text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  inv public.invitations;
  saved public.rsvps;
  v_name text := regexp_replace(btrim(coalesce(p_name, '')), '\s+', ' ', 'g');
  v_hash text;
begin
  select * into inv from public.invitations where slug = p_slug;
  if not found or public.invitation_visibility(inv) <> 'visible' then
    return null;
  end if;

  if not public.rsvp_token_valid(p_token) or p_attending is null then
    return jsonb_build_object('status', 'invalid_request');
  end if;
  v_hash := public.rsvp_token_hash(p_token);

  select * into saved from public.rsvps where token_hash = v_hash;
  if not found then
    if not public.invitation_rsvp_open(inv) then
      return jsonb_build_object('status', 'closed');
    end if;
    if char_length(v_name) not between 2 and 60 then
      return jsonb_build_object('status', 'invalid_name');
    end if;

    insert into public.rsvps (invitation_id, guest_name, attending, token_hash)
    values (inv.id, v_name, p_attending, v_hash)
    on conflict (token_hash) do nothing
    returning * into saved;

    if not found then
      select * into saved from public.rsvps where token_hash = v_hash;
    end if;
  end if;

  if saved.invitation_id <> inv.id then
    return jsonb_build_object('status', 'invalid_request');
  end if;
  return jsonb_build_object('status', 'saved', 'name', saved.guest_name, 'attending', saved.attending);
end;
$$;

-- La respuesta propia, si sigue existiendo; null en cualquier otro caso.
create function public.get_rsvp(p_slug text, p_token text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object('name', r.guest_name, 'attending', r.attending)
  from public.rsvps r
  join public.invitations i on i.id = r.invitation_id
  where i.slug = p_slug
    and public.invitation_visibility(i) = 'visible'
    and public.rsvp_token_valid(p_token)
    and r.token_hash = public.rsvp_token_hash(p_token);
$$;

revoke all on function public.invitation_rsvp_open(public.invitations) from public, anon, authenticated;
revoke all on function public.rsvp_token_hash(text) from public, anon, authenticated;
revoke all on function public.rsvp_token_valid(text) from public, anon, authenticated;
revoke all on function public.submit_rsvp(text, text, boolean, text) from public;
revoke all on function public.get_rsvp(text, text) from public;
grant execute on function public.submit_rsvp(text, text, boolean, text) to anon, authenticated;
grant execute on function public.get_rsvp(text, text) to anon, authenticated;
