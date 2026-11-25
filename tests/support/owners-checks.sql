-- Comprobaciones de la spec 005 contra una base local con la seed cargada.
-- Uso: psql "$DB_URL" -v ON_ERROR_STOP=1 -f tests/support/owners-checks.sql
-- Todo corre dentro de una transacción que se deshace al final.

begin;

delete from public.gifts where invitation_id = (select id from public.invitations where slug = 'demo');

insert into public.gifts (id, invitation_id, position, name, max_reservations)
select v.id::uuid, i.id, v.position, v.name, v.max
from public.invitations i,
  (values
    ('d0000000-0000-4000-8000-000000000001', 1, 'Cuna de prueba', 1),
    ('d0000000-0000-4000-8000-000000000002', 2, 'Manta de prueba', 3)
  ) as v(id, position, name, max)
where i.slug = 'demo';

insert into public.gifts (id, invitation_id, name)
select 'e0000000-0000-4000-8000-000000000001', id, 'Regalo de otra invitación'
from public.invitations where slug = 'demo-cerrada';

select public.set_owner_key('demo', 'Gansito Demo');
select public.set_owner_key('demo-cerrada', 'otra clave');

-- RF-22: solo la huella.
do $$
begin
  assert (select owner_key_hash from public.invitations where slug = 'demo') like '$2%';
  assert not exists (select 1 from public.invitations where owner_key_hash ilike '%gansito%');
  begin
    perform public.set_owner_key('demo', 'corta');
    assert false, 'aceptó una palabra clave de menos de 6 caracteres';
  exception when raise_exception then null;
  end;
  begin
    perform public.set_owner_key('demo', repeat('gansito', 11));
    assert false, 'aceptó una palabra clave de más de 72 bytes';
  exception when raise_exception then null;
  end;
end $$;

set local role anon;

do $$
declare
  k text := 'Gansito Demo';
  ana text := 'f1111111-1111-4111-8111-111111111111';
  beto text := 'f2222222-2222-4222-8222-222222222222';
  cuna uuid := 'd0000000-0000-4000-8000-000000000001';
  manta uuid := 'd0000000-0000-4000-8000-000000000002';
  ajeno uuid := 'e0000000-0000-4000-8000-000000000001';
  res jsonb;
  ana_id uuid;
  tomi_id uuid;
  reservation_id uuid;
