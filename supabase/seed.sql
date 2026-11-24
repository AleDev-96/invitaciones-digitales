-- Datos inventados para probar los estados de una invitación. No usar en una invitación real.

insert into public.invitations (
  slug, template_key, theme_key, status, event_at, timezone, takedown_on,
  preview_title, preview_description, content, features
) values
  (
    'demo', 'baby-shower', 'sage-geese', 'published',
    '2027-06-12 16:00:00-03', 'America/Argentina/Buenos_Aires', '2027-12-31',
    'Baby shower de demostración',
    'Invitación de prueba de Invitaciones Digitales.',
    '{"title": "Baby shower de demostración", "honoree": "Bebé Demo"}',
    '{}'
  ),
  (
    'demo-borrador', 'baby-shower', 'sage-geese', 'draft',
    '2027-06-12 16:00:00-03', 'America/Argentina/Buenos_Aires', null,
    'Borrador de demostración', '', '{}', '{}'
  ),
  (
    'demo-baja', 'baby-shower', 'sage-geese', 'archived',
    '2026-01-10 16:00:00-03', 'America/Argentina/Buenos_Aires', null,
    'Invitación dada de baja', '', '{"title": "No debería verse"}', '{}'
  ),
  (
    'demo-error', 'plantilla-inexistente', 'sage-geese', 'published',
    '2027-06-12 16:00:00-03', 'America/Argentina/Buenos_Aires', '2027-12-31',
    'Plantilla inexistente', '', '{}', '{}'
  )
on conflict (slug) do nothing;
