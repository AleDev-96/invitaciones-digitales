---
name: add-template
description: Agregar un estilo nuevo a una plantilla existente, o una plantilla nueva para otro tipo de evento, reutilizando el motor y los componentes existentes.
---

# Agregar un estilo o una plantilla

**Estado:** borrador. Se completa con nombres de archivos y comandos reales cuando exista la primera plantilla (`baby-shower` con el estilo `sage-geese`), que sirve de modelo.

## Qué corresponde

| Pedido | Qué se agrega |
|---|---|
| Mismo tipo de evento con otro aspecto (por ejemplo, baby shower de varón) | Un estilo |
| Tipo de evento nuevo o estructura distinta (cumpleaños, graduación) | Una plantilla con su primer estilo |

Revisar `docs/templates.md` antes de empezar: si la combinación ya existe, no se agrega nada y se sigue `skills/create-invitation/`.

## Antes de empezar

- Tener una spec aprobada (`specs/_templates/architecture-spec.md`).
- Las referencias propias o con permiso van en `docs/design/references/<tipo>/` y no se publican. No subir capturas de diseños de terceros.

## Agregar un estilo

1. Escribir la guía en `docs/design/<tipo>/<estilo>.md` con paleta, tipografía e ilustraciones. Usar `docs/design/baby-shower/sage-geese.md` como modelo.
2. Crear `src/templates/<tipo>/themes/<estilo>/` con los colores, tipografías e ilustraciones del estilo, sin afectar a los demás.
3. Guardar los gráficos finales en `public/assets/templates/<tipo>/<estilo>/` y anotar origen y licencia en `docs/design/ASSET_SOURCES.md`.
4. Registrar el `theme_key` donde la aplicación elige el estilo.
5. Revisar con datos de demostración en un ancho de celular y uno de escritorio, y comprobar que los otros estilos de la plantilla no cambiaron.
6. Agregar el estilo a la tabla de `docs/templates.md`.

Un estilo no cambia la estructura ni la lógica. Si hace falta cambiarlas, es una plantilla nueva.

## Agregar una plantilla

1. Crear `src/templates/<tipo>/` con el componente principal y sus secciones.
2. Componer las secciones con los componentes compartidos (ubicación, cuenta regresiva, regalos, confirmación). Si falta uno, agregarlo como compartido, no dentro de la plantilla.
3. Registrar el `template_key` donde la aplicación elige la plantilla.
4. Agregar su primer estilo con los pasos de la sección anterior.
5. Agregar la plantilla a la tabla de `docs/templates.md` y actualizar `docs/project-structure.md`.

## No hacer

- No copiar una plantilla entera para cambiar solo colores o ilustraciones.
- No duplicar lógica de regalos, confirmación o carga de datos dentro de la plantilla.
- No consultar Supabase desde la plantilla.
- No usar recursos gráficos sin licencia verificada.
