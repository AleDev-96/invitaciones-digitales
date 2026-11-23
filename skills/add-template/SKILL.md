---
name: add-template
description: Agregar una plantilla visual para un nuevo tipo de evento reutilizando el motor y los componentes existentes.
---

# Agregar una plantilla

Usar cuando se suma un tipo de evento o un diseño nuevo (cumpleaños, bautismo, casamiento).

**Estado:** borrador. Se completa con nombres de archivos y comandos reales cuando exista la primera plantilla (baby shower), que sirve de modelo.

## Antes de empezar

- Tener una guía visual en `docs/design/<plantilla>-visual-guide.md` con paleta, tipografía y orden de secciones.
- Las capturas de inspiración van en `docs/design/references/<plantilla>/` y no se publican.

## Pasos

1. Crear `src/templates/<plantilla>/` con el componente principal, su tema y sus secciones.
2. Definir los colores y tipografías en el tema de la plantilla, sin afectar a las demás.
3. Componer las secciones con los componentes compartidos (ubicación, cuenta regresiva, regalos, RSVP). Si falta uno, agregarlo como compartido, no dentro de la plantilla.
4. Registrar el `template_key` nuevo donde la aplicación elige la plantilla.
5. Guardar los recursos gráficos finales en `public/assets/templates/<plantilla>/` y anotar origen y licencia en `docs/design/ASSET_SOURCES.md`.
6. Agregar datos de demostración y revisar en un ancho de celular y uno de escritorio.
7. Actualizar `docs/project-structure.md`.

## No hacer

- No duplicar lógica de regalos, RSVP o carga de datos dentro de la plantilla.
- No consultar Supabase desde la plantilla.
- No usar recursos gráficos sin licencia verificada.