begin
  perform public.submit_rsvp('demo', 'Meli y Tomi', true, ana);
  perform public.submit_rsvp('demo', 'Beto', false, beto);
  perform public.reserve_gift('demo', cuna, ana);
  perform public.reserve_gift('demo', manta, ana);

  -- RF-4: mayúsculas y espacios en los bordes no importan.
  res := public.get_owner_panel('demo', '  GANSITO demo ');
  assert res ->> 'status' = 'ok', res::text;
  assert (res ->> 'expected_guests')::int = 6, res::text;
  assert jsonb_array_length(res -> 'rsvps') = 2, res::text;
  assert (select count(*) from jsonb_array_elements(res -> 'rsvps') r
    where r ->> 'name' = 'Beto' and r ->> 'attending' = 'false' and r ->> 'manual' = 'false') = 1, res::text;
  assert res -> 'gifts' -> 0 ->> 'name' = 'Cuna de prueba', res::text;
  assert res -> 'gifts' -> 0 -> 'reservations' -> 0 ->> 'name' = 'Meli y Tomi', res::text;
  ana_id := (select (r ->> 'id')::uuid from jsonb_array_elements(res -> 'rsvps') r where r ->> 'name' = 'Meli y Tomi');

  -- RF-2: invitación no visible.
  assert public.get_owner_panel('demo-borrador', k) is null;
  assert public.get_owner_panel('demo-baja', k) is null;
  assert public.get_owner_panel('no-existe', k) is null;
  assert public.owner_add_rsvp('demo-borrador', k, 'Intruso', true) is null;

  -- RF-5 y RF-21: clave incorrecta, sin clave o de otra invitación no devuelve nombres ni cambia nada.
  assert public.get_owner_panel('demo', 'otra clave') = '{"status": "wrong"}';
  assert public.get_owner_panel('demo', null) = '{"status": "wrong"}';
  assert public.owner_delete_rsvp('demo', 'otra clave', ana_id) = '{"status": "wrong"}';
  assert public.owner_update_rsvp('demo', '', ana_id, 'Hackeado', false) = '{"status": "wrong"}';
  assert public.get_rsvp('demo', ana) ->> 'name' = 'Meli y Tomi';
  assert public.get_owner_panel('demo-error', k) = '{"status": "wrong"}';

  -- RF-23: editar nombre; los regalos siguen al nombre.
  assert public.owner_update_rsvp('demo', k, ana_id, '  Meli ', true) = '{"status": "ok"}';
  res := public.get_owner_panel('demo', k);
  assert res -> 'gifts' -> 0 -> 'reservations' -> 0 ->> 'name' = 'Meli', res::text;
  assert public.get_rsvp('demo', ana) = '{"name": "Meli", "attending": true}';
  assert public.owner_update_rsvp('demo', k, ana_id, 'x', true) ->> 'status' = 'invalid_name';
  assert public.owner_update_rsvp('demo', k, gen_random_uuid(), 'Meli', true) ->> 'status' = 'not_found';

  -- RF-25: agregar a mano, sin navegador asociado.
  assert public.owner_add_rsvp('demo', k, 'Tomi', true) = '{"status": "ok"}';
  assert public.owner_add_rsvp('demo', k, ' ', true) ->> 'status' = 'invalid_name';
  res := public.get_owner_panel('demo', k);
  assert jsonb_array_length(res -> 'rsvps') = 3, res::text;
  tomi_id := (select (r ->> 'id')::uuid from jsonb_array_elements(res -> 'rsvps') r
    where r ->> 'name' = 'Tomi' and r ->> 'manual' = 'true' and r ->> 'attending' = 'true');
  assert tomi_id is not null, res::text;

  -- RF-15: anotar a mano cuenta para el cupo, no para el tope por persona; la lista pública lo cuenta.
  assert public.owner_reserve_gift('demo', k, manta, 'Tía Rosa') = '{"status": "ok"}';
  assert public.owner_reserve_gift('demo', k, manta, 'Tía Rosa') = '{"status": "ok"}';
  assert public.owner_reserve_gift('demo', k, manta, 'y') ->> 'status' = 'invalid_name';
  res := public.get_owner_panel('demo', k);
  assert jsonb_array_length(res -> 'gifts' -> 1 -> 'reservations') = 3, res::text;
  reservation_id := (select (r ->> 'id')::uuid from jsonb_array_elements(res -> 'gifts' -> 1 -> 'reservations') r
    where r ->> 'name' = 'Tía Rosa' and r ->> 'manual' = 'true' limit 1);
  assert reservation_id is not null, res::text;
  assert public.get_gifts('demo', beto) -> 'gifts' -> 1 ->> 'available' = 'false';

  -- RF-16: sin lugar o de otra invitación, rechazado.
  assert public.owner_reserve_gift('demo', k, manta, 'Otra Tía') = '{"status": "sold_out"}';
  assert public.owner_reserve_gift('demo', k, cuna, 'Otra Tía') = '{"status": "sold_out"}';
  assert public.owner_reserve_gift('demo', k, ajeno, 'Otra Tía') = '{"status": "not_found"}';

  -- RF-14: quitar una elección, aunque la lista de regalos esté cerrada; repetir no falla.
  assert public.owner_release_gift('demo-cerrada', 'otra clave', reservation_id) = '{"status": "ok"}';
  assert jsonb_array_length(public.get_owner_panel('demo', k) -> 'gifts' -> 1 -> 'reservations') = 3;
  assert public.owner_release_gift('demo', k, reservation_id) = '{"status": "ok"}';
  assert public.owner_release_gift('demo', k, reservation_id) = '{"status": "ok"}';
  assert jsonb_array_length(public.get_owner_panel('demo', k) -> 'gifts' -> 1 -> 'reservations') = 2;

  -- RF-24: pasar a "No asistirá" libera sus elecciones.
  assert public.owner_update_rsvp('demo', k, ana_id, 'Meli', false) = '{"status": "ok"}';
  res := public.get_owner_panel('demo', k);
  assert jsonb_array_length(res -> 'gifts' -> 0 -> 'reservations') = 0, res::text;
  assert jsonb_array_length(res -> 'gifts' -> 1 -> 'reservations') = 1, res::text;
  assert public.get_gifts('demo', ana) ->> 'can_reserve' = 'not_attending';
  perform public.owner_update_rsvp('demo', k, ana_id, 'Meli', true);
  assert public.reserve_gift('demo', cuna, ana) ->> 'status' = 'reserved';

  -- RF-12: borrar libera sus regalos y ese navegador vuelve a ver el formulario; repetir no falla.
  assert public.owner_delete_rsvp('demo', 'otra clave', ana_id) = '{"status": "wrong"}';
  assert public.owner_delete_rsvp('demo-cerrada', 'otra clave', ana_id) = '{"status": "ok"}';
  assert public.get_rsvp('demo', ana) is not null;
  assert public.owner_delete_rsvp('demo', k, ana_id) = '{"status": "ok"}';
  assert public.owner_delete_rsvp('demo', k, ana_id) = '{"status": "ok"}';
  assert public.get_rsvp('demo', ana) is null;
  assert public.get_gifts('demo', beto) -> 'gifts' -> 0 ->> 'available' = 'true';
  assert public.owner_delete_rsvp('demo', k, tomi_id) = '{"status": "ok"}';
  assert jsonb_array_length(public.get_owner_panel('demo', k) -> 'rsvps') = 1;

  -- RF-18: cerrar y reabrir.
  assert public.owner_set_rsvp_closed('demo', k, true) = '{"status": "ok"}';
  assert not (public.get_invitation('demo') ->> 'rsvp_open')::boolean;
  assert public.submit_rsvp('demo', 'Dani', true, 'f3333333-3333-4333-8333-333333333333') ->> 'status' = 'closed';
  res := public.get_owner_panel('demo', k);
  assert res ->> 'rsvp_closed' = 'true' and res ->> 'rsvp_open' = 'false', res::text;
  -- RF-25: con las confirmaciones cerradas, los dueños igual agregan.
  assert public.owner_add_rsvp('demo', k, 'Tomi', false) = '{"status": "ok"}';
  assert public.owner_set_rsvp_closed('demo', k, false) = '{"status": "ok"}';
  assert (public.get_invitation('demo') ->> 'rsvp_open')::boolean;
  assert public.owner_set_rsvp_closed('demo-cerrada', 'otra clave', false) = '{"status": "past_deadline"}';

  -- RF-6: al quinto fallo queda bloqueada, también con la correcta y en todas las funciones.
  assert public.get_owner_panel('demo', k) ->> 'status' = 'ok';
  for i in 1..4 loop
    assert public.get_owner_panel('demo', 'mala') = '{"status": "wrong"}';
  end loop;
  assert public.get_owner_panel('demo', 'mala') = '{"status": "locked"}';
  assert public.get_owner_panel('demo', k) = '{"status": "locked"}';
  assert public.owner_add_rsvp('demo', k, 'Intruso', true) = '{"status": "locked"}';
  -- El bloqueo de una invitación no afecta a otra.
  assert public.get_owner_panel('demo-cerrada', 'otra clave') ->> 'status' = 'ok';
