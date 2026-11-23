# Modelo de datos

**Estado:** propuesta conceptual. El esquema definitivo se escribe en migraciones SQL dentro de `supabase/migrations/` y este documento se actualiza en el mismo cambio.

## Entidades

| Tabla | Contenido |
|---|---|
| `invitations` | Tipo de evento, `template_key`, slug, estado, fecha, ubicación y configuración general |
| `gifts` | Regalos de una invitación: nombre, descripción, imágenes, enlace opcional |
| `gift_reservations` | Qué regalo reservó quién, con los datos mínimos para gestionar la reserva |
| `rsvps` | Respuesta de asistencia, cantidad de asistentes y comentario |
| `admin_users` / perfiles | Usuarios autorizados a administrar invitaciones |

## Relaciones

```text
invitations 1 ── N gifts 1 ── 0..1 gift_reservations
invitations 1 ── N rsvps
```

Toda tabla dependiente de un evento referencia `invitation_id`.

## Restricciones

- `invitations.slug` es único.
- Un regalo tiene como máximo una reserva activa. Se garantiza con una restricción de unicidad en la base, no con una consulta previa desde el navegador.
- Cambiar de regalo libera la reserva anterior y crea la nueva en una sola transacción.
- Los totales del panel se calculan con consultas sobre los registros; no se guardan contadores.

## Acceso por rol

| Rol | Puede | No puede |
|---|---|---|
| Público (sin sesión) | Leer una invitación activa y sus regalos con estado disponible/reservado | Listar respuestas, ver quién reservó, leer invitaciones inactivas |
| Invitado (con token) | Crear, leer y modificar su propia respuesta y su propia reserva | Ver o tocar datos de otro invitado |
| Administrador (con sesión) | Leer todo lo de sus invitaciones, liberar o corregir reservas | Acceder a invitaciones que no administra |

RLS activo en todas las tablas. Las políticas se prueban con un usuario sin sesión antes de publicar.

## Pendiente de definir

Depende de las decisiones abiertas de [architecture.md](architecture.md):

- Columnas y tipos de cada tabla.
- Dónde vive el token del invitado y cómo se guarda (hash, no texto plano).
- Si existe una tabla de invitados precargados.
- Funciones RPC para confirmar asistencia, reservar, liberar y cambiar regalo.
- Almacenamiento de imágenes de regalos (URLs externas o Supabase Storage).
