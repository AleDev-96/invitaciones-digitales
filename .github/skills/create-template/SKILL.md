---
name: create-template
description: Agregar un estilo nuevo a una plantilla existente, o una plantilla nueva para otro tipo de evento, reutilizando el motor y los componentes existentes.
---

# Crear un estilo o una plantilla

**Estado:** borrador. Se completa con nombres de archivos y comandos reales cuando exista la primera plantilla (`baby-shower` con el estilo `sage-geese`), que sirve de modelo.

## Cuándo usarla

| Pedido | Qué se agrega |
|---|---|
| Mismo tipo de evento con otro aspecto (por ejemplo, baby shower de varón) | Un estilo |
| Tipo de evento nuevo o estructura distinta (cumpleaños, graduación) | Una plantilla con su primer estilo |

Revisar `docs/product/templates.md` antes de empezar: si la combinación ya existe, no se agrega nada y se sigue `.github/skills/create-invitation/`.

## Pasos

### Antes de empezar

1. Tener una spec aprobada (moldes en `docs/specs/_templates/`).
2. Registrar la plantilla o el estilo en las tablas de `docs/product/templates.md`, con estado "en desarrollo", antes de escribir código.
3. Guardar las referencias propias o con permiso en `assets/images/references/<tipo>/`. No se publican.

### Agregar un estilo

1. Escribir la guía en `docs/guias/<tipo>/<estilo>.md` con paleta, tipografía e ilustraciones. Usar `docs/guias/baby-shower/sage-geese.md` como modelo.
2. Crear `src/templates/<tipo>/themes/<estilo>/` con los colores, tipografías e ilustraciones del estilo.
3. Guardar los gráficos finales en `assets/images/templates/<tipo>/<estilo>/` y anotar origen y licencia en `docs/guias/ASSET_SOURCES.md`.
4. Registrar el `theme_key` donde la aplicación elige el estilo.
5. Revisar con datos de demostración en un ancho de celular y uno de escritorio, y comprobar que los otros estilos de la plantilla no cambiaron.
6. Pasar el estilo a "disponible" en la tabla de `docs/product/templates.md`.

### Agregar una plantilla

1. Crear `src/templates/<tipo>/` con el componente principal y sus secciones.
2. Componer las secciones con los componentes compartidos (ubicación, cuenta regresiva, regalos, confirmación). Si falta uno, agregarlo como compartido, no dentro de la plantilla.
3. Registrar el `template_key` donde la aplicación elige la plantilla.
4. Agregar su primer estilo con los pasos de la sección anterior.
5. Actualizar el estado de la plantilla en la tabla de `docs/product/templates.md` y actualizar `docs/architecture/project-structure.md`.

## Reglas / checklist

- [ ] Hay una spec aprobada.
- [ ] Un estilo no cambia la estructura ni la lógica. Si hace falta cambiarlas, es una plantilla nueva.
- [ ] No se copió una plantilla entera para cambiar solo colores o ilustraciones.
- [ ] La plantilla no duplica lógica de regalos, confirmación o carga de datos.
- [ ] La plantilla no consulta Supabase.
- [ ] Nombres en inglés, minúsculas y con guiones.
- [ ] Todo recurso gráfico tiene licencia verificada y anotada.
- [ ] No se subieron capturas de diseños de terceros.
- [ ] La plantilla o el estilo se registró en `docs/product/templates.md` antes de escribir código, y su estado quedó actualizado al terminar.

## Ejemplos (bien / mal)

**Bien:** un baby shower de varón con osos azules es el estilo `blue-bears` de la plantilla `baby-shower`: guía en `docs/guias/baby-shower/blue-bears.md`, código en `src/templates/baby-shower/themes/blue-bears/` y gráficos en `assets/images/templates/baby-shower/blue-bears/`.

**Mal:** crear una plantilla `baby-shower-boy` copiando `baby-shower` para cambiarle los colores.

**Mal:** poner dentro de la plantilla de cumpleaños su propia lista de regalos en vez de usar la compartida.
