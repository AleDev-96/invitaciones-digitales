# 001 — Arquitectura base: tareas

- **Estado:** aprobadas
- **Spec:** [spec.md](spec.md) · **Plan:** [plan.md](plan.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

En orden de dependencia. Cada tarea se marca como hecha (`- [x]`) y lleva su propio commit.

- [x] **T1. Crear el proyecto con Vite, React, TypeScript, Tailwind, lint, formato y Vitest.** —
  - Hecho cuando: `npm run build`, `npm run lint`, `npm run typecheck` y `npm test` terminan sin errores, y `AGENTS.md` lista esos comandos.
- [x] **T2. Reglas de dominio de la invitación.** RF-3, RF-4, RF-8
  - Hecho cuando: hay pruebas que cubren slugs válidos, inválidos y reservados, y la visibilidad de cada estado.
- [x] **T3. Migración con la tabla `invitations`, sus permisos y las dos funciones; datos de demostración.** RF-8, RF-9
  - Hecho cuando: con la clave pública la tabla no se puede leer, y las funciones devuelven lo indicado para cada estado.
- [x] **T4. Cliente de Supabase y servicio de carga por slug.** RF-1, RF-5
  - Hecho cuando: el servicio devuelve la invitación, "no encontrada", "dada de baja" o error, con pruebas de cada caso.
- [x] **T5. Rutas, página de invitación, pantallas de estado, registro de plantillas y estilos, y plantilla provisoria.** RF-1 a RF-7, RF-10, RF-11
  - Hecho cuando: en local se ven los cinco estados y el estilo no afecta a la página raíz.
- [x] **T6. Función de vista previa.** RF-12, RF-13
  - Hecho cuando: hay pruebas del armado de etiquetas y de la respuesta sin cambios ante un fallo.
- [x] **T7. Tarea programada.** RF-14 a RF-16
  - Hecho cuando: lanzada a mano se comporta como indica el criterio de aceptación.
  - Hecho: lanzada a mano desde `main` el 2026-11-24 con fecha vigente (2026-12-12), consultó la base y terminó bien. Los casos de fecha vencida y vacía se probaron en local.
- [x] **T8. Publicación en Cloudflare Pages.** RF-1, RF-7, RF-12
  - Hecho cuando: se cumplen los criterios de aceptación sobre la dirección pública.
- [x] **T9. Actualizar la documentación.** —
  - Hecho cuando: `architecture.md`, `data-model.md`, `deployment.md`, `project-structure.md`, `AGENTS.md`, `MEMORY.md`, el README y la skill `create-invitation` reflejan lo construido, sin decisiones abiertas que esta spec cierra.
