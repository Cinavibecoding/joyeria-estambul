# Joyería Estambul — contexto completo para una sesión nueva

> Documento autocontenido. Pégalo entero como primer mensaje en un Claude Code
> nuevo. Verificado contra el árbol de trabajo el 4 de septiembre de 2026,
> commit `188a636`, rama `feat/casa-laksmy`.

---

## 0. Lo primero: dónde está y cómo se abre

```bash
cd "/Users/victor/Desktop/Nuevo proyecto pagina "
```

**El nombre de la carpeta termina en un espacio.** No es un error de copiado: el
directorio se llama literalmente `Nuevo proyecto pagina ` con un espacio final.
Hay que citarlo siempre. En Python, la ruta base es:

```python
PROJ = "/Users/victor/Desktop/Nuevo proyecto pagina /"   # espacio + barra
```

Un fallo típico: escribir `f"{PROJ}FOTOS-CRUDAS/"` cuando `PROJ` acaba en espacio
sin barra produce `.../Nuevo proyecto pagina FOTOS-CRUDAS/`, que no existe.

**Servidor local** (hace falta para ver la página; se cae al cerrar la terminal):

```bash
cd "/Users/victor/Desktop/Nuevo proyecto pagina " && python3 -m http.server 4321
```

Luego `http://127.0.0.1:4321`. La página **también funciona con doble clic en
`index.html`** (`file://`), que fue una decisión de diseño: por eso `catalogo.js`
es un `<script>` y no un `fetch`.

---

## 1. Qué es el negocio

**Joyería Estambul** (antes *Laksmy*, antes *Casa de Ley*). Joyería y taller de
orfebrería en el centro de Caracas, Venezuela — Minicentro París, frente a la
Asamblea Nacional, a dos cuadras de la Plaza Bolívar. Negocio real en marcha,
unos $10.000/mes, que hoy vende por Instagram y WhatsApp.

**Razón social:** Inversiones Lakshmy 3000, C.A. · RIF J-40677790-0. **No se
cambia** con el rebranding: el nombre comercial no cambia la empresa registrada
y el RIF cuelga de esa razón social. Es el único renglón legal de la página.

**WhatsApp:** `584242765908` (0424-276-5908). Un solo número para tienda y
taller, con 7 mensajes prellenados distintos según el botón de origen.

**Instagram:** la cuenta nueva **todavía no existe**. En el pie está sin arroba.

### Los dos públicos

- **B2C, el grueso:** graduandas buscando su anillo de grado. Llegan desde
  Instagram, **casi siempre desde el teléfono**.
- **B2B, derivada real:** otras joyerías que necesitan orfebrería. Cliente de
  referencia **GoldToday** (Sambil Chacao y C.C. Cerro Verde). También son
  **proveedores autorizados de resina Bluecast** para Venezuela, importada de
  Europa. El B2B debe estar siempre visible pero **nunca opacar al B2C**.

### Reglas del negocio que ya están en la página

- Grabado interno **gratis**. No suma al precio.
- **Copias en plata incluidas** al comprar un anillo de grado en oro.
- Si el anillo queda apretado **se agranda sin costo**. Se pide justo antes que
  grande, porque agrandar es fácil y achicar cuesta más.
- **Plazo 14 días** máximo para un anillo de grado.
- Pago: pago móvil, transferencia, Zelle, efectivo, Binance.
- Envíos a todo el país.
- Los clientes van a la **tienda**; al **taller** sólo van joyerías. No
  confundirlos: fue un error ya corregido.

### Objetivo único de la web

Que quien llega termine escribiendo por WhatsApp. **No hay pasarela de pago ni
checkout, y no se va a añadir.**

---

## 2. Stack y estructura

**HTML + CSS + JavaScript puro. Sin framework, sin build step, sin dependencias
en tiempo de ejecución.** Se sirve como archivos estáticos.

