# Auditoría — Laksmy

> Revisión a fondo del sitio: bugs, flujo de compra, exposición legal en Venezuela
> y oportunidades. Hecha el 8 de agosto de 2026 sobre `index.html`.
>
> **Lo legal de este documento son banderas para que las revises con un abogado y un
> contador en Venezuela. No es asesoría jurídica.**

---

## 1. Bugs encontrados y corregidos

Los cuatro primeros se reprodujeron en el navegador antes y después del arreglo.

### 1.1 Inyección de HTML por el campo de grabado — **seguridad**

**Severidad: alta.** El campo "Grabado interno" entraba en `innerHTML` sin escapar.

Escribí en el campo `x" onfocus="window.__H=1" a="` y forcé un re-render cambiando
el material. Resultado antes del arreglo:

```
document.querySelector('#f-grabado').getAttribute('onfocus')
→ "window.__H=1"      ← atributo vivo, inyectado en el DOM
```

El mismo texto viajaba después al panel de pedido, también por `innerHTML`.

**Qué implicaba:** cualquiera podía romper el layout del modal escribiendo comillas
en su grabado. Y como el pedido se comparte por un enlace de WhatsApp con el texto
prellenado, un enlace preparado por un tercero podía ejecutar código en el navegador
de quien lo abriera.

**Arreglo:** función `esc()` que escapa `& < > " '`, aplicada a todo lo que viene del
cliente antes de entrar en `innerHTML`.

```
Después:  getAttribute('onfocus') → null
          input.value → 'x" onfocus="window.__H=1" a="'   (texto intacto, inerte)
```

### 1.2 El precio de la tarjeta no era el precio al abrirla — **conversión**

**Severidad: alta.** La tarjeta calculaba el "desde" en **plata** y el modal abría en
**oro 18k**.

```
Tarjeta:  "desde $138"
Un clic:  "$1.447"        ← 10 veces más
```

Es la clase de salto que hace cerrar la pestaña. **Arreglo:** una sola constante
`MATERIAL_BASE = "10k"` que usan la tarjeta y el modal. Ahora coinciden exactamente:

```
Tarjeta:  "desde $1.005"
Modal:    "$1.005"  (Oro 10k)
```

`precioDesde()` además no pasaba `largo`/`largoP`, así que el "desde" de cadenas y
pulseras ignoraba la medida base. Corregido.

### 1.3 Fuga de memoria en el índice de productos

**Severidad: media.** `pintarGrado()` y `pintarRegistro()` hacían `INDICE.push(p)` en
cada render sin limpiar nunca el array.

```
Al cargar:              14 entradas
Tras 16 cambios de pestaña:  54 entradas y subiendo
```

En una sesión larga en móvil eso crece sin techo, y los índices viejos quedaban
apuntando a objetos duplicados. **Arreglo:** `reconstruirIndice()` regenera el array
en cada pintado. Verificado: 14 → 14 tras 16 renders.

### 1.4 Los diálogos no atrapaban el foco — **accesibilidad**

**Severidad: media.** Con el modal abierto, `Tab` se escapaba a la página de atrás.
El lector de pantalla seguía leyendo el fondo, y al cerrar el foco se perdía al
principio del documento.

**Arreglo:** `inert` sobre nav/main/footer mientras hay un diálogo abierto, ciclo de
`Tab` contenido dentro del diálogo, y el foco vuelve a la tarjeta que lo abrió.

### 1.5 El pedido se perdía al recargar

**Severidad: media** en este negocio concretamente. El flujo termina saliendo a
WhatsApp; en móvil, volver al navegador recargaba y borraba todo lo armado.
**Arreglo:** el pedido se guarda en `sessionStorage`.

### 1.6 Menores

| Qué | Arreglo |
|---|---|
| Etiquetas del espectro desbordaban su columna en móvil | `minmax(0,1fr)` + `overflow-wrap` |
| Barra de confianza ocupaba 3 líneas en 375px | Se reduce a una promesa bajo 560px |
| Línea muerta en `pesoAjustado` (`g *= 1`) | Eliminada |
| El punto de "hoy" del gráfico se cortaba contra el borde | Margen derecho ampliado |
| Rejilla del gráfico sin etiquetar (decoraba, no informaba) | Sustituida por una sola línea base |

---

## 2. Problemas que siguen abiertos

### 2.1 El precio del metal está congelado en el código — **el más importante**

`SPOT` tiene el valor de Kitco del 7 de agosto de 2026. **No se actualiza solo.**

El oro se movió +2,41% en un solo día durante esta sesión. Si el metal sube 10% y la
página sigue mostrando el precio viejo, estás cotizando por debajo de tu costo en cada
pieza que alguien te pida.

Opciones, de menos a más trabajo:

