# Modelo de datos

**Estado:** `invitations` creada en la spec 001 ([migración](../../supabase/migrations/20261124000000_invitations.sql)) `rsvps` en la spec 003 ([migración](../../supabase/migrations/20261124000002_rsvps.sql)) y `gifts` y `gift_reservations` en la spec 004 ([migración](../../supabase/migrations/20261124000003_gifts.sql)). Cada cambio de esquema va en una migración nueva de `supabase/migrations/` y actualiza este documento en el mismo cambio.

## Tabla `invitations`

| Columna | Contenido |
|---|---|
| `id` | Identificador (`uuid`) |
| `slug` | Único; formato y palabras reservadas controlados por la base |
| `template_key`, `theme_key` | Plantilla y estilo |
| `status` | `draft`, `published` o `archived` |
| `event_at`, `timezone` | Fecha y hora del evento, y zona horaria |
| `rsvp_closes_at` | Cierre de las respuestas; si está vacía, se cierran a la hora del evento |
| `rsvp_closed` | Cierre manual de las respuestas (falso por defecto) |
| `expected_guests` | Invitados esperados (spec 005) |
| `takedown_on` | Fecha de baja; si se deja vacía, 7 días después del evento. Si cambia la fecha del evento y la baja era la automática, se recalcula |
| `preview_title`, `preview_description`, `preview_image_url` | Vista previa del link |
| `content` | Textos y datos propios de la plantilla (`jsonb`) |
| `features` | Funcionalidades activas |
| `gifts_per_guest` | Cuántos regalos distintos puede elegir cada persona (3 por defecto, mayor que 0) |
| `gifts_closes_at` | Cierre de la lista de regalos; si está vacía, a las 00:00 del día del evento en su `timezone` |
| `created_at`, `updated_at` | Auditoría |

Acceso público, siempre con la clave pública:

| Función | Publicada (antes de `takedown_on`) | Dada de baja o pasada la baja | Borrador o inexistente |
|---|---|---|---|
| `get_invitation(p_slug)` | Datos de la invitación, con `rsvp_open` | Solo `{"status": "archived"}` | `null` |
| `get_invitation_preview(p_slug)` | Título, descripción e imagen | `null` | `null` |

La tabla tiene RLS activo y ningún permiso para `anon` ni `authenticated`.

## Tabla `rsvps`

Una respuesta por persona y por navegador (spec 003).

| Columna | Contenido |
|---|---|
| `id` | Identificador (`uuid`) |
| `invitation_id` | Invitación; al borrarla se borran sus respuestas |
| `guest_name` | Nombre en texto libre, de 2 a 60 caracteres, sin espacios de más |
| `attending` | `true`: "Sí, asistiré"; `false`: "No podré ir" |
| `token_hash` | Huella `sha256` (única) del código que guarda el navegador; el código no se guarda |
| `created_at` | Fecha de la respuesta |

Acceso público, siempre con la clave pública y solo con la invitación visible:

| Función | Devuelve |
|---|---|
| `submit_rsvp(p_slug, p_name, p_attending, p_token)` | `{"status": "saved", "name", "attending"}`; con el mismo código, la respuesta ya guardada. `{"status": "closed"}` con las respuestas cerradas, `{"status": "invalid_name"}` o `{"status": "invalid_request"}`. Invitación no visible: `null` |
| `get_rsvp(p_slug, p_token)` | `{"name", "attending"}` de la propia respuesta, o `null` si no existe o los dueños la borraron |

La tabla tiene RLS activo y ningún permiso para `anon` ni `authenticated`: no se puede listar, modificar ni borrar desde la página. Las comprobaciones están en [`tests/support/rsvp-checks.sql`](../../tests/support/rsvp-checks.sql).

Contadores desde el SQL Editor de Supabase (la spec 005 los muestra en la pantalla de los dueños):

```sql
select
  count(*) filter (where r.attending) as asistiran,
  count(*) filter (where not r.attending) as no_asistiran,
  greatest(coalesce(i.expected_guests, 0) - count(r.id), 0) as sin_respuesta
from public.invitations i
left join public.rsvps r on r.invitation_id = i.id
where i.slug = 'demo'
group by i.id;
```

Para cerrar las respuestas a mano: `update public.invitations set rsvp_closed = true where slug = 'demo';`.

Los datos de demostración están en [`supabase/seed.sql`](../../supabase/seed.sql).

## Tablas `gifts` y `gift_reservations`

Lista de regalos con reserva (spec 004).

