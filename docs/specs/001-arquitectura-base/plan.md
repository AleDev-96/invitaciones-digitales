# 001 — Arquitectura base: plan

- **Estado:** aprobado
- **Spec:** [spec.md](spec.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

Cómo se construye lo que pide la spec. Cada parte indica qué requisitos (RF) cubre.

## Decisiones que cierra

| Tema | Decisión | Alternativa descartada |
|---|---|---|
| Dirección | `/<slug>`, con slug único en toda la aplicación | `/<tipo>/<slug>`: más larga y expone el tipo en inglés |
| Dominio | Gratuito de Cloudflare: `invitaciones-digitales-bhi.pages.dev`, uno solo para todas las invitaciones. Se puede sumar otro sitio de Cloudflare sobre el mismo repositorio si hace falta un nombre distinto | Dominio propio: tiene costo anual. Un sitio por invitación: más trabajo en cada alta |
| Identificación del invitado | Link general. Al confirmar, la base entrega a ese navegador una clave propia que se guarda en el dispositivo (detalle en 003) | Link por invitado: obliga a cargar la lista y a enviar cada link |
| Operaciones de invitados | Funciones de la base que validan todo adentro; ninguna tabla se lee ni se escribe directo desde la página | Políticas RLS abiertas: no distinguen a un invitado de otro |
| Estilos | Variables CSS bajo el atributo `data-theme="<theme_key>"`; Tailwind usa esas variables | Una hoja de estilos global por estilo: los colores de uno pisan a los de otro |
| Vista previa del link | Propia de cada invitación, con una Cloudflare Pages Function | Genérica para todas |
| Pausa de Supabase | Tarea programada de GitHub cada 2 días, con fecha "activa hasta" | Entrar a mano una vez por semana |
| Baja y borrado | 7 días después del evento, a mano y con lista de pasos | Automático: riesgo de borrar por error |
| Pruebas | Vitest | Solo verificación manual; Vitest + Playwright |

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
| Cloudflare Pages | 100 sitios por cuenta y 500 publicaciones por mes | Se usa un sitio; cada cambio integrado consume una publicación |
| GitHub Actions | En un repositorio público, las tareas programadas se desactivan tras 60 días sin actividad en el repositorio | Se reactiva con un clic; queda anotado en la skill `create-invitation` |
