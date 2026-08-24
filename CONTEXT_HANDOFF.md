# Traspaso de contexto — Laksmy

> Documento autocontenido para una sesión nueva de Claude Code sin memoria previa.
> Todo lo aquí descrito está verificado contra el código a 10 de agosto de 2026.

---

## 1. Resumen del proyecto

**Qué es:** landing comercial de **Laksmy**, joyería y taller de orfebrería en el
centro de Caracas, Venezuela. Negocio real en marcha (~$10.000/mes de facturación)
que hoy vende por Instagram (`@inv.laksmy`) y WhatsApp.

**Para quién:** dos públicos, con pesos muy distintos.
- **B2C (el grueso):** clientas particulares, sobre todo graduandas buscando su
  anillo de grado. Llegan desde Instagram, **casi siempre desde el teléfono**.
- **B2B (derivada real, no debe opacar al B2C):** otras joyerías que necesitan
  servicios de orfebrería. Cliente de referencia: **GoldToday** (Sambil Chacao y
  C.C. Cerro Verde). También son **proveedores autorizados de resina Bluecast**
  para Venezuela, importada de Europa.

**Objetivo único de la web:** que quien llega termine escribiendo por WhatsApp.
No hay pasarela de pago ni checkout, y no se va a añadir.

**Stack:** HTML + CSS + JavaScript puro. **Sin framework, sin build step, sin
dependencias externas en tiempo de ejecución.** Un `index.html` (2.438 líneas,
con CSS y JS embebidos) + `catalogo.js` (104 líneas) + fuentes y fotos locales.
Se sirve como archivos estáticos.

**Estado:** funcional y desplegable. Falta lo que depende del dueño (fotografía
propia, logo) y conectar analítica.

---

## 2. Arquitectura y estructura de archivos

```
/Users/victor/Desktop/Nuevo proyecto pagina /
├── index.html                    TODO el sitio: markup + <style> + <script>
├── catalogo.js                   ← ÚNICO archivo que edita la dueña
├── assets/
│   ├── fuentes.css               @font-face de las 3 familias
│   ├── fuentes/                  5 .woff2 (88 KB, subconjunto latino)
│   ├── img/                      6 fotos EN USO
│   │   └── descartadas/          15 fotos rechazadas — NO referenciar
│   └── IMAGENES.md               manifiesto: qué foto es de qué pieza y por qué
├── PUBLICAR/                     paquete listo para Hostinger (se regenera)
├── estambul-web.zip                el mismo paquete comprimido
├── ACTUALIZAR-CATALOGO.md        guía para la dueña: precios y productos
├── GUIA-FOTOGRAFIA.md            cómo fotografiar las 34 piezas
├── MEDICION.md                   cómo conectar analítica (falta pegar el ID)
├── DESIGN.md                     tokens, tipografía, motor de precio
├── AUDITORIA.md                  bugs, flujo de compra, exposición legal
└── .claude/launch.json           servidor local: python3 -m http.server 4321
```

### Flujo de datos

```
catalogo.js  ──►  GRADO[] + REGISTRO{}  ──►  reconstruirIndice() ──► INDICE[]
                                                     │
                            tarjeta(p, i) ◄──────────┤  (data-i = índice)
                                                     │
   clic en .card ──► abrirModal(INDICE[i]) ──► sel{} ──► calcular(p, sel)
                                                     │
                              resumen(sel) ──► mensaje() ──► waLink() ──► WhatsApp
```

