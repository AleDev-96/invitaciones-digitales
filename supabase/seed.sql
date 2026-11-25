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
      "rsvp": {"closedMessage": "Las confirmaciones cerraron. ¡Nos vemos en la fiesta!",
        "contactMessage": "Si necesitás cambiar tu respuesta, escribile a Ana."},
      "gifts": {"intro": "Tu presencia es nuestro mejor regalo. Si querés sumar algo, te dejamos algunas ideas."}}',
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

insert into public.gifts (invitation_id, position, name, description, max_reservations)
select i.id, g.position, g.name, g.description, g.max_reservations
from public.invitations i,
  (values
    (1, 'Manta de algodón', null, 1),
    (2, 'Set de baño', 'Toallón con capucha y esponja', 1),
    (3, 'Pañales', 'Talle RN', 4),
    (4, 'Pañales', 'Talle P', 5),
    (5, 'Ropa', 'De 3 a 6 meses', 3),
    (6, 'Lámpara de noche', 'Con luz cálida', 1)
  ) as g(position, name, description, max_reservations)
where i.slug = 'demo'
  and not exists (select 1 from public.gifts where invitation_id = i.id);

-- Pantalla de los dueños de la demo: palabra clave de prueba e invitados esperados.
update public.invitations set expected_guests = 6 where slug = 'demo' and expected_guests is null;
select public.set_owner_key('demo', 'Gansito Demo');
