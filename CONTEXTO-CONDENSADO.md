# Contexto condensado — Joyería Estambul

> Documento autocontenido para iniciar una sesión nueva sin memoria previa.
> Verificado contra el código en el commit `c49ca8a`, rama `feat/casa-laksmy`.

---

## 1. Proyecto

**Nombre:** Joyería Estambul (antes *Laksmy*, antes *Casa de Ley*). Landing comercial de una joyería y taller de orfebrería en el centro de Caracas, Venezuela. Negocio real en marcha (~$10.000/mes) que vende por Instagram y WhatsApp.

**Stack:** HTML + CSS + JavaScript puro. **Sin framework, sin build step, sin dependencias en tiempo de ejecución.** Se sirve como archivos estáticos y funciona también desde `file://`.

**Ruta:** `/Users/victor/Desktop/Nuevo proyecto pagina /` (el espacio final del nombre es real). Repo git local, rama `feat/casa-laksmy`, sin remoto.

```
index.html          2.574 líneas — TODO el sitio: markup + <style> + <script>
catalogo.js         104 líneas — ÚNICO archivo que edita la dueña (precios y productos)
assets/fuentes.css  @font-face de Cormorant Garamond y Jost
assets/fuentes/     3 woff2 variables, subconjunto latino (87 KB)
assets/img/         5 fotos de producto + 1 del hero · descartadas/ NO se referencia
PRUEBAS/            banco de trampas y fuzzer — no se publica
PUBLICAR/           paquete estático + estambul-web.zip (se regeneran)
ACTUALIZAR-CATALOGO.md · AUDITORIA.md · MEDICION.md · DESIGN.md · CONTEXT_HANDOFF.md
```

**Convenciones:**
- Todo el color vive en `:root`. Ningún hex literal fuera de ahí.
- Comentarios en español explicando **por qué**, no qué. Varios documentan bugs resueltos para que nadie los reintroduzca.
- Clases BEM-ish (`.bloque__elemento--modificador`), funciones y variables en español.
- `esc()` sobre todo lo que venga del cliente antes de entrar en `innerHTML`.

**Preferencias del usuario — críticas:**
- Responder **en español**.
- **No cambiar lo que no se pidió.** Un re-skin completo ("Casa Laksmy") se ejecutó y se revirtió entero por petición suya; sólo sobrevivieron paleta y tipografía.
- Nada de migrar a framework, pasarela de pago ni carrito real. WhatsApp es el único canal de conversión.
- "En Venezuela a la gente no le gusta leer": todo masticado.
- Tráfico casi todo móvil desde Instagram.
- El taller B2B siempre visible pero **nunca opacando al B2C** (graduandas).

---

## 2. Estado actual

**Funciona y está terminado:** el sitio completo — hero, Espectro (filtro por color de piedra), catálogo con "Ver más" en tandas, modal de personalización con precio en vivo, calculadora de talla, sección de cómo comprar, gráfico del oro, taller a medida, B2B, Bluecast, pedido persistente en `sessionStorage`, y 15 enlaces de WhatsApp con 7 mensajes prellenados distintos.

**En progreso:** precios de anillos de grado **por tamaño de piedra** en vez de por gramo. Investigación hecha, implementación **bloqueada** esperando datos del dueño.

**Orden de secciones:** hero → `#espectro` → `#grado` → `#registro` → `#talla` → `#comprar` → `#refugio` → `#taller` → `#b2b` → `#bluecast` → footer.

**Últimos cambios (commits más recientes primero):**

| Commit | Qué |
|---|---|
| `c49ca8a` | El Espectro pasa de 7 a 8 piedras según la convención universitaria venezolana. `index.html` (`:root`, `ESPECTRO[]`, rejilla) y `catalogo.js` |
| `75ed467` | Rebranding a Joyería Estambul. `index.html`, `catalogo.js` |
| `dbfd8eb` | Panel del pedido con deslizamiento + sección Bluecast propia. `index.html` |
| `b1aa7a8` | Número de WhatsApp nuevo en 16 puntos. `index.html`, `DESIGN.md`, `CONTEXT_HANDOFF.md`, `PRUEBAS/*.html` |
| `d40a6d8` | Banco de pruebas: 3 catálogos trampa + 3 páginas + fuzzer + `HALLAZGOS.md` |
| `492a043` | Revert del re-skin, conservando sólo paleta y tipografía |

