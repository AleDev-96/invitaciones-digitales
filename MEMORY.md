# MEMORY.md — Invitaciones Digitales

Memoria del proyecto entre sesiones. Máximo unas 50 líneas: resumir o eliminar lo que ya no aporte.

## Estado actual — v0.1

Spec 001 (arquitectura base) implementada y publicada en `invitaciones-digitales-bhi.pages.dev`: aplicación React con rutas `/<slug>`, tabla `invitations` con acceso por funciones, vista previa del link y keepalive. Spec 002 (plantilla `baby-shower` + estilo `sage-geese`) implementada en rama, pendiente de validación y PR. Siguen las specs 003 a 006 de `docs/specs/INDEX.md`.

## Aprendizajes y errores a evitar

- Las migraciones se aplican pegándolas en el SQL Editor de Supabase; una aplicada no se edita.
- La tarea `keepalive` solo se puede lanzar a mano cuando está en `main`. Lee Variables del repo (no Secrets); `KEEPALIVE_UNTIL` va hasta la fecha de baja.
- `seed.sql` usa `on conflict do nothing`: para cambiar la `demo` ya cargada hace falta un `update`.
- En Cloudflare, el sitio se crea desde "Workers & Pages" → "Create" → pestaña "Pages". El asistente de Workers pide "API Token" y no sirve para este proyecto.

## Decisiones

El detalle está en `docs/architecture/architecture.md`.

- Costo 0: todo en planes gratuitos (Supabase y Cloudflare Pages).
- Un solo repositorio y una sola aplicación para todas las invitaciones.
- Cada invitación usa una plantilla (`template_key`, la estructura) y un estilo (`theme_key`, el aspecto). Una plantilla puede tener varios estilos.
- Varias invitaciones pueden estar publicadas a la vez y compartir plantilla y estilo; sus datos no se mezclan.
- Las funcionalidades son opcionales por invitación y solo se agrega una nueva cuando una invitación la necesita.
- Sin panel de administración: confirmaciones y reservas se consultan desde la pantalla de Supabase.
- La aplicación no genera PDF: se usa la función de imprimir del navegador.
- Al terminar el evento se despublica la invitación y se borran los datos de invitados, previa entrega de la lista a quien la encargó.
- Las capturas de diseños de terceros no se suben al repositorio; la guía de estilo las describe con texto.
- Estructura de carpetas según la convención habitual del responsable (`.github/`, `assets/`, `docs/`, `src/`, `tests/`); detalle en `docs/architecture/project-structure.md`.
- Los 6 principios innegociables están en `docs/CONSTITUTION.md` y ganan ante cualquier spec o skill.
- Los datos reales de una invitación se cargan directo en Supabase, nunca en `seed.sql` ni en otro archivo del repo.
- Orden de trabajo: spec aprobada, armar, validar, testear y recién después el pull request.

## Próximos pasos

Vacío por ahora.
