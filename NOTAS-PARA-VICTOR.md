# Lo que hice anoche y lo que necesito de ti

> Sesión del 3 al 4 de septiembre de 2026. Todo está en la rama
> `feat/casa-laksmy`, commit a commit, y la página corre en
> `http://127.0.0.1:4321`.

---

## 1. Lo primero que quiero que mires

Abre la página y baja al catálogo. **Las 153 piezas están integradas**, con foto,
y cada ficha tiene la galería de las otras tomas.

Tres cosas que cambié por lo que me dijiste, y quiero que me digas si acerté:

**La portada de cada pieza ahora es la toma del medio.** Comparé las tres tomas de
varios anillos y el patrón de tu sesión fue: 1ª cenital (el anillo acostado),
2ª de pie, 3ª invertida con la piedra abajo. La del medio es la única que enseña
el anillo puesto de pie con la piedra entera y el perfil. Era exactamente lo que
pedías.

**El centrado.** Me costó cuatro intentos. Lo que ganaba la detección no era la
joya sino el listón tostado del expositor — o peor, la frontera entre el listón
y el cuero negro, que es donde hay más contraste de toda la foto. Sólo lo vi
cuando dibujé la caja detectada encima de la foto. La solución fue dejar de
buscar "la joya" y buscar **la piedra**: es el punto más saturado del cuadro y
el expositor no tiene nada parecido. 131 de 153 piezas se encuadran así.

**El hero.** Fuera la foto de Unsplash. Puse una tuya: la cadena de eslabón
marino sobre el expositor. Dejé lista una segunda opción con el anillo de grado
de zafiro (`assets/img/hero-anillo-grado-zafiro.jpg`) por si la prefieres — se
cambia una línea y te dejé escrito cuál.

---

## 2. Lo que necesito que me contestes

### a) Los pesos en gramos — es lo que desbloquea todo

**Ninguna pieza tiene precio.** Todas dicen "Consultar" porque no tengo el peso
real de ninguna y no pienso inventar una cifra: un precio equivocado en joyería
no es un detalle.

Con que me des el peso de **una pieza por tipo y medida** ya puedo calcular el
resto por proporción:

| Necesito | Ejemplo de lo que espero |
|---|---|
| Anillo de grado 6x8 en oro 10k | ¿5 g? ¿7 g? |
| El mismo modelo en 4x3 y en 10x12 | para saber cuánto sube por medida |
| Cadena de eslabón marino 6x8, 45 cm | |
| Zarcillo 6x8 el par | |

Si prefieres darme el **precio directo** en vez del peso, también sirve — pero
con el peso el precio se actualiza solo cuando cambia el oro, y con precio fijo
hay que tocarlo a mano cada semana.

### b) El color de cada piedra — 141 piezas por confirmar

Los colores los leí **de las fotos**, no de tu inventario. Están en `catalogo.js`
como `piedra:"rojo"`, `piedra:"azul"`, etc. Esto importa de verdad: una graduanda
de Medicina filtra por amarillo y si el anillo está mal etiquetado, no lo ve.

Intenté detectarlos automáticamente y **no llegué a fiable** (acertaba 8 de 16),
así que los puse a ojo. Repásalos.

Cuatro piezas tienen piedra **verde** y el verde ya no corresponde a ninguna
carrera desde que arreglamos el mapa de colores. Las dejé sin etiqueta: dime a
qué carrera van o si esas se venden como "cualquiera".

### c) Clásicos y modernos — la clasificación está a medias

Hice el selector que pediste: dos botones dentro de Anillos de Grado, que además
se combinan con el filtro de color.

**Pero el reparto de qué pieza es clásica y cuál moderna no es de fiar.** Lo hice
contando destellos de circonita en la foto, y la distribución salió continua
(71 / 103 / 133 destellos): no hay dos grupos separados, es un degradado. Quedaron
59 clásicos y 39 modernos, y seguro hay errores.

Lo que dijiste de las **4 o 5 fotos desaparecidas** cuadra: en la secuencia faltan
`IMG_8945`, `8946`, `8947` y `8948` — **cuatro seguidas**, justo el bloque del
antes y después. Si las tienes en el teléfono, mándamelas y con esas dos
referencias clasifico las 98 en un rato.

Mientras, la forma rápida: abre la página, filtra por "Modernos" y dime cuáles
están mal puestos.

### d) El nombre de cada modelo

Ahora se llaman "Anillo de Grado Granate 01", "Anillo de Grado Zafiro 04"… es un
nombre de relleno. En las fotos se leen carreras y universidades grabadas
(UCSAR, UNEFA, UPTAMCA, Policía Nacional, Medicina, Psicología, Cirujano…). Si me
pasas la lista de qué modelo es cuál, las fichas dejan de ser genéricas — y eso
es justo lo que busca una graduanda: ver el anillo de SU universidad.

### e) Bluecast

La sección está hecha pero vacía de datos: faltan presentaciones, referencias y
precios de la resina.

### f) El Instagram nuevo

Cuando crees la cuenta, pásame el usuario. En el pie está sin arroba.

---

## 3. Lo que investigué de precios en el mercado venezolano

Me pediste que no saliera del país. Lo que encontré, y una advertencia.

