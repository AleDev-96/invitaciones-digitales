-- Comprobaciones de la spec 003 contra una base local con la seed cargada.
-- Uso: psql "$DB_URL" -v ON_ERROR_STOP=1 -f tests/support/rsvp-checks.sql
-- Todo corre dentro de una transacción que se deshace al final.

begin;

set local role anon;

do $$
declare
  tok text := '11111111-1111-4111-8111-111111111111';
  res jsonb;
begin
  -- RF-2 y RF-6: guarda una vez; repetir con el mismo código devuelve la misma respuesta.
  res := public.submit_rsvp('demo', '  Ana   Pérez ', true, tok);
  assert res = '{"status": "saved", "name": "Ana Pérez", "attending": true}', res::text;
  res := public.submit_rsvp('demo', 'Otro nombre', false, tok);
  assert res = '{"status": "saved", "name": "Ana Pérez", "attending": true}', res::text;

  -- RF-3: "No podré ir".
  res := public.submit_rsvp('demo', 'Beto', false, '22222222-2222-4222-8222-222222222222');
  assert res ->> 'attending' = 'false', res::text;

  -- RF-5: nombre inválido.
  res := public.submit_rsvp('demo', ' a ', true, '33333333-3333-4333-8333-333333333333');
  assert res ->> 'status' = 'invalid_name', res::text;
  res := public.submit_rsvp('demo', repeat('x', 61), true, '33333333-3333-4333-8333-333333333333');
  assert res ->> 'status' = 'invalid_name', res::text;

  -- Código con formato inválido.
  res := public.submit_rsvp('demo', 'Carla', true, 'no-es-un-codigo');
  assert res ->> 'status' = 'invalid_request', res::text;

  -- RF-8: comprobar la propia respuesta; con otro código no aparece.
  res := public.get_rsvp('demo', tok);
  assert res = '{"name": "Ana Pérez", "attending": true}', res::text;
  assert public.get_rsvp('demo', '44444444-4444-4444-8444-444444444444') is null;
  assert public.get_rsvp('demo-cerrada', tok) is null;

  -- Invitación no visible.
  assert public.submit_rsvp('demo-borrador', 'Ana', true, tok) is null;
  assert public.submit_rsvp('no-existe', 'Ana', true, tok) is null;

  -- RF-12 y RF-14: cerrada por fecha.
  res := public.submit_rsvp('demo-cerrada', 'Ana', true, '55555555-5555-4555-8555-555555555555');
  assert res ->> 'status' = 'closed', res::text;
  assert (public.get_invitation('demo') ->> 'rsvp_open')::boolean;
  assert not (public.get_invitation('demo-cerrada') ->> 'rsvp_open')::boolean;

  -- Sin la funcionalidad rsvp no se aceptan respuestas.
  res := public.submit_rsvp('demo-error', 'Ana', true, '77777777-7777-4777-8777-777777777777');
  assert res ->> 'status' = 'closed', res::text;
end $$;

-- RF-16: sin acceso directo a la tabla ni a las funciones internas.
do $$
begin
  begin
    perform 1 from public.rsvps;
    assert false, 'anon pudo leer rsvps';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.rsvps (invitation_id, guest_name, attending, token_hash)
    select id, 'Intruso', true, 'x' from public.invitations limit 1;
    assert false, 'anon pudo insertar en rsvps';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.rsvp_token_hash('x');
    assert false, 'anon pudo usar rsvp_token_hash';
  exception when insufficient_privilege then null;
  end;
end $$;

reset role;

do $$
declare
  demo_id uuid := (select id from public.invitations where slug = 'demo');
begin
  -- RF-17: solo la huella del código.
  assert not exists (select 1 from public.rsvps where token_hash like '1111%');
  assert (select count(*) from public.rsvps where invitation_id = demo_id) = 2;

  -- RF-14: cierre manual.
  update public.invitations set rsvp_closed = true where id = demo_id;
  assert public.submit_rsvp('demo', 'Dani', true, '66666666-6666-4666-8666-666666666666') ->> 'status' = 'closed';
  -- RF-15: quien ya respondió sigue viendo su respuesta.
  assert public.submit_rsvp('demo', 'Ana', true, '11111111-1111-4111-8111-111111111111') ->> 'status' = 'saved';
  assert public.get_rsvp('demo', '11111111-1111-4111-8111-111111111111') is not null;

  -- RF-9: si los dueños borran la respuesta, ya no aparece.
  delete from public.rsvps where guest_name = 'Beto';
  assert public.get_rsvp('demo', '22222222-2222-4222-8222-222222222222') is null;

  -- RF-18: borrar la invitación borra sus respuestas.
  delete from public.invitations where id = demo_id;
  assert not exists (select 1 from public.rsvps where invitation_id = demo_id);
end $$;

rollback;

\echo 'rsvp-checks: OK'
