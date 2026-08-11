# Cómo medir si la página funciona

> La página ya emite los eventos. Sólo falta pegar un ID.
> Tiempo de instalación: **5 minutos**. Costo: **$0**.

---

## 1. Qué medidor usar

**Umami, plan Hobby (gratis).** Ya está preparado en el código: sólo falta el ID.

| Opción | Precio | Peso | Cookies | ¿Mide los eventos? | |
|---|---|---|---|---|---|
| **Umami Cloud (Hobby)** | Gratis | ~2 KB | No | **Sí** | **La elegida** |
| Plausible | desde $9/mes | ~1 KB | No | Sí | Si algún día quieres más detalle |
| Google Analytics 4 | Gratis | ~50 KB | Sí | Sí | Pesa 25 veces más y obliga a poner aviso de cookies |
| Cloudflare Web Analytics | Gratis | ~1 KB | No | **No** | **Descartada.** Sólo cuenta visitas |

### Por qué NO Cloudflare

Cloudflare Web Analytics **no tiene eventos personalizados**: cuenta visitas y
poco más. Con él instalado sabrías cuánta gente entra, pero no cuánta escribe
por WhatsApp — que es justo lo único que importa aquí. Los siete eventos que la
página emite se perderían enteros.

Dicho eso: **poner el dominio detrás de Cloudflare sigue valiendo la pena** por
el HTTPS, la caché y la protección, todo gratis. Son dos cosas distintas y
pueden convivir. Lo que no sirve es su medidor.

### Instalar Umami

1. Entra a `cloud.umami.is` y crea la cuenta (gratis, sin tarjeta).
2. **Add website** → nombre `Laksmy` y el dominio.
3. Ve a **Settings → Websites → Edit** y copia el **Website ID**
   (una línea con guiones, tipo `3f2b9c10-...`).
4. Abre `index.html`, busca al final del archivo el bloque que dice
   **`MEDIDOR — Umami`**, y pega el ID entre las comillas:

   ```js
   var ID = "3f2b9c10-....";     /* ← pega aquí el ID */
   ```

5. Sube el archivo. Listo.

**Mientras las comillas estén vacías no se carga nada** y la página funciona
igual: no se pide un solo byte a ningún servidor externo. Se hizo así a
propósito, para no dejar puesta una etiqueta con un ID falso que daría error en
cada visita.

**Límites del plan gratis:** 100.000 eventos al mes, 3 sitios y **6 meses de
histórico**. El volumen sobra de largo. Lo del histórico sí importa: a los 6
meses se borra lo viejo, así que **no vas a poder comparar la temporada de
grados de un año contra la del anterior**. Si eso te interesa, exporta los
datos una vez al año o pasa al plan de pago. (Confirma los límites en su página
de precios: pueden cambiar.)

---

## 2. Qué mide la página por sí sola

Ya está programado. Cada acción avisa al medidor:

| Evento | Cuándo ocurre | Qué te dice |
|---|---|---|
| `whatsapp` | Alguien pulsa cualquier botón de WhatsApp | **La conversión real.** Trae `origen` (`tienda`, `taller`, `medida`, `pedido`, `ficha-producto`) y la sección desde donde salió |
| `abre_ficha` | Abren una pieza para personalizarla | Qué piezas despiertan interés, con nombre, tipo y precio |
| `filtra_piedra` | Escogen un color en el espectro | **Qué carreras vienen.** Si el azul se dispara en junio, prepara Ingenierías |
| `agrega_pedido` | Agregan una pieza al pedido | El paso previo a escribir. Si hay muchos y pocos `whatsapp`, algo falla al final |
| `calcula_talla` | Usan la calculadora | Si se usa mucho, la duda de talla era real y la resolviste |
| `ver_mas` | Pulsan "Ver más" para ver otras 6 piezas | Cuánta gente pasa de la primera tanda. Si casi nadie, el catálogo no engancha |
| `abre_calculadora_talla` | Van a la calculadora desde la ficha | La talla es la duda que frena la compra en ese momento |

