---
name: create-invitation
description: Dar de alta una invitación nueva usando una plantilla existente, sin modificar el código de la aplicación.
---

# Crear una invitación

Usar cuando hay que publicar un evento nuevo con una plantilla que ya existe. Si la plantilla no existe, seguir primero `skills/add-template/`.

**Estado:** borrador. Los pasos concretos (tablas, columnas, comandos) se completan cuando existan el esquema y la aplicación.

## Datos necesarios

- Tipo de evento y plantilla (`template_key`).
- Slug para la URL.
- Nombres, mensaje de bienvenida, fecha, horario y ubicación con link de Google Maps.
- Lista de regalos: nombre, descripción, imágenes y enlace opcional.
- Información adicional (indicaciones, código de vestimenta).

## Pasos

1. Verificar que el slug no esté en uso.
2. Crear el registro de la invitación en Supabase con su `template_key`, en estado inactivo.
3. Cargar los regalos asociados al `invitation_id`.
4. Revisar la invitación en un ancho de celular y uno de escritorio.
5. Probar el flujo completo con un invitado de prueba: confirmar, modificar, reservar y cambiar regalo.
6. Borrar los datos de prueba, activar la invitación y compartir la URL.

## No hacer

- No copiar componentes ni plantillas para un evento puntual.
- No escribir datos del evento dentro del código.
- No cargar datos personales reales en el repositorio.
