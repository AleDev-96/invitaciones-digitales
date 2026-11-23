# Guía visual — Baby Shower

Esta guía define la dirección visual de la primera plantilla de **Invitaciones Digitales**. Se basa en cuatro capturas compartidas como inspiración. Los colores son aproximados y deben ajustarse al verlos aplicados en el navegador.

## 1. Dirección de arte

**Concepto:** baby shower delicado, romántico y cálido, con estética de ilustración infantil vintage / acuarela.

La experiencia debe sentirse suave, luminosa, tierna y elegante; artesanal, con detalles ilustrados y texturas discretas; ordenada y fácil de leer, especialmente en celulares. Mantener un único estilo de ilustración de principio a fin.

### Elementos de referencia

- Fondo marfil/blanco cálido.
- Borde lateral o marco con patrón de cuadros (gingham) verde muy claro.
- Sobre cerrado con lazo de tela a cuadros en la portada.
- Ilustraciones acuareladas de patitos, ocas, pollitos y animalitos de granja.
- Globo aerostático, nubes, regalos, moños y tendedero de ropa de bebé.
- Marcos ovalados u orgánicos con follaje verde.
- Separadores finos y discontinuos.
- Botones redondeados color taupe.
- Titulares serif delicados; nombres o frases cortas en tipografía manuscrita.

## 2. Paleta inicial

Los valores son una **propuesta de aproximación**, no una extracción exacta de los píxeles. Mantenerlos centralizados para poder afinarlos sin buscar colores por todo el código.

| Token | HEX | Uso |
|---|---|---|
| `--color-background` | `#FAFAF5` | Fondo general marfil |
| `--color-paper` | `#FFFFFF` | Paneles y tarjetas |
| `--color-gingham-light` | `#F0F2E9` | Cuadros más claros del patrón |
| `--color-gingham-sage` | `#DDE5D2` | Cuadros verdes del patrón |
| `--color-sage` | `#7E8A63` | Acentos, etiquetas y destacados |
| `--color-sage-dark` | `#5E6B4C` | Verde oscuro para texto/acento |
| `--color-taupe` | `#A88B73` | Botones y etiquetas |
| `--color-dusty-blue` | `#657A98` | Nombres y acentos secundarios |
| `--color-ink` | `#44463D` | Texto principal |
| `--color-muted` | `#77776B` | Texto secundario |
| `--color-line` | `#DFDED3` | Líneas y divisores |

### Reglas de color

- Marfil y blanco ocupan la mayor parte de la pantalla.
- El gingham debe ser muy tenue: usarlo en bordes, laterales o detalles; no detrás de grandes bloques de texto.
- El verde salvia es el color de identidad principal.
- El taupe se reserva para botones y pequeños llamados a la acción.
- El azul grisáceo se usa con moderación, por ejemplo para nombres.
- El texto pequeño debe mantener contraste suficiente. No usar beige o verde muy claro como texto principal.
- Evitar colores neón, saturados y gradientes fuertes.

### Tokens CSS iniciales

```css
:root {
  --color-background: #FAFAF5;
  --color-paper: #FFFFFF;
  --color-gingham-light: #F0F2E9;
  --color-gingham-sage: #DDE5D2;
  --color-sage: #7E8A63;
  --color-sage-dark: #5E6B4C;
  --color-taupe: #A88B73;
  --color-dusty-blue: #657A98;
  --color-ink: #44463D;
  --color-muted: #77776B;
  --color-line: #DFDED3;
}
```

Guardar estos tokens en `src/styles/tokens.css` o en el tema de la plantilla. Evitar repetir códigos HEX dentro de componentes.

## 3. Tipografía

Combinación sugerida:
- **Títulos y texto editorial:** Cormorant Garamond o una serif equivalente.
- **Texto de lectura y datos:** Lora o una serif de alta legibilidad.
- **Palabras decorativas y nombres:** Allura o Parisienne, solo en frases cortas.

No escribir párrafos completos en tipografía manuscrita. Fechas, horarios, direcciones y formularios deben ser especialmente legibles. Revisar la licencia de las fuentes y recursos antes de un uso comercial.

## 4. Composición y experiencia móvil

**Mobile-first.** Las capturas son verticales y la invitación se abrirá principalmente desde WhatsApp en un teléfono.

- Diseñar primero para 360–430 px de ancho.
- Usar una columna principal y márgenes cómodos.
- Evitar scroll horizontal.
- Mantener el contenido centrado y con espacios generosos.
- El marco gingham puede aparecer en laterales o como borde exterior fino.
- Separar secciones con espacio, líneas finas o pequeños adornos; evitar tarjetas pesadas.
- En desktop ampliar el margen exterior, pero conservar el carácter de invitación vertical.

## 5. Orden recomendado de secciones

1. **Portada / sobre:** frase breve, sobre verde oliva y lazo gingham. Al tocar, el sobre se abre o conduce suavemente al contenido.
2. **Presentación:** “Estás invitado/a a mi Baby Shower”, nombre del bebé y/o de quienes invitan, mensaje breve e ilustración principal.
3. **Cuenta regresiva:** días, horas, minutos y segundos; si el evento ya pasó, no mostrar valores negativos.
4. **Fecha y horario:** día, fecha y hora con jerarquía clara.
5. **Ubicación:** dirección, indicaciones opcionales y botón “Ver mapa” que abre Google Maps.
6. **Regalos:** productos con imagen de referencia, nombre exacto, descripción/características y acción para elegir o reservar.
7. **Confirmación de asistencia:** formulario breve para confirmar, rechazar o actualizar la respuesta.
8. **Cierre:** agradecimiento e ilustración pequeña.

