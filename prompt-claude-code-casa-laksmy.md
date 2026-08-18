# Prompt para Claude Code — Implementar la dirección «Casa Laksmy» en el sitio de Laksmy

Copia todo lo que está debajo de la línea y pégalo como primer mensaje en Claude Code, dentro del repositorio del sitio.

---

Vas a re-skinear el sitio de **Laksmy** (joyería y taller de orfebrería, Caracas) con una dirección de arte llamada **«Casa Laksmy»**. No es un rediseño funcional: **no cambies rutas, lógica de negocio, componentes de datos ni el comportamiento de ningún flujo**. Cambia únicamente el sistema visual (tipografía, color, espaciado, grilla, estados, movimiento).

## 0. Antes de escribir código

1. Explora el repo y dime en un resumen corto: framework, sistema de estilos (Tailwind / CSS modules / styled-components / CSS global), dónde están los tokens de color y tipografía, y qué componentes concentran el look (layout, header, footer, card de producto, botón, tipografías).
2. Propón un plan de archivos a tocar y **espera mi confirmación** antes de empezar.
3. Trabaja en una rama nueva: `feat/casa-laksmy`. Commits pequeños y descriptivos.

## 1. Tesis de la dirección

«La tienda hecha sitio»: el lujo como ceremonia, no como catálogo. El sitio se comporta como el salón físico donde se abre la caja — simetría axial, mucho aire, una sola idea por pantalla, silencio tipográfico. La referencia son las casas históricas italianas: serif con gracia monumental, cursiva reservada al nombre de marca, oro presente solo como filete.

## 2. Tokens de color (reemplazan la paleta actual)

Define estos tokens en el sistema de estilos existente (variables CSS, tema de Tailwind, o lo que ya use el repo — **no introduzcas una segunda forma de manejar tokens**):

| token | hex | uso |
|---|---|---|
| `--marfil` | `#F9F7F2` | fondo base de todo el sitio |
| `--superficie` | `#EDE7DA` | tarjetas, bloques secundarios, inputs |
| `--verde-vitrina` | `#16211C` | texto principal y bloques oscuros |
| `--verde-profundo` | `#070B09` | footer y bloques a sangre |
| `--lacre` | `#6B1D2A` | **único** color de acción: enlaces, botones, estados activos |
| `--oro` | `#B08A46` | solo filetes de 1px, subrayados y separadores |
| `--plata` | `#A9AEA8` | equivalente de `--oro` en fichas de plata Ley 950 |

Reglas duras:
- Nada de degradados dorados, sombras de color ni glows. Las sombras, si existen, son `0 1px 0 rgba(22,33,28,.12)` como máximo.
- El oro **nunca** rellena áreas ni texto grande: solo bordes de 1px y subrayados.
- El metal real (oro/plata de las piezas) solo aparece en fotografía.
- Un único acento: si algo necesita destacar y no es acción, se resuelve con espacio en blanco, no con color.

## 3. Tipografía

Instala vía `next/font` (o el mecanismo de fuentes que ya use el repo) desde Google Fonts:
- **Cormorant Garamond** — pesos 300, 400, 500 + italic 300. Titulares y precios.
- **Jost** — pesos 300, 400. Cuerpo, navegación, interfaz.
- Elimina Instrument Serif, Instrument Sans y DM Mono del sitio (mantén DM Mono solo si algún módulo técnico deja de ser legible sin monoespaciada; consúltame antes).

Escala tipográfica (tres registros y punto):
- `display`: Cormorant Garamond 300, `clamp(56px, 8vw, 128px)`, `line-height: .95`, `letter-spacing: .01em`.
- `subtitulo`: Cormorant Garamond italic 300, 24–28px, `line-height: 1.45`. **Reservado al nombre de marca, citas y bajadas de sección** — jamás en botones ni navegación.
- `cuerpo`: Jost 300/400, 16px, `line-height: 1.75`.
- `etiqueta`: Jost 400, 11px, `letter-spacing: .18em`, `text-transform: uppercase`, color `--verde-vitrina` al 55%.
- `precio`: Cormorant Garamond 400 en versalitas, 20px, `letter-spacing: .16em`, formato `DESDE 480 $ · 18K`.

No uses pesos bold para jerarquizar. La jerarquía se hace con tamaño, espacio y filete.

## 4. Grilla y espaciado

- Grilla de 12 columnas, **simetría axial**: contenido centrado, márgenes laterales del 18% en ≥1280px, 8% en tablet, 24px en móvil.
- Ancho máximo de línea de texto: 74 caracteres (`max-width: 74ch`), centrado.
- Escala de espaciado en múltiplos de 4, generosa: secciones separadas por 96–128px en desktop, 64px en móvil.
- Una idea por pantalla: si una sección tiene dos mensajes, sepárala en dos.

## 5. Elemento gráfico recurrente: «la moldura»

