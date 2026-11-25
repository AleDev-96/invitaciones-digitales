# Specs

Una spec describe qué se va a construir y cómo se comprueba que quedó bien, antes de escribir código. La aprueba el responsable del proyecto.

## Tipos

| Tipo | Cuándo | Molde | Extensión esperada |
|---|---|---|---|
| Larga | Decisiones de base, una funcionalidad nueva, una plantilla nueva, un estilo nuevo o un rediseño grande | [spec.md](_templates/spec.md), [plan.md](_templates/plan.md) y [tasks.md](_templates/tasks.md) | La que haga falta |
| Corta | Un rediseño o ajuste acotado, sin cambios de datos ni dependencias | Los mismos tres; en `spec.md` alcanzan Objetivo, Alcance, Requisitos funcionales y Criterios de aceptación | Una página por archivo |
| Invitación | Una invitación nueva con plantilla y estilo ya existentes | [invitation.md](_templates/invitation.md), guardado como `spec.md`, más [plan.md](_templates/plan.md) y [tasks.md](_templates/tasks.md) | Una página por archivo |

Los cambios menores (un texto, un color, un ajuste de espaciado) y las reorganizaciones de archivos o documentos no llevan spec.

Cómo redactarlas e implementarlas paso a paso está en la skill [`sdd`](../../.github/skills/sdd/SKILL.md).

## Nombre y ubicación

Cada spec es una carpeta `docs/specs/NNN-nombre-corto/`, con `NNN` correlativo de tres cifras. Ejemplo: `docs/specs/001-arquitectura-base/`.

Toda spec, sea larga, corta o de invitación, lleva los tres archivos:

| Archivo | Qué contiene |
|---|---|
| `spec.md` | Qué se construye y por qué: alcance, requisitos, criterios de aceptación |
| `plan.md` | Cómo se construye: decisiones, diseño técnico, costo |
| `tasks.md` | En qué orden: tareas verificables |

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
| 001 | [Arquitectura base](001-arquitectura-base/spec.md) | Larga | Implementada | |
| 002 | [Plantilla `baby-shower` y estilo `sage-geese`](002-plantilla-baby-shower/spec.md) | Larga | Implementada | |
| 003 | [Confirmación de asistencia](003-confirmacion-asistencia/spec.md) | Larga | Implementada | |
| 004 | [Lista de regalos con reserva](004-lista-regalos/spec.md) | Larga | Implementada | |
| 005 | [Pantalla de los dueños del evento](005-pantalla-papis/spec.md) | Larga | Borrador | |
| 006 | [Primera invitación: baby shower](006-primera-invitacion/spec.md) | Invitación | Aprobada | Borrador |

La columna "Invitación" aplica solo a specs de invitación: borrador, publicada o dada de baja.
