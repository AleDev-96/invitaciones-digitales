# 005 — Pantalla de los dueños del evento: plan

- **Estado:** borrador
- **Spec:** [spec.md](spec.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

## Decisiones

| Tema | Decisión | Alternativa descartada |
|---|---|---|
| Acceso | Palabra clave por invitación, comprobada dentro de cada función de los dueños | Cuentas de Supabase Auth: mails, contraseñas y recuperación para algo que dura semanas |
| Huella | `extensions.crypt` con `gen_salt('bf')` de `pgcrypto` (ya viene activa en Supabase) sobre la clave en minúsculas y sin espacios en los bordes | `sha256` como en la spec 003: sirve para códigos aleatorios, pero una palabra elegida por una persona se adivina rápido si alguien llega a la huella |
| Bloqueo | Columnas `owner_failed_attempts` y `owner_locked_until` en `invitations`: 5 fallos seguidos bloquean 15 minutos | Bloqueo por navegador: se saltea borrando los datos del navegador |
| Sesión | La pestaña guarda la palabra clave en `sessionStorage` y la manda en cada llamada | Código de sesión con vencimiento en otra tabla: más tablas y limpieza para el mismo resultado |
| Regalos anotados a mano | `gift_reservations.rsvp_id` pasa a aceptar vacío y se suma `giver_name`; cada fila tiene uno de los dos | Tabla aparte: habría que sumarla al cupo en las funciones públicas de la spec 004, que hoy cuentan `gift_reservations` |
| Invitados agregados a mano | `rsvps.token_hash` pasa a aceptar vacío: una confirmación sin huella es una anotada por los dueños | Columna aparte "anotado a mano": repite lo que ya dice la huella vacía |
| Cupo | Las elecciones a mano cuentan para el cupo del regalo, no para el tope por persona | Permitir pasarse del cupo: la lista pública diría "Disponible" de un regalo completo |
| Plazos | Los dueños quitan o anotan elecciones aunque la lista esté cerrada; solo hace falta la invitación visible | Respetar el cierre de regalos: justo después del cierre es cuando más se corrige |
| Confirmar antes de borrar | Pregunta nativa del navegador (`window.confirm`) | Ventana propia: más código para el mismo pedido |
| Aspecto | Pantalla neutra compartida en `src/features/owners/`, con colores de Tailwind como las pantallas de estado | Una pantalla por estilo: la usan dos personas y no hace falta que combine con la tarjeta |

## Diseño técnico

Migración nueva `supabase/migrations/20261125000000_owners.sql` (no se edita ninguna aplicada):

- `invitations`: `owner_key_hash text`, `owner_failed_attempts integer not null default 0`, `owner_locked_until timestamptz`.
- `rsvps`: `token_hash` sin `not null` (sigue siendo única cuando está cargada).
- `gift_reservations`: `rsvp_id` sin `not null`, `giver_name text` (2 a 60 caracteres, sin espacios de más) y la restricción "uno de los dos".
- `set_owner_key(p_slug, p_key)`: carga o cambia la palabra clave (mínimo 6 caracteres) y reinicia el bloqueo. Solo la ejecuta quien administra desde el SQL Editor; sin permisos para `anon` ni `authenticated`.
- `owner_check(inv, p_key)` (interna): devuelve `ok`, `wrong` o `locked` y actualiza intentos y bloqueo.
- Funciones de los dueños, `security definer`, con permisos para `anon`; todas reciben `p_slug` y `p_key`, devuelven `null` si la invitación no es visible y `{"status": "wrong" | "locked"}` si la clave no pasa:
  - `get_owner_panel`: `{"status": "ok", "expected_guests", "rsvp_open", "rsvp_closed", "rsvp_closes_at", "rsvps": [...], "gifts": [...]}`, con cada regalo y sus elecciones (`id`, nombre, a mano o no).
  - `owner_delete_rsvp(p_rsvp_id)`: borra la respuesta de esa invitación; sus reservas se borran en cascada.
  - `owner_update_rsvp(p_rsvp_id, p_name, p_attending)`: cambia nombre o respuesta; al pasar a "No asistirá" borra sus reservas. `{"status": "invalid_name"}` si el nombre no cumple.
  - `owner_add_rsvp(p_name, p_attending)`: crea una confirmación sin huella, aunque las confirmaciones estén cerradas.
  - `owner_release_gift(p_reservation_id)`: borra la elección si el regalo es de esa invitación.
  - `owner_reserve_gift(p_gift_id, p_name)`: bloquea el regalo (`for update`), controla el cupo y guarda `giver_name`; `{"status": "sold_out"}` o `{"status": "invalid_name"}` si no corresponde.
  - `owner_set_rsvp_closed(p_closed)`: cambia `rsvp_closed`.
- `get_invitation` no cambia: la huella y los intentos no salen nunca.

| Parte | Ubicación | RF |
|---|---|---|
| Columnas, huella, bloqueo y funciones | `supabase/migrations/20261125000000_owners.sql` | RF-4 a RF-6, RF-12, RF-14 a RF-16, RF-18, RF-21 a RF-25 |
| Contadores, colado y orden | `src/domain/owners.ts` | RF-9 a RF-11, RF-13 |
| Llamadas y lectura de respuestas | `src/services/owners.ts` | RF-5, RF-6, RF-8, RF-19 |
| Clave en la pestaña | `src/infra/ownerKeyStorage.ts` | RF-7 |
| Estado del panel y acciones | `src/features/owners/useOwnerPanel.ts` | RF-3 a RF-8, RF-12, RF-14 a RF-20, RF-23 a RF-25 |
| Pantallas de acceso y panel | `src/features/owners/OwnersPage.tsx` y componentes vecinos, `src/content/messages.ts` | RF-2, RF-3, RF-5, RF-6, RF-9 a RF-18, RF-23 a RF-25 |
| Ruta | `src/app/App.tsx` | RF-1, RF-2 |
| Clave de la `demo` | `supabase/seed.sql` (palabra de prueba, no real) | Criterios de aceptación |
| Comprobaciones sin sesión | `tests/support/owners-checks.sql` | RF-5, RF-6, RF-12, RF-14 a RF-16, RF-18, RF-21 a RF-25 |
| Tests unitarios | `tests/unit/` | RF-5 a RF-11, RF-13, RF-19 |

Documentación que se actualiza: `data-model.md`, `architecture.md`, `deployment.md` (cargar la palabra clave), el README (consulta y administración, regla 7), `AGENTS.md`, `MEMORY.md`, el INDEX y el índice de specs.

Para la invitación publicada: quien administra corre la migración en el SQL Editor y después `select public.set_owner_key('<slug>', '<palabra clave>');`. La invitación pública no cambia.

Sin dependencias nuevas.

## Costo

Se mantiene en los planes gratuitos: `pgcrypto` ya está en Supabase y la pantalla es parte de la misma aplicación en Cloudflare Pages.
