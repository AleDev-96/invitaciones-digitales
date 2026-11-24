# 003 — Confirmación de asistencia: spec

- **Tipo:** larga
- **Estado:** aprobada
- **Fecha:** 2026-11-24

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

## Objetivo

Que cada invitado responda desde la invitación si va a ir o no, escribiendo solo su nombre, para que los dueños sepan cuántas personas van, cuántas no y cuántas faltan responder. La tarjeta se manda a cada persona por separado, a su celular, así que cada respuesta es de una sola persona. Reemplaza el lugar reservado "Muy pronto" de la [spec 002](../002-plantilla-baby-shower/spec.md) (RF-16).

## Alcance

- Formulario con un solo campo de nombre y dos botones, "Sí, asistiré" y "No podré ir", en la sección "Confirmar asistencia" de la plantilla `baby-shower`.
- Una respuesta por persona, guardada con su nombre y si asiste o no, para calcular los contadores de la spec 005.
- Bloqueo del formulario en el navegador que ya respondió.
- Cierre de las respuestas por fecha o a mano.
- Mensajes de cierre y de contacto con los dueños cargados en los datos de la invitación.
- Un código guardado en el navegador de quien respondió, que la spec 004 usa para reconocerlo al elegir un regalo.

## Fuera de alcance

- Responder por otras personas o por un grupo familiar. Si alguien escribe dos nombres, lo corrigen los dueños; no hay control automático.
- Chicos u otras personas sin celular: no responden y los dueños los suman por su cuenta.
- Cambiar o cancelar la respuesta desde la invitación: el invitado avisa a los dueños y ellos la borran ([decisión del INDEX](../INDEX.md#decisiones-ya-tomadas)).
- Mostrar en la página pública cuántos respondieron o quiénes.
- Pantalla de los dueños: contadores, lista de nombres al tocar cada contador, aviso de colados, borrar respuestas y botón para cerrar (spec 005). Hasta entonces se hace desde la pantalla de Supabase.
- Links individuales por invitado.

## Requisitos funcionales

Formulario:

- RF-1: MIENTRAS las respuestas estén abiertas y ese navegador no haya respondido, EL SISTEMA muestra un campo "Nombre y apellido", la aclaración "Cada persona responde desde su celular: escribí solo tu nombre" y los botones "Sí, asistiré" y "No podré ir".
- RF-2: CUANDO el invitado toca "Sí, asistiré" con un nombre válido, EL SISTEMA guarda que asiste y muestra "¡Gracias, <nombre>! Tu asistencia está confirmada.".
- RF-3: CUANDO el invitado toca "No podré ir" con un nombre válido, EL SISTEMA guarda que no asiste y muestra "¡Gracias por avisarnos, <nombre>! Te vamos a extrañar.".
- RF-4: SI el invitado toca un botón con el campo vacío, ENTONCES EL SISTEMA no envía nada y muestra "¿Podrías poner tu nombre, por favor? Solo para no insistirte con la confirmación :D".
- RF-5: SI el nombre, sin espacios al principio ni al final, tiene 1 carácter o más de 60, ENTONCES EL SISTEMA no lo envía y muestra debajo del campo qué corregir.
- RF-6: MIENTRAS el envío está en curso, EL SISTEMA deshabilita los dos botones, y un doble clic o un reintento del mismo envío no genera una segunda respuesta.
- RF-7: SI el envío falla por un problema de conexión, ENTONCES EL SISTEMA conserva el nombre escrito y muestra "No pudimos guardar tu respuesta. Probá de nuevo en unos segundos.".

Después de responder:

- RF-8: CUANDO alguien vuelve a abrir la invitación en el navegador desde el que respondió, EL SISTEMA muestra el mensaje de RF-2 o RF-3, según su respuesta, en lugar del formulario.
- RF-9: SI los dueños borraron esa respuesta, ENTONCES EL SISTEMA vuelve a mostrar el formulario en ese navegador.
- RF-10: SI el navegador no permite guardar datos (por ejemplo, en modo incógnito), ENTONCES EL SISTEMA muestra el formulario en cada visita; una respuesta repetida la borran los dueños.
- RF-11: MIENTRAS el navegador tenga una respuesta, EL SISTEMA muestra debajo del agradecimiento el mensaje de contacto con los dueños, si está cargado en los datos.

Cierre:

- RF-12: EL SISTEMA considera cerradas las respuestas desde la fecha y hora de cierre de la invitación, o desde que los dueños las cierran a mano. Si la invitación no tiene fecha de cierre, se cierran a la hora del evento.
- RF-13: MIENTRAS las respuestas estén cerradas, EL SISTEMA reemplaza el formulario por el mensaje de cierre y el de contacto con los dueños cargados en los datos; si falta el de cierre, muestra "Las confirmaciones ya están cerradas.".
- RF-14: SI llega una respuesta con las respuestas cerradas, ENTONCES EL SISTEMA la rechaza en la base de datos y muestra el mensaje de RF-13, aunque el navegador las creyera abiertas.
- RF-15: MIENTRAS las respuestas estén cerradas, EL SISTEMA sigue mostrando el agradecimiento a quien ya respondió desde ese navegador.

Privacidad y seguridad:

- RF-16: EL SISTEMA no permite leer, listar, modificar ni borrar respuestas desde la página pública; solo crear la propia y comprobar la propia con su código.
- RF-17: EL SISTEMA guarda en la base solo el nombre, si asiste o no, la fecha de la respuesta y una huella del código del navegador, nunca el código en sí.
- RF-18: CUANDO se borra una invitación, EL SISTEMA borra también sus respuestas.

## Reglas

- Las del [README](../../../README.md#reglas-de-negocio-importantes) y la [constitución](../../CONSTITUTION.md), con las [decisiones del INDEX](../INDEX.md#decisiones-ya-tomadas): link general, nombre en texto libre, nombres repetidos aceptados y sin cambios desde la invitación.
- Los contadores se calculan contando registros; no se guardan. Con 64 invitados esperados, por ejemplo: asistirán 32 (respuestas "sí"), no asistirán 30 (respuestas "no") y sin respuesta 2 (esperados menos respuestas, nunca menos de 0). Se muestran en la spec 005.
- Superar los invitados esperados no bloquea respuestas: el aviso de colados es de la spec 005.
- Lo visual se verifica contra la [guía de estilo `sage-geese`](../../guias/baby-shower/sage-geese.md): el formulario usa tipografía legible, no manuscrita.

## Criterios de aceptación

- [ ] En `/demo` se responde "Sí, asistiré" con un nombre y aparece el agradecimiento; al recargar, sigue el agradecimiento y no el formulario.
- [ ] En otro navegador se responde "No podré ir" y aparece su agradecimiento; en la base queda guardado que no asiste.
- [ ] Con el campo vacío aparece el mensaje que pide el nombre, y un nombre de 1 carácter o de más de 60 no se envía.
- [ ] Un doble clic en un botón crea una sola respuesta.
- [ ] Al borrar la respuesta desde la pantalla de Supabase y recargar, vuelve el formulario.
- [ ] Con la fecha de cierre vencida o el cierre manual activado, se ve el mensaje de cierre y una llamada directa a la función de responder es rechazada.
- [ ] Sin sesión y con la clave pública, no se puede leer ni listar la tabla de respuestas.
- [ ] Una consulta en la pantalla de Supabase devuelve asistirán, no asistirán y sin respuesta de una invitación.
- [ ] En un celular de 360 px y en escritorio, el formulario se ve completo y sin desplazamiento horizontal.
- [ ] `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test` y `npm run build` pasan.

## Preguntas abiertas

Ninguna.

## Historial de cambios

| Fecha | Cambio |
|---|---|
| 2026-11-24 | Borrador inicial. Un solo nombre por confirmación: la tarjeta se manda a cada persona por separado |
| 2026-11-24 | Se suma "No podré ir": cada respuesta guarda si asiste o no, para los contadores asistirán, no asistirán y sin respuesta de la spec 005. El campo vacío pide el nombre con un mensaje amable |
| 2026-11-24 | Una sola persona: solo con la aclaración del formulario, sin control automático. Los chicos sin celular quedan fuera |
| 2026-11-24 | Aprobada |