```
/Users/victor/Desktop/Nuevo proyecto pagina /
├── index.html                2.976 líneas — TODO el sitio: markup + <style> + <script>
├── catalogo.js               411 líneas — ÚNICO archivo que edita la dueña
├── assets/
│   ├── fuentes.css           @font-face de Cormorant Garamond y Jost
│   ├── fuentes/              3 woff2 variables, subconjunto latino (87 KB)
│   ├── img/
│   │   ├── hero-cadena-oro-marino.jpg        1200x1600 · el hero actual
│   │   ├── hero-anillo-grado-rojo.jpg        1200x1600 · alternativa lista
│   │   ├── hero-referencia-anillos-...jpg    la vieja de Unsplash, ya sin uso
│   │   ├── 5 fotos sueltas antiguas (aro, cadena, dijes, grado)
│   │   ├── descartadas/      11 fotos rechazadas — NO referenciar nunca
│   │   └── piezas/           153 portadas 720x960 + mini/ 153 + gal/ 290
│   └── IMAGENES.md           manifiesto de qué foto es de qué pieza
├── FOTOS-CRUDAS/             463 HEIC originales, 640 MB — fuera de git
├── HERRAMIENTAS/
│   ├── fotos.py              pipeline de fotos, la versión buena
│   ├── procesar-fotos.py     script que lo ejecuta
│   ├── encuadre.py, piedra.py  módulos antiguos, ya superados por fotos.py
│   └── publicar.sh           arma el paquete para Hostinger
├── PRUEBAS/
│   ├── simulador.js          fuzzer: 28 acciones al azar + 9 invariantes
│   ├── recorridos.js         6 recorridos completos de usuario real
│   ├── catalogo-{hostil,vacio,volumen}.js  catálogos trampa
│   ├── prueba-{hostil,vacio,volumen}.html  el sitio con cada trampa
│   └── HALLAZGOS.md          los 7 bugs encontrados (ya arreglados)
├── PUBLICAR/                 paquete estático (se regenera)
├── estambul-web.zip          el paquete comprimido
├── NOTAS-PARA-VICTOR.md      ← LO MÁS IMPORTANTE: qué falta y qué preguntar
├── FOTOS-INVENTARIO.md       las 154 piezas con sus tomas y nitidez
├── FOTOS-DESCRIPTIVOS.md     notas del dueño mapeadas a los grupos
├── ACTUALIZAR-CATALOGO.md    guía para la dueña
├── MEDICION.md               cómo conectar la analítica
├── AUDITORIA.md              bugs históricos, flujo de compra, exposición legal
├── DESIGN.md                 ⚠️ DESACTUALIZADO: describe el sistema anterior
└── CONTEXT_HANDOFF.md        ⚠️ DESACTUALIZADO: marca y sistema anteriores
```

**Git:** repo local, rama `feat/casa-laksmy`, **sin remoto**. `main` tiene el
estado previo al re-skin. `.gitignore` excluye `PUBLICAR/`, `*.zip`,
`.DS_Store`, `FOTOS-CRUDAS/` y `assets/img/piezas/`.

⚠️ **Las fotos publicadas NO están en git.** Son regenerables con
`python3 HERRAMIENTAS/procesar-fotos.py`, pero si se borran hay que rehacerlas.

### Convenciones de código

- **Todo el color vive en `:root`.** Ningún hex literal fuera de ahí.
- **Comentarios en español**, explicando *por qué*, no *qué*. Varios documentan
  bugs ya resueltos para que nadie los reintroduzca. **Respetar ese estilo.**
- Clases BEM-ish: `.bloque__elemento--modificador`.
- Funciones y variables **en español**: `pintarGrado`, `piedraActiva`.
- `esc()` sobre todo lo que venga de `catalogo.js` antes de entrar en `innerHTML`.

---

## 3. Sistema visual exacto

### Paleta (en `:root` de `index.html`)

