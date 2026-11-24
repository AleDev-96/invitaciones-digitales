# 002 — Plantilla `baby-shower` y estilo `sage-geese`: spec

- **Tipo:** larga
- **Estado:** borrador
- **Fecha:** 2026-11-24

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

## Objetivo

Reemplazar la plantilla provisoria de la spec 001 por la invitación de baby shower que se recorre en el celular: portada con sobre, presentación, cuenta regresiva, fecha, cómo llegar y cierre, con el estilo `sage-geese`. Es la base visual sobre la que las specs 003 y 004 suman la confirmación y los regalos.

## Alcance

- Portada con sobre y apertura animada.
- Una sola página larga con las secciones de la [guía de estilo](../../guias/baby-shower/sage-geese.md#5-orden-recomendado-de-secciones), en ese orden.
- Funcionalidades `countdown` (cuenta regresiva) y `map` (cómo llegar).
- Lugar reservado en la página para regalos y confirmación de asistencia, sin su lógica.
- Paleta, tipografías y marco gingham del estilo `sage-geese`.
- Ilustraciones provisorias identificadas como tales.
- Textos del evento cargados en los datos de la invitación, y la invitación `demo` actualizada para recorrer todo.

## Fuera de alcance

- Formulario de confirmación y sus datos: spec 003.
- Lista de regalos, reservas y su pantalla: spec 004.
- Pantalla de los dueños: spec 005.
- Ilustraciones finales y datos reales: spec 006.
- Música, galería de fotos o cualquier sección que no esté en la guía.

## Requisitos funcionales

Portada:

- RF-1: CUANDO alguien abre una invitación publicada, EL SISTEMA muestra primero la portada con el sobre cerrado y el texto "¡Tenés una invitación!".
- RF-2: CUANDO el invitado toca el sobre, EL SISTEMA lo abre con una animación de 1,5 segundos como máximo y muestra la presentación.
- RF-3: MIENTRAS el dispositivo tenga activada la preferencia de reducir movimiento, EL SISTEMA pasa a la presentación sin animación.

Página:

- RF-4: EL SISTEMA muestra las secciones en este orden: presentación, cuenta regresiva, fecha y hora, cómo llegar, regalos, confirmación de asistencia y cierre, en una sola columna que se recorre deslizando hacia abajo.
- RF-5: EL SISTEMA muestra solo las secciones de funcionalidades activas en la invitación (`countdown`, `map`, `gifts`, `rsvp`). Presentación, fecha y hora y cierre se muestran siempre.
- RF-6: EL SISTEMA toma de los datos de la invitación todos los textos del evento: nombre del bebé, quienes invitan, mensaje, dirección, indicaciones y agradecimiento.
- RF-7: SI falta un texto opcional en los datos, ENTONCES EL SISTEMA omite esa línea sin dejar huecos ni mostrar textos de relleno.
- RF-8: EL SISTEMA no genera desplazamiento horizontal en anchos de 360 a 430 px, y en escritorio mantiene la columna centrada con el marco gingham a los costados.

Cuenta regresiva:

- RF-9: MIENTRAS falte tiempo para el evento, EL SISTEMA muestra días, horas, minutos y segundos restantes, actualizados cada segundo y calculados con la zona horaria de la invitación.
- RF-10: CUANDO llega la hora del evento, EL SISTEMA reemplaza la cuenta regresiva por un texto de "¡Llegó el día!" y nunca muestra valores negativos.

Fecha y hora:

- RF-11: EL SISTEMA muestra el día de la semana, la fecha (mes, día y año) y la hora del evento en la zona horaria de la invitación. SI el navegador no reconoce esa zona, ENTONCES EL SISTEMA muestra la fecha con la zona indicada, como ya hace la spec 001.

Cómo llegar:

- RF-12: CUANDO el invitado toca "Cómo llegar", EL SISTEMA abre la ubicación del evento en Google Maps (la aplicación si está instalada, o el navegador) en Android y en iPhone.
- RF-13: EL SISTEMA muestra la dirección escrita debajo del botón y, si existen, las indicaciones (por ejemplo, estacionamiento) en una lista.

Regalos y confirmación (lugar reservado):

- RF-14: MIENTRAS las specs 003 y 004 no estén implementadas, EL SISTEMA muestra en esas secciones su título y el texto "Muy pronto", sin botones que se puedan tocar.

## Reglas

- Las del [README](../../../README.md) y la [constitución](../../CONSTITUTION.md).
- Lo visual se verifica contra la [guía de estilo `sage-geese`](../../guias/baby-shower/sage-geese.md).
- Ninguna ilustración se copia de la invitación de referencia. Las provisorias son propias y quedan registradas en `docs/guias/ASSET_SOURCES.md`.
- Ningún código HEX fuera del tema del estilo.
- Sin datos personales reales: la `demo` usa datos inventados.

## Criterios de aceptación

- [ ] `/demo` muestra la portada y, al tocar el sobre, la animación y la presentación, en un celular y en escritorio.
- [ ] Con "reducir movimiento" activado, el sobre abre sin animación.
- [ ] Las secciones aparecen en el orden de RF-4 y una funcionalidad desactivada en los datos hace desaparecer su sección.
- [ ] La cuenta regresiva de una invitación con fecha pasada muestra "¡Llegó el día!" y ningún número negativo.
- [ ] "Cómo llegar" abre Google Maps en la ubicación correcta desde un Android y desde un iPhone.
- [ ] A 360 px no hay desplazamiento horizontal.
- [ ] Ningún componente contiene códigos HEX ni textos del evento escritos a mano.
- [ ] `npm run build`, el lint y los tests pasan.

## Preguntas abiertas

- Texto del botón: "Cómo llegar" (INDEX) o "Ver mapa" (guía de estilo).
- Si el sobre aparece en cada visita o solo la primera vez en ese navegador.

## Historial de cambios

| Fecha | Cambio |
|---|---|
| 2026-11-24 | Borrador inicial |
| 2026-11-24 | Tipografías: se guardan en el repositorio con `@fontsource` |
