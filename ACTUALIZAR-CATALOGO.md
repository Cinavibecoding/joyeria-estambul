# Cómo actualizar la página tú misma

> Todo lo que cambia con el tiempo vive en **un solo archivo**: `catalogo.js`.
> No hay que tocar `index.html` para nada de esto.

---

## 1. Subir el precio del oro (hazlo cada semana)

Abre `catalogo.js`. Arriba del todo:

```js
const ORO_ONZA   = 4341.30;   // dólares por onza troy de oro
const PLATA_ONZA = 63.46;     // dólares por onza troy de plata
const SPOT = { ..., fecha:"7 ago 2026" };
```

Entra a **kitco.com**, copia el precio de la onza, pégalo, y cambia la fecha.
Guarda y sube el archivo. **Los 34 precios de la página se recalculan solos.**

La fecha sale visible en el pie de la página, así que el cliente ve cuándo se
actualizó por última vez.

> **Por qué importa:** el oro se movió +2,41% en un solo día mientras
> construíamos esto. Si sube 10% y la página no se actualiza, estás cotizando
> por debajo de tu costo en cada pieza.

---

## 2. Añadir una pieza nueva

Busca la categoría en `catalogo.js` y añade una línea. Por ejemplo, en Anillos:

```js
"Anillos":[
  {n:"Anillo Pavé Abierto", tipo:"anillo", g:4.5, acabado:"Pavé, pulido espejo"},
  {n:"Anillo Solitario",    tipo:"anillo", g:5,   acabado:"Garra alta", nuevo:true},   ← nueva
],
```

| Campo | Qué es |
|---|---|
| `n` | El nombre que ve la clienta |
| `tipo` | `anillo` · `aro` · `cadena` · `pulsera` · `zarcillo` · `dije` · `grado`. Decide qué opciones salen al personalizar (talla, largo, piedra…) |
| `g` | Peso en gramos. **De aquí sale el precio** |
| `acabado` | Cómo se ve. Aparece en la ficha |
| `nuevo` | `nuevo:true` la manda a "Recién llegados" con su sello rojo |
| `img` | Nombre del archivo en `assets/img/`. **Si no hay foto, no pongas nada** |

**Cuidado con `g`:** es lo único que separa el precio mostrado del precio real.
Pesa la pieza antes de publicarla.

---

## 3. "Recién llegados"

Ponle `nuevo:true` a una pieza y aparece automáticamente en la pestaña
**Recién llegados**, que es la primera del Registro y sale con un sello rojo.

- Si ninguna pieza tiene `nuevo:true`, **la pestaña desaparece sola**. No queda
  una sección vacía.
- Quita el `nuevo:true` cuando deje de ser novedad. La pieza se queda en su
  categoría normal.

Es todo. No hay que crear secciones ni mover nada.

---

## 4. Añadir la foto de una pieza

1. Mete el archivo en `assets/img/` con el nombre de la convención
   (`anillo-oro18-solitario-01.jpg`).
2. En `catalogo.js`, añade `img` y `alt` a esa pieza:

```js
{n:"Anillo Solitario", tipo:"anillo", g:5, acabado:"Garra alta",
 img:"anillo-oro18-solitario-01.jpg",
 alt:"Anillo en oro 18k con solitario en garra alta"}
```

**Regla que no se rompe:** si la foto tiene marca de agua, ícono de Instagram,
o la pieza sale cortada por el borde — **no la pongas**. La ficha tipográfica se
ve bien; una foto sucia no. Ver `GUIA-FOTOGRAFIA.md`.

---

## 5. Subir los cambios a Hostinger

Sube por FTP o por el gestor de archivos:

- `catalogo.js` ← el que cambias casi siempre
- `assets/img/` ← sólo si añadiste fotos
- `index.html` ← sólo si cambió el diseño

**Truco:** si sólo tocaste precios o productos, con subir `catalogo.js` basta.
Son 6 KB, tarda un segundo.

---

## 6. Si algo se rompe

El error más común es una **coma que falta o sobra**. La página se queda en
blanco o sin catálogo.

Cómo verlo antes de subir: abre `index.html` en el navegador, click derecho →
*Inspeccionar* → pestaña *Console*. Si hay un error de sintaxis te dice el
número de línea.

Regla de oro: **cada pieza va entre llaves `{}` y separada por coma, menos la
última de la lista.**

```js
"Dijes":[
  {n:"Dije Osito",   tipo:"dije", g:2.5, acabado:"Relieve"},   ← con coma
  {n:"Dije Corazón", tipo:"dije", g:2,   acabado:"Liso"}       ← la última, sin coma
],
```

Guarda siempre una copia del archivo anterior antes de cambiarlo.
