-- Datos inventados para probar los estados de una invitación. No usar en una invitación real.

insert into public.invitations (
  slug, template_key, theme_key, status, event_at, timezone, takedown_on,
  preview_title, preview_description, preview_image_url, content, features
) values
  (
    'demo', 'baby-shower', 'sage-geese', 'published',
    '2027-06-12 16:00:00-03', 'America/Argentina/Buenos_Aires', '2027-12-31',
    'Baby shower de demostración',
    'Invitación de prueba de Invitaciones Digitales.', '/og/demo.png',
    '{"babyName": "Bebé Demo", "hosts": "Ana y Juan",
      "message": "Estamos muy felices de compartir con vos la espera de nuestro bebé.",
      "closing": "¡Gracias por acompañarnos en este momento tan especial!",
      "location": {"address": "Av. Siempre Viva 742, Ciudad de Ejemplo",
        "notes": ["Hay estacionamiento en la esquina", "Tocar timbre en la casa del fondo"]},
      "rsvp": {"contactMessage": "Si necesitás cambiar tu respuesta, escribile a Ana."}}',
    '{countdown,map,gifts,rsvp}'
  ),
  (
    'demo-cerrada', 'baby-shower', 'sage-geese', 'published',
    '2027-06-12 16:00:00-03', 'America/Argentina/Buenos_Aires', '2027-12-31',
    'Confirmaciones cerradas', '', null,
    '{"babyName": "Bebé Demo", "hosts": "Ana y Juan",
      "rsvp": {"closedMessage": "Las confirmaciones cerraron el 1 de enero.",
        "contactMessage": "Si necesitás cambiar algo, escribile a Ana."}}',
    '{rsvp}'
  ),
  (
    'demo-borrador', 'baby-shower', 'sage-geese', 'draft',
    '2027-06-12 16:00:00-03', 'America/Argentina/Buenos_Aires', null,
    'Borrador de demostración', '', null, '{}', '{}'
  ),
  (
    'demo-baja', 'baby-shower', 'sage-geese', 'archived',
    '2026-01-10 16:00:00-03', 'America/Argentina/Buenos_Aires', null,
    'Invitación dada de baja', '', null, '{"title": "No debería verse"}', '{}'
  ),
  (
    'demo-error', 'plantilla-inexistente', 'sage-geese', 'published',
    '2027-06-12 16:00:00-03', 'America/Argentina/Buenos_Aires', '2027-12-31',
    'Plantilla inexistente', '', null, '{}', '{}'
  )
on conflict (slug) do nothing;

update public.invitations set rsvp_closes_at = '2026-01-01 00:00:00-03' where slug = 'demo-cerrada';
