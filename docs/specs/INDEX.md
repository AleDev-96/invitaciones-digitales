# INDEX — Primer desarrollo

Hoja de ruta de las specs necesarias para publicar la primera invitación: baby shower con la plantilla `baby-shower` y el estilo `sage-geese`. Vale solo para este primer desarrollo; los estilos e invitaciones futuros se anotan directamente en el índice de [README.md](README.md).

Cada una se redacta, se clarifica y se aprueba por separado según la skill [`sdd`](../../.github/skills/sdd/SKILL.md).

## Specs

| N.º | Spec | Tipo | Depende de | Estado |
|---|---|---|---|---|
| 001 | [Arquitectura base](001-arquitectura-base/spec.md) | Larga | — | Implementada |
| 002 | [Plantilla `baby-shower` y estilo `sage-geese`](002-plantilla-baby-shower/spec.md) | Larga | 001 | Borrador |
| 003 | Confirmación de asistencia | Larga | 001, 002 | Sin redactar |
| 004 | Lista de regalos con reserva | Larga | 001, 002, 003 | Sin redactar |
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

- Formulario al final de la página, con el nombre de la persona.
- Cada confirmación es individual y suma uno al contador.
- Después de confirmar, el botón queda bloqueado en ese navegador.
- Las confirmaciones se cierran en una fecha fijada por invitación o cuando los dueños las cierran a mano.

### 004 — Lista de regalos con reserva

- Pantalla aparte, con botón para volver a la invitación.
- Reservar un regalo pide el nombre de quien lo elige.
- Un regalo no puede reservarse más veces de las que permite, ni con doble clic ni con pedidos simultáneos.
- La lista pública muestra solo "reservado", sin el nombre.

### 005 — Pantalla de los dueños del evento

Pantalla extra a la que los invitados no acceden. Reemplaza la decisión anterior de "sin panel"; al aprobarse se corrigen `AGENTS.md`, `MEMORY.md`, el README y la arquitectura.

- Acceso con una palabra clave por invitación, sin distinguir mayúsculas de minúsculas, comprobada en la base de datos y con bloqueo tras varios intentos fallidos.
- Contador de confirmados sobre invitados esperados (ejemplo: "10/64").
- Si se supera el número esperado, aviso "¡Tenemos un colado! Revisemos".
- Lista de quienes confirmaron y de quién eligió cada regalo.
- Borrar confirmaciones falsas.
- Quitar la reserva de un regalo.
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
- Para reservar un regalo hay que haber confirmado asistencia: la reserva queda asociada a la confirmación y al nombre del invitado.
- Borrar una confirmación borra también las reservas de regalos de esa persona.
- La lista de regalos sigue abierta hasta el fin del evento, aunque las confirmaciones estén cerradas.
- Cada regalo indica cuántas veces se puede elegir: por ejemplo, pañales talle P hasta 5 veces y la cuna evolutiva 1 sola. Reemplaza la restricción de "una reserva por regalo" de [data-model.md](../architecture/data-model.md); se corrige al aprobar la spec 004.
- Los dueños pueden quitar la reserva de un regalo desde su pantalla (spec 005).
- Las decisiones de arquitectura están en la [spec 001](001-arquitectura-base/spec.md).

## Pendientes de definir

| Tema | Spec |
|---|---|
| Si quien ya confirmó puede elegir un regalo después del cierre de confirmaciones | 004 |
