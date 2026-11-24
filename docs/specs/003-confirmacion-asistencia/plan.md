# 003 — Confirmación de asistencia: plan

- **Estado:** borrador
- **Spec:** [spec.md](spec.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

## Decisiones

| Tema | Decisión | Alternativa descartada |
|---|---|---|
| Reconocer a quien respondió | Código aleatorio generado en el navegador (`crypto.randomUUID()`), guardado en `localStorage` por slug junto con el nombre. La spec 004 lo usa para elegir regalos | Pedir de nuevo el nombre: no empareja "Jorgito" con "Jorge Ayala". Links individuales: descartados en el INDEX |
| Código en la base | Solo su huella `sha256`, con la función nativa de Postgres | Guardar el código tal cual: quien lea la tabla podría hacerse pasar por el invitado. Extensión `pgcrypto`: innecesaria |
| Doble clic y reintentos | El navegador manda el mismo código en cada intento; la huella es única, así que repetir devuelve la respuesta existente | Solo deshabilitar el botón: no cubre un reintento tras un corte de red |
| Acceso | Funciones `submit_rsvp` y `get_rsvp` (`security definer`); la tabla no tiene permisos para `anon` ni `authenticated`, igual que `invitations` | Políticas RLS de inserción directa: reparte la validación del cierre entre la política y el navegador |
| Abierta o cerrada | Lo calcula la base y `get_invitation` lo devuelve como `rsvp_open` | Calcularlo con el reloj del celular: puede estar mal configurado |
| Cierre manual | Columna `rsvp_closed` en `invitations` (falso por defecto); hasta la spec 005 se cambia desde la pantalla de Supabase | Quitar `rsvp` de `features`: oculta la sección entera, incluido el mensaje de cierre |
| Sin fecha de cierre | Se cierra a la hora del evento | Dejarla abierta hasta la baja: se podría confirmar después de la fiesta |
| Envíos masivos | Sin límite ni captcha: los dueños borran las respuestas falsas (decisión del INDEX) | Captcha: servicio externo y dependencia nueva |
| Una sola persona | Un solo campo con la aclaración; si alguien escribe dos nombres, lo corrigen los dueños | Bloquear comas, "y" o "familia": falla con nombres reales y suma reglas para algo que corrigen los dueños |

## Diseño técnico

Migración nueva `supabase/migrations/20261124000002_rsvps.sql` (no se edita ninguna aplicada):

- Tabla `rsvps`: `id`, `invitation_id` (borrado en cascada), `guest_name` (2 a 60 caracteres), `attending` (`boolean`: sí o no), `token_hash` (único), `created_at`. RLS activo y sin permisos para `anon` ni `authenticated`.
- Columna `invitations.rsvp_closed boolean not null default false`.
- `invitation_rsvp_open(inv)`: abierta si no está `rsvp_closed` y no pasó `rsvp_closes_at` (o `event_at` si está vacía).
- `get_invitation(p_slug)`: igual que hoy, más `rsvp_open`.
- `submit_rsvp(p_slug, p_name, p_attending, p_token)`: con la invitación visible, normaliza y valida el nombre, y devuelve `{"status": "saved", "name": ..., "attending": ...}`, `{"status": "closed"}` o `{"status": "invalid_name"}`. Si el código ya existe, devuelve esa respuesta sin crear otra. Invitación no visible: `null`.
- `get_rsvp(p_slug, p_token)`: `{"name": ..., "attending": ...}` si la respuesta existe; si no, `null`.
- Consulta de contadores para la pantalla de Supabase (asistirán, no asistirán, sin respuesta), documentada en `data-model.md`; la spec 005 la convierte en función.

Campos nuevos de `content` (opcionales):

| Campo | Ejemplo |
|---|---|
| `rsvp.closedMessage` | "Las confirmaciones cerraron el 4 de diciembre." |
| `rsvp.contactMessage` | "Si necesitás cambiar algo, escribile a Ana." |

| Parte | Ubicación | RF |
|---|---|---|
| Tabla, cierre y funciones | `supabase/migrations/` | RF-2, RF-3, RF-6, RF-9, RF-12, RF-14, RF-16, RF-17, RF-18 |
| Validación del nombre | `src/domain/rsvp.ts` | RF-4, RF-5 |
| Código y respuesta en el navegador | `src/infra/rsvpStorage.ts` | RF-8, RF-10 |
| Responder y comprobar | `src/services/rsvp.ts` | RF-2, RF-3, RF-7, RF-9, RF-14 |
| `rsvpOpen` en la invitación | `src/domain/invitation.ts`, `src/services/invitations.ts` | RF-12 |
| Estado del formulario | `src/features/rsvp/useRsvp.ts` | RF-1, RF-6, RF-8, RF-11, RF-13, RF-15 |
| Sección visual y textos | `src/templates/baby-shower/sections/Rsvp.tsx`, `src/content/messages.ts` | RF-1 a RF-5, RF-7, RF-11, RF-13 |
| Mensajes de cierre y contacto | `src/templates/baby-shower/content.ts` | RF-11, RF-13 |
| Datos de la `demo` | `supabase/seed.sql` | RF-11, RF-13 |
| Comprobaciones sin sesión | `tests/support/rsvp-checks.sql` | RF-14, RF-16, RF-17 |
| Tests unitarios | `tests/unit/` | RF-4 a RF-10, RF-14 |

Documentación que se actualiza: `data-model.md`, `architecture.md`, `templates.md`, el README (sección de confirmación), `AGENTS.md`, `MEMORY.md` y el INDEX (se cierra el pendiente de cómo se reconoce a quien confirmó).

Sin dependencias nuevas.

## Costo

Una tabla y cuatro funciones en el mismo proyecto de Supabase. Con unos 100 invitados, el uso queda muy por debajo del plan gratuito. Sin servicios nuevos.
