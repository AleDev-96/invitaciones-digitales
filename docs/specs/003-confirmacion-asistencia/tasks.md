# 003 — Confirmación de asistencia: tareas

- **Estado:** aprobada
- **Spec:** [spec.md](spec.md) · **Plan:** [plan.md](plan.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

Cada tarea se marca como hecha (`- [x]`) y lleva su propio commit.

- [ ] **T1. Migración de `rsvps`, cierre y funciones.** RF-2, RF-3, RF-6, RF-9, RF-12, RF-14, RF-16, RF-17, RF-18
  - Hecho cuando: aplicada sobre una base de prueba, `tests/support/rsvp-checks.sql` pasa con el rol `anon` y la consulta de contadores devuelve los tres números.
- [ ] **T2. Validación del nombre.** RF-4, RF-5
  - Hecho cuando: hay tests de nombre vacío, corto, largo y con espacios de más.
- [ ] **T3. Código y respuesta en el navegador.** RF-8, RF-10
  - Hecho cuando: hay tests de guardar, leer, borrar y navegador sin almacenamiento.
- [ ] **T4. Servicio de respuestas y `rsvpOpen`.** RF-2, RF-3, RF-7, RF-9, RF-12, RF-14
  - Hecho cuando: hay tests de respuesta guardada (sí y no), cerrada, nombre inválido, error de red y respuesta borrada.
- [ ] **T5. Estado del formulario y sección "Confirmar asistencia".** RF-1 a RF-8, RF-11, RF-13, RF-15
  - Hecho cuando: en `/demo` se responde sí y no desde dos navegadores, se recarga y se ve cada agradecimiento; con el cierre activado se ve el mensaje de cierre.
- [ ] **T6. Mensajes de cierre y contacto, y datos de la `demo`.** RF-11, RF-13
  - Hecho cuando: `seed.sql` trae los dos mensajes y hay tests de la lectura de `content`.
- [ ] **T7. Documentación.** Reglas
  - Hecho cuando: `data-model.md` (con la consulta de contadores), `architecture.md`, `templates.md`, el README, `AGENTS.md`, `MEMORY.md` y el INDEX reflejan la spec.
- [ ] **T8. Revisión en celular y escritorio.** RF-1, RF-13
  - Hecho cuando: a 360 px y en escritorio se ven el formulario, los dos agradecimientos y el cierre sin desplazamiento horizontal.
