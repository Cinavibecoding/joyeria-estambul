# Sistema de diseño — Laksmy · "El Espectro"

Todo lo que sigue está implementado en `index.html`. Los tokens viven en `:root`;
no hay ningún hex literal fuera de ahí.

---

## 1. Color

### Base

| Token | Nombre | Hex | Uso |
|---|---|---|---|
| `--field` | Plata Bruñida | `#E9ECEA` | Fondo de página. Neutro frío: hace saltar el amarillo del oro |
| `--panel` | Blanco Taller | `#F7F9F7` | Tarjetas, modal, sección Registro |
| `--toque` | Piedra de Toque | `#161D1C` | Utility bar, pie del hero, banda de taller. Nunca fondo de página |
| `--ink` | Tinta | `#1A211F` | Texto principal — 13,8:1 |
| `--ink-2` | Grafito | `#565F5C` | Texto secundario — 5,5:1 |
| `--lacre` | Lacre | `#96202F` | **Único color de acción.** CTA, foco, barra móvil |
| `--lacre-dark` | Lacre oscuro | `#7A1A26` | Hover del CTA |
| `--line` | Buril | `#C9D0CC` | Filetes de 1px |
| `--line-soft` | Buril claro | `#DDE2DF` | Bordes de tarjeta |

**Cero dorado en la interfaz.** Es un anti-patrón verificado: el oro en botones y
tipografía compite con el producto y el metal deja de destacar.

### Espectro — sólo Anillos de Grado

| Token | Piedra | Carrera | Hex | Contraste |
|---|---|---|---|---|
| `--e-azul` | Zafiro | Ingenierías | `#20458C` | 7,7:1 |
| `--e-verde` | Esmeralda | Medicina | `#0F6B4A` | 5,5:1 |
| `--e-rojo` | Granate | Derecho | `#9E2233` | 7,1:1 |
| `--e-amarillo` | Citrino | Farmacia · Pedagogía | `#8A6410` | 4,5:1 |
| `--e-morado` | Amatista | Filosofía · Artes | `#5B3A87` | 7,4:1 |
| `--e-rosa` | Turmalina | Diseño | `#A83A62` | 5,1:1 |
| `--e-blanco` | Cuarzo | Cualquier carrera | `#C9CFC9` | sólo swatch |

Regla: el espectro **no aparece fuera de Anillos de Grado**. Un color con significado
deja de significar en cuanto se usa de adorno.

### Tintes de material

| Token | Hex | Uso |
|---|---|---|
| `--t-oro` | `#EFEADC` | Fondo de ficha / media de pieza en oro |
| `--t-plata` | `#E4EAEC` | Fondo de ficha / media de pieza en plata |

---

## 2. Tipografía

Tres familias de Google Fonts. Ninguna está en la lista de anti-patrones
(Montserrat, Poppins, Jost/Futura, Cormorant quedaron fuera a propósito).

| Rol | Fuente | Peso | Tamaño |
|---|---|---|---|
| Display | **Instrument Serif** | 400 | `clamp(2rem, 5.5vw, 3.4rem)` |
| Display grande (quilates) | Instrument Serif | 400 | `clamp(3.4rem, 11vw, 6.5rem)` |
| Display cursiva | Instrument Serif italic | 400 | `clamp(1.5rem, 3.6vw, 2.2rem)` |
| Heading | **Instrument Sans** | 600 | `1.0625rem`–`1.6rem` |
| Cuerpo | Instrument Sans | 400 | `1rem` / `line-height 1.6` |
| UI / botones | Instrument Sans | 500 | `.9375rem` |
| Punzón (`.punzon`) | **DM Mono** | 400 | `.6875rem` · mayúsculas · `letter-spacing .16em` |
| Dato (`.dato`) | DM Mono | 500 | `1rem`–`1.75rem` |

Instrument Serif tiene una sola pesa a propósito: obliga a que la jerarquía venga
del tamaño y la caja, no del bold.

---

## 3. Espacio y layout

