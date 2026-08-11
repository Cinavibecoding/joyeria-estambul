# Hallazgos — corrida del 11 de agosto de 2026

> 7 fallos encontrados. Ninguno lo puede provocar un cliente desde fuera:
> los tres graves salen de `catalogo.js`, que es el archivo que edita la dueña.
> **La página está a salvo de quien la visita; no está a salvo de quien la edita.**

## Cómo se probó

| Versión | Qué mete a presión |
|---|---|
| `prueba-hostil.html` | Nombres con comillas, `<`, HTML, emoji, 400 caracteres, y un `alt` con inyección |
| `prueba-vacio.html` | El día que se borra todo el catálogo mientras se reordena el archivo |
| `prueba-volumen.html` | Los ~90 anillos de grado que vienen + 84 piezas del resto |
| `simulador.js` | 26 acciones al azar encadenadas, 10 invariantes revisados tras **cada** acción |

**~7.000 acciones** en seis tamaños: 320, 375, 390, 414, 844×390 apaisado y 1280.

⚠️ Ejecutar siempre con el viewport fijado. Si el panel está colapsado,
`clientWidth` vale 0 y todo se reporta como desbordamiento.

---

## Lo que falla

### 1 · El nombre del producto ejecuta código — `index.html:1700`

```js
<h3 class="card__name">${p.n}</h3>     // ← sin esc()
```

Cuatro líneas más arriba, el mismo `p.n` **sí** se escapa para la ficha sin
foto. Es una inconsistencia, no una decisión.

**Comprobado:** un producto llamado `Anillo <img src=x onerror=...>` ejecuta el
código al pintar la tarjeta. Y sin malicia ninguna, `Anillo "Clásico" <Zafiro>`
se convierte en un elemento `<zafiro>` y el nombre se corrompe en pantalla.

### 2 · La foto del modal admite atributos vivos — `index.html:1940`

```js
`<img src="assets/img/${p.img}" alt="${p.alt}">`    // ← ninguno escapado
```

`tarjeta()` sí los escapa; el modal no. **Comprobado:** el DOM quedó con
`<img src="…" onerror="…" alt="foto" onload="…">`, atributos de evento reales.

### 3 · Renombrar una categoría rompe el catálogo — `index.html:2051`

El índice lateral trae las categorías **quemadas en el markup**
(`data-cat="Aros de Boda"`, `"Cadenas y Esclavas"`…) y el manejador las acepta
sin comprobar que existan:

```js
if(cat){ catActiva = cat; … pintarRegistro(); }   // ← nadie valida
```

`piezasDe()` devuelve `undefined` → `.slice` revienta → **el catálogo deja de
repintarse**: se queda con las piezas de la categoría anterior bajo el titular
equivocado.

Es el fallo más probable de los siete: pasa el día que la dueña abre
`catalogo.js` y escribe `"Aros"` donde antes decía `"Aros de Boda"`.
Reproducido de forma determinista en `prueba-volumen.html`.

### 4 · Selector muerto en ese mismo camino — `index.html:2052`

```js
$$(".tab").forEach(…)      // no existe ninguna .tab; la clase es .cat
```

Entrar a una categoría desde el índice cambia la rejilla pero deja marcada la
pestaña anterior.

### 5 · `TypeError` en cada scroll — `index.html:2445`

`$("#wabar")` devuelve `null`: ese elemento no existe desde que se quitó la
barra inferior. Salta en las seis corridas. Es el que ya se había limpiado y
volvió con el revert.

### 6 · `#modalAdd` sin guarda — `index.html:2300`

`calcular(actual, sel)` con `actual` en `null` si se pulsa antes de abrir
ninguna ficha. Un cliente no llega ahí — el botón está dentro de un modal
oculto — pero el manejador confía en un estado que nadie garantiza.

### 7 · El enlace de WhatsApp se pasa de largo

Con el carrito lleno (50 piezas, el tope que pone la propia página) el enlace
mide **11.142 caracteres**, de los cuales 6.340 son el mensaje. WhatsApp corta
los textos prellenados largos: la clienta cree que mandó el pedido completo y
llega a medias. El riesgo empieza sobre las 25–30 piezas; con 10 son ~1.300
caracteres y no pasa nada.

---

## Lo que aguantó

- **Grabado.** 10 cadenas de inyección distintas, ninguna ejecutó. El `esc()`
  del bug histórico sigue haciendo su trabajo.
- **`sessionStorage`.** 12 formas de corrupción (objeto en vez de array, JSON
  partido, nulos, totales de texto, negativos, 400 piezas, 1e308, HTML dentro
  del nombre): ninguna tumbó la página.
- **`INDICE` no crece.** 104 entradas con 90 anillos + 14 piezas, estable tras
  cientos de cambios de pestaña.
- **Cero desbordamiento horizontal** en los seis tamaños.
- **El total siempre es la suma** de las piezas, y el contador nunca pasó de 50.
- **Calculadora de talla** con `abc`, vacío, `-5`, `999`, `1e309`, `NaN`,
  `17,3`: ni un precio inválido en pantalla.
- **Catálogo vacío**: la página se pinta entera, sólo sin piezas.
