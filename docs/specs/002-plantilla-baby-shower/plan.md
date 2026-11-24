# 002 — Plantilla `baby-shower` y estilo `sage-geese`: plan

- **Estado:** borrador
- **Spec:** [spec.md](spec.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

## Decisiones

| Tema | Decisión | Alternativa descartada |
|---|---|---|
| Datos del evento | Campos dentro de `content` (ya existe, `jsonb`); sin migración | Columnas nuevas en `invitations`: obliga a una migración por cada texto |
| Link a Google Maps | `https://www.google.com/maps/search/?api=1&query=<dirección>`, o `content.location.mapsUrl` si se carga uno | Coordenadas o la API de Maps: piden clave y pueden tener costo |
| Cuenta regresiva | Cálculo puro en `src/domain/` y un componente que lo refresca cada segundo | Librería de fechas: dependencia nueva para una resta |
| Animación del sobre | CSS (transiciones y `prefers-reduced-motion`) | Librería de animación: dependencia nueva |
| Ilustraciones provisorias | SVG simples propios, marcados como provisorios | Imágenes de bancos sin licencia verificada |
| Tipografías | PENDIENTE: definición del responsable | |

## Diseño técnico

Campos de `content` que usa la plantilla (todos opcionales salvo `babyName`):

| Campo | Ejemplo |
|---|---|
| `babyName` | "Bebé Demo" |
| `hosts` | "Ana y Juan" |
| `message` | "Queremos compartir con vos..." |
| `location.address` | "Calle Falsa 123, CABA" |
| `location.mapsUrl` | Link de Google Maps (opcional) |
| `location.notes` | Lista: "Hay estacionamiento en la esquina" |
| `closing` | "¡Gracias por acompañarnos!" |

| Parte | Ubicación | RF |
|---|---|---|
| Lectura segura de `content` | `src/domain/` | RF-6, RF-7 |
| Cálculo de cuenta regresiva | `src/domain/` | RF-9, RF-10 |
| Armado del link de Maps | `src/domain/` | RF-12 |
| Portada y sobre | `src/templates/baby-shower/` | RF-1 a RF-3 |
| Secciones y su orden | `src/templates/baby-shower/` | RF-4, RF-5, RF-11, RF-13, RF-14 |
| Cuenta regresiva y ubicación compartibles | `src/components/` | RF-9, RF-10, RF-12 |
| Paleta, tipografías y gingham | `src/templates/baby-shower/themes/sage-geese/` | RF-8 |
| Ilustraciones provisorias | `src/templates/baby-shower/themes/sage-geese/` | RF-1, RF-4 |
| Registro de recursos | `docs/guias/ASSET_SOURCES.md` | Reglas |
| Datos de la `demo` | `supabase/seed.sql` | RF-5, RF-6 |

No hay tablas nuevas ni cambios de permisos. Los tests unitarios cubren la cuenta regresiva, el link de Maps y la lectura de `content`.

## Costo

Sin servicios ni dependencias nuevas (salvo que se elija `@fontsource`, que es gratuita). Se mantiene en planes gratuitos.
