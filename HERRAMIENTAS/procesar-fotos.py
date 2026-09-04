#!/usr/bin/env python3
"""
De FOTOS-CRUDAS a assets/img/piezas, de una pasada.

    python3 HERRAMIENTAS/procesar-fotos.py

Qué hace, en orden:
  1. Lee la fecha de captura de cada foto y agrupa por saltos de más de 12
     segundos. Ese umbral salió de medir la sesión real: da 3,0 fotos por
     grupo, que es justo el método de tres ángulos por pieza.
  2. De cada grupo se queda con la toma más nítida.
  3. Localiza la pieza y recorta al cuadrado ajustado a su tamaño (encuadre.py).
  4. Guarda 800px para el modal y 400px para la tarjeta.

Las fotos crudas NO están en git: son 661 MB. Este script es lo que permite
rehacerlas si se pierden los recortes.
"""
import os, re, sys, json, subprocess, datetime as dt
from PIL import Image, ImageFilter, ImageStat
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import encuadre

RAIZ   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CRUDAS = os.path.join(RAIZ, "FOTOS-CRUDAS")
DESTINO= os.path.join(RAIZ, "assets", "img", "piezas")
TMP    = "/tmp/estambul-foto.jpg"
HUECO  = 12          # segundos entre disparos que separan una pieza de la siguiente

def fechas(archivos):
    out = subprocess.run(["mdls","-name","kMDItemContentCreationDate","-raw",
                          "-nullMarker","?"]+archivos, capture_output=True, text=True).stdout
    return out.split("\0")

def nitidez(ruta):
    im = Image.open(ruta).convert("L").resize((600,450))
    return ImageStat.Stat(im.filter(ImageFilter.FIND_EDGES)).stddev[0]

def main():
    fs = sorted(f for f in os.listdir(CRUDAS) if not f.startswith("."))
    print(f"{len(fs)} archivos en FOTOS-CRUDAS")
    rutas = [os.path.join(CRUDAS,f) for f in fs]
    datos = []
    for f, d in zip(fs, fechas(rutas)):
        d = d.strip()
        if d == "?": continue
        datos.append({"f":f, "t":dt.datetime.strptime(d[:19], "%Y-%m-%d %H:%M:%S")})
    datos.sort(key=lambda x:x["t"])

    grupos, actual = [], [datos[0]]
    for a, b in zip(datos, datos[1:]):
        (grupos.append(actual) or actual.clear() or actual.append(b)) \
            if (b["t"]-a["t"]).total_seconds() > HUECO else actual.append(b)
    grupos.append(actual)
    print(f"{len(grupos)} piezas")

    os.makedirs(os.path.join(DESTINO,"mini"), exist_ok=True)
    for i, g in enumerate(grupos):
        for x in g:
            subprocess.run(["sips","-s","format","jpeg","-Z","1200",
                            os.path.join(CRUDAS,x["f"]),"--out",TMP], capture_output=True)
            x["n"] = nitidez(TMP)
        mejor = max(g, key=lambda x:x["n"])
        subprocess.run(["sips","-s","format","jpeg","-Z","2400",
                        os.path.join(CRUDAS,mejor["f"]),"--out",TMP], capture_output=True)
        rec,_ = encuadre.recorte_web(Image.open(TMP))
        rec.resize((800,800), Image.LANCZOS).save(
            f"{DESTINO}/pieza-{i:03d}.jpg", quality=80, optimize=True, progressive=True)
        rec.resize((400,400), Image.LANCZOS).save(
            f"{DESTINO}/mini/pieza-{i:03d}.jpg", quality=76, optimize=True, progressive=True)
        print(f"  #{i:03d}  {len(g)} tomas  mejor {mejor['f']}")

if __name__ == "__main__":
    main()
