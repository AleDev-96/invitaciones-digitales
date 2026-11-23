# Specs

Una spec describe qué se va a construir y cómo se comprueba que quedó bien, antes de escribir código. La aprueba el responsable del proyecto.

## Tipos

| Tipo | Cuándo | Molde | Extensión esperada |
|---|---|---|---|
| Arquitectura | Decisiones de base, una funcionalidad nueva, una plantilla nueva o un estilo nuevo | [_templates/architecture-spec.md](_templates/architecture-spec.md) | La que haga falta |
| Invitación | Una invitación nueva con plantilla y estilo ya existentes | [_templates/invitation-spec.md](_templates/invitation-spec.md) | Una página |

Los cambios menores (un texto, un color, un ajuste de espaciado) no llevan spec.

## Nombre y ubicación

`specs/NNN-nombre-corto.md`, con `NNN` correlativo de tres cifras. Ejemplo: `specs/001-arquitectura-base.md`.

## Estados

1. **Borrador:** en discusión. No se implementa.
2. **Aprobada:** el responsable dio el visto bueno. Se puede implementar.
3. **Implementada:** el pull request se integró. No hace falta releerla para trabajos nuevos; la documentación de `docs/` refleja el resultado.

## Flujo

1. Escribir la spec en estado borrador y revisarla con el responsable hasta aprobarla.
2. Armar lo que la spec describe.
3. Validar con el responsable en la vista previa.
4. Testear contra los criterios de aceptación de la spec.
5. Abrir el pull request.
6. Al integrarse, pasar la spec a implementada y actualizar `docs/`.

## Reglas

- Una spec no repite lo que ya está en el README o en `docs/`; lo enlaza.
- Las preguntas abiertas se resuelven antes de aprobar.
- Si durante el armado aparece algo que la spec no previó, se actualiza la spec y se vuelve a consultar.

## Índice

| N.º | Spec | Tipo | Estado de la spec | Invitación |
|---|---|---|---|---|
| | Todavía no hay specs | | | |

La columna "Invitación" aplica solo a specs de invitación: borrador, publicada o dada de baja.
