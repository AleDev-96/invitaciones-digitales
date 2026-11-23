# MEMORY.md — Invitaciones Digitales

Memoria del proyecto entre sesiones. Máximo unas 50 líneas: resumir o eliminar lo que ya no aporte.

## Estado actual — v0.1

Armado inicial del harness, hasta tener el ambiente listo para empezar el desarrollo de las invitaciones digitales personalizadas.

## Aprendizajes y errores a evitar

Vacío por ahora.

## Decisiones

El detalle está en `docs/architecture/architecture.md`.

- Costo 0: todo en planes gratuitos (Supabase y Cloudflare Pages).
- Un solo repositorio y una sola aplicación para todas las invitaciones.
- Cada invitación usa una plantilla (`template_key`, la estructura) y un estilo (`theme_key`, el aspecto). Una plantilla puede tener varios estilos.
- Varias invitaciones pueden estar publicadas a la vez y compartir plantilla y estilo; sus datos no se mezclan.
- Las funcionalidades son opcionales por invitación y solo se agrega una nueva cuando una invitación la necesita.
- Sin panel de administración propio por ahora: se consulta desde la pantalla de Supabase.
- La aplicación no genera PDF: se usa la función de imprimir del navegador.
- Al terminar el evento se despublica la invitación y se borran los datos de invitados, previa entrega de la lista a quien la encargó.
- Las capturas de diseños de terceros no se suben al repositorio; la guía de estilo las describe con texto.
- Estructura de carpetas según la convención habitual del responsable (`.github/`, `assets/`, `docs/`, `src/`, `tests/`); detalle en `docs/architecture/project-structure.md`.
- Orden de trabajo: spec aprobada, armar, validar, testear y recién después el pull request.

## Próximos pasos

Vacío por ahora.