Esta secuencia corresponde al baby shower. No es obligatorio imponerla a futuras plantillas.

## 6. Imágenes e ilustraciones

### Estilo buscado

- Acuarela suave, con textura de papel y bordes orgánicos.
- Gama apagada: verde salvia, oliva, crema, beige, marrón claro y pequeños acentos azul grisáceo.
- Animalitos tiernos (patitos, ocas, pollitos), globo aerostático, nubes, ropita de bebé, regalos y lazos.
- Preferir PNG o WebP transparente para ilustraciones superpuestas.
- Para texturas y fondos, usar WebP optimizado.

### Recursos a preparar

- `envelope-olive-gingham.webp` — sobre de portada.
- `bow-gingham.webp` — lazo a cuadros.
- `duck-family-watercolor.webp` — ilustración central de animalitos.
- `hot-air-balloon-watercolor.webp` — globo y nubes.
- `baby-clothes-garland.webp` — tendedero de ropa.
- `gift-box-watercolor.webp` — regalo decorativo.
- `gingham-sage-tile.webp` — patrón repetible sutil.
- `foliage-oval-frame.webp` — marco ovalado con follaje.

Son nombres sugeridos; no crear archivos vacíos ni asumir que los recursos ya existen.

### Imágenes de regalos

Las imágenes deben ayudar a identificar el artículo correcto. Cada regalo debe poder guardar nombre/modelo, descripción y características importantes (medida, material, color, modelo), imagen/es de referencia, enlace a tienda opcional y una nota como “imagen ilustrativa” cuando corresponda.

Para una “cuna evolutiva”, por ejemplo, especificar modelo o características para evitar compras equivocadas. Las imágenes particulares de regalos pertenecen al contenido de cada invitación, no a los adornos fijos de la plantilla. Guardarlas como URLs o en Supabase Storage cuando se implemente el flujo dinámico.

## 7. Interacciones y movimiento

- La apertura del sobre puede tener una animación breve y suave.
- Usar apariciones sutiles (fade o pequeño desplazamiento).
- Evitar parpadeos, movimientos constantes o animaciones largas.
- No reproducir audio automáticamente.
- Respetar `prefers-reduced-motion`.
- Mostrar estados claros para botones y regalos: disponible, reservado, deshabilitado.
- No revelar datos personales de quien reservó un regalo.

## 8. Organización de archivos

Separar las **referencias visuales**, los **recursos finales de la plantilla** y las **imágenes de contenido de cada invitación**.

```text
docs/
└── design/
    ├── baby-shower-visual-guide.md
    ├── ASSET_SOURCES.md
    └── references/
        └── baby-shower/
            ├── 01-portada-sobre.png
            ├── 02-presentacion.png
            ├── 03-fecha-ubicacion-regalos.png
            └── 04-regalos-confirmacion.png

public/
└── assets/
    └── templates/
        └── baby-shower/
            ├── backgrounds/
            ├── decorations/
            ├── illustrations/
            └── fonts/

src/
├── templates/
│   └── baby-shower/
│       ├── BabyShowerTemplate.tsx
│       ├── theme.ts
│       └── sections/
└── styles/
    ├── tokens.css
    └── global.css
```

### Qué va en cada lugar

- `docs/design/references/`: capturas y moodboards; solo orientan el diseño y no se cargan en la web.
- `public/assets/templates/`: recursos finales, originales o con licencia, reutilizables por la plantilla.
- `src/templates/`: composición y secciones visuales de la plantilla.
- `src/styles/tokens.css`: colores y variables globales.
- Fotos y regalos específicos de cada evento: contenido de la invitación, almacenado como datos/URLs o en Supabase Storage.

Mantener `docs/design/ASSET_SOURCES.md` actualizado con origen, licencia, permiso comercial y atribución requerida de cada recurso.

## 9. Referencias recibidas

Las capturas van en `docs/design/references/baby-shower/` (todavía no están cargadas en el repositorio):

1. `01-portada-sobre.png`: portada con sobre y lazo.
2. `02-presentacion.png`: marco ovalado, nombre e ilustración de animalitos.
3. `03-fecha-ubicacion-regalos.png`: cuenta regresiva, fecha, mapa y regalos.
4. `04-regalos-confirmacion.png`: detalle de regalos y confirmación.

Tienen resolución reducida y marca de agua. **No deben utilizarse como fondos ni publicarse como parte de la invitación.** Usarlas solo para reconstruir el estilo con recursos originales o con licencia adecuada.

## 10. Instrucciones para agentes de IA

Antes de diseñar o modificar la plantilla baby shower:
1. Leer esta guía y revisar las cuatro capturas.
2. Mantener la paleta y la dirección de arte descritas.
3. No introducir una estética distinta o colores fuertes sin justificación.
4. No usar las capturas completas como imágenes del sitio.
5. Si faltan ilustraciones finales, usar placeholders identificados; no descargar recursos sin verificar licencia.
6. Priorizar móvil y revisar al menos un ancho móvil y uno desktop.
7. Mantener textos y datos separados de la presentación visual.
8. Centralizar colores, tipografías y recursos para no duplicarlos.