| Token | Valor | Uso |
|---|---|---|
| `--field` | `#F9F7F2` | Marfil. Fondo base de todo el sitio |
| `--panel` | `#EDE7DA` | Superficie. Tarjetas, bloques secundarios, inputs |
| `--toque` | `#16211C` | Verde Vitrina. Texto principal y bloques oscuros |
| `--profundo` | `#070B09` | Verde Profundo. Footer y bloques a sangre |
| `--ink` | `#16211C` | Tinta |
| `--ink-2` | `#636A65` | Grafito. **Es el verde al 66%, no al 55%**: al 55% da 3,7:1 sobre marfil y no llega al AA de 4,5:1 |
| `--lacre` | `#6B1D2A` | **Único color de acción**: CTA, foco, enlaces |
| `--lacre-dark` | `#54161F` | Hover del lacre |
| `--oro` | `#B08A46` | **Sólo filetes de 1px y subrayados. Nunca relleno ni texto grande** |
| `--plata` | `#A9AEA8` | El equivalente del oro en piezas de plata Ley 950 |
| `--line` | `#CBCEC7` | Bordes |
| `--line-soft` | `#E1DFD6` | Bordes suaves |
| `--t-oro` | `#EDE7DA` | Fondo de ficha sin foto, piezas de oro |
| `--t-plata` | `#E7E9E4` | Fondo de ficha sin foto, piezas de plata |

### El Espectro — colores de piedra por carrera

Los colores **no son libres**: la convención venezolana viene de Salamanca por
vía colonial y es la que usan las universidades, así que la graduanda llega
buscando un color concreto. Fuentes: protocolo de la Universidad de Oriente y
tradición de la Universidad de Salamanca.

| Token | Valor | id | Carreras |
|---|---|---|---|
| `--e-azul` | `#20458C` | `azul` | Ingenierías, Informática, Arquitectura, Geología |
| `--e-amarillo` | `#8A6410` | `amarillo` | **Salud**: Medicina, Bioanálisis, Enfermería, Nutrición |
| `--e-rojo` | `#9E2233` | `rojo` | **Derecho + Contaduría y Administración** |
| `--e-morado` | `#5B3A87` | `morado` | **Farmacia** |
| `--e-fucsia` | `#B0106F` | `fucsia` | **Odontología** |
| `--e-celeste` | `#2E6E9E` | `celeste` | **Educación, Letras, Filosofía, Historia, Artes** |
| `--e-rosa` | `#A83A62` | `rosa` | Diseño, Comunicación, Publicidad |
| `--e-blanco` | `#8E968E` | `blanco` | Psicología, Ciencias básicas, comodín |

**Dos correcciones que salieron de la investigación y no de la intuición:**
Farmacia y Odontología venían cruzadas (Farmacia es morado, Odontología fucsia,
no al revés), y Educación no va sola sino compartiendo azul celeste con Letras,
Filosofía e Historia.

**Naranja no entra**: en la convención es Economía y Sociología, no Farmacia.

⚠️ **La piedra `fucsia` (Odontología) no tiene ningún modelo etiquetado**, así
que su filtro muestra 0. Hay que marcar una pieza en `catalogo.js`.

### Tipografía

```css
--display: "Cormorant Garamond", Georgia, serif;
--sans:    "Jost", system-ui, -apple-system, sans-serif;
--mono:    "Jost", ...;   /* DM Mono salió; el token se conserva para no tocar
                             las 17 reglas que lo usaban. Lo que la monoespaciada
                             aportaba (columnas de cifras alineadas) lo da
                             font-variant-numeric: tabular-nums en 8 reglas */
```

**Autoalojadas** en `assets/fuentes/`, 3 woff2 variables, subconjunto latino.
**No enlazar a Google Fonts**: una vuelta de red menos y sin exponer la IP de
quien visita. El subconjunto cubre acentos, ñ, ¿¡, · (U+00B7), × (U+00D7),
− (U+2212) y — (U+2014).

### Espaciado y otros

```css
--s1:.25rem  --s2:.5rem  --s3:.75rem  --s4:1rem  --s5:1.5rem
--s6:2rem    --s7:3rem   --s8:4rem    --s9:6rem
--wrap:1140px  --radius:3px  --ease:cubic-bezier(.22,.61,.36,1)
```

