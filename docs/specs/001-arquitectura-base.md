# 001 — Arquitectura base

- **Tipo:** larga
- **Estado:** borrador
- **Fecha:** 2026-11-23

## Objetivo

Dejar la aplicación funcionando y publicada, todavía sin diseño: una dirección por invitación, los datos de cada invitación en la base y las piezas comunes que usan todas las specs siguientes. Cierra las decisiones abiertas de [architecture.md](../architecture/architecture.md).

## Alcance

- Proyecto React + TypeScript + Vite + Tailwind con comprobaciones de código y pruebas.
- Tabla de invitaciones en Supabase, con acceso público solo a través de una función de la base.
- Dirección `/<slug>` por invitación y pantallas de estado (cargando, no encontrada, dada de baja, error).
- Registro de plantillas y estilos, y mecanismo para que un estilo no afecte a otro.
- Vista previa propia de cada invitación al compartir el link.
- Tarea automática que evita la pausa de Supabase mientras haya una invitación publicada.
- Publicación en Cloudflare Pages con el dominio gratuito.
- Una invitación de demostración con una plantilla provisoria, para comprobar el recorrido completo.

## Fuera de alcance

- El diseño de la invitación, el sobre y las secciones: spec 002.
- Confirmación de asistencia y sus tablas: spec 003.
- Regalos y sus tablas: spec 004.
- Pantalla de los dueños y su palabra clave: spec 005. Hasta entonces los documentos siguen diciendo "sin panel".
- Links individuales por invitado. El diseño no los impide.
- Dominio propio.

## Decisiones que cierra

| Tema | Decisión | Alternativa descartada |
|---|---|---|
| Dirección | `/<slug>`, con slug único en toda la aplicación | `/<tipo>/<slug>`: más larga y expone el tipo en inglés |
| Dominio | Gratuito de Cloudflare (`<nombre>.pages.dev`) | Dominio propio: tiene costo anual |
| Identificación del invitado | Link general. Al confirmar, la base entrega a ese navegador una clave propia que se guarda en el dispositivo (detalle en 003) | Link por invitado: obliga a cargar la lista y a enviar cada link |
| Operaciones de invitados | Funciones de la base que validan todo adentro; ninguna tabla se lee ni se escribe directo desde la página | Políticas RLS abiertas: no distinguen a un invitado de otro |
| Estilos | Variables CSS bajo el atributo `data-theme="<theme_key>"`; Tailwind usa esas variables | Una hoja de estilos global por estilo: los colores de uno pisan a los de otro |
| Vista previa del link | Propia de cada invitación, con una Cloudflare Pages Function | Genérica para todas |
| Pausa de Supabase | Tarea programada de GitHub cada 2 días, con fecha "activa hasta" | Entrar a mano una vez por semana |
| Baja y borrado | 7 días después del evento, a mano y con lista de pasos | Automático: riesgo de borrar por error |
| Pruebas | Vitest | Solo verificación manual; Vitest + Playwright |

## Requisitos funcionales

Dirección y carga:

- RF-1: CUANDO alguien abre `/<slug>` de una invitación publicada, EL SISTEMA muestra esa invitación con la plantilla de su `template_key` y el estilo de su `theme_key`.
- RF-2: MIENTRAS se cargan los datos de la invitación, EL SISTEMA muestra una pantalla de espera.
- RF-3: SI el slug no existe o la invitación está en borrador, ENTONCES EL SISTEMA muestra "No encontramos esta invitación", sin distinguir un caso del otro.
- RF-4: SI la invitación está dada de baja, ENTONCES EL SISTEMA muestra "Esta invitación ya no está disponible" y ningún dato del evento.
- RF-5: SI la base de datos no responde, ENTONCES EL SISTEMA muestra un mensaje de error con un botón para reintentar.
- RF-6: CUANDO alguien abre la dirección raíz `/`, EL SISTEMA muestra una página neutra, sin listar invitaciones.
- RF-7: CUANDO alguien entra directo a `/<slug>` o recarga la página, EL SISTEMA muestra la misma invitación.

Datos y aislamiento:

- RF-8: EL SISTEMA acepta como slug solo minúsculas sin acentos, números y guiones, de 3 a 40 caracteres, y rechaza slugs repetidos o reservados.
- RF-9: EL SISTEMA entrega al público únicamente los datos de la invitación pedida por su slug; no permite listar invitaciones ni leer la tabla directamente.
- RF-10: SI una invitación indica un `template_key` o un `theme_key` que no están registrados, ENTONCES EL SISTEMA muestra el mensaje de error de RF-5 y no otra plantilla.
- RF-11: EL SISTEMA aplica los colores y tipografías de un estilo solo dentro de la invitación que lo usa.

Vista previa del link:

- RF-12: CUANDO se comparte el link de una invitación publicada, EL SISTEMA entrega el título, la descripción y la imagen de vista previa propios de esa invitación.
- RF-13: SI la invitación no existe, no está publicada o la base no responde, ENTONCES EL SISTEMA entrega la vista previa genérica y la página funciona igual.