---

## 3. Decisiones tomadas

**Paleta y tipografía nuevas, todo lo demás revertido** → el usuario probó una dirección de arte completa ("Casa Laksmy": moldura de doble filete, grilla de simetría axial, home en cinco actos, hero de una sola idea, wordmark con filete de oro, monograma) y la descartó entera. Sobreviven los tokens de color y las dos familias tipográficas. Los commits `55c5665` y `a412905` siguen en la rama por si se quiere rescatar una pieza suelta.

**Los nombres de token no cambiaron, sólo sus valores** → así los 361 selectores del sistema anterior siguen funcionando sin tocar ninguno. `--field` es marfil, `--panel` es superficie, `--toque` es verde vitrina.

**`--ink-2` es el verde vitrina al 66%, no al 55%** → al 55% da 3,7:1 sobre marfil y no llega al AA de 4,5:1. Al 66% da 5,0:1 y a ojo es el mismo gris.

**DM Mono fuera; el token `--mono` apunta a Jost** → evita tocar las 17 reglas que lo usaban. Lo que la monoespaciada aportaba de verdad (columnas de cifras alineadas) lo da `font-variant-numeric: tabular-nums`, aplicado en 8 reglas.

**Fuentes autoalojadas, no Google Fonts** → una vuelta de red menos, sin exponer la IP de quien visita, y la página no se queda sin tipografía si Google no responde. Descartado: `<link>` a fonts.googleapis.com.

**Analítica: Umami, no Cloudflare** → **Cloudflare Web Analytics no tiene eventos personalizados**; con él se perderían los 7 eventos que la página emite, incluida la conversión (`whatsapp`). Umami Cloud Hobby es gratis, sin cookies (sin banner), ~2 KB, y `medir()` ya tenía la rama. Descartados: GA4 (50 KB + cookies), Plausible ($9/mes).

**El cargador de Umami inyecta el script sólo si hay ID** → con las comillas vacías no se pide nada a ningún servidor, en vez de dejar una etiqueta con un ID falso que daría error en cada visita.

**Colores del Espectro según la convención universitaria, no por gusto** → viene de Salamanca por vía colonial y es la que usan las universidades venezolanas, así que la graduanda llega buscando un color concreto. La investigación corrigió dos asignaciones del usuario: Farmacia y Odontología venían cruzadas (Farmacia es **morado**, Odontología **fucsia**), y Educación no va sola sino compartiendo **azul celeste** con Letras, Filosofía e Historia. Descartado: naranja para Farmacia — en la convención es Economía y Sociología.

**La razón social del pie NO cambia con el rebranding** → `Inversiones Lakshmy 3000, C.A. · RIF J-40677790-0` es la empresa registrada y el RIF cuelga de ella. Poner el nombre comercial ahí sería declarar en falso en el único renglón legal de la página.

**El formato de precio de vitrina se separó de `fmt()`** → `fmt()` alimenta sólo los mensajes de WhatsApp; cambiar la cadena que llega al chat no es un cambio de piel. (Esta decisión se revirtió con el re-skin pero el razonamiento sigue vigente si se vuelve a tocar el precio.)

**El velo del panel de pedido va en `::before`** → hay que animar su opacidad sin arrastrar la del panel, y como los pseudo-elementos no reciben eventos, el clic en el velo sigue llegando a `#pedido` y cerrar pulsando fuera funciona igual.

---

## 4. Problemas resueltos

**Resto muerto de `#wabar`** — Síntoma: `TypeError` en **cada evento de scroll**, consola llena. Causa: el elemento no existe desde que se quitó la barra inferior; sobrevivió `#wafab`. Ni `.wabar` ni `.is-hidden` tenían regla CSS. Solución: eliminar el bloque y repuntar el selector de `bloquearFondo()` a `.wafab`, que además arreglaba que el botón flotante no quedara `inert` con el modal abierto y el foco pudiera escaparse del diálogo. Archivo: `index.html`. **⚠️ Este arreglo VOLVIÓ ATRÁS con el revert — el bug está vivo otra vez.**

