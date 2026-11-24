# INDEX — Primer desarrollo

Hoja de ruta de las specs necesarias para publicar la primera invitación: baby shower con la plantilla `baby-shower` y el estilo `sage-geese`. Vale solo para este primer desarrollo; los estilos e invitaciones futuros se anotan directamente en el índice de [README.md](README.md).

Cada una se redacta, se clarifica y se aprueba por separado según la skill [`sdd`](../../.github/skills/sdd/SKILL.md).

## Specs

| N.º | Spec | Tipo | Depende de | Estado |
|---|---|---|---|---|
| 001 | [Arquitectura base](001-arquitectura-base/spec.md) | Larga | — | Implementada |
| 002 | [Plantilla `baby-shower` y estilo `sage-geese`](002-plantilla-baby-shower/spec.md) | Larga | 001 | Implementada |
| 003 | [Confirmación de asistencia](003-confirmacion-asistencia/spec.md) | Larga | 001, 002 | Implementada |
| 004 | [Lista de regalos con reserva](004-lista-regalos/spec.md) | Larga | 001, 002, 003 | Aprobada |
| 005 | Pantalla de los dueños del evento | Larga | 003, 004 | Sin redactar |
| 006 | Primera invitación: baby shower | Invitación | 002 a 005 | Sin redactar |

## Qué cubre cada una

### 001 — Arquitectura base

Deja la aplicación vacía funcionando y publicada, con la base de datos y una URL por invitación. Cierra las decisiones abiertas de [architecture.md](../architecture/architecture.md).

- Proyecto React + TypeScript + Vite + Tailwind, Supabase y Cloudflare Pages.
- Tablas, reglas de acceso y operaciones validadas en la base de datos.
- Forma de la URL y carga de una invitación por su dirección.
- Estados de la invitación: borrador, publicada, dada de baja.
- Mecanismo para aplicar un estilo sin afectar a otro.
- Herramientas de prueba (requieren aprobación).

### 002 — Plantilla `baby-shower` y estilo `sage-geese`

La invitación que se recorre, con datos de ejemplo. Guía visual: [sage-geese.md](../guias/baby-shower/sage-geese.md).

- Portada con un sobre y el texto "¡Tenés una invitación!"; al tocarlo se abre con una animación.
- Una sola página larga que se recorre deslizando hacia abajo: presentación, cuenta regresiva y fecha, cómo llegar, regalos, confirmar asistencia.
- Botón "Cómo llegar" que abre Google Maps, con la dirección escrita debajo. Se prueba en Android y en iPhone.
- Ilustraciones de relleno hasta tener las finales.

### 003 — Confirmación de asistencia

- Formulario al final de la página, con el nombre de la persona y dos botones: "Sí, asistiré" y "No podré ir".
- Cada respuesta es de una sola persona: la tarjeta se manda a cada celular por separado.
- Después de responder, el formulario queda bloqueado en ese navegador.
- Las confirmaciones se cierran en una fecha fijada por invitación o cuando los dueños las cierran a mano.

### 004 — Lista de regalos con reserva

- Pantalla aparte, con botón para volver a la invitación.
- Elige quien respondió "Sí, asistiré", reconocido por el código de su navegador, sin escribir el nombre otra vez.
- Hasta 3 regalos distintos por persona; un regalo no puede reservarse más veces de las que permite, ni con doble clic ni con pedidos simultáneos.
- La lista pública muestra solo "Disponible" o "Reservado", sin el nombre ni cuántos quedan. Sin imágenes ni enlaces a tiendas.

### 005 — Pantalla de los dueños del evento

Pantalla extra a la que los invitados no acceden. Reemplaza la decisión anterior de "sin panel"; al aprobarse se corrigen `AGENTS.md`, `MEMORY.md`, el README y la arquitectura.

- Acceso con una palabra clave por invitación, sin distinguir mayúsculas de minúsculas, comprobada en la base de datos y con bloqueo tras varios intentos fallidos.
- Contadores sobre los invitados esperados (ejemplo con 64): asistirán 32, no asistirán 30, sin respuesta 2. Al tocar cada número se ven los nombres.
- Si se supera el número esperado, aviso "¡Tenemos un colado! Revisemos".
- Lista de quienes confirmaron y de quién eligió cada regalo.
- Borrar confirmaciones falsas.
- Quitar la reserva de un regalo.
- Marcar un regalo como reservado a mano, con el nombre de quien lo regala (por ejemplo, alguien que no asiste).
- Cerrar las confirmaciones.

### 006 — Primera invitación: baby shower

- Datos reales del evento. Fiesta: 05/12/2026. Cierre de confirmaciones: 04/12/2026. Invitados esperados: 64.
- Ilustraciones finales, propias o con licencia.
- Lista de regalos real y palabra clave de los dueños.
- Publicación, y baja con borrado de datos después del evento.

## Decisiones ya tomadas

- Un link general para todos los invitados, sin links individuales. El modelo de datos no debe impedir sumarlos más adelante.
- Se carga solo el número de invitados esperados, no la lista de personas.
- El control de confirmaciones falsas lo hacen los dueños desde su pantalla.
- El invitado escribe su nombre en texto libre; se aceptan nombres repetidos.
- Quien confirmó no cambia ni cancela su respuesta desde la invitación: avisa a los dueños y ellos la borran. Así se evita tener que emparejar nombres escritos distinto ("Jorgito" y "Jorge Ayala").
- Con las confirmaciones cerradas, la invitación se sigue viendo: el botón de confirmar se reemplaza por un mensaje de cierre y uno de contacto con los dueños, ambos cargados en los datos de la invitación.
- Para reservar un regalo hay que haber respondido "Sí, asistiré": la reserva queda asociada a esa respuesta y al nombre del invitado. Quien respondió "No podré ir" no elige regalo; si quiere regalar, avisa a los dueños.
- Los dueños pueden marcar un regalo como reservado sin asociarlo a un invitado, anotando a mano quién lo regala (spec 005).
- Borrar una confirmación borra también las reservas de regalos de esa persona.
- La lista de regalos sigue abierta aunque las confirmaciones estén cerradas, hasta la fecha de cierre de la invitación o, si no tiene, hasta terminar el día anterior al evento (para la fiesta del 05/12, todo el 04/12). Quien ya confirmó puede elegir o cambiar su regalo en ese período.
- Cada regalo indica cuántas veces se puede elegir: por ejemplo, pañales talle P hasta 5 veces y la cuna evolutiva 1 sola. Reemplazó la restricción de "una reserva por regalo" de [data-model.md](../architecture/data-model.md).
- Los dueños pueden quitar la reserva de un regalo desde su pantalla (spec 005).
- Las decisiones de arquitectura están en la [spec 001](001-arquitectura-base/spec.md).

- Quien respondió se reconoce por un código guardado en su navegador; la base guarda solo su huella (spec 003). La spec 004 lo usa para elegir o cambiar el regalo sin volver a escribir el nombre.

## Pendientes de definir

Ninguno por ahora.