```
--s1 .25rem   --s2 .5rem    --s3 .75rem   --s4 1rem
--s5 1.5rem   --s6 2rem     --s7 3rem     --s8 4rem   --s9 6rem
--wrap 1140px   --radius 3px
```

`--radius: 3px` — casi cero. Es una marca golpeada, no un botón de app.

### Breakpoints

| Ancho | Qué cambia |
|---|---|
| **< 560px** | Utility bar a una sola promesa · pie del hero compacto · espectro a 4 columnas |
| **< 640px** | Espectro a 4 columnas, chips de 44px |
| **≥ 700px** | Grid de catálogo a 3 columnas |
| **≥ 820px** | Modal a dos columnas (foto + panel) |
| **≥ 900px** | Nav con enlaces · hero a dos columnas · desaparece la barra WhatsApp fija |
| **≥ 1000px** | Grid de catálogo a 4 columnas |

Mobile-first: todas las reglas base son de móvil; los `@media` sólo amplían.

---

## 4. Componentes

| Componente | Clase | Notas |
|---|---|---|
| Botón primario | `.btn.btn--primary` | Lacre, texto Blanco Taller, 8,3:1. Hover: `--lacre-dark` + `translateY(-1px)` |
| Botón secundario | `.btn.btn--ghost` | Transparente, borde `--line`. Hover: borde `--ink` + fondo `--panel` |
| Botón oscuro | `.btn.btn--dark` | Piedra de Toque. Para el CTA de tienda en el footer |
| Tarjeta | `.card` | `--panel`, borde `--line-soft`, radio 3px. Hover: sube 4px + sombra + barrido especular |
| Ficha sin foto | `.card__ficha` | Nombre en display sobre tinte de material + acabado + `FOTOGRAFÍA EN TALLER` |
| Hilo de piedra | `.card__thread` | Franja de 3px en el borde superior, color del espectro |
| Pestaña | `.tab` | Punzón. Activa: fondo Piedra de Toque |
| Segmento de espectro | `.seg` | Chip de color + etiqueta. Activo: chip de 70px + anillo interior |
| Opción de modal | `.opcion` | Píldora. Activa: fondo Piedra de Toque |
| Campo | `.campo select`, `.campo input` | Fondo `--field`, borde `--line`. Foco: borde `--ink` + fondo `--panel` |

---

## 4b. Estructura de secciones

```
utility → nav → hero → espectro → Anillos de Grado → Registro
        → Valor refugio → Taller → footer
```

**Valor refugio** entra después del catálogo y antes del taller: el cliente ya vio las
piezas, ahí se le da el segundo argumento (ahorro), y recién después la vía de encargo
a medida.

### Gráfico del precio del oro

Serie única → sin leyenda; el título nombra la serie. Etiquetas directas sólo en el
primer y el último punto, nunca en todos. Sin rejilla: líneas sin etiquetar decoran en
vez de informar, así que se dejó sólo la línea base. El punto de "hoy" es el único en
Lacre, para que el ojo caiga ahí. Cada punto lleva `<title>` con su valor, y existe una
tabla de datos alterna bajo `Ver los datos en tabla`.

Los datos viven en `ORO_HIST`. El último punto se calcula solo desde `SPOT`, así que al
actualizar el precio del metal el gráfico se actualiza con él.

## 4c. El espectro: significado y aviso de filtrado

Cada piedra tiene un campo `sig` con su lectura de color — la gente escoge el anillo de
grado por identificación, no por catálogo. Al pulsar un color aparece un panel con el
nombre de la piedra, la carrera, su significado y un botón **"Ver N modelos con esta
piedra ↓"** que baja al grid. Se añadió porque el filtro pasaba desapercibido: la barra
se agrandaba pero nada indicaba que el catálogo de abajo ya había cambiado.

El chip activo crece **hacia arriba** dentro de una caja de alto fijo (`.seg__caja`),
para que las siete etiquetas queden siempre alineadas.

## 5. Microinteracciones

