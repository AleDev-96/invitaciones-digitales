---
name: create-invitation
description: Dar de alta una invitación nueva usando una plantilla y un estilo existentes, sin modificar el código de la aplicación.
---

# Crear una invitación

**Estado:** borrador. Los pasos concretos (tablas, columnas, comandos) se completan cuando existan el esquema y la aplicación.

## Cuándo usarla

Cuando hay que publicar un evento nuevo con una plantilla y un estilo que ya figuran en `docs/product/templates.md`. Si la plantilla o el estilo no existen, seguir primero `.github/skills/create-template/`.

## Pasos

1. Buscar el tipo de evento en `docs/product/templates.md` para saber qué plantilla, estilos y funcionalidades le corresponden.
2. Escribir una spec corta con el molde `docs/specs/_templates/invitation-spec.md` y esperar su aprobación.
3. Reunir los datos del evento:
   - Plantilla (`template_key`), estilo (`theme_key`) y funcionalidades activas.
   - Slug para la URL.
   - Nombres, mensaje de bienvenida, fecha, horario y ubicación con link de Google Maps.
   - Lista de regalos: nombre, descripción, imágenes y enlace opcional.
   - Información adicional (indicaciones, código de vestimenta).
4. Verificar que el slug no esté en uso.
5. Crear el registro de la invitación en Supabase con su `template_key` y su `theme_key`, en estado borrador.
6. Cargar los regalos asociados al `invitation_id`.
7. Revisar la invitación en un ancho de celular y uno de escritorio, y validarla con el responsable del proyecto en la vista previa.
8. Probar el flujo completo con un invitado de prueba: confirmar, modificar, reservar y cambiar regalo.
9. Borrar los datos de prueba, publicar la invitación y compartir la URL.

## Reglas / checklist

- [ ] Hay una spec de invitación aprobada.
- [ ] No se copió ningún componente ni plantilla para este evento.
- [ ] No hay datos del evento escritos dentro del código.
- [ ] No hay datos personales reales en el repositorio.
- [ ] Todos los datos cargados llevan el `invitation_id` de esta invitación.
- [ ] No quedaron datos de prueba antes de publicar.
- [ ] El índice de `docs/specs/README.md` refleja el estado de la invitación.

## Ejemplos (bien / mal)

**Bien:** un segundo baby shower con el estilo `sage-geese` se resuelve cargando un registro nuevo con otro slug y sus propios regalos. No se toca el código.

**Mal:** duplicar `src/templates/baby-shower/` para cambiarle los nombres y la fecha al evento nuevo.

**Mal:** escribir la dirección del salón o los nombres de los padres dentro de un componente.