---

## 4. ⚠️ El bug que arrastró todo — leer antes de tocar fotos

**Las fotos del iPhone son 3024×4032 — VERTICALES.** `sips` informa los ejes al
revés (`pixelWidth: 4032`) y **al convertir a JPEG escribe la imagen girada 90
grados**. Las 463 fotos pasaron por ahí, así que todo el catálogo salió acostado.

Demostrado así:

```
sips -s format jpeg -Z 800 IMG_8778.HEIC  ->  800x600   (horizontal, MAL)
pillow_heif leyendo el mismo archivo      ->  3024x4032 (vertical, BIEN)
```

**`sips` está fuera del pipeline.** Se lee el HEIC directamente con
`pillow-heif` (ya instalado vía pip).

Y arrastraba más de lo que parecía: la lectura de las tres tomas como "cenital /
de pie / invertida" era una interpretación de imágenes giradas.

### Reglas de fotos que vienen del dueño y no se negocian

- **NO se gira, NO se voltea, NO se invierte, NO se reordena nada.**
- **La PRIMERA toma de cada pieza es la central y es la portada.**
- La segunda es el **lado derecho**; la tercera, el **lado izquierdo**. En ese orden.
- Lo único permitido es **recortar y centrar**, manteniendo el vertical.
- Las fotos se ven **verticales** (3:4), como se tomaron con el teléfono.

Todo esto está documentado dentro de `HERRAMIENTAS/fotos.py`.

---

## 5. La sesión de fotos

**24 de agosto de 2026, 12:33–15:12 hora de Caracas (2h 39min).**

- **463 archivos** en `FOTOS-CRUDAS/`: 461 HEIC + 1 PNG + 1 JPG, 640 MB.
- Rango `IMG_8741` → `IMG_9209`. 6 huecos reales + 1 duplicado
  (`IMG_9137 2.HEIC`).
- **154 piezas** agrupadas por saltos de más de 12 segundos entre disparos.
  Media exacta de 3,0 fotos por pieza, que coincide con el método de tres
  ángulos.
- **4032×3024 según sips / 3024×4032 de verdad.** 12 MP.

### Descartes

- **`IMG_8777.PNG`** es una captura de pantalla de la galería del teléfono, no
  un producto. Descartada. Por eso son 153 piezas publicadas y no 154.
- **`IMG_9173` y `IMG_9174`** salieron **vacías**: fotos del expositor sin
  pieza. No estaban movidas, estaban vacías.

### Las fotos que faltan

Faltan **`IMG_8945`, `IMG_8946`, `IMG_8947` y `IMG_8948`** — cuatro seguidas.
El dueño dijo que las fotos perdidas eran el **"antes y después"**: los modelos
clásicos y los modernos. Si aparecen, sirven de referencia para clasificar los
98 anillos.

---

## 6. Estado del catálogo

```
GRADO: 98 anillos de grado
REGISTRO:
  Anillos: 43            (anillos de dama, no de grado)
  Aros de Boda: 0        ← sin fotografiar
  Cadenas y Esclavas: 8
  Pulseras: 1
  Zarcillos: 3
  Dijes: 0               ← sin fotografiar
```

- **Todas las piezas llevan `consultar:true`** y la página muestra "Consultar"
  en vez de un precio. No hay pesos reales y no se inventan cifras.
- **21 anillos tienen su carrera real leída de la foto**, ampliando el original
  a 4032 px. **5 tienen institución.**
- **59 clásicos / 39 modernos** — reparto automático **no fiable**.

### Los grabados que ya se leyeron

