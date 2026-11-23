# Tipos de evento, plantillas y estilos

Índice único para saber qué plantilla, estilos y funcionalidades corresponden a cada tipo de evento. Se actualiza en el mismo cambio que agrega o modifica una plantilla o un estilo.

- **Plantilla:** estructura de un tipo de evento (secciones y orden). Una por tipo.
- **Estilo:** colores, tipografías e ilustraciones. Varios por plantilla.

Una invitación se define con una plantilla (`template_key`) y un estilo (`theme_key`). Varias invitaciones pueden usar la misma combinación.

## Plantillas

| Tipo de evento | `template_key` | Estructura | Estado |
|---|---|---|---|
| Baby shower | `baby-shower` | `src/templates/baby-shower/` | Sin implementar |

## Estilos

| `template_key` | `theme_key` | Descripción | Guía de estilo | Código | Gráficos | Estado |
|---|---|---|---|---|---|---|
| `baby-shower` | `sage-geese` | Acuarela con gansos, verde salvia, marfil y taupe | [sage-geese.md](design/baby-shower/sage-geese.md) | `src/templates/baby-shower/themes/sage-geese/` | `public/assets/templates/baby-shower/sage-geese/` | Guía lista; sin implementar |

Estados posibles: guía lista, en desarrollo, disponible.

Si la plantilla o el estilo pedido no figura en estas tablas, seguir `skills/add-template/`.

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
