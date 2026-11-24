# 001 — Arquitectura base: spec

- **Tipo:** larga
- **Estado:** aprobada
- **Fecha:** 2026-11-23

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

Qué se construye y por qué. El cómo está en [plan.md](plan.md) y el orden de trabajo en [tasks.md](tasks.md).

## Objetivo

Dejar la aplicación funcionando y publicada, todavía sin diseño: una dirección por invitación, los datos de cada invitación en la base y las piezas comunes que usan todas las specs siguientes. Cierra las decisiones abiertas de [architecture.md](../../architecture/architecture.md); cómo se cierra cada una está en [plan.md](plan.md).

## Alcance

- Proyecto React + TypeScript + Vite + Tailwind con comprobaciones de código y pruebas.
- Tabla de invitaciones en Supabase, con acceso público solo a través de una función de la base.
- Dirección `/<slug>` por invitación y pantallas de estado (cargando, no encontrada, dada de baja, error).
- Registro de plantillas y estilos, y mecanismo para que un estilo no afecte a otro.
- Vista previa propia de cada invitación al compartir el link.
- Tarea automática que evita la pausa de Supabase mientras haya una invitación publicada.
- Publicación en Cloudflare Pages con el dominio gratuito.
- Una invitación de demostración con una plantilla provisoria, para comprobar el recorrido completo.

## Fuera de alcance

- El diseño de la invitación, el sobre y las secciones: spec 002.
- Confirmación de asistencia y sus tablas: spec 003.
- Regalos y sus tablas: spec 004.
- Pantalla de los dueños y su palabra clave: spec 005. Hasta entonces los documentos siguen diciendo "sin panel".
- Links individuales por invitado. El diseño no los impide.
- Dominio propio.

## Requisitos funcionales

Dirección y carga:

- RF-1: CUANDO alguien abre `/<slug>` de una invitación publicada, EL SISTEMA muestra esa invitación con la plantilla de su `template_key` y el estilo de su `theme_key`.
- RF-2: MIENTRAS se cargan los datos de la invitación, EL SISTEMA muestra una pantalla de espera.
- RF-3: SI el slug no existe o la invitación está en borrador, ENTONCES EL SISTEMA muestra "No encontramos esta invitación", sin distinguir un caso del otro.
- RF-4: SI la invitación está dada de baja, ENTONCES EL SISTEMA muestra "Esta invitación ya no está disponible" y ningún dato del evento.
- RF-5: SI la base de datos no responde, ENTONCES EL SISTEMA muestra un mensaje de error con un botón para reintentar.
- RF-6: CUANDO alguien abre la dirección raíz `/`, EL SISTEMA muestra una página neutra, sin listar invitaciones.
- RF-7: CUANDO alguien entra directo a `/<slug>` o recarga la página, EL SISTEMA muestra la misma invitación.

Datos y aislamiento:

- RF-8: EL SISTEMA acepta como slug solo minúsculas sin acentos, números y guiones, de 3 a 40 caracteres, y rechaza slugs repetidos o reservados.
- RF-9: EL SISTEMA entrega al público únicamente los datos de la invitación pedida por su slug; no permite listar invitaciones ni leer la tabla directamente.
- RF-10: SI una invitación indica un `template_key` o un `theme_key` que no están registrados, ENTONCES EL SISTEMA muestra el mensaje de error de RF-5 y no otra plantilla.
- RF-11: EL SISTEMA aplica los colores y tipografías de un estilo solo dentro de la invitación que lo usa.

Vista previa del link:

- RF-12: CUANDO se comparte el link de una invitación publicada, EL SISTEMA entrega el título, la descripción y la imagen de vista previa propios de esa invitación.
- RF-13: SI la invitación no existe, no está publicada o la base no responde, ENTONCES EL SISTEMA entrega la vista previa genérica y la página funciona igual.

Disponibilidad:

- RF-14: MIENTRAS la fecha actual no supere la fecha "activa hasta", EL SISTEMA hace una consulta mínima a la base cada 2 días.
- RF-15: SI la fecha actual supera la fecha "activa hasta", ENTONCES EL SISTEMA no consulta la base.
- RF-16: SI la consulta de RF-14 falla, ENTONCES EL SISTEMA marca la ejecución como fallida para que GitHub avise por correo.

## Reglas

- Las del [README](../../../README.md) y la [constitución](../../CONSTITUTION.md).
- La clave `service_role` no se usa en la aplicación, en la función de vista previa ni en la tarea programada: las tres usan la clave pública.
- Los datos de la invitación de demostración son inventados.
- Estados de una invitación: borrador, publicada, dada de baja. Cambiar el estado de una no afecta a las demás.
- La baja y el borrado de datos de invitados se hacen 7 días después del evento, a mano.

## Criterios de aceptación

- [ ] `/demo` muestra la invitación de demostración en la dirección pública `.pages.dev`, en un celular y en escritorio.
- [ ] Recargar `/demo` muestra la misma invitación.
- [ ] Un slug inexistente y una invitación en borrador muestran el mismo mensaje.
- [ ] Una invitación dada de baja muestra su mensaje y la respuesta de la base no incluye datos del evento.
- [ ] Con la clave pública no se puede leer ni escribir la tabla `invitations` directamente.
- [ ] El link de `/demo` pegado en WhatsApp muestra el título, la descripción y la imagen de la demostración.
- [ ] Un link con slug inexistente muestra la vista previa genérica.
- [ ] La tarea programada, lanzada a mano, consulta la base con una fecha vigente y no la consulta con una fecha vencida.
- [ ] Pasan la comprobación de tipos, el lint, las pruebas y la compilación.
- [ ] No hay credenciales en el repositorio.

## Preguntas abiertas

Ninguna. Resueltas el 2026-11-23:

1. **Cuentas.** El responsable creó el proyecto de Supabase y la cuenta de Cloudflare. La dirección del proyecto y la clave pública de Supabase se cargan como variables de entorno; no se escriben en el repositorio. La conexión de Cloudflare con GitHub se hace en T8.
2. **Nombre del dominio gratuito.** `babyshower-invitacion-digital.pages.dev`. El 2026-11-23 no estaba en uso; se confirma al crear el sitio en T8.
3. **Dependencias y carpeta `functions/`.** Aprobadas.

## Historial de cambios

| Fecha | Cambio |
|---|---|
| 2026-11-23 | Primera versión, con las respuestas de la clarificación |
| 2026-11-23 | Se cierran las preguntas abiertas: cuentas, dominio y dependencias |
| 2026-11-24 | Se separa en spec.md, plan.md y tasks.md, sin cambios de contenido |