**Cloudflare no medía nada** — Síntoma: `MEDICION.md` recomendaba un medidor sin eventos personalizados. Causa: se eligió por peso y privacidad sin verificar la API. Solución: Umami + cargador condicional + `DEPURAR` que imprime en consola en `localhost`, `127.0.0.1` y `file://` **aunque ya haya medidor conectado**, para que el paso de comprobación del manual funcione siempre. Archivos: `index.html`, `MEDICION.md`.

**Pie del modal comiéndose la pantalla** — Síntoma: 285px de un viewport de 814, tapando las opciones que hay que tocar. Causa: el espaciado generoso del sistema aplicado a una barra de servicio. Solución: apretar padding y gap → 225px. (Revertido con el re-skin.)

**El panel del pedido se abría de golpe** — Síntoma: sin fluidez, a diferencia del índice lateral. Causa: `display:none` → `display:flex`, que no admite transición ninguna. Solución: patrón del índice (visibility + pointer-events + velo en `::before` + `translateX(100%)`), más `overflow:hidden` para que el panel aparcado fuera del borde no asome, y `transition:visibility 0s .38s` para que también el cierre se vea. Archivo: `index.html`.

**Piedra huérfana en el catálogo** — Síntoma: al remapear los colores, el modelo con `piedra:"verde"` apuntaba a una piedra inexistente. Solución: pasa a `celeste` y se renombra a juego. Archivo: `catalogo.js`.

---

## 5. Problemas abiertos

**Los 7 hallazgos del banco de pruebas** (`PRUEBAS/HALLAZGOS.md`). Ninguno lo provoca un cliente desde fuera: los tres graves entran por `catalogo.js`, el archivo que edita la dueña.

| # | Qué | Dónde |
|---|---|---|
| 1 | `${p.n}` sin `esc()` — el nombre del producto **ejecuta código**; 4 líneas arriba el mismo valor sí se escapa | `index.html` `tarjeta()` |
| 2 | `p.img` y `p.alt` sin escapar en el modal — el DOM queda con `onerror`/`onload` reales | `index.html` `abrirModal()` |
| 3 | `catActiva = cat` sin validar desde el índice lateral. Las categorías van **quemadas en el markup**; renombrar una en `catalogo.js` hace que `piezasDe()` devuelva `undefined`, revienta `.slice` y **el catálogo deja de repintarse** | `index.html` |
| 4 | `$$(".tab")` no existe (la clase es `.cat`): entrar por el índice deja marcada la pestaña anterior | `index.html`, mismo bloque |
| 5 | `#wabar` null → `TypeError` en cada scroll | `index.html` final del script |
| 6 | `#modalAdd` llama a `calcular(actual, sel)` sin guarda si `actual` es `null` | `index.html` |
| 7 | Con el carrito lleno (50 piezas) el enlace de WhatsApp mide **11.142 caracteres**; WhatsApp corta los prellenados largos. Riesgo desde ~25 piezas | `index.html` `pintarPedido()` |

**Documentación desincronizada:**
- `GUIA-FOTOGRAFIA.md` **fue borrada del disco** y el borrado quedó commiteado en `b1aa7a8`. Recuperable: `git show 76e8fb6:GUIA-FOTOGRAFIA.md > GUIA-FOTOGRAFIA.md`.
- `DESIGN.md` y `CONTEXT_HANDOFF.md` siguen describiendo el sistema viejo (plata fría `#E9ECEA`, lacre `#96202F`, Instrument Serif/Sans/DM Mono) y la marca vieja.
- `PRUEBAS/simulador.js` escribe en `laksmy.pedido`, pero el sitio lee `estambul.pedido`: la acción `corromperSesion` y el invariante del contador **ya no prueban nada**.

**Otros:**
- La piedra **fucsia (Odontología) no tiene ningún modelo** en `catalogo.js`: su filtro muestra 0.
- El **Instagram del pie quedó sin arroba** — falta el usuario de la cuenta nueva.
- Bluecast sin presentaciones, referencias ni precios.
- 29 de 34 piezas sin foto usable.
- Analítica sin conectar: falta pegar el Website ID de Umami.
- Spot del metal se edita a mano en `catalogo.js`; sin backend no hay automatización.
- Los pesos en gramos son estimados; la mano de obra de plata ($10/g) es un supuesto, la de oro ($45/g) sí es dato del dueño.
- Agregar la misma pieza dos veces la duplica en vez de sumar cantidad.
- `assets/img/descartadas/` son 1,9 MB que no deben subirse (ya excluidos del paquete).

