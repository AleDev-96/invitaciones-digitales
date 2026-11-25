# AGENTS.md — Invitaciones Digitales

Instrucciones para cualquier agente de IA que trabaje en este repositorio. No dependen de una herramienta en particular.

Proyecto para generar invitaciones digitales: cada invitación es una página web interactiva que informa de un evento. Las invitaciones se organizan por tipo de evento, porque cada tipo tiene su estructura: un baby shower no se arma igual que un cumpleaños, aunque puede parecerse a un casamiento por la selección de regalos.

## Memoria del proyecto

[MEMORY.md](MEMORY.md) guarda lo que tiene que sobrevivir entre sesiones: estado, aprendizajes, decisiones y próximos pasos.

- Leerlo al empezar cada sesión.
- Actualizarlo al terminar, en el mismo cambio que el trabajo realizado.
- Mantenerlo en unas 50 líneas: resumir o eliminar lo que ya no aporte. El detalle va en `docs/` o en la spec correspondiente, no en la memoria.

## Estado actual

Está construida la base de la [spec 001](docs/specs/001-arquitectura-base/spec.md): rutas `/` y `/<slug>`, tabla `invitations`, registro de plantillas y estilos, vista previa del link y tarea keepalive. También están la plantilla `baby-shower` con el estilo `sage-geese` (spec 002) la confirmación de asistencia (spec 003, tabla `rsvps`) y la lista de regalos (spec 004, ruta `/<slug>/regalos`, tablas `gifts` y `gift_reservations`). La pantalla de los dueños está en `/<slug>/papis` (spec 005), con palabra clave por invitación. No asumir que un archivo existe sin comprobarlo.

## Stack y estructura

Filosofía: **costo 0, inversión 0**. Todo corre en planes gratuitos.

| Parte | Tecnología |
|---|---|
| Frontend | React + TypeScript + Vite |
| Estilos | Tailwind CSS |
| Datos | Supabase (plan gratuito) |
| Hosting | Cloudflare Pages (plan gratuito) |

Una sola aplicación sirve todas las invitaciones. No se copia la aplicación ni se crea un repositorio por evento.

Documentos de referencia:

- [docs/CONSTITUTION.md](docs/CONSTITUTION.md): los 6 principios innegociables. Ganan ante cualquier spec, skill o cambio.
- [MEMORY.md](MEMORY.md): memoria del proyecto entre sesiones.
- [README.md](README.md): propósito, alcance, reglas de negocio y seguridad.
- [docs/product/templates.md](docs/product/templates.md): tipos de evento, plantillas, estilos y funcionalidades.
- [docs/architecture/architecture.md](docs/architecture/architecture.md): capas, rutas y decisiones.
- [docs/architecture/data-model.md](docs/architecture/data-model.md): tablas, restricciones y acceso por rol.
- [docs/architecture/deployment.md](docs/architecture/deployment.md): variables de entorno y publicación.
- [docs/architecture/project-structure.md](docs/architecture/project-structure.md): qué va en cada carpeta.
- [docs/specs/README.md](docs/specs/README.md): cómo se escriben y aprueban las specs.
- [SKILLS.md](SKILLS.md): qué skills hay y cuándo es obligatorio usarlas. Las skills viven en [.github/skills/](.github/skills/).

## Convenciones

- Código simple, priorizando que funcione bien antes que la elegancia.
- Código en inglés: nombres de archivos, variables, funciones, tablas y columnas.
- Textos de la interfaz en español. Documentación y specs en español.
- Se distinguen dos cosas:
  - **Plantilla** (`<tipo>`): la estructura de un tipo de evento, es decir, sus secciones y su orden. Una por tipo de evento, por ejemplo `baby-shower`.
  - **Estilo** (`<estilo>`): colores, tipografías e ilustraciones. Una plantilla puede tener varios, por ejemplo `sage-geese`.
- Nombres en inglés, minúsculas y con guiones. Cada pieza tiene su lugar fijo:

  | Pieza | Ubicación |
  |---|---|
  | Estructura de la plantilla | `src/templates/<tipo>/` |
  | Estilo en código | `src/templates/<tipo>/themes/<estilo>/` |
  | Guía de estilo | `docs/guias/<tipo>/<estilo>.md` |
  | Gráficos fijos | `assets/images/templates/<tipo>/<estilo>/` |