| Qué | Cómo | Por qué |
|---|---|---|
| **Troquelado del espectro** | Los 7 segmentos entran escalonados 58ms, desde `translateY(6px) scaleY(.92)`, 340ms | Lee como una marca golpeada, no como un fade genérico |
| **Bruñido de tarjeta** | Barrido especular diagonal 620ms + zoom 1,045 + elevación 4px | Bruñido es el paso real de acabado del taller |
| **Escalera de quilates** | 10 → 14 → 18 se encienden por turnos cada 1,6s | Comunica el rango sin una línea de texto más |
| **Chip del espectro** | Crece de 56px a 70px al hover/activo | Feedback físico, como una tecla que se hunde |
| **Barra WhatsApp** | Se retrae al bajar, vuelve al subir, 220ms | Presente sin estorbar. 3/3 referencias la tienen fija |

Todas colapsan a cambio de estado instantáneo con `prefers-reduced-motion: reduce`.

---

## 6. Motor de precio — interno

**La interfaz sólo muestra el resultado. Nunca el gramaje, el spot ni la mano de obra.**

```
precio = gramos_ajustados × pureza × spot_del_metal
       + gramos_ajustados × mano_de_obra
       + extras
```

| Constante | Valor | Fuente |
|---|---|---|
| Oro 24k | `$4.341,30 / 31,1035` = **$139,58/g** | Kitco, 7 ago 2026 |
| Plata 999 | `$63,46 / 31,1035` = **$2,04/g** | Kitco, 7 ago 2026 |
| Pureza | 10k `.4167` · 14k `.5833` · 18k `.75` · Ley 950 `.95` | Definición de ley |
| Mano de obra oro | **$45/g**, sin importar el quilate | Dato de la dueña |
| Mano de obra plata | $10/g | Estimación, **confirmada por la dueña** el 7 ago 2026 |
| Baño de rodio (oro blanco) | +$20 | |
| Grabado interno | +$12 | |
| Engaste de piedra | +$25 | Se aplica a los de grado y a cualquier pieza donde se escoja piedra |

**Ajuste por talla:** `peso × (1 + (talla − 7) × 0,045)` — ~4,5% por talla.
**Ajuste por largo:** cadenas `peso × largo/45`; pulseras `peso × largo/18`.

Los pesos en gramos de las 34 piezas (campo `g` en `GRADO` y `REGISTRO`) son
estimación, **confirmada como válida por la dueña** el 7 ago 2026. Se afinan cuando
se pesen las piezas reales.

### Material base: oro 10k

`MATERIAL_BASE = "10k"` lo usan **la tarjeta y el modal**. Antes la tarjeta calculaba el
"desde" en plata y el modal abría en 18k: la tarjeta decía `desde $138` y al primer clic
aparecía `$1.447`. Ahora coinciden exactamente.

### Moneda — requisito legal, no estético

Los precios se muestran **en dólares como referencia**, etiquetados `· USD`. El modal, el
carrito y el pie aclaran que se acepta pago en bolívares a la tasa **BCV** del día y que
la venta se factura en bolívares. Ver `AUDITORIA.md §3.1`.

### Verificación

Anillo de Grado Zafiro, 9,5 g, talla 7:

| Material | Precio |
|---|---|
| Plata Ley 950 | $138 |
| Oro 10k | $1.005 |
| Oro 14k | $1.226 |
| Oro 18k | $1.447 |

Comprobado a mano: `9,5 × 0,75 × 139,58 + 9,5 × 45 + 25 = 1.447`. ✅

⚠️ **`SPOT` no se actualiza solo.** Está fijo en el 7 ago 2026. Hay que editar dos
números cuando el metal se mueva; la fecha sale visible en el pie de la página.

---

## 7. Personalización por tipo de pieza

| Tipo | Campos del modal |
|---|---|
| `grado` | Material y ley · Color del oro · Talla · **Piedra y carrera** · Grabado |
| `anillo` | Material y ley · Color del oro · Talla · **Piedra (opcional)** · Acabado · Grabado |
| `aro` | Material y ley · Color del oro · Talla · **Piedra (opcional)** · Acabado · Grabado |
| `cadena` | Material y ley · Color del oro · Largo (45/50/60/70 cm) · Acabado |
| `pulsera` | Material y ley · Color del oro · Largo (17/18/19/20 cm) · Acabado · Grabado |
| `zarcillo` | Material y ley · Color del oro · Acabado |
| `dije` | Material y ley · Color del oro · **Piedra (opcional)** · Grabado |