---

## 6. Dependencias y configuración

**No hay `.env`, ni credenciales, ni servicios externos.** No hay `npm install`, ni build, ni tests automatizados en el repo.

- **WhatsApp:** `const WA = "584242765908"` (0424-276-5908). Público por definición.
- **Umami:** `var ID = ""` en el bloque `MEDIDOR` al final de `index.html`. Con las comillas vacías no se carga nada.
- **`.gitignore`:** `PUBLICAR/`, `*.zip`, `.DS_Store`.
- **Instalado durante la sesión:** `fonttools` y `brotli` vía pip, sólo para extraer el contorno de la "L" de Cormorant del woff2. No hacen falta para el sitio.
- **Servidor local:** `cd "/Users/victor/Desktop/Nuevo proyecto pagina " && python3 -m http.server 4321` → `http://127.0.0.1:4321`. Se cae al cerrar la terminal.

**Regenerar el paquete:**

```bash
rm -rf PUBLICAR estambul-web.zip
mkdir -p PUBLICAR/assets/img PUBLICAR/assets/fuentes
cp index.html catalogo.js PUBLICAR/
cp assets/fuentes.css PUBLICAR/assets/
cp assets/fuentes/*.woff2 PUBLICAR/assets/fuentes/
cp assets/img/*.jpg PUBLICAR/assets/img/     # NUNCA descartadas/
cd PUBLICAR && zip -qr ../estambul-web.zip .
```

---

## 7. Próximos pasos

1. **Precios por tamaño de piedra** (pedido explícito, bloqueado). Faltan del dueño: qué medidas maneja (dijo 4x8 y 8x12), el **peso en gramos de cada una** — o el precio directo, aunque con el peso el precio se actualiza solo con el oro — y si los circones se cobran aparte. Referencia del mercado: tugraduacion.com.ve publica "medidas estándar de 6x4 (pequeños), 6x8 (medianos) y 10x12 (grandes)", cobra los circones aparte y no publica precios.
2. **Restaurar `GUIA-FOTOGRAFIA.md`** desde git.
3. **Arreglar los hallazgos 1, 2 y 3** — son los que rompe la dueña editando su propio archivo.
4. **Etiquetar un modelo como fucsia** para que Odontología no muestre 0.
5. **Actualizar `DESIGN.md` y `CONTEXT_HANDOFF.md`** al sistema y la marca actuales.
6. **Sincronizar la clave de sesión del simulador** a `estambul.pedido`.
7. **Fotografía** de las 29 piezas que faltan.
8. **Pegar el ID de Umami** y publicar (falta SSL, GZIP y caché en hPanel).

**Advertencias para quien continúe:**
- **No proponer** migrar de stack, añadir pasarela de pago, carrusel, scroll infinito, ni desglosar el precio. Todo cerrado.
- **No reintroducir** los sellos "CL" (marca anterior).
- El foco que devuelve el modal al cerrarse **arrastra el scroll**: para navegar a otra sección hay que poner `ultimoFoco = null` antes de `cerrarModal()`.
- `.modal__box` **no puede llevar `overflow:hidden`** o el pie fijo del precio deja de pegarse.
- `requestAnimationFrame` **no corre en pestañas en segundo plano**: `irA()` tiene red de seguridad a los 120 ms.
- **Ejecutar el simulador siempre con viewport fijado.** Con el panel colapsado `clientWidth` vale 0 y todo se reporta como desbordamiento (73.541 falsos positivos en una corrida).
- `PRUEBAS/simulador.js` contiene un byte de control (un veneno ANSI) que hace que `grep` lo trate como binario y no imprima coincidencias. Usar `grep -a` o `sed`.
- **Aviso legal:** los precios pueden referenciarse en USD pero debe aceptarse pago en bolívares a tasa BCV y **facturarse en bolívares**. La sección de valor refugio **no puede prometer rendimientos**.

---

## 8. Fragmentos de código clave