- Un pedido que solo cambia el aspecto es un estilo nuevo. Un pedido que cambia la estructura es una plantilla nueva.
- Colores y tipografías viven en el estilo y no afectan a los demás estilos. No repetir códigos HEX dentro de componentes.
- Textos y datos de un evento van en los datos de la invitación, no escritos dentro de los componentes.
- Diseñar primero para celular (360 a 430 px de ancho).

## Reglas de dominio

- [docs/product/templates.md](docs/product/templates.md) es el único lugar donde se busca qué plantilla, estilos y funcionalidades corresponden a un tipo de evento. Leerlo antes de armar o modificar una invitación.
- Si el tipo de evento o el estilo pedido no está en esa tabla, no improvisar: proponer un estilo o preguntar, y registrarlo en la tabla antes de escribir código.
- Toda plantilla o estilo nuevo se agrega a la tabla en el mismo cambio.
- Las plantillas solo componen la parte visual. La lógica de las funcionalidades va en `src/features/` y se comparte entre plantillas.
- Cada invitación activa o desactiva sus funcionalidades con datos, sin código nuevo.
- Reservas y confirmaciones se validan en la base de datos. Ocultar un botón no es seguridad.
- La página pública no muestra datos personales de invitados.

## Límites

- Es una tarjeta interactiva cuya finalidad es informar del evento. No es una plataforma.
- Funcionalidades previstas hoy: regalos sugeridos, confirmación de asistencia, cuenta regresiva y ubicación en Google Maps. Según el tipo de evento, una invitación puede tener todas, algunas o ninguna.
- La lista no es cerrada, pero una funcionalidad nueva se agrega solo cuando una invitación concreta la necesita, con su spec. No agregar funcionalidades "por si acaso".
- Las invitaciones son temporales. No hacer desarrollos complejos para algo que dura lo que dura el evento.
- La aplicación no genera archivos PDF. El recuerdo de la tarjeta se obtiene con la función de imprimir del navegador.
- Al terminar el evento, la invitación se despublica y los datos personales de los invitados se borran. Antes de borrarlos, se entrega a quien encargó la invitación la lista de confirmados y regalos.
- En el repositorio quedan plantillas y estilos, nunca datos de personas ni credenciales.
- Los dueños consultan y corrigen confirmaciones y reservas desde `/<slug>/papis`. Invitaciones, regalos y palabras clave se cargan desde la pantalla de Supabase.
- No usar la marca Tomolitech en la interfaz ni en textos públicos.

## Forma de trabajar

Se trabaja con specs ([docs/specs/README.md](docs/specs/README.md)), siguiendo la skill [`sdd`](.github/skills/sdd/SKILL.md).

- **Specs largas:** las iniciales de arquitectura y los rediseños grandes. Pueden tomar el tiempo que haga falta; es preferible definir bien antes que rehacer un desarrollo costoso.
- **Specs cortas:** rediseños o ajustes acotados.
- **Specs de invitación:** cortas. Cuando ya existe la plantilla y el estilo, solo definen tipo de evento, estilo, imágenes y funcionalidades.
- **Cambios menores** (un texto, un color, un ajuste de espaciado) y reorganizaciones de archivos o documentos: directo, sin spec.

Toda spec, sea larga, corta o de invitación, es una carpeta `docs/specs/NNN-nombre-corto/` con `spec.md` (qué y por qué), `plan.md` (cómo) y `tasks.md` (en qué orden).

Orden de cada trabajo:

1. Armar, a partir de una spec aprobada.
2. Validar con el responsable del proyecto en la vista previa.
3. Testear.
4. Abrir el pull request. No antes.

Una rama por trabajo; no trabajar directo sobre `main`. Borrar el `.gitkeep` de una carpeta cuando recibe contenido real.

### Dónde va cada cosa