| Pieza | Grabado | Institución |
|---|---|---|
| grado-015 | Queseras del Medio 1987 | Academia Militar |
| grado-018, grado-031 | Policía Nacional Bolivariana | PNB |
| grado-019, grado-020, grado-032 | Médico Cirujano | |
| grado-034 | Psiquiatra | |
| grado-038 | T.S.U. Informática | |
| grado-039, grado-057 | Administración / Lic. Administración | |
| grado-049 | Diseño Gráfico | |
| grado-051, grado-119, grado-123, grado-126 | Abogado | |
| grado-052 | Lic. Relaciones Industriales | |
| grado-053 | T.S.U. Publicidad y Mercadeo | |
| grado-121 | T.S.U. Administración de Aduanas | **CUAM** |
| grado-122 | Ingeniería de Sistemas | |
| grado-124 | Contador Público | |
| grado-125 | Criminalística | **CICPC** |

**Instituciones verificadas:** CUAM = Colegio Universitario de Administración y
Mercadeo (privado, sede Caracas desde 1996, ofrece Administración de Aduanas).
UCSAR = Pontificia Universidad Católica Santa Rosa (Caracas, la de trayectoria
más antigua de Venezuela, raíces en 1673). Sin verificar: UPTAMCA.

Se leen también en las fotos, sin transcribir aún: UNEFA, UPTAMCA, UCSAR,
"BOLIVARIANA", "UNERG".

### Estructura de una pieza en `catalogo.js`

```js
{n:"Anillo de Grado · Abogado", tipo:"grado", g:6.5, piedra:"rojo",
 estilo:"clasico", grabado:"Abogado", institucion:"CUAM", consultar:true,
 medida:"6x8", unica:true, stock:true, nuevo:true,
 mas:["piezas/gal/grado-051-2.jpg", "piezas/gal/grado-051-3.jpg"],
 img:"piezas/grado-051.jpg", alt:"..."}
```

`tipo` ∈ `grado · anillo · aro · cadena · pulsera · zarcillo · dije`

### Medidas

```js
MEDIDAS = [4x3 "Discreta", 6x4 "Menuda", 6x8 "Clásica",
           10x8 "Amplia", 10x12 "Grande"]
```

Son **milímetros: ancho por largo**. En un anillo o zarcillo, el tamaño de la
piedra; en una cadena, el del eslabón. Hay una sección `#medidas` que las dibuja
**a escala entre ellas** (`PX_MM = 7.5`), porque el cliente no necesita entender
milímetros, le basta ver que la 10x12 es tres veces la 4x3.

---

## 7. Secciones de la página, en orden

`hero` → `#espectro` → `#grado` → `#registro` → `#medidas` → `#talla` →
`#comprar` → `#refugio` → `#taller` → `#b2b` → `#bluecast` → `footer`

Más los diálogos: `#modal` (ficha de pieza), `#pedido` (carrito), `#indice`
(menú lateral), `#visor` (foto ampliada), `#wafab` (botón flotante de WhatsApp).

### Funcionalidad que no se puede romper

- **El Espectro** y su selector de 7+1 piedras, más el índice alfabético de
  carreras que activa la misma piedra.
- **Clásicos / Modernos** (`#estilos`), que se combina con el filtro de piedra.
- **El simulador de talla**: fórmula del estándar americano,
  `circunferencia = 36,5 + talla × 2,55`, tallas 4 a 15.
- **El bloque del oro como reserva de valor** y su gráfico.
- **El recálculo de precio por metal** (10k/14k/18k/plata 950).
- **El botón de WhatsApp** y los 15 enlaces.
- **"Ver más" en tandas de 6.** Nunca carrusel ni scroll infinito.

---

## 8. Decisiones cerradas — no volver a proponerlas

1. **No migrar a React/Next/Astro/Shopify.** Se probó TanStack y se revirtió.
2. **No añadir pasarela de pago ni carrito real.** WhatsApp es el único canal.
3. **No poner dorado en botones ni tipografía.** El oro va en filetes de 1px.
4. **No mostrar el desglose del precio** (gramos, spot, mano de obra). Sólo el
   resultado.
5. **No rellenar con fotos de stock** las piezas sin foto. Ficha tipográfica.
6. **No carrusel, no scroll infinito.**
7. **No cobrar el grabado.** Es gratis desde el 10 de agosto de 2026.
8. **El `href` de WhatsApp se queda en `wa.me`**; la URL directa se usa sólo al
   abrir por JS. Ver el bug histórico #6.
