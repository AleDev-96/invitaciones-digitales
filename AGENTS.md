# AGENTS.md

Instrucciones para cualquier agente de IA que trabaje en este repositorio. No dependen de una herramienta en particular.

## Antes de empezar

1. Leer el [README](README.md): propósito, alcance del MVP, reglas de negocio y seguridad.
2. Leer el documento de `docs/` que corresponda a la tarea:
   - [docs/architecture.md](docs/architecture.md): capas, rutas y decisiones abiertas.
   - [docs/data-model.md](docs/data-model.md): tablas, restricciones y acceso por rol.
   - [docs/deployment.md](docs/deployment.md): variables de entorno y publicación.
   - [docs/project-structure.md](docs/project-structure.md): qué va en cada carpeta.
   - [docs/design/baby-shower-visual-guide.md](docs/design/baby-shower-visual-guide.md): paleta, tipografía y secciones de la plantilla baby shower.
3. Si la tarea coincide con una skill de `skills/`, seguir sus pasos.

## Estado actual

El repositorio contiene documentación y la estructura de carpetas. Todavía no hay aplicación: no existe `package.json` ni código en `src/`. No asumir que un archivo existe sin comprobarlo.

## Reglas

- Una sola aplicación para todas las invitaciones. No copiar la aplicación ni crear un repositorio por evento.
- Las plantillas solo componen la parte visual. La lógica de regalos, RSVP y administración va en `src/features/`.
- Textos y datos de un evento van en los datos de la invitación, no escritos dentro de los componentes.
- Colores y tipografías se toman de los tokens; no repetir códigos HEX en componentes.
- Diseñar primero para celular (360 a 430 px de ancho).
- Reservas y respuestas se validan en la base de datos. Ocultar un botón no es seguridad.
- Todo cambio de esquema va en una migración nueva dentro de `supabase/migrations/` y actualiza `docs/data-model.md`. No editar migraciones ya aplicadas.
- No subir credenciales, tokens reales ni datos personales. La clave `service_role` nunca va en el frontend.
- No subir al repositorio capturas de diseños de terceros ni usar el material de `docs/design/references/` como imágenes del sitio. No descargar recursos gráficos sin verificar su licencia.
- No usar la marca Tomolitech en la interfaz ni en textos públicos.
- No implementar lo listado como fuera de alcance en el README sin pedido expreso.
- Una decisión abierta de `docs/architecture.md` se consulta con el responsable del proyecto antes de implementarla.

## Flujo de trabajo

- Una rama y un pull request por cambio; no trabajar directo sobre `main`.
- Si un cambio modifica el comportamiento, la arquitectura o el esquema, actualizar la documentación en el mismo pull request.
- Borrar el `.gitkeep` de una carpeta cuando recibe contenido real.

## Definición de terminado

- El cambio cumple lo pedido y respeta las reglas de negocio del README.
- `npm run build` termina sin errores (cuando exista la aplicación).
- Los cambios visuales se revisaron en un ancho de celular y uno de escritorio.
- Los cambios de datos o permisos se probaron también sin sesión iniciada.
- La documentación afectada quedó actualizada.
