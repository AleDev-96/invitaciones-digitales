# 004 — Lista de regalos con reserva: spec

- **Tipo:** larga
- **Estado:** aprobada
- **Fecha:** 2026-11-24

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

## Objetivo

Que quien confirmó su asistencia elija desde la invitación qué regalo va a llevar, sin volver a escribir su nombre, para que los dueños no reciban regalos repetidos y los invitados sepan qué falta. Reemplaza el lugar reservado "Muy pronto" de la sección "Regalos" de la [spec 002](../002-plantilla-baby-shower/spec.md).

## Alcance

- Sección "Regalos" de la plantilla `baby-shower` con un texto opcional y un botón hacia la lista.
- Pantalla aparte con la lista de regalos y un botón para volver a la invitación.
- Cada regalo con nombre, descripción opcional (por ejemplo, "Talle P") y cuántas veces se puede elegir.
- Elegir hasta 3 regalos distintos por persona (tope configurable por invitación), y quitar o cambiar los propios, reconociendo a quien eligió por el código que guardó su navegador al confirmar ([spec 003](../003-confirmacion-asistencia/spec.md)).
- Control en la base de datos de las veces que se puede elegir cada regalo, con doble clic y pedidos simultáneos.
- Cierre de la lista en una fecha fijada por invitación; si no se fija, al terminar el día anterior al evento.

## Fuera de alcance

- Pantalla de los dueños: ver quién eligió cada regalo, quitar una reserva o marcar un regalo como reservado anotando quién lo regala (spec 005). Hasta entonces se hace desde la pantalla de Supabase.
- Cargar o editar regalos desde la aplicación: los dueños los cargan desde la pantalla de Supabase.
- Precios, pagos, transferencias o compra desde la invitación.
- Imágenes de los regalos y enlaces a tiendas: la lista es modesta y cada invitado compra lo que pueda, sin un producto exacto.

## Requisitos funcionales

Sección en la invitación:

- RF-1: MIENTRAS la invitación tenga la funcionalidad de regalos, EL SISTEMA muestra la sección "Regalos" con el texto de los datos de la invitación, si está cargado, y el botón "Ver lista de regalos", que abre la pantalla de regalos.

Pantalla de regalos:

- RF-2: EL SISTEMA muestra la pantalla de regalos en `/<slug>/regalos`, con el botón "Volver a la invitación" arriba y abajo de la lista.
- RF-3: EL SISTEMA muestra los regalos en el orden cargado por los dueños, cada uno con su nombre y, si está cargada, su descripción.
- RF-4: EL SISTEMA muestra en cada regalo solo "Disponible", mientras quede cupo, o "Reservado", cuando se agotó, sin indicar cuántas veces se puede elegir ni cuántas quedan.
- RF-5: SI la invitación no existe, es un borrador o está dada de baja, ENTONCES EL SISTEMA muestra en `/<slug>/regalos` la misma pantalla que en `/<slug>`.
- RF-6: SI la invitación no tiene la funcionalidad de regalos o no tiene regalos cargados, ENTONCES EL SISTEMA muestra "Todavía no hay regalos cargados." y el botón para volver.

Elegir un regalo:

- RF-7: MIENTRAS el navegador tenga una respuesta "Sí, asistiré" y la lista esté abierta, EL SISTEMA muestra el botón "Elegir este regalo" en cada regalo disponible.
- RF-8: CUANDO el invitado toca "Elegir este regalo", EL SISTEMA lo reserva a su nombre y marca ese regalo como "Tu regalo", sin pedir el nombre otra vez.
- RF-9: SI el invitado ya eligió la cantidad máxima de regalos por persona de la invitación (3 si no se cargó otra), ENTONCES EL SISTEMA no muestra "Elegir este regalo" en los demás y muestra "Ya elegiste <n> regalos. Para cambiar uno, primero quitá tu elección.". Cada persona elige un mismo regalo una sola vez.
- RF-10: CUANDO el invitado toca "Quitar mi elección" en su regalo, EL SISTEMA libera la reserva y el regalo vuelve a estar disponible.
- RF-11: SI el regalo se agotó entre que se cargó la lista y el invitado lo eligió, ENTONCES EL SISTEMA no lo reserva, muestra "Alguien lo eligió recién. Probá con otro regalo." y actualiza la lista.
- RF-12: MIENTRAS una elección está en curso, EL SISTEMA deshabilita los botones de la lista, y un doble clic o un reintento no genera una segunda reserva del mismo regalo para la misma persona.
- RF-13: SI la elección falla por un problema de conexión, ENTONCES EL SISTEMA muestra "No pudimos guardar tu elección. Probá de nuevo en unos segundos." y deja la lista como estaba.

Quién puede elegir:

- RF-14: SI el navegador no tiene una respuesta, ENTONCES EL SISTEMA muestra la lista sin botones de elegir y el aviso "Para elegir un regalo, primero confirmá tu asistencia", con un botón que lleva a la sección "Confirmar asistencia" de la invitación.
- RF-15: SI el navegador tiene una respuesta "No podré ir", ENTONCES EL SISTEMA muestra la lista sin botones de elegir y el aviso "Si querés hacer un regalo, avisales a los dueños", seguido del mensaje de contacto de los datos de la invitación, si está cargado.
- RF-16: SI los dueños borraron la respuesta del invitado, ENTONCES EL SISTEMA trata a ese navegador como sin respuesta (RF-14); sus reservas ya se borraron junto con la respuesta.
- RF-17: SI la invitación no tiene la funcionalidad de confirmación de asistencia, ENTONCES EL SISTEMA muestra la lista solo como información, sin botones de elegir ni avisos.

