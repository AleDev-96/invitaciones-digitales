# Despliegue

**Estado:** previsto. Todavía no hay nada desplegado; los pasos se completan y verifican cuando exista la aplicación.

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública de cliente |

- En local van en `.env.local`, que no se sube al repositorio.
- En producción se cargan en Cloudflare Pages.
- La clave `service_role` nunca va en una variable `VITE_*` ni en el frontend. La clave pública solo es segura con las políticas RLS bien configuradas.

## Frontend en Cloudflare Pages

Se publica desde GitHub con la integración de Cloudflare Pages.

- **Framework preset:** Vite.
- **Build command:** `npm run build`.
- **Build output directory:** `dist`.
- **Variables de entorno:** las dos de la tabla anterior.

Cada cambio en la rama configurada genera un despliegue nuevo.

## Supabase

- El esquema se crea aplicando las migraciones de `supabase/migrations/` en orden.
- El plan gratuito sirve para validar el MVP y un evento chico, pero no garantiza disponibilidad. Revisar sus límites antes de usarlo en eventos pagos.

## Verificación antes de compartir una invitación

1. Abrir el link público desde un celular.
2. Entrar directo a la URL de la invitación y recargar la página: la ruta tiene que seguir funcionando.
3. Probar sin sesión que no se pueden leer respuestas ni reservas ajenas.
4. Recorrer el flujo completo con usuarios de prueba: confirmar, modificar, reservar regalo, cambiar regalo.
