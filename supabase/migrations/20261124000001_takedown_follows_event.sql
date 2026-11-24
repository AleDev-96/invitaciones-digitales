-- Si cambia la fecha del evento y la baja era la automática (7 días después), la baja se recalcula.
create or replace function public.invitations_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE'
    and (new.event_at, new.timezone) is distinct from (old.event_at, old.timezone)
    and new.takedown_on is not distinct from old.takedown_on
    and old.takedown_on = (old.event_at at time zone old.timezone)::date + 7 then
    new.takedown_on := null;
  end if;
  if new.takedown_on is null then
    new.takedown_on := (new.event_at at time zone new.timezone)::date + 7;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
