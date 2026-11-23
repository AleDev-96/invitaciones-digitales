# Tipos de evento y plantillas

Índice único para saber qué plantilla, guía de estilo y funcionalidades corresponden a cada tipo de evento. Se actualiza en el mismo cambio que agrega o modifica una plantilla.

## Plantillas

| Tipo de evento | `template_key` | Guía de estilo | Plantilla | Gráficos | Estado |
|---|---|---|---|---|---|
| Baby shower | `baby-shower` | [baby-shower-visual-guide.md](design/baby-shower-visual-guide.md) | `src/templates/baby-shower/` | `public/assets/templates/baby-shower/` | Guía lista; plantilla sin implementar |

Estados posibles: guía lista, plantilla en desarrollo, plantilla disponible.

Si el tipo de evento pedido no figura en la tabla, seguir `skills/add-template/`.

## Funcionalidades

Las funcionalidades son opcionales por invitación. Una funcionalidad nueva entra a esta tabla solo cuando una invitación concreta la necesita y tiene su spec.

| Funcionalidad | Clave | Qué hace | Estado |
|---|---|---|---|
| Cuenta regresiva | `countdown` | Tiempo faltante para el evento | Sin implementar |
| Ubicación | `map` | Dirección y botón que abre Google Maps | Sin implementar |
| Regalos sugeridos | `gifts` | Lista de regalos con reserva | Sin implementar |
| Confirmación de asistencia | `rsvp` | Confirmar, rechazar o modificar la asistencia | Sin implementar |

## Funcionalidades habituales por tipo de evento

Es el punto de partida; cada invitación puede desactivar las que no use.

| Tipo de evento | `countdown` | `map` | `gifts` | `rsvp` |
|---|---|---|---|---|
| Baby shower | Sí | Sí | Sí | Sí |