Un marco de doble filete que enmarca módulos, fotos y tarjetas: borde exterior de 1px `--verde-vitrina` al 18%, borde interior de 1px `--oro`, separados 3px (implementable con `outline` + `outline-offset` o con un wrapper). Créalo como un componente/utilidad reutilizable (`<Moldura>` o clase `.moldura`) y aplícalo a: hero de producto, tarjetas de catálogo, bloque del simulador de talla y tarjetas de servicio B2B. Úsalo con criterio — no todo lleva moldura.

## 6. Logotipo

- Wordmark: `LAKSMY` en Cormorant Garamond 400, versalitas, `letter-spacing: .28em`, con un filete `--oro` de 1px debajo que ocupa exactamente el ancho de la palabra.
- Monograma para favicon y avatares: la `L` de Cormorant inscrita en un círculo de filete de 1px. Genera el SVG a partir de tipografía, no dibujado a mano.

## 7. Estructura del home (reordenar contenido existente, no inventar contenido nuevo)

Convierte el home en cinco actos, en este orden. Reutiliza el contenido y las imágenes que ya existen; si falta algo, deja un placeholder claro y avísame:

1. **Acto I — Apertura.** Foto a página completa (mano con anillo) + nombre en cursiva + una sola línea de copy + un único CTA en `--lacre`.
2. **Acto II — El Espectro.** Índice de carreras en dos columnas de versalitas, ordenado alfabéticamente. **Conserva toda la lógica actual del selector.** El color de la carrera no se muestra como chip saturado: al hacer hover/foco, el filete `--oro` de la fila adopta el color de la piedra y aparece el nombre de la piedra a la derecha. El color seleccionado se refleja en el filete del producto, no en fondos grandes.
3. **Acto III — El taller.** Texto en formato carta firmada, centrado, con foto documental del taller de Caracas.
4. **Acto IV — El oro como reserva de valor.** **Conserva el gráfico existente y sus datos**, redibujado como línea de 1px `--oro` sobre `--marfil`, ejes en Jost 11px versalitas, sin relleno ni área sombreada.
5. **Acto V — Catálogo y a la medida.** Aros de boda, cadenas, dijes y piezas a medida; máximo 2 productos por fila en desktop, foto grande, ficha mínima (nombre, metal, precio desde).
6. **Cierre — B2B.** Bloque a sangre en `--verde-vitrina` con los servicios de orfebrería al mayor (fundición, engaste, terminado, modelado 3D). Discreto pero deliberado: una puerta de servicio, no un banner.
7. **Footer** en `--verde-profundo`.

## 8. Elementos funcionales que NO se pueden romper

Los reinterpretas visualmente, pero deben seguir funcionando exactamente igual:
- **El Espectro** (color de piedra por carrera) y su selector.
- **El simulador de talla** — reencuádralo dentro de una moldura, tipografía Jost, sin ilustraciones.
- **El bloque de oro como reserva de valor** y su gráfico.
- **El recálculo de precio según metal** (10k / 14k / 18k / plata 950).
- **El botón de WhatsApp** — rediséñalo como pastilla `--lacre` con texto en Jost 11px versalitas, esquinas de 2px, sin icono de burbuja infantil; posición fija abajo a la derecha, con margen de 24px.

## 9. Estados y movimiento

- Transiciones de **420 ms**, `cubic-bezier(.22,.61,.36,1)`, solo en `opacity` y `color`/`border-color`.
- Hover de enlaces y tarjetas: **no hay desplazamiento ni escala**. Se dibuja un filete `--oro` de 1px de izquierda a derecha bajo el elemento.
- Focus visible: filete `--lacre` de 1px con `outline-offset: 3px` (accesibilidad obligatoria, no lo elimines).
- Cambio de metal: cross-fade de dígitos del precio, 200 ms. Sin contadores animados.
- Prohibido: parallax, scroll-jacking, rebotes, rotaciones, `transform: scale` en hover, animaciones de entrada por elemento.
- Respeta `prefers-reduced-motion: reduce` desactivando todas las transiciones.

## 10. Fotografía

Los estilos deben suponer: fondo marfil o verde vitrina, luz lateral difusa, sombra larga única, encuadre centrado con la pieza ocupando menos del 40% del cuadro. Por lo tanto: **sin recortes cuadrados forzados** — usa `aspect-ratio: 4/5` en producto y `16/9` en ambiente, `object-fit: cover`, y nunca apliques filtros CSS a las fotos.

## 11. Entregables

1. Tokens de color y tipografía centralizados en un solo lugar.
2. Componente/utilidad `moldura`.
3. Componentes base actualizados: botón, enlace, tarjeta de producto, etiqueta, precio, input.
4. Home reordenado en los actos descritos.
5. Páginas internas (catálogo, producto, B2B) heredando el sistema sin estilos huérfanos.
6. Limpieza: elimina los tokens, fuentes y clases que queden sin uso.
7. Revisión de accesibilidad: contraste AA en todo texto (`--lacre` sobre `--marfil` y `--marfil` sobre `--verde-vitrina` cumplen; verifica los grises que introduzcas).
8. Al terminar, un resumen de qué cambió por archivo y qué quedó pendiente.

Si en algún punto una decisión visual choca con la funcionalidad existente, **pregúntame antes de romper la funcionalidad**.
