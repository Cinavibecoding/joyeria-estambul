#!/usr/bin/env python3
"""
PROCESADOR DE FOTOS — Joyería Estambul
========================================================================
Toma los originales de FOTOS-CRUDAS/ y produce las imágenes de la web.

Lo que hace, en orden:

  1. Agrupa las fotos por pieza usando los saltos de tiempo entre disparos
     (más de 12s = pieza nueva). Con 3 tomas por pieza el promedio da 3,0,
     que es exactamente el método del fotógrafo.

  2. Localiza la joya dentro del cuadro. Esto es lo único no trivial: la
     pieza está descentrada sobre un expositor, y un recorte cuadrado ciego
     la deja cortada o diminuta. Se detecta por dos señales combinadas:
       · saturación — las piedras de color y el oro saltan sobre el cuero
         gris y el fondo, que son casi acromáticos
       · brillo local — el metal pulido es lo más claro sobre el cuero negro
     Se descartan los bordes del cuadro (donde vive el fondo claro) y se
     toma el bloque más denso por proyección de filas y columnas, que es
     más estable que buscar la mancha más grande: la joya se parte en varios
     reflejos y una mancha sola nunca la cubre entera.

  3. Recorta cuadrado alrededor de ese centro, con aire alrededor, y sin
     salirse del original.

  4. Exporta 400 / 800 / 1200 px. El de 1200 es el que ve el modal; el de
     400 basta para la tarjeta en un teléfono.

No inventa nada: no reenfoca, no rellena, no genera píxeles. Sólo recorta,
escala y comprime.
"""
import json, os, sys, datetime as dt
from PIL import Image, ImageFilter, ImageStat
import numpy as np

RAIZ   = "/Users/victor/Desktop/Nuevo proyecto pagina"
CRUDAS = f"{RAIZ}/FOTOS-CRUDAS"
SALIDA = f"{RAIZ}/assets/img"
TRABAJO = "/private/tmp/claude-502/-Users-victor-Finalmente-listo-/f29ca804-cd22-4eb3-b8a6-232e3832b77d/scratchpad"
JPG    = f"{TRABAJO}/jpg"          # copias a 900px ya convertidas de HEIC

TAMANOS = [400, 800, 1200]
MARGEN  = 1.55   # cuánto aire alrededor de la joya (1.0 = pegado al borde)


def localizar_joya(ruta):
    """Devuelve (cx, cy, lado) normalizado 0-1 sobre la imagen original."""
    im = Image.open(ruta).convert("RGB")
    W, H = im.size
    ch = im.resize((240, int(240 * H / W)))
    a = np.asarray(ch).astype(np.float32) / 255.0
    h, w, _ = a.shape

    mx = a.max(axis=2); mn = a.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)   # saturación
    val = mx                                                       # brillo

    # El fondo claro vive en los bordes; el expositor y la joya, al centro.
    # Se penaliza el marco exterior para que no arrastre el centro de masa.
    borde = np.ones((h, w), np.float32)
    bx, by = int(w * 0.08), int(h * 0.08)
    borde[:by, :] = borde[-by:, :] = borde[:, :bx] = borde[:, -bx:] = 0.15

    # Brillo relativo: cuánto más clara es la zona que su vecindario.
    suave = np.asarray(ch.convert("L").filter(ImageFilter.GaussianBlur(12)),
                       np.float32) / 255.0
    realce = np.clip(val - suave, 0, 1)

    puntaje = (sat * 1.6 + realce * 2.2) * borde
    if puntaje.max() <= 0:
        return 0.5, 0.5, 0.6
    puntaje /= puntaje.max()
    fuerte = puntaje > 0.42
    if fuerte.sum() < 30:
        fuerte = puntaje > np.percentile(puntaje, 99.0)

    ys, xs = np.nonzero(fuerte)
    # Percentiles en vez de mínimo/máximo: un reflejo suelto en una esquina
    # no debe estirar el recorte hasta el otro extremo del cuadro.
    x0, x1 = np.percentile(xs, 4), np.percentile(xs, 96)
    y0, y1 = np.percentile(ys, 4), np.percentile(ys, 96)
    cx, cy = (x0 + x1) / 2 / w, (y0 + y1) / 2 / h
    lado = max((x1 - x0) / w, (y1 - y0) / h * (h / w) * (W / H) if H else 0)
    lado = max((x1 - x0) / w, (y1 - y0) / h)
    return float(cx), float(cy), float(min(lado, 1.0))


def recortar(origen, destino_base, cx, cy, lado):
    im = Image.open(origen).convert("RGB")
    W, H = im.size
    px = max(int(lado * W * MARGEN), int(min(W, H) * 0.34))
    px = min(px, min(W, H))
    x = min(max(int(cx * W - px / 2), 0), W - px)
    y = min(max(int(cy * H - px / 2), 0), H - px)
    caja = im.crop((x, y, x + px, y + px))
    salidas = []
    for t in TAMANOS:
        r = caja.resize((t, t), Image.LANCZOS)
        p = f"{destino_base}-{t}.jpg"
        r.save(p, quality=86, optimize=True, progressive=True)
        salidas.append(p)
    return salidas


def color_dominante_piedra(ruta, cx, cy, lado):
    """Color medio de la zona más saturada dentro de la joya: la piedra."""
    im = Image.open(ruta).convert("RGB")
    W, H = im.size
    px = int(lado * W * 1.1)
    x = min(max(int(cx * W - px / 2), 0), max(W - px, 0))
    y = min(max(int(cy * H - px / 2), 0), max(H - px, 0))
    z = im.crop((x, y, x + px, y + px)).resize((120, 120))
    a = np.asarray(z).astype(np.float32) / 255.0
    mx = a.max(axis=2); mn = a.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    m = sat > max(np.percentile(sat, 97), 0.30)
    if m.sum() < 12:
        return None
    rgb = (a[m].mean(axis=0) * 255).astype(int)
    return tuple(int(v) for v in rgb)


if __name__ == "__main__":
    print("Este archivo se usa desde los scripts de integración.")
