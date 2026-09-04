#!/usr/bin/env python3
"""
De FOTOS-CRUDAS a assets/img/piezas.   python3 HERRAMIENTAS/procesar-fotos.py

EL FALLO QUE COSTÓ TRES RONDAS
------------------------------
Las fotos del iPhone son 3024x4032: VERTICALES. `sips` informa los ejes al
revés ("pixelWidth: 4032") y al convertir a JPEG ESCRIBE LA IMAGEN GIRADA 90
GRADOS. Las 463 pasaron por ahí y todo el catálogo salió acostado.

    sips -s format jpeg -Z 800 IMG_8778.HEIC  ->  800x600  (horizontal)
    pillow_heif leyendo el mismo archivo      ->  3024x4032 (vertical)

sips está fuera del pipeline. Se lee el HEIC directamente con pillow-heif.

REGLAS
------
  · No se gira, no se voltea, no se invierte, no se reordena nada.
  · La PRIMERA toma es la central y es la portada; la 2ª el lado derecho y
    la 3ª el izquierdo, en ese orden.
  · Lo único que se hace es recortar y centrar, siempre en vertical 3:4.
  · Aire FIJO respecto a la piedra: así las tres tomas de una pieza salen
    al mismo tamaño aparente. Sólo se amplía la toma que quede cortada.
  · Cada recorte se comprueba dos veces: que haya joya dentro y que no
    toque el borde. Sin eso se publican fotos de cuero vacío y anillos
    partidos por la mitad; ambas cosas pasaron.
"""
import os, sys, json, datetime as dt, subprocess
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import fotos

RAIZ   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CRUDAS = os.path.join(RAIZ, "FOTOS-CRUDAS")
DESTINO= os.path.join(RAIZ, "assets", "img", "piezas")
HUECO  = 12      # segundos entre disparos que separan una pieza de la siguiente

def fechas(rutas):
    out = subprocess.run(["mdls","-name","kMDItemContentCreationDate","-raw",
                          "-nullMarker","?"]+rutas, capture_output=True, text=True).stdout
    return out.split("\0")

def main():
    fs = sorted(f for f in os.listdir(CRUDAS) if not f.startswith("."))
    datos=[]
    for f, d in zip(fs, fechas([os.path.join(CRUDAS,f) for f in fs])):
        d=d.strip()
        if d!="?": datos.append({"f":f,"t":dt.datetime.strptime(d[:19],"%Y-%m-%d %H:%M:%S")})
    datos.sort(key=lambda x:x["t"])
    grupos, actual = [], [datos[0]]
    for a,b in zip(datos, datos[1:]):
        if (b["t"]-a["t"]).total_seconds() > HUECO:
            grupos.append(actual); actual=[b]
        else: actual.append(b)
    grupos.append(actual)
    print(f"{len(fs)} fotos -> {len(grupos)} piezas")

    for sub in ("","mini","gal"): os.makedirs(os.path.join(DESTINO,sub), exist_ok=True)
    for i,g in enumerate(grupos):
        for j,t in enumerate(g[:3]):
            rec,info = fotos.encuadrar_completo(fotos.abrir(os.path.join(CRUDAS,t["f"])))
            if j==0:
                rec.resize((720,960), Image.LANCZOS).save(f"{DESTINO}/pieza-{i:03d}.jpg",
                    quality=80, optimize=True, progressive=True)
                rec.resize((360,480), Image.LANCZOS).save(f"{DESTINO}/mini/pieza-{i:03d}.jpg",
                    quality=76, optimize=True, progressive=True)
            else:
                rec.resize((600,800), Image.LANCZOS).save(f"{DESTINO}/gal/pieza-{i:03d}-{j+1}.jpg",
                    quality=76, optimize=True, progressive=True)
        print(f"  #{i:03d}  {len(g)} tomas")

if __name__ == "__main__": main()