Disponibilidad:

- RF-14: MIENTRAS la fecha actual no supere la fecha "activa hasta", EL SISTEMA hace una consulta mínima a la base cada 2 días.
- RF-15: SI la fecha actual supera la fecha "activa hasta", ENTONCES EL SISTEMA no consulta la base.
- RF-16: SI la consulta de RF-14 falla, ENTONCES EL SISTEMA marca la ejecución como fallida para que GitHub avise por correo.

## Reglas

- Las del [README](../../README.md) y la [constitución](../CONSTITUTION.md).
- La clave `service_role` no se usa en la aplicación, en la función de vista previa ni en la tarea programada: las tres usan la clave pública.
- Los datos de la invitación de demostración son inventados.
- Estados de una invitación: borrador, publicada, dada de baja. Cambiar el estado de una no afecta a las demás.
- La baja y el borrado de datos de invitados se hacen 7 días después del evento, a mano.

## Diseño técnico

### Carpetas y archivos

| Parte | Ubicación | RF |
|---|---|---|
| Arranque, rutas y estilos globales | `src/app/` | RF-6, RF-7 |
| Tipos de invitación, validación de slug y regla de visibilidad por estado. La fecha de "hoy" entra como parámetro | `src/domain/invitation.ts` | RF-3, RF-4, RF-8 |
| Cliente de Supabase | `src/infra/supabase.ts` | RF-9 |
| Carga de una invitación por slug | `src/services/invitations.ts` | RF-1, RF-5 |
| Página de invitación y pantallas de estado | `src/features/invitations/` | RF-1 a RF-5 |
| Registro de plantillas y estilos | `src/templates/registry.ts` | RF-1, RF-10 |
| Plantilla provisoria `baby-shower` y variables del estilo `sage-geese` | `src/templates/baby-shower/` | RF-1, RF-11 |
| Función de vista previa | `functions/[slug].ts` | RF-12, RF-13 |
| Tarea programada | `.github/workflows/keepalive.yml` | RF-14 a RF-16 |
| Tabla, función y permisos | `supabase/migrations/` | RF-8, RF-9 |
| Datos de demostración | `supabase/seed.sql` | RF-1 |
| Pruebas | `tests/unit/` | — |

`functions/` es una carpeta nueva en la raíz: Cloudflare Pages solo reconoce las funciones en esa ubicación.

### Datos

Tabla `invitations`:

| Columna | Contenido |
|---|---|
| `id` | Identificador |
| `slug` | Único. Formato de RF-8 |
| `template_key`, `theme_key` | Plantilla y estilo |
| `status` | `draft`, `published` o `archived` |
| `event_at`, `timezone` | Fecha y hora del evento, y zona horaria |
| `rsvp_closes_at` | Cierre de confirmaciones (lo usa 003) |
| `expected_guests` | Invitados esperados (lo usa 005) |
| `takedown_on` | Fecha de baja; por defecto, 7 días después del evento |
| `preview_title`, `preview_description`, `preview_image_url` | Vista previa del link |
| `content` | Textos y datos propios de la plantilla; su forma la define cada plantilla (002) |
| `features` | Funcionalidades activas |
| `created_at`, `updated_at` | Auditoría |

- RLS activo y sin políticas para el público: la tabla no se puede leer ni escribir con la clave pública.
- Función `get_invitation(slug)`: devuelve los datos de una invitación publicada; de una dada de baja, solo el estado; de un borrador o un slug inexistente, nada. Es el único acceso público (RF-3, RF-4, RF-9).
- Función `get_invitation_preview(slug)`: devuelve solo los tres campos de vista previa de una invitación publicada (RF-12).
- Las tablas de confirmaciones y regalos se agregan en 003 y 004, todas con `invitation_id`.
- Quien administra carga y edita invitaciones desde la pantalla de Supabase.

### Estilos

Cada estilo declara sus colores y tipografías como variables CSS bajo `[data-theme="<theme_key>"]`. La página de invitación pone ese atributo en su contenedor y Tailwind lee las variables. Fuera del contenedor no hay estilo de invitación (RF-11).

### Vista previa del link

`functions/[slug].ts` atiende los pedidos a `/<slug>`: pide a la base los campos de vista previa, los escribe en las etiquetas Open Graph de `index.html` y devuelve la página. Si algo falla, devuelve `index.html` sin cambios (RF-13). Los pedidos de archivos estáticos no pasan por la función. La lógica que arma las etiquetas es una función pura, probada con Vitest.

### Tarea programada

`.github/workflows/keepalive.yml` corre cada 2 días y también se puede lanzar a mano. Lee la variable del repositorio `KEEPALIVE_UNTIL` (fecha); si ya pasó, termina sin consultar. Si no, llama a `get_invitation_preview` con la clave pública. Publicar una invitación incluye actualizar esa fecha a su `takedown_on`; el paso se agrega a la skill `create-invitation`.

Entre eventos la base puede pausarse. No se pierden datos: se reactiva desde la pantalla de Supabase antes de publicar la siguiente invitación.

### Dependencias

