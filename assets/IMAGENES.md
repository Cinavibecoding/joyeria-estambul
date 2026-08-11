# assets/IMAGENES.md — Manifiesto de imágenes (Laksmy)

> Fuente única de verdad. Si un archivo no está en esta tabla, **no se usa en la web**.
> Ninguna imagen puede aparecer en dos filas distintas. Cero URLs externas: todo se
> sirve desde `assets/img/`.
>
> Actualizado tras la auditoría de calidad: se revisaron las 16 fotos de producto una
> por una y **11 quedaron fuera**. Regla nueva y firme: una tarjeta sin foto muestra su
> **ficha de especificación**, nunca una foto sucia, entrecortada o con símbolos encima.

---

## En uso — 5 fotos de producto

Todas pasaron la auditoría: pieza completa dentro del cuadro, sin marca de agua, sin
ícono de Instagram, sin franjas de borde.

| Archivo | Producto | Categoría | Alt text | Dónde se usa |
|---|---|---|---|---|
| `grado-oro-granate-09.png` | Anillo de Grado Granate | Anillos de Grado | Anillo de grado en oro 18k con piedra granate | Tarjeta + modal |
| `aro-oro-trenzado-par-01.png` | Par Alianzas Trenzadas | Aros de Boda | Par de alianzas de boda en oro 18k, trenzadas | Tarjeta + modal |
| `cadena-oro-mariner-doble-01.png` | Cadena Mariner Doble | Cadenas y Esclavas | Cadena en oro 18k, eslabón mariner doble | Tarjeta + modal |
| `dije-oro-osito-01.png` | Dije Osito | Dijes | Dije en oro 18k en forma de osito | Tarjeta + modal |
| `dije-oro-medallon-grecas-01.png` | Dije Medallón Grecas | Dijes | Dije en oro 18k, medallón con grecas | Tarjeta + modal |

**Limpieza aplicada:** a las 5 se les recortaron franjas planas de borde (restos de la
tarjeta del post de Instagram) por detección de filas/columnas de color uniforme.
A `aro-oro-trenzado-par-01.png` se le cortó además una franja blanca de 36 px a la derecha.

---

## Foto de referencia con licencia libre — 1

| Archivo | Origen | Licencia | Uso | Alt text |
|---|---|---|---|---|
| `hero-referencia-anillo-oro-solitario-01.jpg` | Unsplash, foto de Sabrianna, `photo-1598560917807` | **Unsplash License** — uso comercial permitido, sin atribución obligatoria | Panel del hero | Anillo de oro amarillo con piedra de talla esmeralda y banda en pavé |

**No es una pieza del catálogo.** Es una foto de referencia, descargada al repo (nunca
servida por URL externa) y verificada visualmente antes de usarse: es efectivamente un
anillo de oro, no una imagen aleatoria. Se recortó de 1600×1600 a 1020×1275.

**Se sustituye** en cuanto haya fotografía propia del hero — ver `GUIA-FOTOGRAFIA.md`.
Mientras esté, no debe usarse en ninguna tarjeta de producto: sólo en el hero.

---

## Marca

| Archivo | Uso | Estado |
|---|---|---|
| `marca-sello-monograma-cl-01.png` | Ninguno | ⚠️ Monograma **"CL"** = *Casa de Ley*. Con el nombre **Laksmy** ya no corresponde |
| `marca-sello-monograma-cl-02-circulo.png` | Ninguno | ⚠️ Mismo problema |
| `marca-sello-medallon-320.png` | Ninguno | Recorte circular con alfa del sello CL. Mismo problema |

**Pendiente de marca:** el nav usa hoy un wordmark tipográfico ("Laksmy" en Instrument
Serif) porque los tres assets de sello dicen CL. Hace falta rehacer el sello con la
inicial correcta antes de publicar.

---

## Descartadas — 11 fotos, en `assets/img/descartadas/`

No se borraron; se apartaron. **No referenciar ninguna.**

| Archivo | Motivo del descarte |
|---|---|
| `grado-oro-azul-01.jpg` | Código de modelo "C10X12YJ-1" quemado en amarillo sobre la foto |
| `grado-oro-amarillo-02.jpg` | Código "C10X12YJ-2" quemado |
| `grado-oro-rojo-03.jpg` | Código "C10X12YJ-3" quemado |
| `grado-plata-morado-04.jpg` | Código "C10X8YJ-1" quemado |
| `grado-plata-blanco-05.jpg` | Pieza cortada por el borde + artefacto blanco en esquina |
| `grado-plata-rosa-06.jpg` | Entrecortada, restos de recorte alrededor de la pieza |
| `grado-plata-multicolor-07.jpg` | Anillo cortado por los laterales del cuadro |
| `grado-plata-verde-08.jpg` | Anillo cortado por los laterales del cuadro |
| `grado-plata-amatista-10.png` | Entrecortada; se ve papelería de fondo, pieza diminuta |
| `anillo-oro-pave-abierto-01.png` | Ícono de "reproducir" de Instagram encima + borde del carrusel |
| `cadena-oro-eslabon-brunido-01.png` | Barra negra de artefacto en el borde superior |
| `hero-grado-oro-granate-01.jpg` | Derivado de hero, ya no se usa |
| `hero-grado-oro-granate-02.jpg` | Derivado de hero, ya no se usa |

---

## Productos con ficha de especificación — 29 tarjetas

Sin foto usable. En vez de un hueco, la tarjeta muestra: nombre en Instrument Serif
sobre el tinte del material, el acabado, y la leyenda `FOTOGRAFÍA EN TALLER`.
Es un formato legítimo, no un error.

| Categoría | Tarjetas sin foto | Fotos que faltan |
|---|---|---|
| Anillos de Grado | 9 de 10 | 9 |
| Anillos | 4 de 4 | 4 |
| Pulseras | 4 de 4 | 4 |
| Cadenas y Esclavas | 3 de 4 | 3 |
| Zarcillos | 4 de 4 | 4 |
| Dijes | 2 de 4 | 2 |
| Aros de Boda | 3 de 4 | 3 |
| **Total** | **29** | **29** |

**Se reemplazan cuando** haya fotografía propia. Sin excepciones: no se rellena con
foto de stock ni con la foto de otra pieza.

---

## Reglas — cerradas

1. **Prohibido inventar rutas o URLs.** Nada de Unsplash/Pexels/picsum servido por URL.
   Si se usa una foto con licencia libre, se **descarga al repo**, se **verifica
   visualmente** y se registra en este archivo con su licencia.
2. Cada imagen se usa **sólo** para el producto al que está asignada aquí.
3. **Ninguna imagen se repite** en dos tarjetas.
4. Producto sin foto usable → **ficha de especificación**, nunca la foto de otra cosa.
5. Foto con marca de agua, ícono de red social, franja de borde o pieza cortada por el
   cuadro → **se descarta**. Un hueco limpio es mejor que una foto sucia.
6. `alt` obligatorio y descriptivo: material + tipo de pieza + detalle.
7. Al terminar cualquier trabajo con imágenes, imprimir la tabla
   `archivo → producto → alt` para verificación.

---

## Verificación de la última pasada

- Rutas referenciadas en `index.html`: **6** — las 5 de producto + la de referencia del hero.
- Imágenes rotas: **0**.
- Peticiones de red a dominios externos de imagen: **0**.
- Imágenes repetidas en dos tarjetas: **0**.
