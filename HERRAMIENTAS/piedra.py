"""
Detección del color de la piedra.

En el recorte ya centrado, la piedra es la zona más saturada que queda: el
metal es gris o amarillo pálido, el expositor no tiene color. Se toma el
cuartil más saturado de los píxeles centrales, se saca su tono medio en
círculo (los tonos son ángulos: promediar 350° y 10° da 0°, no 180°) y se
traduce al id de piedra que usa el Espectro.
"""
import numpy as np
from PIL import Image

# Tono central de cada piedra, en grados. Ajustados a lo que sale en estas
# fotos, no a la teoría del círculo cromático.
TONOS = {"rojo":   2, "fucsia": 330, "rosa": 345, "morado": 280,
         "azul":   225, "celeste": 200, "verde": 140, "amarillo": 48}

def color_piedra(im, top=6.0):
    """
    La piedra está en el centro del recorte por construcción: recorte_web ya
    centró la pieza, y la piedra es el centro de la pieza. El listón tostado
    del expositor, que es lo que envenenaba la medición, vive en los bordes.

    Así que el peso de cada píxel es saturación x cercanía al centro. Con eso
    el tostado deja de ganar la moda sin necesidad de excluir ningún tono a
    mano — que sería peligroso, porque hay piedras citrino que son
    exactamente del mismo amarillo que ese listón.
    """
    N = 200
    a = np.asarray(im.convert("RGB").resize((N,N)), dtype=np.float32)/255.0
    yy, xx = np.mgrid[0:N, 0:N]
    rad = np.hypot(xx/N-0.5, yy/N-0.5)
    cerca = np.exp(-(rad/0.20)**2)          # el centro pesa; el borde no

    mx, mn = a.max(2), a.min(2)
    sat = np.where(mx>0.05, (mx-mn)/np.maximum(mx,1e-6), 0)
    val = np.where((mx>0.20) & (mx<0.99), 1.0, 0.0)
    peso_px = (sat * cerca * val).ravel()
    col = a.reshape(-1,3)

    corte = np.percentile(peso_px, 100-top)
    ok = peso_px >= max(corte, 1e-4)
    if ok.sum() < 40: return "blanco", 0.0
    sel, w = col[ok], peso_px[ok]
    if np.percentile(sat.ravel()[ok], 60) < 0.28:
        return "blanco", 0.0                # centro sin color: piedra incolora o sello

    r,g,bl = sel[:,0], sel[:,1], sel[:,2]
    mxv, mnv = sel.max(1), sel.min(1); dif = np.maximum(mxv-mnv, 1e-6)
    h = np.where(mxv==r, ((g-bl)/dif)%6, np.where(mxv==g, (bl-r)/dif+2, (r-g)/dif+4))*60

    bins = 36
    idx = (h/(360/bins)).astype(int) % bins
    hist = np.bincount(idx, weights=w, minlength=bins)
    hist = np.convolve(np.r_[hist[-2:], hist, hist[:2]], np.ones(5)/5, "valid")
    pico = int(np.argmax(hist)); centro_pico = (pico+0.5)*(360/bins)

    def dist(a_, b_): d=abs(a_-b_)%360; return min(d, 360-d)
    cerca_pico = np.array([dist(x, centro_pico) <= 32 for x in h])
    if cerca_pico.sum() < 15: return "blanco", round(float(centro_pico),1)
    ang = np.radians(h[cerca_pico]); ww = w[cerca_pico]
    tono = np.degrees(np.arctan2((np.sin(ang)*ww).sum(), (np.cos(ang)*ww).sum())) % 360
    fuerza = float(ww.sum()/max(w.sum(),1e-6))
    piedra = min(TONOS, key=lambda k: dist(tono, TONOS[k]))
    if fuerza < 0.30: return "blanco", round(float(tono),1)
    return piedra, round(float(tono),1)
