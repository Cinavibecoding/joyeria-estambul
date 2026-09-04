"""
Encuadre automático de fotos de joyería.

El problema: la pieza está en algún punto de un cuadro de 4032x3024, sobre un
expositor gris y negro, y la web recorta a cuadrado. Recortar por el centro
geométrico deja la pieza descentrada o fuera.

Cómo se localiza la pieza, en dos señales que se multiplican:

  SATURACIÓN — el oro es amarillo y las piedras son rojas, azules, moradas.
  El expositor es gris, negro y cuero tostado: casi sin saturación. Es la
  señal más limpia que hay en estas fotos.

  DETALLE FINO — el grabado del anillo y los eslabones de la cadena tienen
  microcontraste; el cuero y la tela del fondo, no. Se mide como diferencia
  entre la imagen y su versión desenfocada, que deja pasar sólo lo fino.

El borde del expositor también tiene contraste, pero no tiene saturación, así
que al multiplicar las dos señales se apaga solo. Al revés pasa con el cuero
tostado, que sí tiene algo de color pero no tiene detalle.
"""
import numpy as np
from PIL import Image, ImageFilter

def mapa_interes(im, lado=320):
    """Devuelve un mapa pequeño (lado x lado*h/w) de dónde está la pieza."""
    ch = im.convert("RGB").resize((lado, int(lado*im.height/im.width)), Image.BILINEAR)
    a = np.asarray(ch, dtype=np.float32) / 255.0

    mx, mn = a.max(axis=2), a.min(axis=2)
    sat = np.where(mx > 0.04, (mx - mn) / np.maximum(mx, 1e-6), 0.0)

    g = np.asarray(ch.convert("L").filter(ImageFilter.GaussianBlur(2.2)), dtype=np.float32)/255.0
    n = np.asarray(ch.convert("L"), dtype=np.float32)/255.0
    detalle = np.abs(n - g)

    # Cada señal se normaliza por su percentil 99 para que ninguna domine
    # por escala; la pieza tiene que puntuar alto en LAS DOS.
    def norm(x):
        p = np.percentile(x, 99)
        return np.clip(x / p, 0, 1) if p > 1e-6 else x*0
    m = norm(sat) * norm(detalle)

    # Sesgo suave hacia el centro. El listón tostado del expositor tiene algo
    # de color y algo de textura, así que puntúa bajo pero no cero, y vive
    # casi siempre en el borde del cuadro. Quien fotografía apunta al centro:
    # este sesgo usa esa costumbre para desempatar sin descartar nada.
    h, w = m.shape
    yy, xx = np.mgrid[0:h, 0:w]
    d2 = ((xx/w - .5)/.62)**2 + ((yy/h - .5)/.62)**2
    m = m * (0.35 + 0.65*np.exp(-d2))

    # Suavizar para que el mapa sea una mancha y no puntos sueltos
    return np.asarray(Image.fromarray((m*255).astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(6)), dtype=np.float32)/255.0

def centro_pieza(im):
    """Centro de masa de la pieza, en coordenadas 0..1 sobre la foto original."""
    m = mapa_interes(im)
    umbral = max(m.max()*0.35, np.percentile(m, 97))
    ys, xs = np.nonzero(m >= umbral)
    if len(xs) < 12:                      # sin señal clara: centro geométrico
        return 0.5, 0.5, 0.0
    peso = m[ys, xs]
    cx = float((xs*peso).sum()/peso.sum()) / m.shape[1]
    cy = float((ys*peso).sum()/peso.sum()) / m.shape[0]
    # confianza: qué fracción de la energía cae dentro del 25% central del recorte
    return cx, cy, float(peso.sum()/max(m.sum(), 1e-6))

def recorte_cuadrado(im, margen=1.0):
    """Recorta al cuadrado más grande posible centrado en la pieza."""
    cx, cy, conf = centro_pieza(im)
    L = min(im.width, im.height)
    x = int(round(cx*im.width  - L/2))
    y = int(round(cy*im.height - L/2))
    x = max(0, min(x, im.width  - L))     # sin salirse del cuadro
    y = max(0, min(y, im.height - L))
    return im.crop((x, y, x+L, y+L)), (cx, cy, conf)

def caja_pieza(im):
    """Caja que contiene la pieza, en coordenadas 0..1. Devuelve (x0,y0,x1,y1)."""
    m = mapa_interes(im)
    umbral = max(m.max()*0.30, np.percentile(m, 96))
    ys, xs = np.nonzero(m >= umbral)
    if len(xs) < 12:
        return 0.25, 0.25, 0.75, 0.75
    # se recortan los extremos para que un reflejo suelto no infle la caja
    x0, x1 = np.percentile(xs, 2)/m.shape[1], np.percentile(xs, 98)/m.shape[1]
    y0, y1 = np.percentile(ys, 2)/m.shape[0], np.percentile(ys, 98)/m.shape[0]
    return float(x0), float(y0), float(x1), float(y1)

def recorte_web(im, aire=1.55, min_lado=0.42):
    """
    Recorte cuadrado centrado en la pieza y ajustado a su tamaño.

    `aire` es cuánto se abre el cuadro respecto a la pieza: 1.55 deja un
    margen cómodo alrededor sin que la pieza nade en el encuadre. Un anillo
    ocupa el 12% del cuadro original; sin este ajuste, en una tarjeta de
    160px del teléfono se vería del tamaño de una pulga.

    `min_lado` impide recortes tan cerrados que la foto pierda resolución o
    que el grano se note al ampliar.
    """
    x0, y0, x1, y1 = caja_pieza(im)
    W, H = im.width, im.height
    cx, cy = (x0+x1)/2*W, (y0+y1)/2*H
    lado_pieza = max((x1-x0)*W, (y1-y0)*H)
    L = int(min(min(W, H), max(lado_pieza*aire, min(W, H)*min_lado)))
    x = int(round(cx - L/2)); y = int(round(cy - L/2))
    x = max(0, min(x, W-L));  y = max(0, min(y, H-L))
    ocupa = lado_pieza / L
    return im.crop((x, y, x+L, y+L)), {"lado": L, "ocupa": round(ocupa, 2),
                                       "cx": round(cx/W, 3), "cy": round(cy/H, 3)}
