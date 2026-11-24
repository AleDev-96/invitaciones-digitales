# 004 — Lista de regalos con reserva: plan

- **Estado:** implementada
- **Spec:** [spec.md](spec.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

## Decisiones

| Tema | Decisión | Alternativa descartada |
|---|---|---|
| Reconocer a quien elige | El código que guardó el navegador al confirmar (spec 003); la base busca la respuesta por su huella | Pedir el nombre otra vez: no empareja "Jorgito" con "Jorge Ayala" |
| Veces que se elige un regalo | Columna `max_reservations` en `gifts`; al reservar se bloquea la fila del regalo (`for update`) y se cuentan sus reservas dentro de la misma transacción | Contar desde el navegador antes de reservar: dos pedidos simultáneos pasarían los dos |
| Regalos por persona | Columna `gifts_per_guest` en `invitations` (3 por defecto); `reserve_gift` cuenta las reservas de esa respuesta dentro de la misma transacción, bloqueando la fila de la respuesta | Fijar 3 en el código: otra invitación no podría cambiarlo sin código nuevo |
| Doble clic y reintentos | Una reserva por persona y por regalo (único `gift_id` + `rsvp_id`); repetir devuelve la reserva existente | Solo deshabilitar el botón: no cubre un reintento tras un corte de red |
| Acceso | Funciones `get_gifts`, `reserve_gift` y `release_gift` (`security definer`); las tablas no tienen permisos para `anon` ni `authenticated`, igual que `rsvps` | Políticas RLS de lectura directa: expondrían quién reservó o requerirían una vista aparte |
| Lista abierta o cerrada | Columna `gifts_closes_at` en `invitations`; si está vacía, las 00:00 del día del evento en su `timezone`. La calcula la base y `get_gifts` la devuelve como `open` | Usar el reloj del celular: puede estar mal configurado |
| Imágenes y tiendas | Sin columnas de imágenes ni enlaces: la lista es modesta y cada invitado compra lo que pueda | Enlaces a fotos de tiendas o Supabase Storage: trabajo de carga y fotos que pueden desaparecer, para una lista que no busca un producto exacto |
| Pantalla de regalos | Ruta `/<slug>/regalos` dentro de la misma aplicación; carga la invitación con `get_invitation` como `/<slug>` | Ventana emergente en la misma página: el INDEX pide una pantalla aparte con botón para volver |
| Sin `rsvp` activo | Lista solo informativa | Permitir reservar sin respuesta: rompe la decisión del INDEX de reservar solo con "Sí, asistiré" |

## Diseño técnico

Migración nueva `supabase/migrations/20261124000003_gifts.sql` (no se edita ninguna aplicada):

- Tabla `gifts`: `id`, `invitation_id` (borrado en cascada), `position` (orden), `name` (1 a 80 caracteres), `description` (opcional, hasta 200), `max_reservations` (entero mayor que 0, 1 por defecto), `created_at`. RLS activo y sin permisos para `anon` ni `authenticated`.
- Columnas `invitations.gifts_per_guest integer not null default 3` (mayor que 0) y `invitations.gifts_closes_at timestamptz` (opcional).
- `invitation_gifts_open(inv)`: abierta si no pasó `gifts_closes_at` o, si está vacía, las 00:00 del día de `event_at` en `timezone`.
- Tabla `gift_reservations`: `id`, `gift_id` (borrado en cascada), `rsvp_id` (borrado en cascada), `created_at`; único (`gift_id`, `rsvp_id`). RLS activo y sin permisos públicos.
- `get_gifts(p_slug, p_token)`: con la invitación visible y `gifts` activo, devuelve `{"open", "can_reserve", "per_guest", "gifts": [...]}`; cada regalo trae `id`, `name`, `description`, `available` y `mine` (si el código es de quien lo eligió). Nunca devuelve nombres. `can_reserve`: `no_rsvp`, `not_attending`, `attending` o `disabled` (sin `rsvp` activo).
- `reserve_gift(p_slug, p_gift_id, p_token)`: devuelve `{"status": "reserved"}`, `sold_out`, `limit_reached`, `closed`, `no_rsvp`, `not_attending` o `invalid_request`. Invitación no visible: `null`.
- `release_gift(p_slug, p_gift_id, p_token)`: `{"status": "released"}`, `closed` o `invalid_request`.
- Consulta para la pantalla de Supabase con quién eligió cada regalo, documentada en `data-model.md`; la spec 005 la convierte en función.

Campo nuevo de `content` (opcional):

| Campo | Ejemplo |
|---|---|
| `gifts.intro` | "Tu presencia es nuestro mejor regalo. Si querés sumar algo, te dejamos algunas ideas." |

| Parte | Ubicación | RF |
|---|---|---|
| Tablas y funciones | `supabase/migrations/` | RF-4, RF-8 a RF-12, RF-16, RF-18, RF-20 a RF-24 |
| Tipos y reglas de la lista | `src/domain/gift.ts` | RF-4, RF-7, RF-9, RF-14, RF-15, RF-17, RF-19 |
| Leer, elegir y quitar | `src/services/gifts.ts` | RF-8, RF-10, RF-11, RF-13, RF-20 |
| Estado de la lista | `src/features/gifts/useGifts.ts` | RF-7, RF-11, RF-12, RF-14 a RF-19 |
| Ruta `/<slug>/regalos` | `src/app/App.tsx`, `src/features/gifts/GiftsPage.tsx` | RF-2, RF-5, RF-6 |
| Sección y pantalla visual | `src/templates/baby-shower/sections/Gifts.tsx`, `src/templates/baby-shower/GiftList.tsx`, `src/content/messages.ts` | RF-1 a RF-4, RF-6 a RF-15, RF-19, RF-20 |
| Texto de la sección | `src/templates/baby-shower/content.ts` | RF-1 |
| Datos de la `demo` | `supabase/seed.sql` | RF-1 a RF-4 |
| Comprobaciones sin sesión | `tests/support/gifts-checks.sql` | RF-11, RF-12, RF-20 a RF-24 |
| Tests unitarios | `tests/unit/` | RF-4, RF-7, RF-11 a RF-15, RF-17 |

Se borra `ComingSoon.tsx`, que queda sin uso. La función de Cloudflare `functions/[slug].ts` solo atiende `/<slug>`; `/<slug>/regalos` usa la vista previa genérica del sitio.

Documentación que se actualiza: `data-model.md` (tablas, funciones, consulta y la restricción de "una reserva por regalo" que reemplaza `max_reservations`), `architecture.md` (ruta), `templates.md`, el README (lista de regalos), `AGENTS.md`, `MEMORY.md` y el INDEX.

Sin dependencias nuevas.

## Costo

Dos tablas y tres funciones en el mismo proyecto de Supabase, sin imágenes. Con unos 100 invitados y algunas decenas de regalos, el uso queda muy por debajo del plan gratuito. Sin servicios nuevos.
