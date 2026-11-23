---
name: review-code
description: Revisar un cambio de código contra las reglas de negocio, seguridad y arquitectura del proyecto antes de aprobarlo.
---

# Revisar código

Usar antes de aprobar un pull request o al terminar un cambio propio.

## Pasos

1. Leer la descripción del cambio y el diff completo.
2. Recorrer la lista de control.
3. Informar cada problema con archivo, línea y motivo, separando lo que bloquea de lo que es sugerencia.

## Lista de control

**Seguridad y privacidad**
- No hay credenciales, tokens ni datos personales en el código.
- La clave `service_role` no aparece en el frontend ni en variables `VITE_*`.
- Toda tabla nueva tiene RLS activo y políticas explícitas.
- La página pública no muestra datos personales de invitados ni quién reservó un regalo.
- Un invitado no puede leer ni modificar la respuesta o la reserva de otro.

**Reglas de negocio**
- Reservar, liberar y cambiar un regalo se valida en la base de datos.
- Un regalo no puede quedar reservado dos veces, tampoco con doble clic o solicitudes simultáneas.
- Toda consulta filtra por `invitation_id`.
- Los totales se calculan a partir de los registros guardados.
- Se manejan los errores de red con un mensaje claro para el invitado.

**Arquitectura**
- El cambio corresponde a una spec aprobada, o es un cambio menor.
- No agrega dependencias, carpetas fuera de la estructura ni servicios sin consulta previa.
- Una plantilla o funcionalidad nueva figura en `docs/templates.md`.
- La lógica está en `src/features/` y la plantilla solo compone la parte visual.
- No hay textos ni datos de un evento escritos dentro de componentes.
- No hay códigos HEX sueltos; se usan los tokens.
- Un cambio de esquema viene con su migración y con `docs/data-model.md` actualizado.

**Interfaz**
- Funciona en 360 a 430 px de ancho sin scroll horizontal.
- Respeta `prefers-reduced-motion` y no reproduce audio automáticamente.
- Los botones muestran sus estados: disponible, reservado, deshabilitado.