**Las visitas no pagan; los mensajes sí.** Por eso lo importante no es cuánta
gente entra, sino qué proporción termina escribiendo.

---

## 3. Los cuatro números que debes mirar

### a) Tasa de contacto — **el número principal**

```
personas que pulsaron WhatsApp ÷ visitantes × 100
```

Referencia del sector: las joyerías online convierten **por debajo del 1%** en
venta directa. Pero tú no vendes en la web: vendes por chat. Una tasa de
contacto sana para tu caso está entre **3% y 8%**.

- Menos de 2% → la página no convence, o el tráfico viene mal segmentado
- Más de 10% → excelente; sube el presupuesto de Instagram

### b) De dónde salen los mensajes

El evento `whatsapp` trae el campo `origen`. Te dice qué parte de la página
trabaja:

- `ficha-producto` alto → el configurador de precio está funcionando
- `tienda` alto y `ficha-producto` bajo → la gente escribe sin mirar catálogo:
  quizá las fotos no convencen
- `taller` con volumen → el negocio B2B tiene demanda propia

### c) Qué piezas abren y cuáles no

Si un producto tiene muchos `abre_ficha` y nunca `agrega_pedido`, el precio
espanta. Si nunca lo abren, la ficha sin foto no vende: prioriza fotografiarlo.

### d) Colores de piedra más buscados

`filtra_piedra` te dice qué carreras están buscando anillos **antes** de que te
escriban. Es información de inventario gratis.

---

## 4. Cómo comprobar que funciona

**Antes de conectar nada**, para ver que los eventos salen:

1. Abre la página en tu computadora (con el servidor local o el archivo directo).
2. Click derecho → *Inspeccionar* → pestaña **Console**.
3. Navega, abre una pieza, escoge un color.
4. Verás líneas `[medir] abre_ficha {...}`.

Esas líneas **sólo salen en tu computadora**, nunca en el sitio publicado, y
siguen saliendo aunque Umami ya esté conectado. Así puedes comprobar cualquier
día que la instrumentación está viva sin ensuciar las estadísticas reales.

**Después de conectar Umami**, entra al panel de `cloud.umami.is` y mira que
aparezca tu propia visita. Los eventos salen en la pestaña **Events**.

---

## 5. Lo que la medición NO puede ver

Sé honesto con estos límites al leer los números:

- **No sabe si la venta se cerró.** El embudo termina cuando se abre WhatsApp.
  Lo que pasa dentro del chat es ciego. Para cerrar el círculo hay que anotar a
  mano cuántos de esos mensajes terminaron en compra.
- **No distingue a la misma persona en dos días** (sin cookies no hay
  seguimiento entre sesiones). Es el precio de no pedir consentimiento.
- **Los bots inflan las visitas.** Umami filtra los conocidos, pero no todos.
- **Sólo 6 meses de histórico** en el plan gratis (ver arriba).

**Sugerencia práctica:** lleva una libreta o una hoja de cálculo con los
mensajes que llegan y cuáles terminan en venta. Cruzar eso con la tasa de
contacto te da el cuadro completo. Con tu volumen actual, hacerlo a mano es
perfectamente viable.

---

## 6. Qué probar cuando tengas datos

Cuando lleves un mes midiendo, prueba **un cambio a la vez** y compara:

1. **La foto del hero.** Es la variable de mayor impacto. Prueba una foto de un
   anillo de grado puesto en una mano contra la actual.
2. **El texto del botón principal.** "Ver anillos de grado" contra
   "Ver precios".
3. **El orden de las secciones.** Subir "Cómo comprar" por encima de "Tu talla".

Cambia una sola cosa y espera dos semanas. Si cambias tres, no sabrás cuál funcionó.

---

## 7. Si algún día cambias de medidor

`medir()` en `index.html` ya soporta Umami, Plausible y Google Analytics: manda
el evento al primero que encuentre cargado. Para cambiar, quita el bloque
`MEDIDOR` del final y pega el script de la otra herramienta en su lugar. **No
hay que tocar ni una sola de las llamadas a `medir()`.**
