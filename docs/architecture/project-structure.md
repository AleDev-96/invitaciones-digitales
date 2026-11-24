# Estructura del proyecto

**Repositorio:** `invitaciones-digitales`.

Una sola aplicación sirve muchas invitaciones. Cada evento se representa con sus propios datos y elige una plantilla y un estilo; no se crea un repositorio nuevo por invitación.

## Estructura actual

Las carpetas vacías se versionan con un archivo `.gitkeep`, que se borra cuando la carpeta recibe contenido real.

```text
invitaciones-digitales/
├── .github/
│   ├── agents/               # Definiciones de agentes (pendiente)
│   ├── instructions/         # Instrucciones por tema (pendiente)
│   ├── workflows/            # Tareas de GitHub Actions (keepalive)
│   └── skills/
│       ├── create-invitation/
│       ├── create-template/
│       └── review-code/
├── assets/
│   └── images/
│       ├── references/       # Referencias propias (no se publican)
│       │   └── baby-shower/
│       ├── backgrounds/      # Fondos compartidos entre plantillas
│       ├── decorations/      # Adornos compartidos entre plantillas
│       ├── illustrations/    # Ilustraciones compartidas entre plantillas
│       └── templates/
│           └── baby-shower/
│               └── sage-geese/       # Gráficos de un estilo
├── docs/
│   ├── CONSTITUTION.md       # Principios innegociables
│   ├── architecture/         # Arquitectura, modelo de datos, despliegue y esta estructura
│   ├── flows/                # Flujos de uso (pendiente)
│   ├── guias/
│   │   └── baby-shower/
│   │       └── sage-geese.md         # Guía de un estilo
│   ├── presentacion/         # Material de presentación (pendiente)
│   ├── product/
│   │   └── templates.md      # Tipos de evento, plantillas, estilos y funcionalidades
│   └── specs/                # Specs y sus moldes
│       ├── _templates/
│       └── NNN-nombre-corto/ # Una carpeta por spec: spec.md, plan.md, tasks.md
├── src/
│   ├── app/                  # Arranque, rutas, configuración y estilos globales
│   ├── components/           # Componentes visuales compartidos
│   ├── content/              # Textos fijos de la interfaz y datos de demostración
│   ├── domain/               # Tipos y reglas de negocio, sin dependencias externas
│   ├── features/
│   │   ├── invitations/      # Datos y consulta de invitaciones
│   │   ├── gifts/            # Regalos, reservas, liberaciones
│   │   └── rsvp/             # Confirmación y modificación de asistencia
│   ├── infra/                # Conexión con Supabase y otros servicios externos
│   ├── services/             # Operaciones que combinan dominio e infraestructura
│   └── templates/
│       └── baby-shower/      # Estructura de la plantilla
│           └── themes/sage-geese/    # Un estilo
├── functions/                # Cloudflare Pages Functions: vista previa del link ([slug].ts)
├── public/og/                # Imágenes de vista previa del link (genérica y demo)
├── supabase/
│   ├── migrations/           # Cambios versionados de base de datos
│   └── seed.sql              # Datos inventados de demostración
├── tests/
│   ├── e2e/                  # Pruebas de punta a punta
│   ├── unit/                 # Pruebas unitarias
│   ├── fixtures/             # Datos de prueba
│   └── support/              # Utilidades de prueba
├── AGENTS.md                 # Instrucciones para agentes de IA
├── MEMORY.md                 # Memoria del proyecto entre sesiones
├── SKILLS.md                 # Qué skills hay y cuándo usarlas
└── README.md
```

## Archivos de configuración

En la raíz: `package.json`, `tsconfig.json`, `vite.config.ts` (también configura Vitest), `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `index.html` y `.env.example`. `docs/guias/ASSET_SOURCES.md` registra el origen y la licencia de cada recurso gráfico.

## Fuera de la convención general

Dos carpetas no forman parte de la convención habitual de repositorios y se mantienen por necesidad de este proyecto:

- `src/templates/`: las plantillas y sus estilos son el núcleo del producto y necesitan un lugar propio y fijo.
- `supabase/migrations/`: es la ubicación que usa la herramienta de Supabase para las migraciones.
- `functions/`: Cloudflare Pages solo reconoce sus funciones en esa carpeta de la raíz.
- `public/`: Vite publica tal cual lo que está ahí; se usa para las imágenes de vista previa del link, que necesitan una dirección fija.

## Responsabilidad de cada capa

- `app/`: arranque, rutas, configuración general y estilos globales.
- `components/`: componentes visuales compartidos entre plantillas.
- `content/`: textos fijos de la interfaz y datos ficticios para previsualización.
- `domain/`: tipos y reglas de negocio puras.
- `features/`: lógica y pantallas por funcionalidad (invitaciones, regalos, confirmación).
- `infra/`: conexión con Supabase.
- `services/`: operaciones que usan el dominio y la infraestructura.
- `templates/<tipo>/`: estructura de un tipo de evento (secciones y orden).
- `templates/<tipo>/themes/<estilo>/`: colores, tipografías e ilustraciones de un estilo.
- `assets/images/templates/<tipo>/<estilo>/`: gráficos fijos de un estilo.
- `assets/images/references/`: inspiración visual; no se publica en la web.
- `supabase/migrations/`: historial de cambios del esquema de datos.
- `.github/skills/`: procedimientos paso a paso para tareas repetidas.
- `docs/specs/`: qué se va a construir y cómo se comprueba, antes de escribir código.

## Imágenes

`assets/` está fuera de `src/` y no se publica entero. Una imagen llega a la web solo si el código la importa. Por eso las referencias de `assets/images/references/` nunca se publican.

## Flujo esperado para una nueva invitación

1. Crear el registro del evento en Supabase.
2. Asignar un `template_key` y un `theme_key`, por ejemplo `baby-shower` y `sage-geese`.
3. Guardar los datos, regalos, fecha y ubicación de ese evento.
4. Publicar la invitación y compartir su URL única, por ejemplo `/baby-shower/sofia`.
5. La aplicación busca el evento por slug y renderiza la plantilla con su estilo.

Las reservas y las confirmaciones quedan asociadas al `invitation_id` correcto.

## Separación de recursos

1. **Referencias:** material de inspiración propio o con permiso en `assets/images/references/`. No subir capturas de diseños de terceros: el repositorio es público.
2. **Decoración fija:** recursos finales en `assets/images/templates/<tipo>/<estilo>/`, o en `backgrounds/`, `decorations/` e `illustrations/` si los comparten varias plantillas.
3. **Contenido del evento:** fotos y productos particulares guardados como URLs/datos o en Supabase Storage.

Optimizar las imágenes finales para dispositivos móviles y registrar sus licencias.
