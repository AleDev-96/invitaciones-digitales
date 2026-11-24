# Specs

Una spec describe qué se va a construir y cómo se comprueba que quedó bien, antes de escribir código. La aprueba el responsable del proyecto.

## Tipos

| Tipo | Cuándo | Molde | Extensión esperada |
|---|---|---|---|
| Larga | Decisiones de base, una funcionalidad nueva, una plantilla nueva, un estilo nuevo o un rediseño grande | [_templates/architecture-spec.md](_templates/architecture-spec.md) completo | La que haga falta |
| Corta | Un rediseño o ajuste acotado, sin cambios de datos ni dependencias | El mismo molde, solo con Objetivo, Alcance, Requisitos funcionales y Criterios de aceptación | Una página |
| Invitación | Una invitación nueva con plantilla y estilo ya existentes | [_templates/invitation-spec.md](_templates/invitation-spec.md) | Una página |

Los cambios menores (un texto, un color, un ajuste de espaciado) no llevan spec.

Cómo redactarlas e implementarlas paso a paso está en la skill [`sdd`](../../.github/skills/sdd/SKILL.md).

## Nombre y ubicación

`docs/specs/NNN-nombre-corto.md`, con `NNN` correlativo de tres cifras. Ejemplo: `docs/specs/001-arquitectura-base.md`.

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

La hoja de ruta de las specs del primer desarrollo está en [INDEX.md](INDEX.md).

| N.º | Spec | Tipo | Estado de la spec | Invitación |
|---|---|---|---|---|
| 001 | [Arquitectura base](001-arquitectura-base.md) | Larga | Borrador | |

La columna "Invitación" aplica solo a specs de invitación: borrador, publicada o dada de baja.