**Apertura de WhatsApp — la decisión menos obvia del proyecto.** `wa.me` no es WhatsApp, es un redirector que salta a `api.whatsapp.com`; ese salto intermedio es lo que bloquean los iframes y el navegador interno de Instagram. El `href` se queda en `wa.me` a propósito (funciona sin JS y se puede copiar); la URL directa se usa sólo al abrir por JS, con cadena de respaldos.

```js
const waLink = texto => "https://wa.me/" + WA + (texto ? "?text=" + encodeURIComponent(texto) : "");

function urlWhatsApp(texto, movil){
  movil = movil === undefined ? esMovil() : movil;
  const t = texto ? "&text=" + encodeURIComponent(texto) : "";
  return movil
    ? "whatsapp://send?phone=" + WA + t                 // abre la app
    : "https://web.whatsapp.com/send?phone=" + WA + t;  // sin interstitial
}
```

**Motor de precio.** La interfaz sólo muestra el resultado — nunca el gramaje, el spot ni la mano de obra por separado.

```js
function pesoAjustado(p, sel){
  let g = p.g;
  if(sel.talla)  g *= 1 + (sel.talla - 7) * 0.045;   // ~4,5% por talla
  if(sel.largo)  g *= sel.largo / 45;
  if(sel.largoP) g *= sel.largoP / 18;
  return g;   // en aros y zarcillos el peso base ya corresponde al par
}
// precio = gramos_ajustados x pureza x spot_metal + gramos_ajustados x mano_de_obra + extras
```

**Saneado del carrito.** Lo guardado no es de fiar: probado contra 17 formas de corrupción.

```js
function sanearCarrito(raw){
  let datos;
  try{ datos = JSON.parse(raw); }catch{ return []; }
  if(!Array.isArray(datos)) return [];
  return datos
    .filter(it => it && typeof it === "object" && !Array.isArray(it))
    .map(it => ({
      n:     typeof it.n    === "string" ? it.n.slice(0,120)   : "Pieza",
      spec:  typeof it.spec === "string" ? it.spec.slice(0,300): "",
      total: Number.isFinite(+it.total) && +it.total >= 0 ? Math.round(+it.total) : 0
    }))
    .slice(0, 50);
}
```

**Escapado.** Cierra el XSS del campo de grabado, que fue explotable.

```js
const esc = v => String(v ?? "").replace(/[&<>"']/g, c =>
  ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
```

**Medición.** Emite 7 eventos: `whatsapp`, `abre_ficha`, `filtra_piedra`, `agrega_pedido`, `calcula_talla`, `ver_mas`, `abre_calculadora_talla`.

```js
const DEPURAR = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
             || location.protocol === "file:";

function medir(evento, datos){
  try{
    if(window.umami)          window.umami.track(evento, datos);
    else if(window.plausible) window.plausible(evento, {props: datos});
    else if(window.gtag)      window.gtag("event", evento, datos);
    if(DEPURAR) console.debug("[medir]", evento, datos);
  }catch(e){ /* medir nunca puede romper la página */ }
}
```

**Mapa del Espectro** (8 piedras, en `index.html`). Estructura de cada entrada: `{id, piedra, carrera, c, carreras[], sig}`.

| id | Piedra | Carreras |
|---|---|---|
| `azul` | Azul zafiro | Ingenierías, Informática, Arquitectura, Geología |
| `amarillo` | Amarillo citrino | Medicina, Bioanálisis, Enfermería, Nutrición |
| `rojo` | Rojo granate | Derecho, Ciencias Políticas, Contaduría, Administración |
| `morado` | Morado amatista | Farmacia |
| `fucsia` | Fucsia | Odontología |
| `celeste` | Azul celeste | Educación, Letras, Filosofía, Historia, Artes |
| `rosa` | Rosa turmalina | Diseño, Comunicación, Publicidad |
| `blanco` | Blanco cuarzo | Psicología, Ciencias básicas, comodín |

**Tokens** (`:root`): `--field:#F9F7F2` · `--panel:#EDE7DA` · `--toque:#16211C` · `--profundo:#070B09` · `--ink:#16211C` · `--ink-2:#636A65` · `--lacre:#6B1D2A` · `--oro:#B08A46` · `--plata:#A9AEA8`. Tipografía: `--display:"Cormorant Garamond"` · `--sans:"Jost"` · `--mono` apunta a Jost.