| Columna de `gifts` | Contenido |
|---|---|
| `id` | Identificador (`uuid`) |
| `invitation_id` | Invitación; al borrarla se borran sus regalos |
| `position` | Orden en la lista |
| `name` | Nombre, de 1 a 80 caracteres, sin espacios de más |
| `description` | Opcional, hasta 200 caracteres (por ejemplo, "Talle P") |
| `max_reservations` | Cuántas veces se puede elegir (1 por defecto, mayor que 0) |
| `created_at` | Fecha de carga |

| Columna de `gift_reservations` | Contenido |
|---|---|
| `id` | Identificador (`uuid`) |
| `gift_id` | Regalo; al borrarlo se borran sus reservas |
| `rsvp_id` | Respuesta de quien eligió; al borrarla se borran sus reservas |
| `created_at` | Fecha de la elección |

Único (`gift_id`, `rsvp_id`): una persona elige cada regalo una sola vez.

Acceso público, siempre con la clave pública y solo con la invitación visible. El código es el que guardó el navegador al confirmar (spec 003):

| Función | Devuelve |
|---|---|
| `get_gifts(p_slug, p_token)` | `{"open", "can_reserve", "per_guest", "gifts": [{"id", "name", "description", "available", "mine"}]}`. `can_reserve`: `attending`, `not_attending`, `no_rsvp` o `disabled` (sin `rsvp` activo). Sin `gifts` activo, la lista viene vacía. Nunca devuelve nombres ni cuántas veces se eligió. Invitación no visible: `null` |
| `reserve_gift(p_slug, p_gift_id, p_token)` | `{"status": "reserved"}` (repetir devuelve lo mismo), `sold_out`, `limit_reached`, `closed`, `no_rsvp`, `not_attending` o `invalid_request`. Invitación no visible: `null` |
| `release_gift(p_slug, p_gift_id, p_token)` | `{"status": "released"}` (repetir no falla), `closed`, `no_rsvp` o `invalid_request`. Invitación no visible: `null` |

`reserve_gift` bloquea la fila de la respuesta y la del regalo (`for update`, en ese orden) y cuenta las reservas dentro de la misma transacción: dos pedidos simultáneos por el último lugar no pasan los dos. Las tablas tienen RLS activo y ningún permiso para `anon` ni `authenticated`. Las comprobaciones están en [`tests/support/gifts-checks.sql`](../../tests/support/gifts-checks.sql).

Quién eligió cada regalo, desde el SQL Editor de Supabase (la spec 005 lo muestra en la pantalla de los dueños):

```sql
select g.position, g.name, g.description, g.max_reservations,
  count(gr.id) as elegido,
  string_agg(r.guest_name, ', ' order by gr.created_at) as quienes
from public.gifts g
join public.invitations i on i.id = g.invitation_id
left join public.gift_reservations gr on gr.gift_id = g.id
left join public.rsvps r on r.id = gr.rsvp_id
where i.slug = 'demo'
group by g.id
order by g.position;
```

Para cerrar la lista a mano: `update public.invitations set gifts_closes_at = now() where slug = 'demo';`.

## Entidades

| Tabla | Contenido |
|---|---|
| `invitations` | Tipo de evento, `template_key`, `theme_key`, slug, estado, fecha, ubicación y configuración general |
| `gifts` | Regalos de una invitación: nombre, descripción opcional y cuántas veces se puede elegir |
| `gift_reservations` | Qué respuesta eligió qué regalo |
| `rsvps` | Respuesta de una persona: nombre y si asiste |

## Relaciones

```text
invitations 1 ── N gifts 1 ── N gift_reservations N ── 1 rsvps
invitations 1 ── N rsvps
```

Toda tabla dependiente de un evento referencia `invitation_id`.

## Restricciones

- `invitations.slug` es único.
- Un regalo se elige como máximo `max_reservations` veces, y cada persona elige como máximo `gifts_per_guest` regalos distintos. Lo controla la base con bloqueo de filas, no una consulta previa desde el navegador.
- Para cambiar de regalo, el invitado quita su elección y elige otro.
- Los totales se calculan con consultas sobre los registros; no se guardan contadores.

## Acceso por rol

| Rol | Puede | No puede |
|---|---|---|
| Público (sin sesión) | Leer una invitación activa y sus regalos con estado disponible/reservado | Listar respuestas, ver quién reservó, leer invitaciones inactivas |
| Invitado (con el código de su navegador) | Crear y leer su propia respuesta; elegir y quitar sus propios regalos | Modificar o borrar su respuesta, ver o tocar datos de otro invitado |
| Quien administra (pantalla de Supabase) | Leer y corregir todos los datos. Carga y edita las invitaciones | No aplica: no usa la aplicación |

RLS activo en todas las tablas. Las políticas se prueban con un usuario sin sesión antes de publicar.
