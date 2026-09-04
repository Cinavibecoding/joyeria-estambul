# Lo que hice y lo que necesito de ti

> Última pasada: 4 de septiembre de 2026. Rama `feat/casa-laksmy`.
> La página corre en `http://127.0.0.1:4321`.

---

## 0. El bug que lo explicaba todo

Tenías razón las tres veces que me dijiste que las fotos se veían acostadas.
No era el encuadre: **`sips`, la herramienta de macOS que usaba para convertir
tus HEIC, giraba cada foto 90 grados.** Lo demostré así:

```
sips -s format jpeg -Z 800 IMG_8778.HEIC  →  800x600   (horizontal)
pillow_heif leyendo el mismo archivo      →  3024x4032 (vertical)
```

`sips` incluso informa los ejes al revés: dice "pixelWidth: 4032" cuando el
ancho real es 3024. Las 463 fotos pasaron por ahí.

Y arrastraba más de lo que parecía: lo que yo interpreté como "toma cenital,
de pie e invertida" era tu **central, derecha e izquierda** vistas giradas.
Por eso elegí mal la portada. Ya está: **sips fuera del pipeline, la primera
toma es la portada, y no se gira, voltea ni reordena nada.**

## 1. Lo que quedó arreglado esta pasada

| | |
|---|---|
| **Vertical** | Las 443 fotos en 3:4, como las tomaste |
| **Orden** | 1ª central (portada) · 2ª derecha · 3ª izquierda |
| **Tamaño parejo** | Aire fijo: las tres tomas de una pieza se ven al mismo tamaño. Antes la 2 salía lejos y la 3 cerca |
| **Sin cortes** | Cada recorte se comprueba dos veces: que haya joya dentro y que no toque el borde. 233 de 443 se corrigieron |
| **Cadenas** | Encuadre propio: se ven enteras y todas iguales. Antes unas gigantes y otras diminutas |
| **Hero** | Vertical y de frente (tu primera toma), simétrico |
| **Precios** | Parten de **plata Ley 950: $103**, no de los $696 del oro 10k |
| **La X** | Arriba a la derecha, flotando sobre la foto |
| **Copias en plata** | Bajo el nombre, en pequeño. Ya no tapa las opciones |
| **Visor** | Tocas la foto y se abre a pantalla completa, con zoom y las tres tomas |
| **Espectro** | El panel del color se despliega ahí mismo, no al final de la sección |
| **Menos scroll** | Chips más bajos, sin descripciones en los botones de estilo |

---

## 2. Lo que necesito de ti

### a) Los pesos en gramos — sigue siendo lo que desbloquea todo

Los precios que ves salen de un peso **estimado de 6,5 g** para todos los
anillos. Con que me des el peso real de una pieza por medida, calculo el resto:

| Necesito | |
|---|---|
| Anillo de grado 6x8 en plata | ¿5 g? ¿7 g? |
| El mismo modelo en 4x3 y en 10x12 | para saber cuánto sube por medida |
| Cadena de eslabón marino 6x8, 45 cm | |
| Zarcillo 6x8, el par | |

### b) La mano de obra

Con los **$45 por gramo** que hay puestos, un anillo de 6,5 g en oro 10k da
$696, de los cuales **$292 son sólo hechura** — más que el oro que lleva. Un
competidor de Caracas cobra $169 por uno en plata. En un anillo de grado la
hechura suele cobrarse **por pieza**, no por gramo, porque el molde ya existe.
**Dime cuánto cobras** y lo ajusto.

### c) Los grabados que ya leí — confírmalos

Amplié las fotos y leí las carreras. **21 anillos ya llevan su nombre real**:

Queseras del Medio 1987 · Policía Nacional Bolivariana (×2) · Médico Cirujano
(×3) · Psiquiatra · T.S.U. Informática · Lic. Administración · Diseño Gráfico ·
Abogado (×4) · Lic. Relaciones Industriales · T.S.U. Publicidad y Mercadeo ·
Administración · T.S.U. Administración de Aduanas · Ingeniería de Sistemas ·
Contador Público · Criminalística

Y encontré **instituciones**: **CUAM** (Colegio Universitario de Administración
y Mercadeo, con sede en Caracas desde 1996), **CICPC**, la **Policía Nacional
Bolivariana** y un anillo de **Academia Militar** con la promoción "Queseras del
Medio" y el año 1987. **UCSAR** aparece en otro: es la Pontificia Universidad
Católica Santa Rosa, la de raíces más antiguas del país.

Los otros 77 no los pude leer con seguridad. Si quieres, sigo ampliando.

### d) Clásicos y modernos

El reparto (59/39) lo hizo una estimación que cuenta destellos de circonita y
**no es de fiar**: la distribución salió continua, sin dos grupos separados.

**Encontré tus fotos perdidas**: faltan `IMG_8945` a `IMG_8948`, cuatro
seguidas — justo el bloque del antes y después. Si las tienes en el teléfono,
con esas dos referencias clasifico las 98 en un rato.

### e) El color de cada piedra

141 piezas etiquetadas **leyendo la foto**, no tu inventario. Repásalo: si un
anillo está mal etiquetado, la graduanda que filtra por su carrera no lo ve.

### f) Bluecast y el Instagram

Faltan presentaciones y precios de la resina, y el usuario de la cuenta nueva.

---

## 3. El choque de color, medido

Me preguntaste por la paleta. Lo medí:

| | |
|---|---|
| Borde de tus fotos (el expositor) | **#757671** · 45% de luminancia · casi neutro |
| Fondo de la página | **#F9F7F2** · 96% · cálido |

**52 puntos de salto.** Por eso la foto no se apoya en la página: se pega
encima como un recorte. Y hay un segundo choque, de temperatura: el beige de
las tarjetas tira a cálido (R−B = +19) contra el gris casi neutro de la foto
(R−B = +4). Ese amarilleo es lo que se ve sucio al lado.

Dejé **tres variantes listas** para que elijas. Se prueban abriendo la consola
del navegador y escribiendo:

```
document.documentElement.dataset.fondo = "vitrina"
```

- **`vitrina`** — la tarjeta se oscurece hasta el tono de la foto. Es lo que
  hace una joyería: fondo oscuro, pieza iluminada. El salto baja de 52 a 6.
  **Es la que recomiendo.**
- **`neutro`** — se deja claro pero se le quita el amarillo. Arregla la
  temperatura, no la luminancia.
- **`difuminado`** — la foto se funde con la tarjeta por los bordes. Es lo que
  proponías. Funciona porque el borde de todas tus fotos es el mismo gris.

Para volver a la actual: `document.documentElement.removeAttribute("data-fondo")`.

---

## 4. Estado técnico

- **Simulador**: 1.170 acciones en 390 px, **cero fallos y cero errores**.
- Los 7 bugs del banco de pruebas siguen arreglados.
- Paquete listo: `bash HERRAMIENTAS/publicar.sh` → 320 archivos, 21 MB.
- El pipeline de fotos es reproducible: `python3 HERRAMIENTAS/procesar-fotos.py`.

### Pendientes que no dependen de mí
- **GZIP en hPanel**: comprime el HTML de 140 KB a unos 30.
- **ID de Umami** para la analítica.
- `GUIA-FOTOGRAFIA.md` sigue borrada: `git show 76e8fb6:GUIA-FOTOGRAFIA.md > GUIA-FOTOGRAFIA.md`.

### Para más adelante
- El prompt de Instagram con todo el contexto de la página.
- Los recorridos de usuario (`PRUEBAS/recorridos.js`) tardan más que el límite
  del navegador que uso; hay que correrlos por partes.
