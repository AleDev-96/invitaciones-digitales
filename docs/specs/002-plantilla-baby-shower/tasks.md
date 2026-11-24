# 002 — Plantilla `baby-shower` y estilo `sage-geese`: tareas

- **Estado:** borrador
- **Spec:** [spec.md](spec.md) · **Plan:** [plan.md](plan.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

Cada tarea se marca como hecha (`- [x]`) y lleva su propio commit.

- [ ] **T1. Lectura de `content` y datos de la `demo`.** RF-6, RF-7
  - Hecho cuando: hay tests de campos faltantes o con tipo incorrecto y `seed.sql` trae todos los campos del plan.
- [ ] **T2. Tipografías y marco gingham del estilo.** RF-8
  - Hecho cuando: `/demo` usa las tres tipografías y el gingham solo en los costados, sin HEX fuera del tema.
- [ ] **T3. Portada con sobre y apertura.** RF-1, RF-2, RF-3, RF-3a, RF-3b
  - Hecho cuando: el sobre abre con animación y sin ella con "reducir movimiento", y no vuelve a aparecer al recargar en el mismo navegador.
- [ ] **T4. Presentación y cierre.** RF-4, RF-6, RF-7
  - Hecho cuando: se ven con los datos de la `demo` y sin líneas vacías al quitar un campo.
- [ ] **T5. Cuenta regresiva.** RF-9, RF-10
  - Hecho cuando: los tests cubren evento futuro, pasado y otra zona horaria.
- [ ] **T6. Fecha y hora.** RF-11
  - Hecho cuando: se ve el día, la fecha y la hora con la jerarquía de la guía.
- [ ] **T7. Cómo llegar.** RF-12, RF-13
  - Hecho cuando: hay tests del link y abre Maps desde un Android y desde un iPhone.
- [ ] **T8. Lugar de regalos y confirmación, y secciones según funcionalidades.** RF-5, RF-14
  - Hecho cuando: desactivar `gifts` o `rsvp` en los datos oculta su sección.
- [ ] **T9. Ilustraciones provisorias y `ASSET_SOURCES.md`.** Reglas
  - Hecho cuando: cada recurso figura con origen y licencia.
- [ ] **T10. Revisión en celular y escritorio, y documentación.** RF-8
  - Hecho cuando: no hay desplazamiento horizontal a 360 px, `templates.md` pasa a "en desarrollo" y se actualiza `MEMORY.md`.