**El oro.** El 18k en Venezuela se cotiza sobre **$73–74 el gramo** (agosto de
2026). **Cuidado con ese número**: es precio de *compra* — lo que te pagan a ti
por tu oro. El spot internacional está en $4.341 la onza, que son $139,6 el gramo
de oro 24k puro; el 18k puro vale $104,7 el gramo. Nadie vende joya terminada por
debajo del valor del metal.

**Nadie publica precios.** Ni [tugraduacion.com.ve](https://www.tugraduacion.com.ve/productos/anillos-de-graduacion-grado-mujer-hombre-oro-plata.html)
ni [Joyas Villa de Oro](https://joyasvilladeoro.com/) ponen precio a los anillos
de grado: todos cotizan. Eso valida lo que hicimos con el "Consultar" — no
quedamos raros, quedamos como el resto del mercado.

**Un precio de competidor directo:** [@alianzas_alcala](https://www.instagram.com/alianzas_alcala/),
fabricantes en Caracas, publican **anillo de grado tipo joya en plata a $169**.

**Cómo vende el competidor más parecido a ti** ([tugraduacion.com.ve](https://www.tugraduacion.com.ve/productos/anillos-de-graduacion-grado-mujer-hombre-oro-plata.html)):
medidas estándar 6x4 / 6x8 / 10x12, los circones alrededor de la piedra se cobran
aparte, cobran el 100% por adelantado, 25 a 30 días hábiles y **no envían por
agencia**. Ahí tienes tres ventajas que puedes decir en voz alta: tus 14 días,
tus envíos a todo el país, y que no cobras todo por adelantado.

### ⚠️ Y una advertencia sobre tu motor de precio

Haciendo las cuentas me salió esto y creo que importa:

> Con los parámetros de `catalogo.js` (oro a $4.341 la onza y **$45 el gramo de
> mano de obra**), un anillo de grado de 6,5 g en oro 10k daría **≈ $695**.
> De eso, **$292 son mano de obra** — más que el oro que lleva.

Compáralo con los $169 que cobra Alianzas Alcalá por uno en plata y con lo que
cobras tú de verdad. Si el número te parece alto, el sospechoso es la mano de
obra por gramo: en un anillo de grado la hechura suele cobrarse **por pieza**, no
por gramo, porque el molde ya existe y hacer el número 40 cuesta lo mismo que
hacer el número 2.

**Dime cuánto cobras de hechura por un anillo de grado** y lo ajusto. Puede ser
la diferencia entre parecer caro y parecer justo.

---

## 4. Lo que arreglé de paso

Los 7 hallazgos del banco de pruebas que te reporté hace días **ya están
arreglados**, porque tuve que tocar ese código igual:

1. El nombre del producto ya no ejecuta código (`esc()` en la tarjeta).
2. La foto del modal tampoco (`esc()` en `src` y `alt`).
3. Renombrar una categoría en `catalogo.js` ya no rompe el catálogo: se valida
   que exista antes de activarla.
4. El selector muerto `$$(".tab")` ahora es `.cat`.
5. Fuera el resto de `#wabar`, que lanzaba un `TypeError` en cada scroll.
6. `#modalAdd` ya no revienta si no hay pieza abierta.
7. `piezasDe()` devuelve siempre un array.

**El simulador de clientes corrió 3.120 acciones en 320, 375 y 1280 píxeles:
cero fallos y cero errores de consola.** Es la primera corrida completamente
limpia desde que existe el banco.

---

## 5. Cosas que dejé anotadas y no toqué

- **Peso de la página.** Cada tarjeta carga una miniatura de 29 KB en vez de la
  foto de 800 px, así que la primera pantalla son 173 KB en vez de 680 KB. Para
  un teléfono en Venezuela eso son varios segundos.
- **23 piezas** no tienen piedra que detectar (bandas lisas, cadenas, pulseras) y
  usan el encuadre de respaldo. Algunas quedaron menos centradas: `grado-013`,
  `grado-021`, `grado-022`, `grado-042`, `grado-045`, `grado-110`, `grado-112`,
  `grado-120`, `grado-141`, `grado-142`, `grado-144`, `anillo-084`, `anillo-092`,
  `anillo-097`. Si me dices cuáles te molestan, las recorto a mano.
- **`IMG_8777.PNG`** era una captura de pantalla de la galería del teléfono, no un
  producto. Descartada.
- **`IMG_9173` y `IMG_9174`** salieron vacías: son fotos del expositor sin pieza.
  No estaban movidas, estaban vacías.
- **Aros de Boda y Dijes** aparecen con 0 piezas porque no las fotografiaste.
- **`GUIA-FOTOGRAFIA.md`** sigue borrada. Se recupera con
  `git show 76e8fb6:GUIA-FOTOGRAFIA.md > GUIA-FOTOGRAFIA.md`. Dime si la quieres.

---

## 6. Para más adelante

- **Prompt de Instagram.** Lo dejaste para después: un prompt con todo el contexto
  de la página para que salgan posts que suenen a equipo de marketing y no a la
  dueña escribiendo. Cuando lo pidas lo armo.
- **Analítica.** Sigue faltando pegar el ID de Umami.
- **Publicar.** El paquete se arma con `bash HERRAMIENTAS/publicar.sh`.