end $$;

-- Sin acceso directo a la huella ni a las funciones internas.
do $$
begin
  begin
    perform owner_key_hash from public.invitations;
    assert false, 'anon pudo leer la huella';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.set_owner_key('demo', 'clave nueva');
    assert false, 'anon pudo cambiar la palabra clave';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.owner_check(i, 'x') from public.invitations i;
    assert false, 'anon pudo usar owner_check';
  exception when insufficient_privilege then null;
  end;
  assert public.get_invitation('demo') -> 'owner_key_hash' is null;
end $$;

reset role;

-- RF-6: pasados los 15 minutos se puede volver a entrar, y un ingreso correcto reinicia la cuenta.
do $$
declare
  inv public.invitations := (select i from public.invitations i where slug = 'demo');
begin
  assert inv.owner_locked_until between now() + interval '14 minutes' and now() + interval '15 minutes';
  update public.invitations set owner_locked_until = now() - interval '1 second' where id = inv.id;
  assert public.get_owner_panel('demo', 'mala') = '{"status": "wrong"}';
  assert public.get_owner_panel('demo', 'gansito demo') ->> 'status' = 'ok';
  assert (select owner_failed_attempts from public.invitations where id = inv.id) = 0;
  assert (select owner_locked_until from public.invitations where id = inv.id) is null;
end $$;

rollback;

\echo 'owners-checks: OK'
