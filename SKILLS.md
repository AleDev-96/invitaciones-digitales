# SKILLS.md — Guía de skills de Invitaciones Digitales

Una **skill** es una guía reutilizable con pasos y criterios para un tipo de tarea concreto (por ejemplo, dar de alta una invitación). Le da al agente de turno, sea cual sea la IA, la misma forma de trabajar cada vez.

Este archivo define **qué skills hay y cuándo es obligatorio usarlas**. Las skills en sí viven en `.github/skills/<nombre>/SKILL.md`, el formato estándar que leen GitHub Copilot, Claude y otros asistentes.

## Cómo usarlas

1. **Antes de empezar una tarea**, revisá la tabla de abajo.
2. Si la tarea coincide con el **disparador** de una skill, **leé su `SKILL.md` y seguilo**. Si coincide con varias, aplicalas todas.
3. Al terminar, indicá en tu resumen qué skills aplicaste.
4. Si una skill choca con [AGENTS.md](AGENTS.md) o con la spec, **gana AGENTS.md o la spec**: avisá del conflicto para corregir la skill.

## Skills disponibles

| Skill | Disparador: usala cuando… | Estado |
|---|---|---|
| [`sdd`](.github/skills/sdd/SKILL.md) | Redactes, clarifiques, revises o cambies una spec (`docs/specs/`), o implementes y verifiques una spec | Activa |
| [`create-invitation`](.github/skills/create-invitation/SKILL.md) | Haya que dar de alta una invitación nueva con una plantilla y un estilo que ya existen | Borrador (se completa cuando exista la aplicación) |
| [`create-template`](.github/skills/create-template/SKILL.md) | Haya que agregar un estilo a una plantilla existente, o una plantilla para un tipo de evento nuevo (`src/templates/`, `docs/guias/`, `assets/images/templates/`) | Borrador (se completa con la primera plantilla) |
| [`review-code`](.github/skills/review-code/SKILL.md) | Vayas a aprobar un pull request o termines un cambio propio | Activa |

> Actualizá esta tabla cada vez que se cree, cambie o elimine una skill.

## Cómo crear una skill nueva

1. **Proponela antes de crearla**: qué problema resuelve y cuál sería su disparador. Se crea solo con el ok del responsable.
2. Creá la carpeta `.github/skills/<nombre>/` (nombre en inglés, minúsculas y con guiones) con un archivo `SKILL.md`:

   ```markdown
   ---
   name: <nombre>
   description: Qué hace y cuándo usarla, en una o dos frases.
   ---

   # <Nombre>

   ## Cuándo usarla
   ## Pasos
   ## Reglas / checklist
   ## Ejemplos (bien / mal)
   ```

3. Mantenela **corta y concreta** (idealmente menos de 100 líneas). Si necesita material extra (ejemplos largos, moldes), ponelo en archivos aparte dentro de la misma carpeta y enlazalo.
4. Sumala a la tabla de arriba con su disparador.

## Skill vs. instrucción vs. agente

| Tipo | Dónde | Para qué |
|---|---|---|
| **Regla global** | `AGENTS.md` | Lo que vale siempre, en todo el repo |
| **Instrucción por tema** | `.github/instructions/*.md` | Reglas cortas sobre un tema: estándares de código, arquitectura, pruebas |
| **Skill** | `.github/skills/<nombre>/SKILL.md` | Cómo hacer bien un tipo de tarea: pasos, checklist y ejemplos |
| **Agente (rol)** | `.github/agents/*.agent.md` | Un punto de vista con responsabilidades propias (arquitecto, desarrollador, revisor) |

Las carpetas de instrucciones y de agentes todavía están vacías.