| Qué | Dónde | Se separa por |
|---|---|---|
| Estructura de la plantilla | `src/templates/<tipo>/` | Tipo de evento |
| Estilo en código | `src/templates/<tipo>/themes/<estilo>/` | Estilo |
| Guía de estilo | `docs/guias/<tipo>/<estilo>.md` | Estilo |
| Gráficos fijos | `assets/images/templates/<tipo>/<estilo>/` | Estilo |
| Pedido de la invitación | `docs/specs/NNN-nombre-corto/spec.md` | Invitación |
| Textos, fechas, regalos y fotos del evento | Supabase, asociados al `invitation_id` | Invitación |

En el repositorio hay carpetas por tipo de evento y por estilo, no por cliente. Los datos de cada invitación viven en Supabase y no se versionan.

Cada invitación guarda qué plantilla (`template_key`) y qué estilo (`theme_key`) usa. Dos invitaciones pueden compartir plantilla y estilo: cada una tiene su URL, y sus invitados, regalos, ubicación y textos quedan asociados a su propio `invitation_id` sin mezclarse.

### Trabajo en paralelo

Varias invitaciones pueden armarse y publicarse a la vez sobre la misma aplicación.

- Una rama y una spec por invitación, estilo o plantilla.
- Cada rama toca solo las carpetas de su plantilla o de su estilo. Así las ramas no chocan entre sí.
- Dos invitaciones con la misma plantilla y el mismo estilo no requieren código nuevo: se cargan los datos de cada una.
- Varias invitaciones pueden estar publicadas a la vez. Publicar o dar de baja una no afecta a las demás.
- Cada invitación tiene un estado: borrador, publicada o dada de baja. El índice de `docs/specs/README.md` indica cuáles están publicadas.
- Un cambio en lo compartido (`src/features/`, `src/components/`, `src/app/`, `src/domain/`, `src/services/`, `src/infra/`) afecta a todas las invitaciones publicadas. Va en su propio pull request, separado del de una invitación, y se revisa contra todas las plantillas disponibles.
- Integrar una rama publica la aplicación completa. Antes de integrar, comprobar que las invitaciones ya publicadas siguen viéndose bien.

### Siempre

- Guiarse por la guía del estilo elegido. Si no existe, proponer una o preguntar.
- Reutilizar plantillas, estilos, componentes y funcionalidades existentes antes de crear nuevos.
- Actualizar la documentación afectada en el mismo cambio.

### Preguntar antes

- Dependencias nuevas.
- Carpetas o capas fuera de la estructura documentada en `docs/architecture/project-structure.md`.
- Cambios de arquitectura o de servicios, en especial los que puedan generar gastos.
- Cualquier cosa que comprometa la filosofía de inversión 0.

### Nunca

- Hacer crecer el proyecto sin una necesidad concreta.
- Implementar sin una spec aprobada, salvo cambios menores.
- Contratar o activar servicios pagos.
- Subir credenciales, tokens reales o datos personales. La clave `service_role` de Supabase nunca va en el frontend.
- Subir capturas de diseños de terceros ni usar recursos gráficos sin licencia verificada.
- Editar migraciones de base de datos ya aplicadas.

## Verificación

En este proyecto predominan el estilo y la funcionalidad, así que todo cambio visible se valida mirándolo.

- Durante el trabajo: vista previa en el navegador (`npm run dev`), compartida con el responsable del proyecto.
- En cada rama publicada: enlace de vista previa de Cloudflare Pages, que se puede abrir desde un celular.
- Revisar siempre un ancho de celular y uno de escritorio.
- Antes de cada commit terminan sin errores (Node 22.22 o superior):

  | Comando | Qué comprueba |
  |---|---|
  | `npm run typecheck` | Tipos de TypeScript |
  | `npm run lint` | Reglas de código (ESLint) |
  | `npm run format:check` | Formato (Prettier); `npm run format` lo corrige |
  | `npm test` | Pruebas de Vitest en `tests/` |
  | `npm run build` | Compilación de producción en `dist/` |

- Los cambios de datos o permisos se prueban también sin sesión iniciada.

Los comandos y el enlace de vista previa aplican a partir de que exista la aplicación y su despliegue.
