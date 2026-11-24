-- Invitaciones: tabla cerrada al público y dos funciones de lectura por slug.

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  template_key text not null,
  theme_key text not null,
  status text not null default 'draft',
  event_at timestamptz not null,
  timezone text not null default 'America/Argentina/Buenos_Aires',
  rsvp_closes_at timestamptz,
  expected_guests integer,
  takedown_on date,
  preview_title text not null,
  preview_description text not null default '',
  preview_image_url text,
  content jsonb not null default '{}'::jsonb,
  features text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint invitations_status_check
    check (status in ('draft', 'published', 'archived')),
  constraint invitations_slug_format_check
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 40),
  constraint invitations_slug_reserved_check
    check (slug not in ('admin', 'api', 'app', 'assets', 'functions', 'index', 'login', 'owners', 'static')),
  constraint invitations_expected_guests_check
    check (expected_guests is null or expected_guests > 0)
);

alter table public.invitations enable row level security;
revoke all on table public.invitations from public, anon, authenticated;

create function public.invitations_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.takedown_on is null then
    new.takedown_on := (new.event_at at time zone new.timezone)::date + 7;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger invitations_before_write
before insert or update on public.invitations
for each row execute function public.invitations_before_write();

create function public.invitation_visibility(inv public.invitations)
returns text
language sql
stable
set search_path = ''
as $$
  select case
    when inv.status = 'draft' then 'not_found'
    when inv.status = 'archived' then 'unavailable'
    when (now() at time zone inv.timezone)::date >= inv.takedown_on then 'unavailable'
    else 'visible'
  end;
$$;

-- Publicada: todos los datos públicos. Dada de baja: solo el estado. Borrador o inexistente: null.
create function public.get_invitation(p_slug text)
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

-- Solo los campos de vista previa de una invitación publicada; null en cualquier otro caso.
create function public.get_invitation_preview(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'title', i.preview_title,
    'description', i.preview_description,
    'image_url', i.preview_image_url
  )
  from public.invitations i
  where i.slug = p_slug
    and public.invitation_visibility(i) = 'visible';
$$;

revoke all on function public.invitations_before_write() from public, anon, authenticated;
revoke all on function public.invitation_visibility(public.invitations) from public, anon, authenticated;
revoke all on function public.get_invitation(text) from public;
revoke all on function public.get_invitation_preview(text) from public;
grant execute on function public.get_invitation(text) to anon, authenticated;
grant execute on function public.get_invitation_preview(text) to anon, authenticated;