1. **Revisar a mano** una vez por semana y cambiar dos números. Es lo que hay hoy, y
   la fecha de actualización sale visible en el pie para que el cliente la vea.
2. **Margen de seguridad**: subir el cálculo un 3–5% para absorber el movimiento entre
   actualizaciones.
3. **Un endpoint de precio** que la página consulte al cargar. Requiere un backend
   mínimo o un servicio externo — hoy el sitio no tiene ninguno.

Mi recomendación: opción 1 + opción 2 mientras el volumen sea bajo.

### 2.2 Los gramajes siguen siendo estimación

Los confirmaste como válidos "por ahora". Son lo único entre el precio mostrado y el
precio real. Cuando peses las piezas, es un solo campo `g` por producto.

### 2.3 El sello de marca dice "CL"

Los tres assets son el monograma de *Casa de Ley*. Con Laksmy no corresponden. El nav
usa wordmark tipográfico. **Hay que rehacer el sello antes de publicar.**

### 2.4 Un solo número para tienda y taller

Los dos botones llegan al mismo WhatsApp con mensajes distintos. Funciona, pero
mezcla las dos conversaciones en un mismo hilo.

---

## 3. Implicaciones legales en Venezuela

**Esto son banderas verificadas contra fuentes públicas, no asesoría jurídica.**
Revísalas con un abogado y un contador venezolanos antes de publicar.

### 3.1 Moneda y precios — riesgo alto si se ignora

El bolívar es la moneda de curso legal (Art. 318 de la Constitución). Referenciar
precios en dólares **no está prohibido**, pero:

- Debes **aceptar el pago en bolívares** a la tasa oficial del BCV del día.
- La **factura debe emitirse en bolívares**, con el equivalente a tasa BCV de la fecha
  de la operación.
- Usar tasas paralelas (Monitor Dólar, DolarToday) para facturar expone a **multas
  administrativas, cierre temporal e incluso procedimientos penales por especulación y
  usura** bajo la Ley Orgánica de Precios Justos.

**Ya aplicado en la página:** el precio dice "Precio aproximado · USD", la nota del
modal y del carrito aclaran que se acepta pago en bolívares a tasa BCV, y el pie lleva
el aviso completo de moneda y facturación.

**Lo que falta y depende de ti:** el **RIF** está como `[RELLENAR]` en el pie. Toda
página comercial venezolana debería identificar a la empresa con su RIF.

### 3.2 Facturación fiscal

No hay checkout, así que la página no factura. Pero la venta sí se cierra. Confirma con
tu contador el régimen de facturación que te aplica (SENIAT), el IVA, y si te
corresponde el **IGTF** sobre pagos en divisas — ese último punto no lo pude verificar
con precisión suficiente para afirmártelo.

### 3.3 Comercialización de oro — verificar

Venezuela tiene un régimen especial: la ley que **reserva al Estado** las actividades
de exploración y explotación de oro trata como actividades conexas el *procesamiento,
fundición, almacenamiento, circulación y comercialización* del mineral.

Una joyería que compra oro ya refinado y fabrica piezas normalmente no está en el mismo
supuesto que quien comercializa mineral. **Pero la frontera importa y no la puedo
resolver yo.** Si compras oro a terceros, fundes material recuperado o le prestas
servicio de fundición a otras joyerías —que es exactamente la ruta B2B de la página—
consulta si necesitas registro ante el ministerio de desarrollo minero.

**Esto es lo más serio de la lista.** No porque sea probable que haya problema, sino
porque es lo único que puede cerrar el negocio en vez de multarlo.

### 3.4 El mensaje de "valor refugio" — riesgo real y manejable

Presentar el oro como resguardo de ahorro es legítimo y es cierto. Los riesgos aparecen
si el mensaje cruza dos líneas:

1. **Prometer rendimientos.** "El oro siempre sube", "tu dinero crece", cualquier cifra
   presentada como proyección. Eso es publicidad engañosa si no se cumple, y la Ley
   Orgánica de Precios Justos sí tiene dientes en materia de engaño al consumidor.
2. **Parecer que vendes un instrumento de inversión.** Si la comunicación sugiere que
   el cliente está *invirtiendo* y no *comprando una joya*, entras en terreno de
   oferta de productos financieros, que tiene su propio regulador.

**Cómo quedó redactado en la página para mantenerse del lado seguro:**

- Los datos son **históricos y verificables**, nunca proyecciones.
- La frase del hero es factual, no promete: *"El oro no se oxida, no caduca y no depende
  de ningún banco."* Las tres cosas son ciertas y ninguna es una promesa de retorno.
- La sección lleva un aviso explícito: **el rendimiento pasado no garantiza rendimientos
  futuros**, el precio del oro sube y baja, esto no es asesoría financiera, y Laksmy no
  vende instrumentos de inversión — vende joyas.
