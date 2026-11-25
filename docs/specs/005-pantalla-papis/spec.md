# 005 — Pantalla de los dueños del evento: spec

- **Tipo:** larga
- **Estado:** aprobada
- **Fecha:** 2026-11-25

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

## Objetivo

Que los dueños del evento vean desde el celular quiénes confirmaron y quién eligió cada regalo, y corrijan lo que haga falta (confirmaciones falsas, reservas, regalos anotados a mano, cierre de confirmaciones) sin entrar a la pantalla de Supabase. Reemplaza la decisión de "sin panel de administración" ([INDEX](../INDEX.md#005--pantalla-de-los-dueños-del-evento)).

## Alcance

- Pantalla aparte en `/<slug>/papis`, para cualquier invitación, protegida con una palabra clave por invitación.
- Contadores de asistirán, no asistirán y sin respuesta, con los nombres y el aviso de "colado".
- Corregir, agregar y borrar confirmaciones; al borrar, sus regalos vuelven a quedar disponibles.
- Por regalo: quién lo eligió, quitar una elección y anotar una elección a mano con el nombre de quien lo regala.
- Cerrar y reabrir las confirmaciones.

## Fuera de alcance

- Cargar o editar la invitación, sus textos o sus regalos: sigue siendo desde Supabase.
- Cuentas de usuario, mails o recuperación de la palabra clave: la carga y la cambia quien administra, desde Supabase.
- Exportar la lista a un archivo: se usa la función de imprimir del navegador o las consultas de Supabase.
- Un nombre de ruta distinto por tipo de evento: `/papis` vale para todas las invitaciones.

## Requisitos funcionales

Acceso:

- RF-1: EL SISTEMA muestra la pantalla de los dueños en `/<slug>/papis`, sin enlaces desde la invitación ni desde la lista de regalos.
- RF-2: SI la invitación no existe, es un borrador o está dada de baja, ENTONCES EL SISTEMA muestra en `/<slug>/papis` la misma pantalla que en `/<slug>`.
- RF-3: CUANDO alguien entra sin haber ingresado la palabra clave en esa pestaña, EL SISTEMA muestra el campo "Palabra clave" y el botón "Entrar".
- RF-4: CUANDO se ingresa la palabra clave correcta, sin distinguir mayúsculas de minúsculas ni espacios al principio o al final, EL SISTEMA muestra el panel.
- RF-5: SI la palabra clave es incorrecta o la invitación no tiene palabra clave cargada, ENTONCES EL SISTEMA muestra "La palabra clave no es correcta.".
- RF-6: SI hubo 5 intentos fallidos seguidos, ENTONCES EL SISTEMA rechaza durante 15 minutos todo intento, incluso con la palabra clave correcta, y muestra "Demasiados intentos. Probá de nuevo en 15 minutos.". Un ingreso correcto reinicia la cuenta.
- RF-7: MIENTRAS la pestaña siga abierta, EL SISTEMA recuerda la palabra clave; al cerrarla o al tocar "Salir", la olvida.
- RF-8: SI la palabra clave cambió mientras el panel estaba abierto, ENTONCES EL SISTEMA vuelve a pedirla.

Confirmaciones:

- RF-9: EL SISTEMA muestra tres contadores: "Asistirán", "No asistirán" y "Sin respuesta" (invitados esperados menos respuestas, nunca menos de 0). Si la invitación no tiene invitados esperados cargados, no muestra "Sin respuesta".
- RF-10: SI las respuestas superan a los invitados esperados, ENTONCES EL SISTEMA muestra "¡Tenemos un colado! Revisemos".
- RF-11: CUANDO se toca "Asistirán" o "No asistirán", EL SISTEMA muestra los nombres de ese grupo con la fecha y hora de la respuesta, de la más nueva a la más vieja.
- RF-12: CUANDO se toca "Borrar" en una confirmación y se acepta "¿Borrar la confirmación de <nombre>? Sus regalos vuelven a quedar disponibles.", EL SISTEMA borra la respuesta y sus elecciones de regalos y actualiza los contadores. Ese navegador vuelve a ver el formulario de confirmación.

Regalos:

- RF-13: EL SISTEMA muestra cada regalo en el orden de la lista, con cuántas veces se eligió sobre cuántas se puede elegir ("2 de 3") y el nombre de quien lo eligió en cada caso; las elecciones anotadas a mano llevan "(anotado a mano)".
- RF-14: CUANDO se toca "Quitar" en una elección y se acepta "¿Quitar la elección de <nombre>?", EL SISTEMA la borra y el regalo vuelve a tener lugar, aunque la lista de regalos esté cerrada.
- RF-15: CUANDO se toca "Anotar a mano" en un regalo con lugar, se escribe un nombre de 2 a 60 caracteres y se toca "Guardar", EL SISTEMA guarda la elección con ese nombre, sin asociarla a ninguna confirmación ni contarla para el tope por persona. La invitación pública la cuenta como una elección más.
- RF-16: SI el regalo se quedó sin lugar antes de guardar, ENTONCES EL SISTEMA no lo guarda, muestra "Ese regalo ya no tiene lugar." y actualiza la lista.

Cierre de confirmaciones:

- RF-17: EL SISTEMA muestra si las confirmaciones están abiertas, con su fecha y hora de cierre, o cerradas.
- RF-18: CUANDO se toca "Cerrar confirmaciones", EL SISTEMA las cierra y la invitación muestra el mensaje de cierre ([spec 003](../003-confirmacion-asistencia/spec.md)). CUANDO se toca "Reabrir confirmaciones", las vuelve a abrir, solo si no pasó su fecha de cierre.

Errores y seguridad:

- RF-19: SI una consulta o una acción falla por un problema de conexión, ENTONCES EL SISTEMA muestra "No pudimos conectar. Probá de nuevo en unos segundos." y deja los datos como estaban.
- RF-20: MIENTRAS una acción está en curso, EL SISTEMA deshabilita los botones del panel; un doble clic no repite la acción.
- RF-21: EL SISTEMA comprueba la palabra clave en la base de datos en cada consulta y cada acción. Sin la palabra clave correcta no devuelve nombres ni permite cambios, y la palabra clave de una invitación no sirve para otra.
- RF-22: EL SISTEMA guarda en la base solo una huella de la palabra clave, nunca la palabra clave.

Corregir y agregar confirmaciones:

- RF-23: CUANDO se toca "Editar" en una confirmación, se cambia el nombre (2 a 60 caracteres) o la respuesta y se toca "Guardar", EL SISTEMA guarda el cambio y actualiza los contadores. Los regalos elegidos siguen a su nombre.
- RF-24: SI la edición pasa una confirmación de "Asistirá" a "No asistirá" y tenía regalos elegidos, ENTONCES EL SISTEMA pregunta "<nombre> tenía regalos elegidos. Si guardás, vuelven a quedar disponibles." y, al aceptar, los libera.
- RF-25: CUANDO se toca "Agregar invitado", se escribe un nombre de 2 a 60 caracteres, se elige "Asistirá" o "No asistirá" y se toca "Guardar", EL SISTEMA guarda la confirmación con "(anotado a mano)" y la suma a los contadores, aunque las confirmaciones estén cerradas. Esa confirmación no tiene un navegador asociado: si esa persona quiere regalar, los dueños lo anotan a mano (RF-15).

## Reglas

- Las del [README](../../../README.md#reglas-de-negocio-importantes) y la [constitución](../../CONSTITUTION.md), con las [decisiones del INDEX](../INDEX.md#decisiones-ya-tomadas): los dueños controlan las confirmaciones falsas, borrar una confirmación borra sus reservas y los dueños pueden anotar un regalo a mano.
- La página pública sigue sin mostrar nombres de invitados: los nombres solo salen con la palabra clave.
- La palabra clave no se guarda en el repositorio: la carga quien administra desde Supabase.
- La pantalla es una sola para todas las plantillas: sencilla, legible en celular y con letra grande, sin ilustraciones del estilo.

## Criterios de aceptación

- [ ] `/demo/papis` pide la palabra clave; con la correcta, escrita en mayúsculas o con espacios al final, muestra el panel. `/demo-borrador/papis` y `/demo-baja/papis` muestran lo mismo que `/<slug>`.
- [ ] Con una palabra clave incorrecta aparece el mensaje de RF-5; al quinto intento fallido queda bloqueada 15 minutos, también con la correcta, desde la pantalla y con una llamada directa a la función.
- [ ] Al cerrar la pestaña o tocar "Salir" vuelve a pedir la palabra clave.
- [ ] Con la `demo` (esperados cargados), los contadores coinciden con las respuestas guardadas; al superar los esperados aparece el aviso de colado.
- [ ] Al tocar cada contador se ven los nombres de ese grupo; al borrar una confirmación desaparece, bajan los contadores, sus regalos vuelven a estar disponibles en `/demo/regalos` y ese navegador vuelve a ver el formulario.
- [ ] "Editar" cambia el nombre de "Meli y Tomi" a "Meli" y "Agregar invitado" suma a "Tomi": los contadores suben en uno y ambos nombres aparecen en su grupo. Pasar a "No asistirá" a alguien con regalos, tras aceptar el aviso, los libera.
- [ ] Cada regalo muestra "n de m" y los nombres; "Quitar" libera la elección con la lista cerrada; "Anotar a mano" guarda el nombre con "(anotado a mano)" y la lista pública lo cuenta.
- [ ] Anotar a mano en un regalo sin lugar, desde la pantalla o con una llamada directa, es rechazado.
- [ ] "Cerrar confirmaciones" hace que `/demo` muestre el mensaje de cierre; "Reabrir confirmaciones" vuelve a mostrar el formulario.
- [ ] Sin la palabra clave, o con la de otra invitación, las funciones de los dueños no devuelven nombres ni hacen cambios; la tabla de invitaciones no deja leer la huella con la clave pública.
- [ ] Las funciones públicas de las specs 003 y 004 siguen pasando sus comprobaciones.
- [ ] En un celular de 360 px y en escritorio, el panel se ve completo y sin desplazamiento horizontal.
- [ ] `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test` y `npm run build` pasan.

## Preguntas abiertas

Ninguna.

## Historial de cambios

| Fecha | Cambio |
|---|---|
| 2026-11-25 | Borrador inicial: alcance completo del INDEX, ruta `/<slug>/papis` y borrar una confirmación libera sus regalos |
| 2026-11-25 | Los dueños también editan el nombre o la respuesta de una confirmación y agregan invitados a mano (por ejemplo, separar "Meli y Tomi") |
| 2026-11-25 | Aprobada |
