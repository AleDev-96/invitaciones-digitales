# Modelo de datos

**Estado:** `invitations` creada en la spec 001 ([migración](../../supabase/migrations/20261124000000_invitations.sql)). El resto de las tablas es una propuesta que se cierra en las specs 003 y 004. Cada cambio de esquema va en una migración nueva de `supabase/migrations/` y actualiza este documento en el mismo cambio.

## Tabla `invitations`

| Columna | Contenido |
|---|---|
| `id` | Identificador (`uuid`) |
| `slug` | Único; formato y palabras reservadas controlados por la base |
| `template_key`, `theme_key` | Plantilla y estilo |
| `status` | `draft`, `published` o `archived` |
| `event_at`, `timezone` | Fecha y hora del evento, y zona horaria |
| `rsvp_closes_at` | Cierre de confirmaciones (spec 003) |
| `expected_guests` | Invitados esperados (spec 005) |
| `takedown_on` | Fecha de baja; si se deja vacía, 7 días después del evento |
| `preview_title`, `preview_description`, `preview_image_url` | Vista previa del link |
| `content` | Textos y datos propios de la plantilla (`jsonb`) |
| `features` | Funcionalidades activas |
| `created_at`, `updated_at` | Auditoría |

Acceso público, siempre con la clave pública:

| Función | Publicada (antes de `takedown_on`) | Dada de baja o pasada la baja | Borrador o inexistente |
|---|---|---|---|
| `get_invitation(p_slug)` | Datos de la invitación | Solo `{"status": "archived"}` | `null` |
| `get_invitation_preview(p_slug)` | Título, descripción e imagen | `null` | `null` |

La tabla tiene RLS activo y ningún permiso para `anon` ni `authenticated`. Los datos de demostración están en [`supabase/seed.sql`](../../supabase/seed.sql).

## Entidades

| Tabla | Contenido |
|---|---|
| `invitations` | Tipo de evento, `template_key`, `theme_key`, slug, estado, fecha, ubicación y configuración general |
| `gifts` | Regalos de una invitación: nombre, descripción, imágenes, enlace opcional |
| `gift_reservations` | Qué regalo reservó quién, con los datos mínimos para gestionar la reserva |
| `rsvps` | Respuesta de asistencia, cantidad de asistentes y comentario |

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
| Invitado (con token) | Crear, leer y modificar su propia respuesta y su propia reserva | Ver o tocar datos de otro invitado |
| Quien administra (pantalla de Supabase) | Leer y corregir todos los datos. Carga y edita las invitaciones | No aplica: no usa la aplicación |

RLS activo en todas las tablas. Las políticas se prueban con un usuario sin sesión antes de publicar.

## Pendiente de definir

Se define en las specs 003 y 004:

- Columnas y tipos de `gifts`, `gift_reservations` y `rsvps`.
- Dónde vive el token del invitado y cómo se guarda (hash, no texto plano).
- Si existe una tabla de invitados precargados.
- Funciones RPC para confirmar asistencia, reservar, liberar y cambiar regalo.
- Almacenamiento de imágenes de regalos (URLs externas o Supabase Storage).
