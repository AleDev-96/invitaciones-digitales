-- Comprobaciones de la spec 004 contra una base local con la seed cargada.
-- Uso: psql "$DB_URL" -v ON_ERROR_STOP=1 -f tests/support/gifts-checks.sql
-- Todo corre dentro de una transacción que se deshace al final.

begin;

-- Regalos propios de esta prueba, para no depender de los de la seed.
insert into public.gifts (id, invitation_id, position, name, description, max_reservations)
select v.id::uuid, i.id, v.position, v.name, v.description, v.max
from public.invitations i,
  (values
    ('a0000000-0000-4000-8000-000000000001', 1, 'Cuna de prueba', null, 1),
    ('a0000000-0000-4000-8000-000000000002', 2, 'Pañales de prueba', 'Talle P', 2),
    ('a0000000-0000-4000-8000-000000000003', 3, 'Manta de prueba', null, 5),
    ('a0000000-0000-4000-8000-000000000004', 4, 'Babitas de prueba', null, 5)
  ) as v(id, position, name, description, max)
where i.slug = 'demo';

insert into public.gifts (id, invitation_id, name)
select 'b0000000-0000-4000-8000-000000000001', id, 'Regalo de otra invitación'
from public.invitations where slug = 'demo-cerrada';

set local role anon;

do $$
declare
  ana text := 'c1111111-1111-4111-8111-111111111111';
  beto text := 'c2222222-2222-4222-8222-222222222222';
  caro text := 'c3333333-3333-4333-8333-333333333333';
  sin_respuesta text := 'c4444444-4444-4444-8444-444444444444';
  cuna uuid := 'a0000000-0000-4000-8000-000000000001';
  panales uuid := 'a0000000-0000-4000-8000-000000000002';
  manta uuid := 'a0000000-0000-4000-8000-000000000003';
  babitas uuid := 'a0000000-0000-4000-8000-000000000004';
  ajeno uuid := 'b0000000-0000-4000-8000-000000000001';
  res jsonb;
begin
  perform public.submit_rsvp('demo', 'Ana', true, ana);
  perform public.submit_rsvp('demo', 'Beto', false, beto);
  perform public.submit_rsvp('demo', 'Caro', true, caro);

  -- RF-3, RF-4 y RF-21: orden, disponible y sin nombres ni cupos.
  res := public.get_gifts('demo', sin_respuesta);
  assert res ->> 'open' = 'true' and res ->> 'can_reserve' = 'no_rsvp', res::text;
  assert (res ->> 'per_guest')::int = 3, res::text;
  assert res -> 'gifts' -> 0 ->> 'name' = 'Cuna de prueba', res::text;
  assert res -> 'gifts' -> 1 = jsonb_build_object(
    'id', panales, 'name', 'Pañales de prueba', 'description', 'Talle P',
    'available', true, 'mine', false), res::text;
  assert public.get_gifts('demo', beto) ->> 'can_reserve' = 'not_attending';
  assert public.get_gifts('demo', ana) ->> 'can_reserve' = 'attending';

  -- RF-14, RF-15 y RF-22: sin respuesta o con "No podré ir" no se reserva.
  assert public.reserve_gift('demo', cuna, sin_respuesta) ->> 'status' = 'no_rsvp';
  assert public.reserve_gift('demo', cuna, beto) ->> 'status' = 'not_attending';
  assert public.reserve_gift('demo', cuna, 'no-es-un-codigo') ->> 'status' = 'invalid_request';

  -- RF-22: un regalo de otra invitación no se reserva.
  assert public.reserve_gift('demo', ajeno, ana) ->> 'status' = 'invalid_request';

  -- RF-8 y RF-12: reservar; repetir no crea otra reserva.
  assert public.reserve_gift('demo', cuna, ana) ->> 'status' = 'reserved';
  assert public.reserve_gift('demo', cuna, ana) ->> 'status' = 'reserved';
  res := public.get_gifts('demo', ana);
  assert res -> 'gifts' -> 0 ->> 'mine' = 'true' and res -> 'gifts' -> 0 ->> 'available' = 'false', res::text;

  -- RF-4 y RF-11: un regalo agotado se ve "Reservado" y no se puede elegir.
  res := public.get_gifts('demo', caro);
  assert res -> 'gifts' -> 0 ->> 'mine' = 'false' and res -> 'gifts' -> 0 ->> 'available' = 'false', res::text;
  assert public.reserve_gift('demo', cuna, caro) ->> 'status' = 'sold_out';

  -- Un regalo con cupo de 2 sigue disponible después de la primera reserva.
  assert public.reserve_gift('demo', panales, caro) ->> 'status' = 'reserved';
  assert public.get_gifts('demo', ana) -> 'gifts' -> 1 ->> 'available' = 'true';
  assert public.reserve_gift('demo', panales, ana) ->> 'status' = 'reserved';
  assert public.get_gifts('demo', sin_respuesta) -> 'gifts' -> 1 ->> 'available' = 'false';

  -- RF-9: hasta 3 regalos por persona.
  assert public.reserve_gift('demo', manta, ana) ->> 'status' = 'reserved';
  assert public.reserve_gift('demo', babitas, ana) ->> 'status' = 'limit_reached';

  -- RF-10: quitar libera; repetir no falla; después se puede elegir otro.
  assert public.release_gift('demo', manta, ana) ->> 'status' = 'released';
  assert public.release_gift('demo', manta, ana) ->> 'status' = 'released';
  assert public.reserve_gift('demo', babitas, ana) ->> 'status' = 'reserved';

  -- RF-23: no se quita la reserva de otra persona.
  perform public.release_gift('demo', panales, sin_respuesta);
  assert public.get_gifts('demo', caro) -> 'gifts' -> 1 ->> 'mine' = 'true';

  -- Invitación no visible.
  assert public.get_gifts('demo-borrador', ana) is null;
  assert public.reserve_gift('no-existe', cuna, ana) is null;
  assert public.release_gift('demo-baja', cuna, ana) is null;

  -- RF-6: sin la funcionalidad de regalos, lista vacía y cerrada.
  res := public.get_gifts('demo-cerrada', ana);
  assert res -> 'gifts' = '[]'::jsonb and res ->> 'open' = 'false', res::text;
