# Arquitectura

**Estado:** base construida con la [spec 001](../specs/001-arquitectura-base/spec.md). Las decisiones de base se cierran ahí.

## Visión general

Sitio estático (una sola aplicación React) que sirve todas las invitaciones. Los datos dinámicos viven en Supabase. No hay servidor propio.

```text
Invitado (celular, link de WhatsApp)
        │
        ▼
Cloudflare Pages ── sirve la aplicación React (archivos estáticos)
        │                y la función de vista previa del link (functions/[slug].ts)
        │
        ▼
Supabase ── base de datos Postgres, funciones y políticas RLS
```

## Tecnologías

| Parte | Tecnología | Responsabilidad |
|---|---|---|
| Frontend | React + TypeScript + Vite | Invitación pública |
| Estilos | Tailwind CSS | Diseño responsive y componentes visuales |
| Backend y base de datos | Supabase | Persistencia y operaciones seguras |
| Hosting | Cloudflare Pages | Publicación del frontend |
| Código fuente | GitHub | Versionado y colaboración con agentes de IA |

Cualquier cambio de tecnología se justifica con una necesidad concreta y se documenta acá antes de incorporarlo.

## Capas

1. **Motor de invitaciones** (`src/app/`, `src/features/invitations/`): rutas, carga de datos por slug y elección de plantilla.
2. **Funcionalidades** (`src/features/`): regalos y confirmación de asistencia. Las reglas de negocio puras van en `src/domain/`, la conexión con Supabase en `src/infra/` y las operaciones que combinan ambas en `src/services/`.
3. **Componentes compartidos** (`src/components/`): ubicación, cuenta regresiva, lista de regalos, formulario RSVP, botones.
4. **Plantillas y estilos** (`src/templates/`): estructura de cada tipo de evento y sus estilos. Una plantilla recibe los datos de la invitación y no consulta Supabase por su cuenta.
5. **Datos de cada invitación** (Supabase): nombres, textos, fechas, imágenes, regalos y configuración.

Agregar una invitación nueva no requiere tocar código: se cargan sus datos y se elige una plantilla existente.

## Imágenes

Los gráficos viven en `assets/images/`, fuera de `src/`. Una imagen se publica solo si el código la importa; el resto de la carpeta, incluidas las referencias, no llega a la web.

## Rutas

- Página raíz `/`: neutra, no lista invitaciones.
- Invitación pública: `/<slug>`, por ejemplo `/oliver`. El slug es único en toda la aplicación: minúsculas sin acentos, números y guiones, de 3 a 40 caracteres, y no puede ser una palabra reservada (`src/domain/invitation.ts`).

La aplicación busca la invitación por slug y renderiza la plantilla indicada en su `template_key` con el estilo indicado en su `theme_key`.

## Reglas que condicionan la arquitectura

- Reservar, liberar y cambiar un regalo se valida en la base de datos, no solo en el navegador.
- Un invitado solo puede leer o modificar su propia respuesta.
- La página pública no expone datos personales de invitados.
- La clave `service_role` de Supabase nunca llega al frontend.

El detalle de reglas de negocio y seguridad está en el [README](../../README.md).

## Decisiones tomadas

- **Sin panel de administración:** confirmaciones y reservas se consultan desde la pantalla de Supabase.
- **Plantilla y estilo:** una plantilla define la estructura de un tipo de evento y puede tener varios estilos (colores, tipografías, ilustraciones). Cada invitación indica `template_key` y `theme_key`. Varias invitaciones pueden compartir la misma combinación y estar publicadas a la vez.
- **Funcionalidades opcionales:** cada invitación activa o desactiva las suyas con datos. El catálogo está en [templates.md](../product/templates.md).
- **Sin generación de PDF:** el recuerdo de la tarjeta se obtiene con la función de imprimir del navegador.
- **Ciclo de vida:** al terminar el evento la invitación se despublica y los datos personales de invitados se borran, previa entrega de la lista de confirmados y regalos a quien la encargó. El plazo es de 7 días después del evento.

## Decisiones de la spec 001

El detalle y las alternativas descartadas están en el [plan de la spec 001](../specs/001-arquitectura-base/plan.md).

- **Link general:** uno para todos los invitados. Cada navegador que responde guarda un código propio (spec 003).
- **Acceso público por funciones:** la tabla `invitations` no se lee ni se escribe directo; la página usa `get_invitation(slug)` y la vista previa `get_invitation_preview(slug)`. Las operaciones de invitados de las specs 003 y 004 siguen el mismo criterio.
- **Estilos aislados:** cada estilo declara sus variables CSS bajo `[data-theme="<theme_key>"]`; la página de invitación pone ese atributo en su contenedor y Tailwind lee las variables (`bg-(--color-background)`).
- **Registro de plantillas:** `src/templates/registry.ts` indica qué estilos tiene cada plantilla. Una combinación no registrada muestra el mensaje de error, no otra plantilla.
- **Vista previa por invitación:** `functions/[slug].ts` reemplaza el bloque `<!-- preview:start -->` de `index.html` con el título, la descripción y la imagen de la invitación. Si algo falla, devuelve la vista previa genérica.
- **Pausa de Supabase:** `.github/workflows/keepalive.yml` consulta la base cada 2 días hasta la fecha `KEEPALIVE_UNTIL`.
- **Baja:** 7 días después del evento (`takedown_on`). Desde ese día la invitación muestra "Esta invitación ya no está disponible", aunque siga publicada. El borrado de datos de invitados se hace a mano.
- **Pruebas:** Vitest en `tests/unit/`.

## Decisiones de la spec 003

El detalle está en el [plan de la spec 003](../specs/003-confirmacion-asistencia/plan.md).

- **Una respuesta por persona:** nombre y "Sí, asistiré" o "No podré ir". No se puede cambiar desde la invitación.
- **Código del navegador:** al responder, el navegador genera un código (`crypto.randomUUID()`) y lo guarda en `localStorage` junto con la respuesta. La base guarda solo su huella. Repetir el envío con el mismo código no crea otra respuesta, y la spec 004 lo usa para reconocer al invitado.
- **Cierre:** lo calcula la base (`rsvp_open` en `get_invitation`) con `rsvp_closes_at`, la hora del evento o `rsvp_closed`, y `submit_rsvp` rechaza lo que llegue tarde.