`INDICE` es un array plano que mezcla los anillos de grado visibles y las piezas
de la categoría activa. **Se reconstruye entero en cada pintado**, nunca se
acumula (ver bug #2).

### Convenciones

- **Todo el color vive en `:root`.** Ningún hex literal fuera de ahí.
- **Comentarios en español**, explicando *por qué*, no *qué*. Varios documentan
  bugs ya resueltos para que nadie los reintroduzca.
- **Clases BEM-ish**: `.bloque__elemento--modificador`.
- Nombres de funciones y variables en español (`pintarGrado`, `piedraActiva`).

---

## 3. Decisiones técnicas tomadas

### Stack: HTML/CSS/JS puro
**Por qué:** el sitio es una landing con un catálogo pequeño y cero backend. Un
framework añadiría build step y dependencias que la dueña no puede mantener.
**Descartado:** React/TanStack (se llegó a migrar en otra sesión; se volvió al
estático a petición del usuario), Shopify (no aporta: no hay checkout).

### `catalogo.js` separado del `index.html`
**Por qué:** la dueña debe poder subir el precio del oro y añadir productos sin
tocar código de la página. Es el archivo que se sube casi siempre (6 KB).
**Descartado:** JSON con `fetch` — rompería el `file://` y añadiría una petición.

### Precio calculado en el navegador, nunca desglosado
```js
precio = gramos_ajustados × pureza × spot_metal
       + gramos_ajustados × mano_de_obra
       + extras
```
La interfaz **sólo muestra el resultado**. Nunca el gramaje, el spot ni la mano
de obra por separado — decisión explícita del negocio.

### Paleta: cero dorado en la interfaz
**Por qué:** anti-patrón verificado en la investigación de referencias — el oro
en botones y tipografía compite con el producto y el metal deja de destacar.
El único color de acción es **Lacre `#96202F`**, el rojo de la cera de sellar.

### Fondo plata fría (`#E9ECEA`), no marfil
**Por qué:** un neutro de sesgo frío hace saltar el amarillo del oro por
contraste simultáneo. El crema tibio lo apaga, y además es el fondo del cluster
visual genérico que se quería evitar.

### Tipografía: Instrument Serif + Instrument Sans + DM Mono
**Descartadas a propósito:** Montserrat (default de plantillas Shopify),
Poppins y Jost/Futura (las usan las referencias directas), Cormorant.
**Autoalojadas** desde `assets/fuentes/`: cero dependencia de Google.

### "Ver más" en tandas de 6, nunca carrusel ni scroll infinito
**Por qué:** investigación citada en `AUDITORIA.md`. Sólo ~1% de la gente
desliza un carrusel y el 84% de esos clics se quedan en la primera lámina — con
90 anillos, esconderías 89. El botón hace que se vean *más* piezas.

### WhatsApp: `href` en `wa.me`, apertura por JS a la URL directa
Ver bug #6. Es la decisión menos obvia del proyecto.

### Entorno
**No hay `.env`, ni credenciales, ni servicios externos.** El único dato
sensible-ish es el número de WhatsApp, que es público por definición:
`const WA = "584242765908"` en `index.html`.

---

## 4. Historial de trabajo realizado

Orden de secciones en la página (los `01—07` son visibles en pantalla):

| # | Sección | `id` | Estado |
|---|---|---|---|
| — | Hero con foto a sangre, lema y 3 pruebas | — | ✅ |
| — | El Espectro (filtro por color de piedra) | `espectro` | ✅ |
| 01 | Anillos de Grado | `grado` | ✅ falta fotografía |
| 02 | Catálogo (6 categorías + Recién llegados) | `registro` | ✅ falta fotografía |
| 03 | Tu talla (calculadora) | `talla` | ✅ |
| 04 | Cómo comprar (pago, envíos, plazos, tienda) | `comprar` | ✅ |
| 05 | Valor refugio (gráfico del oro) | `refugio` | ✅ |
| 06 | Fuera de catálogo (pieza a medida) | `taller` | ✅ |
| 07 | Para joyerías (GoldToday + Bluecast) | `b2b` | ✅ |

### Features implementadas

**El Espectro** — 7 piedras que codifican grupos de carreras. Al tocar un color
se despliega un panel con el nombre de la piedra, las carreras que agrupa, su
significado, y un botón que baja al catálogo filtrado. **El filtro no esconde
nada**: debajo quedan 4 modelos del resto + botón "Ver los N modelos".

**Modal de personalización** — campos según `CAMPOS[tipo]`:
```js
grado:    material, color, talla, piedra, grabado
anillo:   material, color, talla, piedraOpc, acabado, grabado
aro:      material, color, talla, piedraOpc, acabado, grabado
cadena:   material, color, largo(45/50/60/70cm), acabado
pulsera:  material, color, largoP(17/18/19/20cm), acabado, grabado
zarcillo: material, color, acabado
dije:     material, color, piedraOpc, grabado
```
Precio en **barra fija al pie** con el material nombrado al lado y destello al
recalcular. El aviso de copias en plata gratis vive dentro de esa barra.

**Calculadora de talla** — dos modos (medir un anillo / medir el dedo).
Fórmula del estándar americano: `circunferencia = 36,5 + talla × 2,55`.
Tallas 4 a 15. Redondea al medio punto y recomienda la entera.

**Pedido** — panel lateral, persiste en `sessionStorage` (`laksmy.pedido`),
compone un solo mensaje de WhatsApp con todas las piezas y el total.

**Índice lateral** — menú de tres líneas arriba a la izquierda, con las
categorías y los tres mensajes que no deben perderse (pieza a medida, valor
refugio, taller B2B).

**Recién llegados** — pestaña virtual que junta las piezas con `nuevo:true`.
Si no hay ninguna, la pestaña desaparece sola.

**Analítica** — `medir()` emite 7 eventos (`whatsapp`, `abre_ficha`,
`filtra_piedra`, `agrega_pedido`, `calcula_talla`, `ver_mas`,
`abre_calculadora_talla`) y el cargador de Umami ya está puesto; falta el ID.

---

## 5. Bugs y problemas resueltos

### #1 — XSS por el campo de grabado *(seguridad, explotable)*
**Síntoma:** escribir `x" onfocus="alert(1)` en el grabado inyectaba un atributo
vivo en el DOM. **Verificado explotable** antes del fix.
**Causa:** `value="${sel.grabado}"` sin escapar dentro de `innerHTML`.
**Fix:** helper `esc()` aplicado a todo lo que venga del cliente.
```js
const esc = v => String(v ?? "").replace(/[&<>"']/g, c =>
  ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
```

### #2 — `INDICE` crecía sin límite
**Síntoma:** tras 10 cambios de pestaña pasaba de 14 a 54 entradas y seguía.
**Fix:** `reconstruirIndice()` lo rehace entero en cada pintado.

### #3 — `sessionStorage` corrupto tumbaba la página entera
**Síntoma:** un objeto en vez de array, nulos o campos faltantes lanzaban una
excepción **al cargar** y el catálogo no aparecía.
**Fix:** `sanearCarrito()` valida entrada por entrada, trunca a 120/300 chars y
topa en 50 piezas. Probado contra 17 formas de corrupción.

### #4 — Franja muerta a la derecha en móvil
**Síntoma:** en 375 px aparecía una banda vacía de 72 px **en todas** las
secciones. **Causa:** la barra de navegación medía 447 px y empujaba el
documento entero. **Fix:** en `≤700px` se compacta (gap 24→8, "CARACAS" oculto,
botón de pedido a icono + número).

### #5 — Desbordamiento a 320 px
**Causa raíz no obvia:** la **tabla de tallas** tiene 273 px de ancho mínimo y
inflaba la pista del grid. `overflow-x:auto` **no basta** sin `min-width:0` en
los hijos del grid.

### #6 — WhatsApp: "la API de WhatsApp está bloqueada" *(el más importante)*
**Síntoma:** los botones parecían muertos, o WhatsApp respondía que la petición
estaba bloqueada.
**Causa raíz:** `wa.me` **no es WhatsApp, es un redirector** — salta a
`api.whatsapp.com` y de ahí a la app. Ese salto intermedio es lo que bloquean
los iframes, el navegador interno de Instagram/Facebook y algunas redes.
**Fix en dos capas:**
1. `target="_blank" rel="noopener noreferrer"` en los 15 enlaces del markup.
2. Manejador delegado que abre la **URL directa** según dispositivo:
```js
function urlWhatsApp(texto, movil){
  movil = movil === undefined ? esMovil() : movil;
  const t = texto ? "&text=" + encodeURIComponent(texto) : "";
  return movil
    ? "whatsapp://send?phone=" + WA + t              // abre la app
    : "https://web.whatsapp.com/send?phone=" + WA + t; // sin interstitial
}
```
Con cadena de 4 respaldos: pestaña nueva → salir del iframe → mismo marco →
`wa.me`. **El `href` se queda en `wa.me` a propósito**: funciona sin JS y se
puede copiar y pegar.

### #7 — Contenido invisible si el JS fallaba
**Causa:** `.reveal{opacity:0}` incondicional.
**Fix:** el ocultado cuelga de una clase `.js` que sólo se añade si hay
JavaScript. Además se revela lo que quedó por encima del viewport al llegar por
un enlace del índice.

### #8 — `requestAnimationFrame` no se ejecuta en pestañas en segundo plano
**Gotcha que costó tiempo.** El scroll suave depende de rAF y **fallaba en
silencio**. `irA()` tiene red de seguridad: si a los 120 ms no se movió, salta
directo. También descuenta la altura del nav fijo, que `scrollIntoView` ignora.

### #9 — Intervalo huérfano lanzando un error cada 1,6 s
Restos de un hero anterior corriendo sobre `$$(".hero__k")` vacío.

### #10 — El lema de marca desapareció
*«Piezas que se heredan, no que pasan de moda»* se perdió en un rediseño del
hero y estuvo ausente varias iteraciones. **Es un elemento de marca cerrado.**

### Otros gotchas
- El foco que devuelve el modal al cerrarse **arrastra el scroll**. Para navegar
  a otra sección hay que poner `ultimoFoco = null` antes de `cerrarModal()`.
- `.modal__box` **no puede llevar `overflow:hidden`** o el pie fijo del precio
  deja de pegarse.

---

## 6. Problemas conocidos / pendientes

| Pendiente | Detalle |
|---|---|
| **Fotografía propia** | 29 de 34 piezas sin foto usable. De 16 originales sólo 5 pasaron auditoría; las demás tenían marca de agua del modelo, ícono de Instagram o la pieza cortada. Ver `GUIA-FOTOGRAFIA.md`. |
| **Foto del hero es de referencia** | Unsplash, licencia libre con uso comercial. Registrada en `assets/IMAGENES.md`. Sustituir por una propia. |
| **Logo** | La marca es sólo tipográfica. Los sellos "CL" (Casa de Ley) están en `descartadas/` porque el nombre cambió. |
| **Analítica: falta el ID** | Medidor decidido (Umami) y cargador puesto. Falta que el dueño cree la cuenta y pegue el Website ID. Cloudflare Web Analytics quedó **descartado**: no tiene eventos personalizados y perdería los 7 eventos. Ver `MEDICION.md`. |
| **Spot del metal manual** | Se edita a mano en `catalogo.js`. Sin backend no hay automatización posible. Recomendado revisar semanalmente + margen del 3-5%. |
| **Pesos en gramos** | Estimados y confirmados "por ahora" por el dueño. Es lo único que separa el precio mostrado del real. |
| **Mano de obra de plata** | $10/g es supuesto propio ($45/g de oro sí es dato del dueño). |
| **Agregar la misma pieza dos veces** | Se duplica en vez de sumar cantidad. Menor. |
| **`descartadas/`** | 1,9 MB que no deben subirse a producción. |

### Exposición legal (Venezuela) — ver `AUDITORIA.md`
- Los precios pueden referenciarse en USD, **pero debe aceptarse pago en
  bolívares a tasa BCV** y **la factura debe emitirse en Bs** (Art. 318 CRBV +
  Ley Orgánica de Precios Justos). Ya hay avisos en el pie y en el modal.
- Usar tasas paralelas para facturar acarrea sanciones graves.
- **La sección de valor refugio no puede prometer rendimientos.** Está redactada
  como dato histórico con descargo explícito. No convertirla en promesa.
- Nombrar a GoldToday como cliente: conviene su consentimiento.

---

## 7. Próximos pasos

1. **Pegar el ID de Umami** — la herramienta ya está decidida y el cargador ya
   está en `index.html` (bloque `MEDIDOR — Umami`, al final). Sólo falta crear
   la cuenta en `cloud.umami.is` y pegar el Website ID. Paso del dueño.
2. **Propuesta nueva del hero** — el dueño pidió investigación a fondo de
   referencias del sector para la primera impresión, con foco móvil.
   **Quedó pendiente, nunca se entregó.**
3. **Cargar el catálogo real** — ~90 anillos de grado más el resto. Con ese
   volumen, el filtro por color pasa de detalle a herramienta principal.
4. **Fotografía** — sesión pendiente del dueño.
5. **Publicar** — el paquete está listo. Falta SSL, GZIP y caché en hPanel.

---

## 8. Comandos y flujo de trabajo

```bash
cd "/Users/victor/Desktop/Nuevo proyecto pagina "
python3 -m http.server 4321        # o preview_start con .claude/launch.json
```

**No hay `npm install`, ni build, ni tests automatizados en el repo.**

### Simulador de clientes (herramienta custom)

Se construyó un fuzzer que simula clientes reales: 26 acciones posibles
encadenadas al azar, con 10 invariantes comprobados tras cada una (desbordamiento,
precio válido, total = suma de piezas, contador sincronizado, sin HTML inyectado,
fondo desbloqueado, imágenes, enlaces de WhatsApp).

**Resultados acumulados: 1.350 clientes, ~31.560 acciones, 0 fallos** en seis
tamaños (320, 375, 390, 414, 844×390 horizontal, 1280).

⚠️ **Ejecutarlo siempre con viewport fijado.** Si el panel está colapsado,
`clientWidth` es 0 y **todo** se reporta como desbordamiento (73.541 falsos
positivos en una corrida).

El código del simulador no quedó en el repo; se reconstruye desde `AUDITORIA.md`.

### Regenerar el paquete de publicación
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

## 9. Contexto de negocio / producto

- **Tráfico casi todo móvil**, desde Instagram. Mobile-first no es preferencia:
  es el caso principal.
- **"En Venezuela a la gente no le gusta leer."** Todo lo más masticado posible.
  Se hizo una pasada de economía de palabras (1.547 → ~1.175 palabras).
- **Los clientes van a la TIENDA** a ver anillos y probarse tallas. Al **taller**
  sólo van joyerías. Confundir ambos fue un error corregido; no reintroducirlo.
- **El taller B2B debe estar siempre visible pero nunca opacar al B2C.**
- **Grabado interno: gratis.** No suma al precio (decisión del 10 ago 2026).
- **Copias en plata incluidas** al comprar un anillo de grado en oro.
- **Si el anillo queda apretado, se agranda sin costo.** Se pide justo antes que
  grande porque agrandar es fácil y achicar cuesta más.
- **Plazo: 14 días máximo** para un anillo de grado, con puerta abierta a
  emergencias.
- **Pago:** pago móvil, transferencia, Zelle, efectivo, Binance.
- **Envíos a todo el país.**
- **Tienda:** Minicentro París, frente a la Asamblea Nacional, a dos cuadras de
  la Plaza Bolívar, centro de Caracas.
- **Nombre:** **Laksmy** (antes "Casa de Ley"). Legal: Inversiones Lakshmy 3000,
  C.A. Se dijo que habrá rebranding futuro.
- **Un solo número de WhatsApp** para tienda y taller, con 7 mensajes
  prellenados distintos según el botón de origen.

---

## Primeras preguntas que NO deberías hacerme

**No propongas ni preguntes por esto — ya está decidido y cerrado:**

1. **"¿Migramos a React/Next/Astro/Shopify?"** No. HTML/CSS/JS puro, sin build.
   Se probó TanStack Start y se volvió atrás a petición del dueño.
2. **"¿Añadimos pasarela de pago o carrito real?"** No. El único canal de
   conversión es WhatsApp.
3. **"¿Ponemos acentos dorados en botones o títulos?"** No. Cero dorado en la
   interfaz — el oro va en el producto.
4. **"¿Fondo crema/marfil o negro?"** No. Plata fría `#E9ECEA`.
5. **"¿Usamos Montserrat / Poppins / Jost?"** No, están descartadas a propósito.
6. **"¿Carrusel horizontal para el catálogo?"** No. Botón "Ver más" en tandas de 6.
7. **"¿Mostramos el desglose del precio (gramos, spot, mano de obra)?"** No.
   Sólo el resultado.
8. **"¿Rellenamos con fotos de stock las piezas sin foto?"** No. Ficha
   tipográfica. Una foto sucia es peor que un hueco limpio.
9. **"¿Cambiamos el lema?"** No. *«Piezas que se heredan, no que pasan de moda»*
   es elemento de marca cerrado.
10. **"¿Cobramos el grabado?"** No, es gratis desde el 10 de agosto de 2026.
11. **"¿Cambiamos `wa.me` por otra cosa en el `href`?"** No. El `href` se queda;
    la URL directa se usa sólo al abrir por JS. Ver bug #6.
12. **"¿Volvemos a poner los sellos CL?"** No, son de la marca anterior.
13. **"¿Ponemos scroll infinito?"** No.
14. **"¿Qué número de WhatsApp usamos?"** `584242765908`, ya está en el código.
15. **"¿Recreamos las decisiones de paleta/tipografía desde cero?"** No.
    Están documentadas en `DESIGN.md` con su justificación.

**Lo que sí puedes preguntar:** cualquier cosa sobre analítica (sin decidir),
la propuesta del hero (pendiente), o datos de negocio que no estén aquí.
