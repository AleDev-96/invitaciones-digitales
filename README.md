# Invitaciones Digitales

Aplicación web para crear y publicar invitaciones digitales personalizadas para eventos. La primera versión estará enfocada en un **baby shower**, pero la arquitectura debe permitir sumar cumpleaños, bautismos, casamientos y otros eventos sin duplicar la aplicación.

La idea central es mantener **un solo repositorio y una sola aplicación reutilizable**. Cada invitación tendrá sus propios datos, diseño y enlace público.

---

## Objetivos del proyecto

- Crear invitaciones web atractivas y adaptadas a celulares.
- Compartir cada invitación mediante un enlace único.
- Mostrar fecha, horario, ubicación, indicaciones y otros detalles del evento.
- Publicar una lista de regalos con imágenes y descripciones de referencia.
- Permitir que los invitados confirmen, rechacen o modifiquen su asistencia.
- Permitir reservar un regalo y cambiar la elección posteriormente.
- Contar con un panel privado para consultar confirmaciones y administrar regalos.
- Reutilizar el sistema para futuros eventos y clientes.
- Mantener los costos iniciales de infraestructura lo más bajos posible.

## Alcance inicial: MVP de baby shower

### Invitación pública

La primera plantilla debe incluir:

- Nombre del bebé, de los futuros padres o de quienes invitan.
- Mensaje de bienvenida.
- Fecha y horario del evento.
- Cuenta regresiva opcional.
- Dirección y botón para abrir la ubicación en Google Maps.
- Información adicional, recomendaciones o código de vestimenta.
- Lista de regalos.
- Confirmación de asistencia.
- Diseño responsive, priorizando la experiencia en celulares.

### Lista de regalos

Cada regalo podrá incluir:

- Nombre.
- Descripción o especificaciones para identificar el producto correcto.
- Una o más imágenes de referencia.
- Enlace a un producto o tienda, si corresponde.
- Estado: disponible o reservado.

Un invitado podrá seleccionar un regalo disponible. Si cambia de opinión, deberá poder cancelar su elección y seleccionar otro. Un regalo no podrá quedar reservado por dos invitados al mismo tiempo.

Las imágenes y descripciones deben ayudar a identificar el regalo deseado. No se debe asumir que un enlace externo garantiza disponibilidad, precio o que el producto siga siendo idéntico.

### Confirmación de asistencia (RSVP)

El formulario deberá permitir registrar, como mínimo:

- Nombre del invitado o grupo familiar.
- Cantidad de asistentes, si el evento lo permite.
- Estado de asistencia: confirmado, rechazado o pendiente.
- Comentario opcional.

El invitado debe poder volver a su confirmación y modificarla mediante un mecanismo seguro, por ejemplo, un enlace individual de gestión o un token de acceso. No debe poder modificar la respuesta de otra persona.

### Panel privado

El panel de administración deberá permitir:

- Consultar el total de confirmaciones y la cantidad de asistentes confirmados.
- Ver confirmados, rechazados y pendientes.
- Consultar los datos de cada respuesta.
- Ver qué regalos están disponibles y cuáles fueron reservados.
- Liberar o corregir una reserva cuando sea necesario.
- Editar los datos de la invitación.

El panel y sus datos no deben quedar expuestos públicamente.

> **Decisión vigente:** por ahora no se desarrolla un panel propio. Las confirmaciones y reservas se consultan desde la pantalla de Supabase; el panel se retoma cuando haya necesidad concreta.

---

## Arquitectura y tecnologías previstas

La propuesta inicial prioriza una aplicación sencilla de desplegar como sitio estático, con los datos dinámicos gestionados por un servicio backend administrado.

| Parte | Tecnología prevista | Responsabilidad |
|---|---|---|
| Frontend | React + TypeScript + Vite | Interfaz pública y panel de administración |
| Estilos | Tailwind CSS | Diseño responsive y componentes visuales |
| Backend y base de datos | Supabase | Persistencia, autenticación y operaciones seguras |
| Hosting | Cloudflare Pages | Publicación del frontend |
| Código fuente | GitHub | Versionado y colaboración con agentes de IA |

Estas tecnologías son la base prevista para el MVP. Cualquier cambio debe justificarse en función de una necesidad concreta y documentarse antes de incorporarlo.

### Principio de reutilización

Separar claramente:

1. **Motor de invitaciones:** rutas, carga de datos, lógica compartida y publicación.
2. **Componentes compartidos:** ubicación, cuenta regresiva, lista de regalos, RSVP, galería y botones.
3. **Plantillas:** composición visual específica de cada tipo de evento.
4. **Datos de cada invitación:** nombres, textos, fechas, imágenes, regalos y configuración.

