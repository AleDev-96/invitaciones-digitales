# Despliegue

**Estado:** configurado con la [spec 001](../specs/001-arquitectura-base/spec.md). Sitio: `babyshower-invitacion-digital.pages.dev`.

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
- **Production branch:** `main`.
- **Variables de entorno:** las dos de la tabla anterior, más `NODE_VERSION` = `24`. Valen para producción y para vista previa.

Cada cambio en `main` publica el sitio. Cada rama subida genera además un enlace de vista previa propio, que se puede abrir desde un celular.

La carpeta `functions/` la publica Cloudflare sola: `functions/[slug].ts` arma la vista previa del link de cada invitación con las mismas dos variables. Sin variables o con la base caída, devuelve la vista previa genérica.

Se puede sumar otro sitio de Cloudflare sobre el mismo repositorio si hace falta un nombre distinto; todos leen la misma base.

## Supabase

- El esquema se crea pegando cada migración de `supabase/migrations/`, en orden, en el "SQL Editor" de Supabase. Una migración aplicada no se edita: los cambios van en una nueva.
- `supabase/seed.sql` carga invitaciones inventadas de demostración (`demo`, `demo-borrador`, `demo-baja`, `demo-error`).

### Pausa del plan gratuito

Supabase puede pausar un proyecto gratuito tras 7 días de poca actividad. Para evitarlo, `.github/workflows/keepalive.yml` hace una consulta mínima cada 2 días. Usa tres variables del repositorio (Settings → Secrets and variables → Actions → Variables):

| Variable | Valor |
|---|---|
| `KEEPALIVE_UNTIL` | Fecha AAAA-MM-DD de baja de la última invitación publicada. Pasada esa fecha, la tarea no consulta la base |
| `SUPABASE_URL` | URL del proyecto |
| `SUPABASE_ANON_KEY` | Clave pública. Nunca la `service_role` |

- Se lanza a mano desde la pestaña Actions → keepalive → "Run workflow", y se apaga con "Disable workflow".
- Si la consulta falla, la ejecución queda en rojo y GitHub avisa por correo.
- En un repositorio público, GitHub desactiva las tareas programadas tras 60 días sin actividad. Se reactivan con "Enable workflow".
- Si el proyecto igual se pausa, no pierde datos: se reactiva desde la pantalla de Supabase con "Restore project".
- El plan gratuito sirve para validar el MVP y un evento chico, pero no garantiza disponibilidad. Revisar sus límites antes de usarlo en eventos pagos.

## Verificación antes de compartir una invitación

1. Abrir el link público desde un celular.
2. Entrar directo a la URL de la invitación y recargar la página: la ruta tiene que seguir funcionando.
3. Probar sin sesión que no se pueden leer respuestas ni reservas ajenas.
4. Recorrer el flujo completo con usuarios de prueba: confirmar, modificar, reservar regalo, cambiar regalo.