9. **No reintroducir los sellos "CL"**, que son de la marca anterior.
10. **Un re-skin completo ("Casa Laksmy") se ejecutó y se revirtió entero.**
    Sobrevivieron sólo la paleta y la tipografía. Los commits `55c5665` y
    `a412905` siguen en la rama por si se quiere rescatar algo suelto.

---

## 9. Lo que falta, por prioridad

### Bloqueantes — dependen del dueño

1. **Los pesos en gramos.** Con uno por tipo y medida se calcula el resto por
   proporción. Es lo que desbloquea todos los precios.
2. **La mano de obra.** Con los $45/g de `catalogo.js`, un anillo de 6,5 g en
   oro 10k daría **≈$695, de los cuales $292 son hechura** — más que el oro que
   lleva. Un competidor de Caracas (@alianzas_alcala) cobra **$169** por uno en
   plata. En un anillo de grado la hechura suele cobrarse **por pieza y no por
   gramo**, porque el molde ya existe.
3. **Confirmar los 21 grabados leídos** y transcribir el resto.
4. **Clásicos vs modernos:** el reparto automático no es de fiar.
5. **El color de cada piedra:** 141 leídos a ojo de las fotos, no del inventario.
6. **Bluecast:** faltan presentaciones, referencias y precios.
7. **El usuario de Instagram** de la cuenta nueva.

### El choque de color — decisión pendiente

Medido: el fondo de las fotos está en torno al **44% de luminancia** y el de la
página en **96%**. **52 puntos de salto**, por eso la foto no se apoya en la
página sino que se pega encima como un recorte. Hay tres variantes probadas, que
se activan en la consola del navegador:

```js
document.documentElement.dataset.fondo = "vitrina"   // recomendada
document.documentElement.dataset.fondo = "neutro"
document.documentElement.dataset.fondo = "..."
document.documentElement.removeAttribute("data-fondo")  // volver a la actual
```

- **`vitrina`** — la tarjeta se oscurece hasta el tono de la foto. Es lo que
  hace una joyería: fondo oscuro, pieza iluminada. El salto baja de 52 a 6.
- **`neutro`** — se deja claro pero se le quita el amarillo. Arregla la
  temperatura, no la luminancia.

**Falta que el dueño escoja.**

### Encuadres que hay que revisar

- **`grado-133`, `grado-135`, `grado-136`, `grado-138`**: recorte demasiado
  cerrado. No es culpa del algoritmo: esas fotos se tomaron tan de cerca que el
  anillo no cabe entero. **La solución de verdad es volver a fotografiarlas.**
- **`grado-143`, `grado-147`**: el anillo sale pequeño y de canto.
- **23 piezas sin piedra** (bandas lisas, cadenas, pulseras) usan el encuadre de
  respaldo y quedan menos centradas.

### Otros pendientes

- **Analítica sin conectar.** `medir()` emite 7 eventos (`whatsapp`,
  `abre_ficha`, `filtra_piedra`, `agrega_pedido`, `calcula_talla`, `ver_mas`,
  `abre_calculadora_talla`). Falta pegar el Website ID de Umami en el bloque
  `MEDIDOR` al final de `index.html`. **Cloudflare Web Analytics no sirve**: no
  tiene eventos personalizados.
- **GZIP en hPanel.** Comprime el HTML de 140 KB a unos 30 y el JS de 41 a unos
  10. Es marcar una casilla.
- **`GUIA-FOTOGRAFIA.md` está borrada.** Se recupera con
  `git show 76e8fb6:GUIA-FOTOGRAFIA.md > GUIA-FOTOGRAFIA.md`.
- **`DESIGN.md` y `CONTEXT_HANDOFF.md` están desactualizados**: describen el
  sistema visual y la marca anteriores.