end $$;

-- RF-23: sin acceso directo a las tablas ni a las funciones internas.
do $$
begin
  begin
    perform 1 from public.gifts;
    assert false, 'anon pudo leer gifts';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.gift_reservations;
    assert false, 'anon pudo leer gift_reservations';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.gift_reservations;
    assert false, 'anon pudo borrar gift_reservations';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.invitation_gifts_open(i) from public.invitations i;
    assert false, 'anon pudo usar invitation_gifts_open';
  exception when insufficient_privilege then null;
  end;
end $$;

reset role;

do $$
declare
  demo_id uuid := (select id from public.invitations where slug = 'demo');
  ana text := 'c1111111-1111-4111-8111-111111111111';
  caro text := 'c3333333-3333-4333-8333-333333333333';
  cuna uuid := 'a0000000-0000-4000-8000-000000000001';
  panales uuid := 'a0000000-0000-4000-8000-000000000002';
  res jsonb;
begin
  -- RF-18: con las confirmaciones cerradas, la lista sigue abierta.
  update public.invitations set rsvp_closed = true where id = demo_id;
  assert public.release_gift('demo', cuna, ana) ->> 'status' = 'released';
  assert public.reserve_gift('demo', cuna, ana) ->> 'status' = 'reserved';

  -- RF-18: sin fecha de cierre, cierra a las 00:00 del día del evento (hora de la invitación).
  update public.invitations
  set event_at = (date_trunc('day', now() at time zone timezone) + interval '20 hours') at time zone timezone
  where id = demo_id;
  assert not (public.get_gifts('demo', ana) ->> 'open')::boolean;
  update public.invitations set event_at = now() + interval '2 days' where id = demo_id;
  assert (public.get_gifts('demo', ana) ->> 'open')::boolean;

  -- RF-18 y RF-20: con fecha de cierre vencida, se rechaza en la base.
  update public.invitations set gifts_closes_at = now() - interval '1 minute' where id = demo_id;
  res := public.get_gifts('demo', ana);
  assert res ->> 'open' = 'false' and res -> 'gifts' -> 0 ->> 'mine' = 'true', res::text;
  assert public.reserve_gift('demo', panales, ana) ->> 'status' = 'closed';
  assert public.release_gift('demo', cuna, ana) ->> 'status' = 'closed';

  -- RF-17: sin la funcionalidad de confirmación, lista solo informativa.
  update public.invitations set gifts_closes_at = null, features = '{gifts}' where id = demo_id;
  assert public.get_gifts('demo', ana) ->> 'can_reserve' = 'disabled';
  assert public.reserve_gift('demo', panales, ana) ->> 'status' = 'no_rsvp';
  update public.invitations set features = '{countdown,map,gifts,rsvp}' where id = demo_id;

  -- RF-16 y RF-24: borrar la respuesta borra sus reservas y libera el regalo.
  delete from public.rsvps where token_hash = public.rsvp_token_hash(caro);
  assert public.get_gifts('demo', ana) -> 'gifts' -> 1 ->> 'available' = 'true';
  assert public.get_gifts('demo', caro) ->> 'can_reserve' = 'no_rsvp';

  -- RF-24: borrar un regalo o la invitación borra sus reservas.
  delete from public.gifts where id = cuna;
  assert not exists (select 1 from public.gift_reservations where gift_id = cuna);
  delete from public.invitations where id = demo_id;
  assert not exists (select 1 from public.gifts where invitation_id = demo_id);
  assert not exists (select 1 from public.gift_reservations);
end $$;

rollback;

\echo 'gifts-checks: OK'
