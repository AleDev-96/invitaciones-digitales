# 004 — Lista de regalos con reserva: tareas

- **Estado:** aprobada
- **Spec:** [spec.md](spec.md) · **Plan:** [plan.md](plan.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

Cada tarea se marca como hecha (`- [x]`) y lleva su propio commit.

- [x] **T1. Migración de `gifts` y `gift_reservations`, y funciones.** RF-4, RF-8 a RF-12, RF-16, RF-18, RF-20 a RF-24
  - Hecho cuando: aplicada sobre una base de prueba, `tests/support/gifts-checks.sql` pasa con el rol `anon`, incluidos dos pedidos simultáneos sobre un regalo de 1 vez, un cuarto regalo de la misma persona y el cierre con y sin `gifts_closes_at`.
- [x] **T2. Tipos y reglas de la lista.** RF-4, RF-7, RF-9, RF-14, RF-15, RF-17, RF-19
  - Hecho cuando: hay tests de qué botones y avisos corresponden a cada caso (sin respuesta, sí, no, sin `rsvp`, cerrada, tope de regalos alcanzado).
- [x] **T3. Servicio de regalos.** RF-8, RF-10, RF-11, RF-13, RF-20
  - Hecho cuando: hay tests de lista leída, reserva guardada, agotado, tope alcanzado, cerrada, sin respuesta y error de red.
- [x] **T4. Estado de la lista y ruta `/<slug>/regalos`.** RF-2, RF-5, RF-6, RF-7, RF-11, RF-12, RF-14 a RF-19
  - Hecho cuando: `/demo/regalos` carga la lista y `/demo-borrador/regalos` muestra lo mismo que `/demo-borrador`.
- [x] **T5. Sección "Regalos" y pantalla de la lista en `baby-shower`.** RF-1 a RF-4, RF-6 a RF-15, RF-19, RF-20
  - Hecho cuando: en `/demo` se abre la lista, se elige, se quita y se vuelve, con los avisos de cada caso.
- [x] **T6. Texto de la sección y regalos de la `demo`.** RF-1 a RF-4
  - Hecho cuando: `seed.sql` trae el texto y regalos de 1 y de varias veces, con y sin descripción; hay tests de la lectura de `content`.
- [ ] **T7. Documentación.** Reglas
  - Hecho cuando: `data-model.md` (con la consulta de quién eligió), `architecture.md`, `templates.md`, el README, `AGENTS.md`, `MEMORY.md` y el INDEX reflejan la spec.
- [ ] **T8. Revisión en celular y escritorio.** RF-2, RF-3
  - Hecho cuando: a 360 px y en escritorio se ven la sección, la lista y cada estado del regalo sin desplazamiento horizontal.
