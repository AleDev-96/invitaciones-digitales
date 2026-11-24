# 006 — Invitación: primer baby shower: tareas

- **Estado:** aprobada
- **Spec:** [spec.md](spec.md) · **Plan:** [plan.md](plan.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

Cada tarea se marca como hecha (`- [x]`) y lleva su propio commit.

- [ ] **T1. Ilustraciones finales del estilo `sage-geese`.**
  - Hecho cuando: ninguna ilustración tiene `data-placeholder="true"`, cada recurso figura en `ASSET_SOURCES.md` y `/demo` se ve bien en celular y escritorio.
- [ ] **T2. Imagen de la vista previa del link.**
  - Hecho cuando: el link de la `demo` en un validador de Open Graph muestra la imagen elegida.
- [ ] **T3. Archivo SQL con los datos reales, fuera del repositorio.**
  - Hecho cuando: aplicado en un Supabase local, la invitación carga con sus textos, fecha, ubicación y regalos, y queda en borrador.
- [ ] **T4. Carga en Supabase y prueba de punta a punta.**
  - Hecho cuando: el responsable cargó el SQL, la invitación se probó publicada con invitados de prueba (sí, no, regalos) y los datos de prueba se borraron.
- [ ] **T5. Documentación y keepalive.**
  - Hecho cuando: `templates.md` marca `sage-geese` como disponible, el índice de `README.md` muestra la invitación publicada y `KEEPALIVE_UNTIL` llega a la fecha de baja.
- [ ] **T6. Baja después del evento.**
  - Hecho cuando: los dueños recibieron la lista de confirmados y regalos, la invitación está dada de baja y no quedan filas en `rsvps` ni `gift_reservations` de esta invitación.