Todas gratuitas y de uso extendido. Requieren aprobación junto con esta spec.

| Dependencia | Para qué |
|---|---|
| `react`, `react-dom` | Interfaz |
| `vite`, `@vitejs/plugin-react`, `typescript` | Compilación |
| `tailwindcss`, `@tailwindcss/vite` | Estilos |
| `react-router` | Rutas: `/`, `/<slug>` y las que sumen 004 y 005 |
| `@supabase/supabase-js` | Conexión con Supabase |
| `vitest` | Pruebas |
| `eslint`, `typescript-eslint`, `prettier` | Comprobación y formato del código |

## Costo

Se mantiene en planes gratuitos. Límites verificados en la documentación de cada servicio el 2026-11-23:

| Servicio | Límite del plan gratuito | Impacto |
|---|---|---|
| Supabase | Puede pausar el proyecto tras 7 días de poca actividad; se reactiva desde su pantalla. Hasta 2 proyectos activos | Cubierto con la tarea programada. Se usa un solo proyecto |
| Cloudflare Pages Functions | 100.000 pedidos por día, compartidos con Workers | Cada apertura de una invitación consume uno |
| GitHub Actions | En un repositorio público, las tareas programadas se desactivan tras 60 días sin actividad en el repositorio | Se reactiva con un clic; queda anotado en la skill `create-invitation` |

## Criterios de aceptación

- [ ] `/demo` muestra la invitación de demostración en la dirección pública `.pages.dev`, en un celular y en escritorio.
- [ ] Recargar `/demo` muestra la misma invitación.
- [ ] Un slug inexistente y una invitación en borrador muestran el mismo mensaje.
- [ ] Una invitación dada de baja muestra su mensaje y la respuesta de la base no incluye datos del evento.
- [ ] Con la clave pública no se puede leer ni escribir la tabla `invitations` directamente.
- [ ] El link de `/demo` pegado en WhatsApp muestra el título, la descripción y la imagen de la demostración.
- [ ] Un link con slug inexistente muestra la vista previa genérica.
- [ ] La tarea programada, lanzada a mano, consulta la base con una fecha vigente y no la consulta con una fecha vencida.
- [ ] Pasan la comprobación de tipos, el lint, las pruebas y la compilación.
- [ ] No hay credenciales en el repositorio.

## Tareas

- [ ] **T1. Crear el proyecto con Vite, React, TypeScript, Tailwind, lint, formato y Vitest.** —
  - Hecho cuando: `npm run build`, `npm run lint`, `npm run typecheck` y `npm test` terminan sin errores, y `AGENTS.md` lista esos comandos.
- [ ] **T2. Reglas de dominio de la invitación.** RF-3, RF-4, RF-8
  - Hecho cuando: hay pruebas que cubren slugs válidos, inválidos y reservados, y la visibilidad de cada estado.
- [ ] **T3. Migración con la tabla `invitations`, sus permisos y las dos funciones; datos de demostración.** RF-8, RF-9
  - Hecho cuando: con la clave pública la tabla no se puede leer, y las funciones devuelven lo indicado para cada estado.
- [ ] **T4. Cliente de Supabase y servicio de carga por slug.** RF-1, RF-5
  - Hecho cuando: el servicio devuelve la invitación, "no encontrada", "dada de baja" o error, con pruebas de cada caso.
- [ ] **T5. Rutas, página de invitación, pantallas de estado, registro de plantillas y estilos, y plantilla provisoria.** RF-1 a RF-7, RF-10, RF-11
  - Hecho cuando: en local se ven los cinco estados y el estilo no afecta a la página raíz.
- [ ] **T6. Función de vista previa.** RF-12, RF-13
  - Hecho cuando: hay pruebas del armado de etiquetas y de la respuesta sin cambios ante un fallo.
- [ ] **T7. Tarea programada.** RF-14 a RF-16
  - Hecho cuando: lanzada a mano se comporta como indica el criterio de aceptación.
- [ ] **T8. Publicación en Cloudflare Pages.** RF-1, RF-7, RF-12
  - Hecho cuando: se cumplen los criterios de aceptación sobre la dirección pública.
- [ ] **T9. Actualizar la documentación.** —
  - Hecho cuando: `architecture.md`, `data-model.md`, `deployment.md`, `project-structure.md`, `AGENTS.md`, `MEMORY.md`, el README y la skill `create-invitation` reflejan lo construido, sin decisiones abiertas que esta spec cierra.

## Preguntas abiertas

1. **Cuentas.** Hace falta un proyecto de Supabase y uno de Cloudflare Pages a nombre del responsable. Definir si los crea el responsable y comparte el acceso, o cómo se hace el alta.
2. **Nombre del dominio gratuito.** Qué va delante de `.pages.dev`. Propuesta: `invitaciones-digitales`, sujeta a que esté libre.
3. **Aprobación de las dependencias** de la tabla y de la carpeta `functions/` en la raíz.

## Historial de cambios

| Fecha | Cambio |
|---|---|
| 2026-11-23 | Primera versión, con las respuestas de la clarificación |