El campo "Color del oro" desaparece solo cuando el material es Plata Ley 950.

### La piedra no amarra el modelo

Regla de negocio, implementada en dos sitios:

1. **Sección del espectro** — bajo la barra de colores, con filete lacre a la izquierda:
   *"La piedra no amarra el modelo. ¿Te gustó un anillo pero lo viste con otra piedra?
   Se le pone la que quieras."* El color **filtra referencias**, no limita el pedido.
2. **Modal** — campo `piedraOpc` en anillos, aros y dijes, con opción "Sin piedra".

Las etiquetas cambian según el contexto: en anillos de grado la piedra se nombra por
**carrera** (Ingenierías, Medicina…), porque ahí eso es lo que significa. En cualquier
otra pieza se nombra por **color** (Azul zafiro, Verde esmeralda…), porque la carrera
no significa nada en una pulsera.

---

## 7b. WhatsApp

Número único: **0424-276-5908** (Caracas) → `wa.me/584242765908`.

Cada enlace lleva su mensaje prellenado según de dónde salga el cliente:

| Origen | `data-wa` | Mensaje |
|---|---|---|
| Nav, hero, footer tienda, barra móvil | `tienda` | "Hola, vengo de la página. Quisiera información sobre una pieza." |
| CTA de pieza a la medida | `medida` | "Hola, quiero cotizar una pieza a la medida. Les mando la foto de referencia." |
| Línea B2B y footer taller | `taller` | "Hola, tengo una joyería y quiero consultar por servicios de orfebrería al mayor." |
| Modal de producto | dinámico | Nombre de la pieza + configuración completa + precio aproximado |
| Pedido | dinámico | Todas las piezas con su configuración + total |

---

## 7c. Accesibilidad y robustez

| Qué | Cómo |
|---|---|
| Inyección de HTML | `esc()` sobre todo lo que viene del cliente antes de `innerHTML` |
| Foco en diálogos | `inert` en nav/main/footer, ciclo de `Tab` contenido, foco devuelto al abridor |
| Objetivos táctiles | mínimo 44px en botones, pestañas y enlaces de texto |
| Contraste | todos los pares ≥ 4,5:1, incluida la piedra blanca (usa Tinta, no su color pálido) |
| Movimiento | todo colapsa con `prefers-reduced-motion` |
| Pedido | persiste en `sessionStorage` — en móvil el cliente sale a WhatsApp y vuelve |
| Gráfico | `role="img"` con `aria-label` que narra la serie, más tabla de datos alterna |

## 8. Pendientes

- [x] ~~Números de WhatsApp~~ — 0424-276-5908, aplicado en los 9 enlaces.
- [x] ~~Pesos en gramos~~ — confirmados como válidos por ahora.
- [x] ~~Mano de obra de plata~~ — confirmada.
- [ ] **Sello de marca:** los 3 assets dicen "CL" (Casa de Ley). Con el nombre Laksmy
      hay que rehacerlo. Hoy el nav usa wordmark tipográfico y el favicon es una "L"
      tipográfica en línea, ambos provisionales.
- [ ] **RIF** en el pie — está como `[RELLENAR]`.
- [ ] **Actualizar `SPOT`** cada cierto tiempo, o añadir un margen del 3–5%.
- [ ] **Un solo número para tienda y taller.** Hoy los dos botones van al mismo
      WhatsApp con mensajes distintos. Si consigues una línea aparte para B2B,
      es un cambio de una constante.
- [ ] **Fotografía propia** — ver `GUIA-FOTOGRAFIA.md`. 29 de 34 tarjetas sin foto.
- [ ] **Spot de metales:** hoy está fijo en el JS. Si se quiere que se actualice solo,
      hace falta un endpoint; sin backend, se edita a mano cada cierto tiempo.
- [ ] Dominio y hosting.
