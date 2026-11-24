# 002 — Plantilla `baby-shower` y estilo `sage-geese`: tareas

- **Estado:** aprobada
- **Spec:** [spec.md](spec.md) · **Plan:** [plan.md](plan.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

Cada tarea se marca como hecha (`- [x]`) y lleva su propio commit.

- [x] **T1. Lectura de `content` y datos de la `demo`.** RF-8, RF-9
  - Hecho cuando: hay tests de campos faltantes o con tipo incorrecto y `seed.sql` trae todos los campos del plan.
- [x] **T2. Tipografías y marco gingham del estilo.** RF-10
  - Hecho cuando: `/demo` usa las tres tipografías y el gingham solo en los costados, sin HEX fuera del tema.
- [x] **T3. Portada con sobre y apertura.** RF-1, RF-2, RF-3, RF-4, RF-5
  - Hecho cuando: el sobre abre con animación y sin ella con "reducir movimiento", y no vuelve a aparecer al recargar en el mismo navegador.
- [x] **T4. Presentación y cierre.** RF-6, RF-8, RF-9
  - Hecho cuando: se ven con los datos de la `demo` y sin líneas vacías al quitar un campo.
- [x] **T5. Cuenta regresiva.** RF-11, RF-12
  - Hecho cuando: los tests cubren evento futuro, pasado y otra zona horaria.
- [x] **T6. Fecha y hora.** RF-13
  - Hecho cuando: se ve el día, la fecha y la hora con la jerarquía de la guía.
- [x] **T7. Cómo llegar.** RF-14, RF-15
  - Hecho cuando: hay tests del link y abre Maps desde un Android y desde un iPhone.
- [x] **T8. Lugar de regalos y confirmación, y secciones según funcionalidades.** RF-7, RF-16
  - Hecho cuando: desactivar `gifts` o `rsvp` en los datos oculta su sección.
- [x] **T9. Ilustraciones provisorias y `ASSET_SOURCES.md`.** Reglas
  - Hecho cuando: cada recurso figura con origen y licencia.
- [x] **T10. Revisión en celular y escritorio, y documentación.** RF-10
  - Hecho cuando: no hay desplazamiento horizontal a 360 px, `templates.md` pasa a "en desarrollo" y se actualiza `MEMORY.md`.