Agregar una invitación nueva no debería requerir copiar y modificar toda la aplicación. En condiciones normales, debería alcanzar con cargar sus datos y elegir una plantilla existente.

### Ejemplo de URLs

- `/baby-shower/sofia`
- `/cumple/juan`
- `/bautismo/mateo`

Los enlaces definitivos podrán utilizar un dominio propio cuando esté disponible.

---

## Reglas de negocio importantes

Estas reglas deben respetarse en la interfaz y, especialmente, en el backend:

1. Cada invitación tiene un identificador y un slug únicos.
2. Los datos de una invitación no deben mezclarse con los de otra.
3. Una reserva de regalo debe ser única: dos invitados no pueden reservar el mismo regalo disponible simultáneamente.
4. La reserva y su liberación deben validarse en el backend o en la base de datos, no solamente en el navegador.
5. Si un invitado cambia de regalo, la reserva anterior debe liberarse y la nueva debe confirmarse de forma segura.
6. Un invitado solo puede consultar o modificar su propia respuesta mediante un mecanismo de autorización válido.
7. El panel administrativo requiere autenticación y permisos específicos.
8. Los contadores deben calcularse a partir de los registros guardados, no de valores mantenidos únicamente en el frontend.
9. Las operaciones deben contemplar errores de red, doble clic y solicitudes simultáneas.
10. No se deben publicar datos personales de invitados en la página pública.

---

## Seguridad y privacidad

Aunque el primer uso sea un evento familiar, el proyecto debe aplicar buenas prácticas desde el comienzo.

- Activar **Row Level Security (RLS)** en las tablas de Supabase que correspondan.
- Definir políticas de acceso explícitas para cada tipo de usuario y operación.
- No confiar en ocultar botones o pantallas como mecanismo de seguridad.
- Nunca incluir la clave `service_role` de Supabase en el frontend ni en variables `VITE_*`.
- Las claves públicas utilizadas en el navegador solo son aceptables junto con políticas RLS correctamente configuradas.
- Proteger el panel administrativo con autenticación.
- Evitar que los invitados puedan listar respuestas o datos privados de otras personas.
- No guardar más información personal de la necesaria.
- No incluir credenciales, tokens reales ni datos privados en el repositorio.

Las operaciones de reservar, liberar y modificar regalos o confirmaciones deben implementarse de manera que el backend valide la identidad y los permisos correspondientes. Antes de publicar, revisar las políticas RLS y probar los accesos con usuarios no autenticados.

---

## Desarrollo local

### Requisitos

- Node.js en una versión LTS compatible con las dependencias del proyecto.
- npm.
- Una cuenta de GitHub.
- Una cuenta de Supabase para conectar la base de datos.

> Todavía no existe la aplicación ni `package.json`. Los comandos siguientes aplican a partir del scaffold de Vite.

### Instalación

```bash
git clone <URL_DEL_REPOSITORIO>
cd invitaciones-digitales
npm install
```

Crear un archivo `.env.local` en la raíz del proyecto. Las variables previstas son:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Completar los valores con los datos del proyecto de Supabase. No subir `.env.local` al repositorio.

> `VITE_SUPABASE_ANON_KEY` representa la clave pública de cliente. Su uso requiere políticas RLS bien configuradas. Nunca colocar una clave `service_role` en el frontend.

### Ejecutar en modo desarrollo

```bash
npm run dev
```

### Compilar para producción

```bash
npm run build
```

### Vista previa de la compilación

```bash
npm run preview
```

Los comandos definitivos deben coincidir con los scripts definidos en `package.json`.

---

## Despliegue previsto

### Frontend en Cloudflare Pages

La aplicación se publicará desde el repositorio de GitHub mediante la integración de Cloudflare Pages.

Configuración prevista para un proyecto Vite:

- **Framework preset:** Vite (si aparece disponible).
- **Build command:** `npm run build`.
- **Build output directory:** `dist`.
- **Variables de entorno:** las mismas variables públicas de Supabase utilizadas en producción.

Cada cambio publicado en la rama configurada podrá generar un nuevo despliegue. Antes de compartir una invitación, comprobar el enlace público desde un dispositivo móvil y verificar que las rutas funcionen correctamente.

### Supabase

Supabase almacenará los datos de las invitaciones, regalos y respuestas. El proyecto debe contar con sus tablas, relaciones, índices, políticas RLS y funciones necesarias.

El plan gratuito puede servir para validar el MVP y un evento de volumen reducido, pero no representa una garantía de disponibilidad. Revisar las condiciones y límites vigentes antes de utilizarlo para eventos pagos o clientes.

