---
name: sdd
description: Cómo trabajar con Spec-Driven Development en Invitaciones Digitales. Usala al redactar, clarificar, revisar o cambiar specs (docs/specs/), o al implementar y verificar una spec.
---

# Spec-Driven Development (SDD)

## Cuándo usarla

Cada vez que trabajes con `docs/specs/`: redactar, clarificar, revisar o cambiar una spec, o implementarla y verificarla. Los tipos, estados e índice están en [`docs/specs/README.md`](../../../docs/specs/README.md).

Los cambios menores (un texto, un color, un ajuste de espaciado) y las reorganizaciones de archivos o documentos no llevan spec.

## Qué tamaño de spec corresponde

| Tamaño | Cuándo | Molde |
|---|---|---|
| **Larga** | Arquitectura de base, funcionalidad nueva, plantilla o estilo nuevo, rediseño que cambia estructura, datos o varias pantallas | [`spec.md`](../../../docs/specs/_templates/spec.md), [`plan.md`](../../../docs/specs/_templates/plan.md) y [`tasks.md`](../../../docs/specs/_templates/tasks.md) |
| **Corta** | Rediseño o ajuste acotado a una pantalla o sección, sin cambios de datos ni dependencias | Los mismos tres; en `spec.md` alcanzan Objetivo, Alcance, Requisitos funcionales y Criterios de aceptación |
| **Invitación** | Invitación nueva con plantilla y estilo existentes | [`invitation.md`](../../../docs/specs/_templates/invitation.md), guardado como `spec.md`, más `plan.md` y `tasks.md` |

Cada spec es una carpeta `docs/specs/NNN-nombre-corto/` y siempre lleva los tres archivos, sea larga, corta o de invitación: `spec.md` dice qué y por qué; `plan.md`, cómo; `tasks.md`, en qué orden. En una spec corta o de invitación, el plan y las tareas pueden ser de pocas líneas.

Las specs iniciales son largas y pueden tomar el tiempo que haga falta. Si dudás entre larga y corta, preguntá al responsable. Si una spec corta empieza a necesitar más de 5 tareas o cambios de datos, pasala a larga.

## Flujo

[`CONSTITUTION.md`](../../../docs/CONSTITUTION.md) → Spec → Clarificación → Plan y tareas → Armado → Validación → Test → Pull request

- **Nunca pases de la spec al armado sin la aprobación explícita del responsable.** `plan.md` y `tasks.md` se aprueban junto con `spec.md` o en una segunda pasada.
- **Con la spec aprobada, el armado se delega:** se hacen todas las tareas en orden, sin pedir ok entre tareas, y se frena solo en los casos de "Preguntar antes" de [`AGENTS.md`](../../../AGENTS.md).
- **Ninguna spec puede contradecir la constitución.** Si un pedido choca con un principio, frená y avisá.
- **La spec manda:** si algo no está en la spec, no se implementa. Si falta una decisión, frená y preguntá.
- **Un cambio de requisitos** se hace primero en la spec y después en el código. Se anota en el historial de cambios de la spec.
- Al cambiar de estado, actualizá el encabezado `**Estado:**` de `spec.md`, `plan.md` y `tasks.md` y el índice de `docs/specs/README.md`. Si hubo decisiones o aprendizajes, también `MEMORY.md`.

## Spec

- Describe **qué** y **por qué**. No repite lo que ya está en el README o en `docs/`: lo enlaza.
- En specs largas y cortas, los requisitos funcionales van en **formato EARS**, numerados y en español:
  - `RF-x: CUANDO <evento>, EL SISTEMA <respuesta>.`
  - `RF-x: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.`
  - `RF-x: MIENTRAS <estado>, EL SISTEMA <respuesta>.`
  - `RF-x: EL SISTEMA <comportamiento permanente>.`
- **Cada RF tiene que ser verificable:** nada de "rápido", "simple" o "lindo" sin un criterio comprobable. Lo visual se verifica contra la guía de estilo (`docs/guias/<tipo>/<estilo>.md`).
- Lo que no se pueda definir queda como `PENDIENTE: definición del responsable`. No se completa con supuestos.
- **Clarificación:** hacé de 1 a 10 preguntas, de a una, hasta que no queden preguntas abiertas. Para una spec corta o de invitación suelen alcanzar de 1 a 3.
- En specs de invitación no hay RF: alcanzan los datos del molde y sus criterios de aceptación.

## Plan y tareas

El plan va en `plan.md` y las tareas en `tasks.md`, dentro de la carpeta de la spec.

- Carpetas y archivos afectados, por capa (ver [`project-structure.md`](../../../docs/architecture/project-structure.md)).
- Datos y tablas afectados, con sus reglas de seguridad.
- Decisiones justificadas, cada una con su alternativa descartada.
- Costo: confirmar que se mantiene en planes gratuitos.
- **Qué RF cubre cada parte.** Ningún RF puede quedar sin cubrir.

Cada tarea:

```markdown
- [ ] **Tn. <Descripción>.** RF-x, RF-y
  - Hecho cuando: <comprobación verificable>.
```

En orden de dependencia. Si salen más de 10 tareas, proponé dividir la spec.

## Armado

- Una rama por spec, una tarea por vez y en orden.
- Marcá cada tarea como hecha (`- [x]`), hacé un commit por tarea y seguí con la siguiente.
- Antes de cerrar cada tarea deben pasar las comprobaciones de la sección "Verificación" de `AGENTS.md` que existan en ese momento.

## Validación, test y pull request

1. **Validar:** mostrar el resultado al responsable en la vista previa, en un ancho de celular y uno de escritorio. Si pide cambios, se corrigen en la misma rama.
2. **Testear:** cada RF y cada criterio de aceptación tiene que estar cubierto por un test o por una verificación manual concreta. Aplicar la skill [`review-code`](../review-code/SKILL.md).
3. **Pull request:** recién después de validar y testear. Uno solo por spec, con qué se construyó, qué RF cubre cada parte, cómo probarlo, capturas si hay interfaz y los pendientes que quedaron.
4. Al integrarse, pasar la spec a implementada.

## Ejemplos (bien / mal)

**Bien:** `RF-3: SI el regalo ya está reservado, ENTONCES EL SISTEMA muestra el botón deshabilitado con el texto "Reservado".`

**Mal:** `RF-3: La lista de regalos tiene que ser linda y fácil de usar.` No se puede comprobar.

**Mal:** abrir el pull request antes de que el responsable vea la vista previa.
