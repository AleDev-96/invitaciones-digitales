---
name: create-invitation
description: Dar de alta una invitación nueva usando una plantilla existente, sin modificar el código de la aplicación.
---

# Crear una invitación

Usar cuando hay que publicar un evento nuevo con una plantilla que ya existe. Si la plantilla no existe, seguir primero `.github/skills/create-template/`.

**Estado:** borrador. Los pasos concretos (tablas, columnas, comandos) se completan cuando existan el esquema y la aplicación.

## Antes de empezar

1. Buscar el tipo de evento en `docs/product/templates.md` para saber qué plantilla, estilos y funcionalidades le corresponden. Si el estilo pedido no existe, seguir primero `.github/skills/create-template/`.
2. Escribir una spec corta con el molde `docs/specs/_templates/invitation-spec.md` y esperar su aprobación.

## Datos necesarios

- Tipo de evento, plantilla (`template_key`), estilo (`theme_key`) y funcionalidades activas.
- Slug para la URL.
- Nombres, mensaje de bienvenida, fecha, horario y ubicación con link de Google Maps.
- Lista de regalos: nombre, descripción, imágenes y enlace opcional.
- Información adicional (indicaciones, código de vestimenta).

## Pasos

1. Verificar que el slug no esté en uso.
2. Crear el registro de la invitación en Supabase con su `template_key` y su `theme_key`, en estado borrador.
3. Cargar los regalos asociados al `invitation_id`.
4. Revisar la invitación en un ancho de celular y uno de escritorio, y validarla con el responsable del proyecto en la vista previa.
5. Probar el flujo completo con un invitado de prueba: confirmar, modificar, reservar y cambiar regalo.
6. Borrar los datos de prueba, activar la invitación y compartir la URL.

## No hacer

- No copiar componentes ni plantillas para un evento puntual.
- No escribir datos del evento dentro del código.
- No cargar datos personales reales en el repositorio.