- **Aros de Boda y Dijes** aparecen con 0 piezas porque no se fotografiaron.
- **Peso de la primera pantalla: 724 KB** (index 140 + catalogo 41 + fuentes 86
  + hero 309 + 6 miniaturas 148).
- **Prompt de Instagram**: pendiente. El dueño quiere un prompt con todo el
  contexto para que salgan posts que suenen a equipo de marketing y no a la
  dueña escribiendo.

---

## 10. Comandos

```bash
# Servidor local
cd "/Users/victor/Desktop/Nuevo proyecto pagina " && python3 -m http.server 4321

# Regenerar las 153 fotos desde los HEIC originales
python3 HERRAMIENTAS/procesar-fotos.py

# Armar el paquete para Hostinger
bash HERRAMIENTAS/publicar.sh

# Comprobar sintaxis
node --check catalogo.js
```

**No hay `npm install`, ni build, ni tests automatizados.** Instalado vía pip
durante el trabajo: `numpy`, `Pillow`, `pillow-heif`, `fonttools`, `brotli`.

### El banco de pruebas

```js
// En la consola del navegador, con el viewport FIJADO:
ESTAMBUL_SIM.correr({clientes: 40, acciones: 26, semilla: 11})
RECORRIDOS.todos()
```

⚠️ **Ejecutar siempre con viewport fijado.** Con el panel colapsado
`clientWidth` vale 0 y todo se reporta como desbordamiento (73.541 falsos
positivos en una corrida).

⚠️ `PRUEBAS/simulador.js` contiene un byte de control (un veneno ANSI) que hace
que `grep` lo trate como binario. Usar `grep -a` o `sed`.

---

## 11. Trampas conocidas del código

- El foco que devuelve el modal al cerrarse **arrastra el scroll**. Para navegar
  a otra sección hay que poner `ultimoFoco = null` antes de `cerrarModal()`.
- `.modal__box` **no puede llevar `overflow:hidden`** o el pie fijo del precio
  deja de pegarse.
- `requestAnimationFrame` **no corre en pestañas en segundo plano**: `irA()`
  tiene red de seguridad a los 120 ms.
- Las categorías del índice lateral van **quemadas en el markup**. Renombrar una
  en `catalogo.js` rompía el catálogo; ya se valida que exista, pero hay que
  mantener las dos listas sincronizadas.
- El navegador **cachea `catalogo.js` con fuerza**. Para ver cambios:
  `await fetch('/catalogo.js',{cache:'reload'})` antes de recargar.

---

## 12. Exposición legal (Venezuela)

- Los precios pueden referenciarse en USD, **pero debe aceptarse pago en
  bolívares a tasa BCV** y **la factura debe emitirse en Bs** (Art. 318 CRBV +
  Ley Orgánica de Precios Justos). Ya hay avisos en el pie y en el modal.
- Usar tasas paralelas para facturar acarrea sanciones graves.
- **La sección de valor refugio no puede prometer rendimientos.** Está redactada
  como dato histórico con descargo explícito.
- **Nombres de marca ajenos:** el dueño llama a los tejidos "tipo Gucci", "tipo
  Rolex", "tipo Chanel". Son marcas registradas y **no se pueden publicar**. El
  nombre técnico verificado ampliando las fotos: lo que llama "tipo Gucci" es
  **eslabón marino** (o ancla) — óvalo de dos perforaciones unido por barra.
  Nombres genéricos publicables: barbada, cubana, marino, ancla, grumet, figaro,
  espiga, cordón, veneciana, singapur, rolo, forzada.

---

## 13. Cómo trabajar con el dueño

- **Responder en español.**
- **No cambiar lo que no se pidió.** Revirtió un re-skin completo por eso.
- **"En Venezuela a la gente no le gusta leer":** todo masticado.
- Tráfico casi todo móvil desde Instagram. Mobile-first no es preferencia, es el
  caso principal.
- Cuando algo choca con la funcionalidad, **preguntar antes de romperla**.
- Prefiere que se trabaje en paralelo sin quedarse trabado: si algo se bloquea,
  anotarlo y seguir con lo demás.
