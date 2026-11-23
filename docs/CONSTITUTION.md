# CONSTITUTION.md — Invitaciones Digitales

Principios innegociables. Si una spec, una skill o un cambio los contradice, gana este documento.

1. **Stack simple y costo 0.** React, TypeScript, Vite, Tailwind, Supabase y Cloudflare Pages, siempre en planes gratuitos. Ninguna dependencia ni servicio nuevo entra sin aprobación del responsable.
2. **La spec manda.** No se escribe código sin una spec aprobada, salvo cambios menores (un texto, un color, un espaciado). Si cambia un requisito, primero se cambia la spec y después el código.
3. **Lógica separada de la interfaz.** Las plantillas y los estilos solo muestran: no consultan Supabase ni contienen reglas de negocio. La lógica vive en `src/domain/`, `src/services/` y `src/features/`.
4. **Todo requisito se comprueba.** Cada requisito y cada criterio de aceptación tiene un test o una verificación manual escrita antes del pull request. No se instalan herramientas de prueba sin aprobación.
5. **Los datos de las personas se protegen.** No hay datos personales ni credenciales en el repositorio. Los datos de una invitación no se ven desde otra. Las reglas se validan en la base de datos. Al terminar el evento, los datos de invitados se borran.
6. **Código en inglés, textos en español.** Código, carpetas y claves en inglés. Interfaz y documentación en español.