---

## Modelo de datos: propuesta conceptual

El esquema definitivo debe diseñarse y documentarse en migraciones SQL. Como punto de partida, se contemplan estas entidades:

- **invitations:** tipo de evento, slug, estado, fecha, ubicación y configuración general.
- **gifts:** regalos asociados a una invitación, con descripción, imágenes, enlace y disponibilidad.
- **gift_reservations:** relación entre un regalo y quien lo reservó, con los datos mínimos necesarios para gestionar la reserva.
- **rsvps:** respuestas de asistencia y cantidad de asistentes.
- **admin_users / perfiles:** usuarios autorizados a administrar invitaciones, según el diseño de autenticación elegido.

Todas las entidades dependientes de un evento deben referenciar `invitation_id`. El esquema debe impedir reservas duplicadas y definir con claridad qué información puede leer o modificar cada rol.

---

## Fuera del alcance del primer MVP

No implementar inicialmente, salvo que se solicite expresamente:

- Registro público de clientes.
- Constructor visual de invitaciones.
- Plataforma SaaS multiusuario con planes y suscripciones.
- Pasarela de pagos.
- Automatización completa de ventas y entrega.
- Aplicación móvil nativa.
- Integraciones complejas con tiendas externas.

La primera meta es publicar y probar una invitación funcional de baby shower con aproximadamente 100 invitados.

---

## Criterios de aceptación del MVP

El MVP se considerará listo para el evento cuando:

- [ ] La invitación se vea correctamente en celulares y computadoras.
- [ ] Se pueda abrir la ubicación desde Google Maps.
- [ ] Se visualicen los regalos con imágenes y descripciones claras.
- [ ] Un invitado pueda reservar un regalo disponible.
- [ ] No sea posible reservar simultáneamente el mismo regalo dos veces.
- [ ] El invitado pueda cambiar o cancelar su elección de regalo.
- [ ] Un invitado pueda confirmar o rechazar la asistencia.
- [ ] El invitado pueda modificar su respuesta mediante un acceso seguro.
- [ ] El panel privado muestre los totales y el detalle de las respuestas.
- [ ] El panel permita consultar y administrar las reservas de regalos.
- [ ] Los datos privados no sean accesibles desde la invitación pública.
- [ ] Las políticas RLS estén activas y probadas.
- [ ] La versión de producción funcione desde un enlace público.
- [ ] Se haya probado el flujo completo con usuarios de prueba antes de compartirlo.

---

## Documentación

Este README describe el propósito, el alcance y las decisiones generales del producto. El detalle está en:

- [AGENTS.md](AGENTS.md): instrucciones para agentes de IA, flujo de trabajo, reglas y definición de terminado.
- [MEMORY.md](MEMORY.md): memoria del proyecto entre sesiones (estado, aprendizajes, decisiones y próximos pasos).
- [specs/](specs/README.md): specs de arquitectura y de cada invitación.
- [docs/templates.md](docs/templates.md): tipos de evento, plantillas, estilos y funcionalidades.
- [skills/](skills/): procedimientos para tareas repetidas (crear una invitación, agregar una plantilla, revisar código).
- [docs/architecture.md](docs/architecture.md): arquitectura, rutas y decisiones abiertas.
- [docs/data-model.md](docs/data-model.md): tablas, restricciones y acceso por rol.
- [docs/deployment.md](docs/deployment.md): variables de entorno y publicación.
- [docs/project-structure.md](docs/project-structure.md): estructura de carpetas y qué va en cada una.
- [docs/design/baby-shower/sage-geese.md](docs/design/baby-shower/sage-geese.md): guía del primer estilo de baby shower.

---

## Identidad visual y referencias

La primera plantilla tendrá una identidad visual de baby shower estilo acuarela, con base marfil, verde salvia y detalles beige/taupe. La guía visual está en `docs/design/baby-shower/sage-geese.md`. Las capturas de inspiración originales no se guardan en el repositorio; la guía las describe.

## Estado del proyecto

**Etapa:** definición e inicio del MVP.

**Primer entregable:** invitación digital funcional para baby shower, con lista de regalos, confirmación de asistencia y panel privado.

**Principio de trabajo:** construir primero una solución pequeña, clara y segura; luego generalizarla para otros tipos de eventos sin sobredimensionar el sistema.

---

## Nombre y organización del proyecto

**Nombre del proyecto:** Invitaciones Digitales.

Es un proyecto independiente. No utilizar la marca Tomolitech en la interfaz, los textos públicos ni la identidad visual, salvo que se solicite expresamente en el futuro.
