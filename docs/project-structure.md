# Estructura del proyecto

**Repositorio:** `invitaciones-digitales`.

Una sola aplicación sirve muchas invitaciones. Cada evento se representa con sus propios datos y selecciona una plantilla; no se crea un repositorio nuevo por invitación.

## Estructura actual

Las carpetas vacías se versionan con un archivo `.gitkeep`, que se borra cuando la carpeta recibe contenido real.

```text
invitaciones-digitales/
├── AGENTS.md                 # Instrucciones para agentes de IA
├── README.md
├── docs/
│   ├── architecture.md
│   ├── data-model.md
│   ├── deployment.md
│   ├── project-structure.md
│   ├── templates.md          # Tipos de evento, plantillas y funcionalidades
│   └── design/
│       ├── baby-shower-visual-guide.md
│       └── references/baby-shower/   # Referencias propias (no se publican)
├── specs/                    # Specs y sus moldes
│   └── _templates/
├── skills/
│   ├── create-invitation/
│   ├── add-template/
│   └── review-code/
├── public/assets/templates/baby-shower/
├── src/
│   ├── app/                  # App, rutas y configuración
│   ├── components/
│   ├── features/
│   │   ├── invitations/      # Datos y consulta de invitaciones
│   │   ├── gifts/            # Regalos, reservas, liberaciones
│   │   ├── rsvp/             # Confirmación y modificación de asistencia
│   │   └── admin/            # Panel privado
│   ├── templates/
│   │   └── baby-shower/
│   ├── lib/
│   └── styles/
└── supabase/migrations/      # Cambios versionados de base de datos
```

## Se agrega al crear la aplicación

Estos archivos y carpetas todavía no existen. Se crean junto con el código que los necesita, no antes.

```text
├── package.json              # Con el scaffold de Vite
├── .env.example
├── docs/design/ASSET_SOURCES.md      # Con el primer recurso gráfico final
├── public/assets/templates/baby-shower/
│   ├── backgrounds/
│   ├── decorations/
│   ├── illustrations/
│   └── fonts/
└── src/
    ├── components/
    │   ├── shared/           # Componentes comunes entre plantillas
    │   └── ui/               # Botones, inputs, modales, etc.
    ├── templates/
    │   ├── baby-shower/
    │   │   ├── BabyShowerTemplate.tsx
    │   │   ├── theme.ts
    │   │   └── sections/
    │   └── shared/
    ├── lib/supabase/         # Cliente y utilidades de Supabase
    ├── data/demo/            # Datos ficticios para desarrollo
    └── styles/
        ├── global.css
        └── tokens.css
```

## Responsabilidad de cada capa

- `app/`: arranque, rutas y configuración general.
- `components/ui/`: componentes visuales genéricos.
- `components/shared/`: componentes compartidos entre plantillas.
- `features/`: lógica por dominio (invitaciones, regalos, RSVP y administración).
- `templates/`: composición visual específica de cada evento.
- `lib/supabase/`: conexión con Supabase.
- `data/demo/`: datos falsos para previsualización y pruebas.
- `public/assets/templates/`: gráficos fijos que forman parte del diseño reutilizable.
- `docs/design/references/`: inspiración visual; no se publica en la web.
- `supabase/migrations/`: historial de cambios del esquema de datos.
- `skills/`: procedimientos paso a paso para tareas repetidas.
- `specs/`: qué se va a construir y cómo se comprueba, antes de escribir código.

## Flujo esperado para una nueva invitación

1. Crear el registro del evento en Supabase.
2. Asignar un `template_key`, por ejemplo `baby-shower`.
3. Guardar los datos, tema, regalos, fecha y ubicación de ese evento.
4. Activar la invitación y compartir su URL única, por ejemplo `/baby-shower/sofia`.
5. La aplicación busca el evento por slug y renderiza la plantilla correspondiente.

Las reservas y las respuestas RSVP deben quedar asociadas al `invitation_id` correcto.

## Separación de recursos

1. **Referencias:** material de inspiración propio o con permiso en `docs/design/references/`. No subir capturas de diseños de terceros: el repositorio es público.
2. **Decoración fija:** recursos finales y reutilizables en `public/assets/templates/`.
3. **Contenido del evento:** fotos y productos particulares guardados como URLs/datos o en Supabase Storage.

No publicar las referencias como recursos finales. Optimizar las imágenes finales para dispositivos móviles y registrar sus licencias.
