# 005 — Pantalla de los dueños del evento: tareas

- **Estado:** borrador
- **Spec:** [spec.md](spec.md) · **Plan:** [plan.md](plan.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

Cada tarea se marca como hecha (`- [x]`) y lleva su propio commit.

- [ ] **T1. Migración, clave de la `demo` y comprobaciones SQL.** RF-4 a RF-6, RF-12, RF-14 a RF-16, RF-18, RF-21 a RF-25
  - Hecho cuando: `tests/support/owners-checks.sql` pasa contra la base local, y `rsvp-checks.sql` y `gifts-checks.sql` siguen pasando.
- [ ] **T2. Dominio y servicio de los dueños.** RF-5, RF-6, RF-8 a RF-11, RF-13, RF-19
  - Hecho cuando: los tests unitarios de contadores, colado, orden y lectura de respuestas pasan.
- [ ] **T3. Clave en la pestaña, ruta y pantalla de acceso.** RF-1 a RF-8
  - Hecho cuando: en la vista previa, `/demo/papis` pide la clave, entra con la correcta, muestra los errores y "Salir" la olvida.
- [ ] **T4. Panel de confirmaciones.** RF-9 a RF-12, RF-19, RF-20, RF-23 a RF-25
  - Hecho cuando: los contadores y nombres coinciden con la base; editar, agregar y borrar se reflejan en los contadores, y borrar o pasar a "No asistirá" libera sus regalos.
- [ ] **T5. Panel de regalos.** RF-13 a RF-16, RF-19, RF-20
  - Hecho cuando: cada regalo muestra "n de m" y nombres, y "Quitar" y "Anotar a mano" se reflejan en `/demo/regalos`.
- [ ] **T6. Cerrar y reabrir confirmaciones.** RF-17, RF-18
  - Hecho cuando: cerrar muestra el mensaje de cierre en `/demo` y reabrir vuelve a mostrar el formulario.
- [ ] **T7. Documentación.** —
  - Hecho cuando: README, `AGENTS.md`, `MEMORY.md`, arquitectura, modelo de datos, despliegue e índices describen la pantalla de los dueños.
- [ ] **T8. Verificación visual y SQL para la invitación publicada.** Criterios de aceptación
  - Hecho cuando: capturas de celular (360 px) y escritorio revisadas, y el SQL de la migración y de la palabra clave listo para el SQL Editor, fuera del repositorio.
