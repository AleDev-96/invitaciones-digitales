# 006 — Invitación: primer baby shower

- **Tipo:** invitación
- **Estado:** aprobada
- **Fecha:** 2026-11-24

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

El repositorio es público: acá no van nombres, dirección, slug ni palabra clave. Esos datos se cargan directo en Supabase.

## Evento

- **Tipo de evento:** baby shower
- **Plantilla (`template_key`):** `baby-shower`
- **Estilo (`theme_key`):** `sage-geese`
- **Slug de la URL:** lo define el responsable y no se anota en el repositorio.
- **Fecha del evento:** 05/12/2026, de 14:30 a 18:30, mostrado como "De 14:30 a 18:30 hs.". La hora de inicio es `event_at` y la de fin es `content.endTime`, un campo opcional nuevo de la plantilla `baby-shower`. Si cambian, se actualizan en Supabase.
- **Cierre de confirmaciones:** 04/12/2026 a las 23:59 (`rsvp_closes_at`).
- **Cierre de la lista de regalos:** el automático, hasta las 00:00 del 05/12/2026 (todo el 04/12).
- **Invitados esperados:** 64 (`expected_guests`; lo usa la pantalla de los dueños de la spec 005).
- **Regalos por persona:** hasta 3; se puede elegir 1, 2 o 3 (`gifts_per_guest`, valor por defecto).
- **Fecha de baja:** la automática, 7 días después del evento: 12/12/2026. Desde ese día la página muestra que no está disponible; si los dueños lo piden, se da de baja antes. El borrado de datos de invitados es manual, después de entregarles la lista.

## Estilo

- **Guía de estilo:** [sage-geese.md](../../guias/baby-shower/sage-geese.md)
- **Cambios respecto de la guía:** ninguno.

## Imágenes

- Las ilustraciones provisorias de la spec 002 (`data-placeholder="true"`) se reemplazan por las finales del estilo `sage-geese`, propias o con licencia verificada y registradas en [ASSET_SOURCES.md](../../guias/ASSET_SOURCES.md). Valen para todas las invitaciones con este estilo. Origen: las genera el responsable con IA, en PNG o JPG; el fondo se quita en el proyecto; en `ASSET_SOURCES.md` se anota la herramienta usada y que sus términos permiten el uso comercial.
- Se reemplazan las 3 ilustraciones provisorias: presentación (familia de gansos), regalos (gansito con caja de regalo) y cierre (gansito en globo aerostático). El sobre de la portada pasa a ser una ilustración (sobre a cuadros con hilo y ramita): al tocarlo da un saltito, se acerca y se desvanece. Además, el nombre del bebé y el de los anfitriones pasan al verde oscuro del estilo, el nombre del bebé más grande, y los cuadros del borde toman el tono de los moños.
- Imagen de la vista previa del link (WhatsApp): una ilustración del gansito del estilo, sin datos del evento, en `public/og/`.
- No hay fotos propias del evento.

## Funcionalidades

| Funcionalidad | Activa | Notas |
|---|---|---|
| `countdown` | Sí | Hasta la fecha y hora del evento |
| `map` | Sí | Dirección, link de Google Maps e indicaciones |
| `gifts` | Sí | Lista real con el cupo de cada regalo |
| `rsvp` | Sí | Mensajes de cierre y de contacto con los dueños |

## Contenido

El responsable pasa por el chat de trabajo: nombre del bebé, quienes invitan, mensaje de presentación, mensaje de cierre, dirección, link de Google Maps, indicaciones para llegar, mensajes de cierre y de contacto de las confirmaciones, texto de la sección de regalos y la lista de regalos (nombre, detalle y cuántas veces se puede elegir cada uno). Con eso se arma un archivo SQL fuera del repositorio que el responsable pega en el SQL Editor de Supabase cuando decide.

La palabra clave de los dueños queda para la spec 005, que crea el dato.

## Criterios de aceptación

- [x] Se ve bien en celular y en escritorio, con las ilustraciones finales y sin ninguna marcada como provisoria.
- [ ] La invitación real carga en su URL con los textos, la fecha, la hora y la ubicación entregados.
- [ ] "Cómo llegar" abre Google Maps en la dirección correcta en Android y en iPhone.
- [ ] Las funcionalidades activas funcionan de punta a punta con datos de prueba: confirmar "Sí, asistiré" y "No podré ir", elegir, cambiar y quitar regalos.
- [ ] La vista previa del link en WhatsApp muestra título, descripción e imagen sin datos personales.
- [ ] Los datos de prueba se borraron antes de compartir el enlace.
- [ ] `KEEPALIVE_UNTIL` llega hasta la fecha de baja y la tarea `keepalive` está activa.
- [ ] Después del evento: se entrega a los dueños la lista de confirmados y regalos, se da de baja la invitación y se borran los datos de invitados.

## Historial de cambios

- 2026-11-25: horario de 14:30 a 18:30 con el campo nuevo `content.endTime`; regalo y globo intercambiados entre regalos y cierre; sobre ilustrado en la portada; nombres en verde oscuro y borde a cuadros más marcado, fino en escritorio.
- 2026-11-25: para que se lea mejor, la indicación del sobre es más grande y los textos azul y gris son más oscuros; la confirmación de asistencia pasa antes de los regalos; el aviso de nombre vacío dice "Ingrese su nombre, por favor.".
