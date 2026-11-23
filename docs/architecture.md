# Arquitectura

**Estado:** propuesta inicial. Las decisiones marcadas como abiertas se cierran antes de escribir el código que dependa de ellas.

## Visión general

Sitio estático (una sola aplicación React) que sirve todas las invitaciones. Los datos dinámicos viven en Supabase. No hay servidor propio.

```text
Invitado (celular, link de WhatsApp)
        │
        ▼
Cloudflare Pages ── sirve la aplicación React (archivos estáticos)
        │
        ▼
Supabase ── base de datos Postgres, autenticación del panel, funciones y políticas RLS
```

## Tecnologías

| Parte | Tecnología | Responsabilidad |
|---|---|---|
| Frontend | React + TypeScript + Vite | Invitación pública y panel de administración |
| Estilos | Tailwind CSS | Diseño responsive y componentes visuales |
| Backend y base de datos | Supabase | Persistencia, autenticación y operaciones seguras |
| Hosting | Cloudflare Pages | Publicación del frontend |
| Código fuente | GitHub | Versionado y colaboración con agentes de IA |

Cualquier cambio de tecnología se justifica con una necesidad concreta y se documenta acá antes de incorporarlo.

## Capas

1. **Motor de invitaciones** (`src/app/`, `src/features/invitations/`): rutas, carga de datos por slug y elección de plantilla.
2. **Lógica por dominio** (`src/features/`): regalos, RSVP y administración.
3. **Componentes compartidos** (`src/components/`): ubicación, cuenta regresiva, lista de regalos, formulario RSVP, botones.
4. **Plantillas y estilos** (`src/templates/`): estructura de cada tipo de evento y sus estilos. Una plantilla recibe los datos de la invitación y no consulta Supabase por su cuenta.
5. **Datos de cada invitación** (Supabase): nombres, textos, fechas, imágenes, regalos y configuración.

Agregar una invitación nueva no requiere tocar código: se cargan sus datos y se elige una plantilla existente.

## Rutas

- Invitación pública: `/<tipo>/<slug>`, por ejemplo `/baby-shower/sofia`.
- Panel privado: `/admin`.

La aplicación busca la invitación por slug y renderiza la plantilla indicada en su `template_key` con el estilo indicado en su `theme_key`.

## Reglas que condicionan la arquitectura

- Reservar, liberar y cambiar un regalo se valida en la base de datos, no solo en el navegador.
- Un invitado solo puede leer o modificar su propia respuesta.
- La página pública no expone datos personales de invitados.
- La clave `service_role` de Supabase nunca llega al frontend.
- El panel requiere autenticación.

El detalle de reglas de negocio y seguridad está en el [README](../README.md).

## Decisiones tomadas

- **Panel de administración:** por ahora no se desarrolla. Confirmaciones y reservas se consultan desde la pantalla de Supabase. La ruta `/admin` y `src/features/admin/` quedan reservadas.
- **Plantilla y estilo:** una plantilla define la estructura de un tipo de evento y puede tener varios estilos (colores, tipografías, ilustraciones). Cada invitación indica `template_key` y `theme_key`. Varias invitaciones pueden compartir la misma combinación y estar publicadas a la vez.
- **Funcionalidades opcionales:** cada invitación activa o desactiva las suyas con datos. El catálogo está en [templates.md](templates.md).
- **Sin generación de PDF:** el recuerdo de la tarjeta se obtiene con la función de imprimir del navegador.
- **Ciclo de vida:** al terminar el evento la invitación se despublica y los datos personales de invitados se borran, previa entrega de la lista de confirmados y regalos a quien la encargó. El plazo se define en la spec de arquitectura.

## Decisiones abiertas

Se cierran en la spec de arquitectura base.


1. **Operaciones de invitados.** El invitado no inicia sesión, así que las políticas RLS por sí solas no distinguen a un invitado de otro. Propuesta: funciones de Postgres (RPC) que reciben el token del invitado y validan todo adentro de la base; las tablas `rsvps` y `gift_reservations` quedan sin lectura ni escritura directa para el público.
2. **Identificación del invitado.** Dos caminos: (a) lista de invitados precargada, con un link individual por invitado; (b) un link único para todos, donde el token se genera al confirmar y se guarda en el navegador. El estado "pendiente" del README solo tiene sentido con (a).
3. **Relación entre regalo y RSVP.** Definir si para reservar un regalo hace falta haber confirmado asistencia, o si son acciones independientes.
4. **Vista previa del link en WhatsApp.** Un sitio estático devuelve el mismo título e imagen para todas las invitaciones. Si se quiere una vista previa propia por invitación hace falta una Cloudflare Pages Function que complete las etiquetas Open Graph según el slug.
5. **Tipo en la URL.** Definir si el primer tramo de la URL es el `template_key` (`/baby-shower/sofia`) o un alias propio (`/cumple/juan`), y si el slug es único en toda la aplicación o solo dentro de su tipo.
6. **Aplicación del estilo.** Definir el mecanismo técnico para que los colores y tipografías de un estilo no afecten a otro (por ejemplo, variables CSS bajo un atributo `data-theme`).
7. **Pausa del plan gratuito de Supabase.** Verificar si el proyecto se pausa por inactividad y cómo evitar que ocurra cerca de la fecha de un evento.