Cierre:

- RF-18: EL SISTEMA mantiene la lista abierta para elegir, cambiar y quitar hasta la fecha y hora de cierre de regalos de la invitación, aunque las confirmaciones estén cerradas. Si la invitación no tiene fecha de cierre de regalos, cierra a las 00:00 del día del evento, en la zona horaria de la invitación (para una fiesta el 05/12, se puede elegir todo el 04/12).
- RF-19: MIENTRAS la lista esté cerrada, EL SISTEMA la sigue mostrando sin botones, con "Tu regalo" marcado en el que eligió ese navegador.
- RF-20: SI llega una elección o un pedido de quitar con la lista cerrada, ENTONCES EL SISTEMA lo rechaza en la base de datos y muestra "La lista de regalos ya está cerrada.".

Privacidad y seguridad:

- RF-21: EL SISTEMA no muestra en la página pública el nombre de quien eligió cada regalo ni cuántas personas lo eligieron.
- RF-22: EL SISTEMA valida en la base de datos, sin depender del navegador, que quien elige tenga una respuesta "Sí, asistiré" en esa invitación, que el regalo sea de esa invitación, que no se supere la cantidad de veces que se puede elegir el regalo ni la cantidad máxima de regalos por persona.
- RF-23: EL SISTEMA no permite leer, modificar ni borrar reservas ajenas desde la página pública; cada invitado solo puede quitar la propia con su código.
- RF-24: CUANDO se borra una invitación, un regalo o una respuesta, EL SISTEMA borra también sus reservas.

## Reglas

- Las del [README](../../../README.md#lista-de-regalos) y la [constitución](../../CONSTITUTION.md), con las [decisiones del INDEX](../INDEX.md#decisiones-ya-tomadas): para elegir hay que haber respondido "Sí, asistiré", la lista sigue abierta con las confirmaciones cerradas (hasta su propio cierre), cada regalo indica cuántas veces se puede elegir y borrar una respuesta borra sus reservas.
- Los regalos son contenido de cada invitación: se cargan en Supabase y no se guardan en el repositorio.
- Lo visual se verifica contra la [guía de estilo `sage-geese`](../../guias/baby-shower/sage-geese.md): estados claros (disponible, reservado, tu regalo, deshabilitado), botones taupe redondeados y tipografía legible para nombres y descripciones.

## Criterios de aceptación

- [ ] En `/demo` la sección "Regalos" muestra su texto y el botón, y el botón abre `/demo/regalos`; "Volver a la invitación" vuelve a `/demo`.
- [ ] Cada regalo de la `demo` muestra su nombre y, si tiene, su descripción, en el orden cargado.
- [ ] Sin respuesta en el navegador no hay botones de elegir y aparece el aviso para confirmar; con "No podré ir" aparece el aviso de avisar a los dueños.
- [ ] Con "Sí, asistiré" se elige un regalo, queda como "Tu regalo" y al recargar sigue marcado; "Quitar mi elección" lo libera.
- [ ] Un regalo que se puede elegir 1 vez, elegido desde dos navegadores a la vez, queda reservado para uno solo y el otro ve el mensaje de RF-11.
- [ ] Un doble clic en "Elegir este regalo" crea una sola reserva.
- [ ] Con 3 regalos elegidos no se puede elegir un cuarto, ni desde la pantalla ni con una llamada directa a la función; al quitar uno, se puede elegir otro.
- [ ] Con las confirmaciones cerradas y antes del cierre de regalos, se puede elegir; pasado el cierre (cargado, o las 00:00 del día del evento si no hay fecha), la lista se ve sin botones y una llamada directa a la función de elegir es rechazada.
- [ ] Una llamada directa a la función de elegir con un código sin respuesta, con una respuesta "No podré ir", o con un regalo de otra invitación es rechazada.
- [ ] Sin sesión y con la clave pública no se puede leer ni listar la tabla de reservas ni ver nombres.
- [ ] Al borrar la respuesta desde la pantalla de Supabase, sus reservas desaparecen y el regalo vuelve a estar disponible.
- [ ] En un celular de 360 px y en escritorio, la lista se ve completa y sin desplazamiento horizontal.
- [ ] `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test` y `npm run build` pasan.

## Preguntas abiertas

Ninguna.

## Historial de cambios

| Fecha | Cambio |
|---|---|
| 2026-11-24 | Borrador inicial |
| 2026-11-24 | Hasta 3 regalos distintos por persona, con el tope como dato de la invitación; cada regalo tiene su cupo (por ejemplo, pañales P ×5) |
| 2026-11-24 | La lista muestra solo "Disponible" o "Reservado", sin cuántos quedan |
| 2026-11-24 | La lista cierra en una fecha propia de la invitación; si no se carga, al terminar el día anterior al evento. Corrige la decisión del INDEX "hasta el fin del evento" |
| 2026-11-24 | Sin imágenes ni enlaces a tiendas: cada regalo lleva nombre y descripción opcional |
| 2026-11-24 | Aprobada |
