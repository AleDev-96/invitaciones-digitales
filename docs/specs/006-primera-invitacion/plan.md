# 006 — Invitación: primer baby shower: plan

- **Estado:** aprobada
- **Spec:** [spec.md](spec.md)

Archivos de esta spec: [spec.md](spec.md) · [plan.md](plan.md) · [tasks.md](tasks.md)

## Decisiones

| Tema | Decisión | Alternativa descartada |
|---|---|---|
| Orden respecto de la 005 | La invitación se arma y se prueba antes que la pantalla de los dueños; mientras tanto, confirmaciones y reservas se consultan en Supabase. El link se reparte recién cuando todo funciona | Esperar a la 005: deja menos días a los invitados para confirmar |
| Datos reales | Archivo SQL fuera del repositorio, pegado en el SQL Editor por el responsable | Agregarlos a `seed.sql`: el repositorio es público |
| Ilustraciones finales | Se cambian en el estilo `sage-geese` (código y gráficos fijos), no en la invitación | Imágenes por invitación en Supabase: la plantilla no lo prevé y sería una funcionalidad nueva |
| Hora de fin | Campo opcional `content.endTime` (`HH:MM`) de la plantilla `baby-shower`; la fecha muestra "De 14:30 a 18:30 hs." | Escribir el horario en el mensaje de presentación: queda lejos de la fecha y no se valida |
| Cambio compartido | El formato de la hora con rango y "hs." está en `src/domain/eventDate.ts`, que comparten todas las invitaciones: va también en un pull request propio que se integra antes | Dejarlo solo en este pull request: `AGENTS.md` pide separar lo compartido |

## Diseño técnico

| Parte | Ubicación |
|---|---|
| Ilustraciones finales | `assets/images/templates/baby-shower/sage-geese/` y `src/templates/baby-shower/themes/sage-geese/illustrations.tsx` |
| Registro de licencias | `docs/guias/ASSET_SOURCES.md` |
| Imagen de la vista previa del link, si es nueva | `public/og/` |
| Datos del evento y regalos | Supabase: `invitations` y `gifts` con el `invitation_id` de esta invitación |
| Estado del estilo y de la invitación | `docs/product/templates.md`, `docs/specs/README.md`, `docs/specs/INDEX.md`, `MEMORY.md` |

No hay migraciones nuevas ni cambios en `src/features/` ni `src/app/`. El único cambio compartido es `src/domain/eventDate.ts`, que va también en su propio pull request.

## Costo

Sin cambios: Supabase y Cloudflare Pages en plan gratuito.
