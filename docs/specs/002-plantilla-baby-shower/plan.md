# 002 — Plantilla `baby-shower` y estilo `sage-geese`: plan

- **Estado:** aprobada
- **Spec:** [spec.md](spec.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

## Decisiones

| Tema | Decisión | Alternativa descartada |
|---|---|---|
| Datos del evento | Campos dentro de `content` (ya existe, `jsonb`); sin migración | Columnas nuevas en `invitations`: obliga a una migración por cada texto |
| Link a Google Maps | `https://www.google.com/maps/search/?api=1&query=<dirección>`, o `content.location.mapsUrl` si se carga uno | Coordenadas o la API de Maps: piden clave y pueden tener costo |
| Cuenta regresiva | Cálculo puro en `src/domain/` y un componente que lo refresca cada segundo | Librería de fechas: dependencia nueva para una resta |
| Animación del sobre | CSS (transiciones y `prefers-reduced-motion`) | Librería de animación: dependencia nueva |
| Sobre ya abierto | Marca por slug en `localStorage` del navegador; sin datos personales | Guardarlo en la base: pediría identificar al visitante |
| Ilustraciones provisorias | SVG simples propios, marcados como provisorios | Imágenes de bancos sin licencia verificada |
| Tipografías | `@fontsource/cormorant-garamond`, `@fontsource/lora` y `@fontsource/allura`, servidas junto con la app (licencia OFL) | Google Fonts por link: dos servidores externos más y la IP de cada invitado llega a Google |

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
| Lectura segura de `content` | `src/domain/` | RF-8, RF-9 |
| Cálculo de cuenta regresiva | `src/domain/` | RF-11, RF-12 |
| Armado del link de Maps | `src/domain/` | RF-14 |
| Portada y sobre | `src/templates/baby-shower/` | RF-1 a RF-5 |
| Secciones y su orden | `src/templates/baby-shower/` | RF-6, RF-7, RF-13, RF-15, RF-16 |
| Cuenta regresiva y ubicación compartibles | `src/components/` | RF-11, RF-12, RF-14 |
| Paleta, tipografías y gingham | `src/templates/baby-shower/themes/sage-geese/` | RF-10 |
| Sobre ya abierto | Marca por slug en `localStorage` del navegador; sin datos personales | Guardarlo en la base: pediría identificar al visitante |
| Ilustraciones provisorias | `src/templates/baby-shower/themes/sage-geese/` | RF-1, RF-6 |
| Registro de recursos | `docs/guias/ASSET_SOURCES.md` | Reglas |
| Datos de la `demo` | `supabase/seed.sql` | RF-7, RF-8 |

No hay tablas nuevas ni cambios de permisos. Dependencias nuevas, aprobadas por el responsable: los tres paquetes de `@fontsource`. Los tests unitarios cubren la cuenta regresiva, el link de Maps y la lectura de `content`.

## Costo

Sin servicios nuevos. Dependencias nuevas: los tres paquetes de `@fontsource`, gratuitos (licencia OFL). Se mantiene en planes gratuitos.
