# Modelo de datos

**Estado:** `invitations` creada en la spec 001 ([migración](../../supabase/migrations/20261124000000_invitations.sql)) y `rsvps` en la spec 003 ([migración](../../supabase/migrations/20261124000002_rsvps.sql)). Las tablas de regalos son una propuesta que se cierra en la spec 004. Cada cambio de esquema va en una migración nueva de `supabase/migrations/` y actualiza este documento en el mismo cambio.

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

## Entidades

| Tabla | Contenido |
|---|---|
| `invitations` | Tipo de evento, `template_key`, `theme_key`, slug, estado, fecha, ubicación y configuración general |
| `gifts` | Regalos de una invitación: nombre, descripción, imágenes, enlace opcional |
| `gift_reservations` | Qué regalo reservó quién, con los datos mínimos para gestionar la reserva |
| `rsvps` | Respuesta de una persona: nombre y si asiste |

## Relaciones

```text
invitations 1 ── N gifts 1 ── 0..1 gift_reservations
invitations 1 ── N rsvps
```

Toda tabla dependiente de un evento referencia `invitation_id`.

## Restricciones

- `invitations.slug` es único.
- Un regalo tiene como máximo una reserva activa. Se garantiza con una restricción de unicidad en la base, no con una consulta previa desde el navegador.
- Cambiar de regalo libera la reserva anterior y crea la nueva en una sola transacción.
- Los totales se calculan con consultas sobre los registros; no se guardan contadores.

## Acceso por rol

| Rol | Puede | No puede |
|---|---|---|
| Público (sin sesión) | Leer una invitación activa y sus regalos con estado disponible/reservado | Listar respuestas, ver quién reservó, leer invitaciones inactivas |
| Invitado (con el código de su navegador) | Crear y leer su propia respuesta; crear y modificar su propia reserva | Modificar o borrar su respuesta, ver o tocar datos de otro invitado |
| Quien administra (pantalla de Supabase) | Leer y corregir todos los datos. Carga y edita las invitaciones | No aplica: no usa la aplicación |

RLS activo en todas las tablas. Las políticas se prueban con un usuario sin sesión antes de publicar.

## Pendiente de definir

Se define en la spec 004:

- Columnas y tipos de `gifts` y `gift_reservations`.
- Funciones RPC para reservar, liberar y cambiar regalo, con el código de `rsvps`.
- Almacenamiento de imágenes de regalos (URLs externas o Supabase Storage).