- El gráfico trae su tabla de datos y la fuente.

Recomendación: **no quites ese aviso** y no dejes que nadie escriba "inversión
garantizada" en Instagram apuntando a esta página. La página puede ser impecable y el
post que la enlaza meterte el problema.

### 3.5 Datos personales

La página **no recoge ni un dato**: no hay formulario, ni analítica, ni cookies, ni
peticiones a terceros salvo Google Fonts. Eso te deja en la posición más cómoda posible.
Si algún día agregas newsletter o formulario, ahí sí hay que revisar el tema.

Nota menor: Google Fonts se carga desde el servidor de Google, lo que expone la IP del
visitante a un tercero. Si quieres cerrar eso, las tres fuentes se pueden alojar en tu
propio dominio. Es media hora de trabajo.

### 3.6 La foto del hero

Es de Unsplash bajo Unsplash License: uso comercial permitido, sin atribución
obligatoria. Está descargada en el repo, no enlazada. Queda registrada en
`assets/IMAGENES.md` con su licencia. **Sin problema legal**, pero es una pieza que no
es tuya — se reemplaza en cuanto tengas fotos propias.

---

## 4. Qué le agregaría

Ordenado por lo que más mueve la aguja en tu caso.

### Prioridad alta

| Qué | Por qué |
|---|---|
| **Guía de tallas** | Es la objeción n.º 1 en anillos por internet. Una regla imprimible o el truco del hilo + una tabla en cm. Hoy sólo dice "la medimos en el taller" |
| **Bloque de tienda física con mapa** | Tus propias referencias lo señalan: sustituye la confianza que no da una pasarela de pago. Falta la dirección |
| **Formas de pago visibles** | Pago móvil, transferencia, efectivo, Zelle. En Venezuela esto es la segunda pregunta que hacen |
| **Tiempo de entrega por tipo de pieza** | "Un anillo de grado sale en X días." Evita la conversación de ida y vuelta |
| **Foto de la pieza puesta** | Resuelve la escala. Ya está en la guía de fotografía |

### Prioridad media

| Qué | Por qué |
|---|---|
| **Calculadora de "cuánto oro tengo"** | Encaja perfecto con el mensaje de valor refugio: el cliente mete gramos y quilates y ve cuánto vale hoy lo que ya tiene. Te posiciona como referencia y trae tráfico recurrente |
| **Sección de compra de oro usado** | Si compras oro, es un servicio que la gente busca activamente y nadie en Caracas lo comunica bien online. Ojo con el punto 3.3 antes de anunciarlo |
| **Anillos de grado por institución** | Si haces anillos para universidades específicas, filtrar por UCV/USB/UNIMET es mucho más concreto que por carrera |
| **Testimonios con foto real** | Prueba social. Tres bastan |
| **Preguntas frecuentes** | ¿Se puede cambiar la talla después? ¿El grabado tiene costo? ¿Cuánto dura el baño de rodio? |
| **Garantía escrita** | "Ajuste de talla gratis el primer año." Convierte una objeción en una razón para comprar |

### Prioridad baja, pero bonito

| Qué | Por qué |
|---|---|
| **Comparador de quilates** | Mostrar la misma pieza en 10k, 14k y 18k lado a lado con precio y diferencia de color |
| **Historia de la casa** | El nombre viene de Lakshmy. Eso es una historia y la gente compra historias |
| **Antes / después del taller** | Reparaciones y restauraciones. Es el contenido que más se comparte en joyería |
| **Piedra del mes** | Tus referencias lo hacen: 12 notas que trabajan todo el año para tráfico de intención de regalo |

### Lo que NO agregaría

- **Pasarela de pago.** Tu conversión es WhatsApp y funciona. Un checkout añade
  obligaciones fiscales y técnicas sin resolver un problema que tengas.
- **Marquesina de descuentos.** Tu investigación la identifica como señal de joyería
  artesanal de plantilla; te bajaría el posicionamiento.
- **Financiación tipo Addi/Sistecrédito.** No operan en Venezuela.

---

## 5. Estado técnico verificado

| Comprobación | Resultado |
|---|---|
| Errores de consola | 0 |
| Imágenes rotas | 0 |
| Peticiones a dominios externos de imagen | 0 |
| Desbordamiento horizontal | Ninguno |
| Contraste de texto | Todos los pares ≥ 4,5:1 (AA) |
| Foco visible en teclado | Sí, en todos los interactivos |
| Foco atrapado en diálogos | Sí |
| `prefers-reduced-motion` | Respetado |
| Enlaces de WhatsApp | 9, todos con el número correcto |
| Precio tarjeta = precio modal | Sí |
