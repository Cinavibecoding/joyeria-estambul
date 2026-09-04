"""
Pipeline de fotos. Versión buena.

EL FALLO QUE ARRASTRÓ TODO LO ANTERIOR
--------------------------------------
Las fotos del iPhone son 3024x4032: VERTICALES, como se tomaron.
`sips` informa "pixelWidth: 4032, pixelHeight: 3024" y al convertir a JPEG
escribe la imagen GIRADA 90 GRADOS. Las 463 fotos pasaron por ahí, así que
todo el catálogo salió acostado.

Se comprobó así:
    sips -s format jpeg -Z 800 IMG_8778.HEIC  ->  800x600  (horizontal)
    pillow_heif leyendo el mismo archivo      ->  3024x4032 (vertical)

Conclusión: sips fuera del pipeline. Se lee el HEIC directamente.

REGLAS, que vienen del dueño y no se negocian
---------------------------------------------
  · NO se gira, NO se voltea, NO se invierte, NO se reordena nada.
  · La PRIMERA toma de cada pieza es la central y es la portada.
  · La segunda es el lado derecho; la tercera, el izquierdo. En ese orden.
  · Lo único que se hace es RECORTAR y CENTRAR, manteniendo el vertical.
"""
import numpy as np
from collections import deque
from PIL import Image, ImageFilter
import pillow_heif
pillow_heif.register_heif_opener()

ALTO_ANCHO = 4/3          # el vertical con el que se tomaron las fotos

def abrir(ruta):
    """Abre respetando la orientación real. Sin sips, sin rotaciones."""
    im = Image.open(ruta)
    return im.convert("RGB")

def _manchas(mask):
    H,W = mask.shape; et=-np.ones((H,W),dtype=np.int32); comps=[]
    for i in range(H):
        for j in range(W):
            if not mask[i,j] or et[i,j]>=0: continue
            n=len(comps); q=deque([(i,j)]); et[i,j]=n; px=[]
            while q:
                y,x=q.popleft(); px.append((y,x))
                for dy in(-1,0,1):
                    for dx in(-1,0,1):
                        v,u=y+dy,x+dx
                        if 0<=v<H and 0<=u<W and mask[v,u] and et[v,u]<0:
                            et[v,u]=n; q.append((v,u))
            comps.append(px)
    return comps

def _piedra(im, lado=240):
    """Caja de la gema: es el punto más saturado del cuadro y el expositor
       no tiene nada parecido."""
    ch = im.resize((lado, int(lado*im.height/im.width)), Image.BILINEAR)
    a = np.asarray(ch, dtype=np.float32)/255.0
    mx, mn = a.max(2), a.min(2)
    sat = np.where(mx>0.06,(mx-mn)/np.maximum(mx,1e-6),0)
    mask = (sat>0.55) & (mx>0.22)
    H,W = sat.shape
    if mask.sum()<25: return None
    mejor,mejorp=None,-1
    for px in _manchas(mask):
        if len(px)<25: continue
        ys=np.array([p[0] for p in px]); xs=np.array([p[1] for p in px])
        alto=ys.max()-ys.min()+1; ancho=xs.max()-xs.min()+1
        p=len(px)*(0.25+min(alto,ancho)/max(alto,ancho))*(0.3+len(px)/max(alto*ancho,1))*float(sat[ys,xs].mean())
        if p>mejorp: mejorp,mejor=p,(xs,ys)
    if mejor is None: return None
    xs,ys=mejor
    return float(xs.min())/W, float(ys.min())/H, float(xs.max()+1)/W, float(ys.max()+1)/H

def _metal(im, lado=240):
    """Respaldo para lo que no tiene gema: la mancha clara rodeada de oscuro."""
    ch = im.resize((lado, int(lado*im.height/im.width)), Image.BILINEAR)
    L = np.asarray(ch.convert("L"), dtype=np.float32)/255.0
    rod = np.asarray(Image.fromarray(((L<0.22)*255).astype(np.uint8))
                     .filter(ImageFilter.GaussianBlur(7)), dtype=np.float32)/255.0
    m = (L>0.45).astype(np.float32)*rod
    H,W = m.shape
    if m.max()<1e-6: return 0.28,0.28,0.72,0.72
    mejor,mejorp=None,-1
    for px in _manchas(m>=max(np.percentile(m,98.5), m.max()*0.35)):
        if len(px)<20: continue
        ys=np.array([p[0] for p in px]); xs=np.array([p[1] for p in px])
        alto=ys.max()-ys.min()+1; ancho=xs.max()-xs.min()+1
        p=len(px)*(0.3+min(alto,ancho)/max(alto,ancho))
        if p>mejorp: mejorp,mejor=p,(xs,ys)
    if mejor is None: return 0.28,0.28,0.72,0.72
    xs,ys=mejor
    return float(xs.min())/W,float(ys.min())/H,float(xs.max()+1)/W,float(ys.max()+1)/H

def encuadrar(im, aire=5.0, tipo="anillo"):
    """
    Recorte VERTICAL 3:4 centrado en la pieza. No gira nada: sólo mueve la
    ventana de recorte por el cuadro original hasta centrar la joya.
    """
    # CADA TIPO DE PIEZA PIDE SU ENCUADRE.
    # Una cadena ocupa todo el busto y hay que verla entera; un anillo es
    # pequeño y hay que acercarse. Usar la misma regla para las dos era lo
    # que dejaba unas cadenas gigantes y otras diminutas en la misma fila.
    if tipo in ("cadena", "pulsera"):
        # Casi todo el cuadro, con un margen mínimo. Así todas las cadenas
        # salen al mismo tamaño y la fila queda pareja.
        alto = im.height*0.94
        ancho = alto/ALTO_ANCHO
        if ancho > im.width*0.98:
            ancho = im.width*0.98; alto = ancho*ALTO_ANCHO
        x = int((im.width-ancho)/2); y = int((im.height-alto)/2)
        return im.crop((x,y,x+int(ancho),y+int(alto))), {"fuente":"encuadre fijo"}
    if tipo == "zarcillo":
        # El par sobre su tarjeta: encuadre medio y fijo, por lo mismo.
        alto = im.height*0.62
        ancho = alto/ALTO_ANCHO
        x0,y0,x1,y1 = _metal(im)
        cx,cy = (x0+x1)/2*im.width, (y0+y1)/2*im.height
        x = max(0, min(int(cx-ancho/2), im.width-int(ancho)))
        y = max(0, min(int(cy-alto/2),  im.height-int(alto)))
        return im.crop((x,y,x+int(ancho),y+int(alto))), {"fuente":"zarcillo"}

    p = _piedra(im)
    if p:
        x0,y0,x1,y1 = p
        lado = max((x1-x0)*im.width, (y1-y0)*im.height)
        # Un anillo mide algo más de tres veces su piedra. Con aire 5 el
        # anillo ocupa ~65% del ancho del recorte: ni ahogado ni perdido.
        # En las tomas laterales la cámara estaba más cerca y la piedra sale
        # más grande, así que ahí se abre más para que no se salga del cuadro.
        base = lado*aire
        fuente="piedra"
    else:
        x0,y0,x1,y1 = _metal(im)
        base = max((x1-x0)*im.width, (y1-y0)*im.height)*1.5
        fuente="metal"
    cx,cy = (x0+x1)/2*im.width, (y0+y1)/2*im.height

    # ventana vertical: el alto manda, el ancho sale de la proporción
    alto = min(im.height, max(base*ALTO_ANCHO, im.height*0.22))
    ancho = alto/ALTO_ANCHO
    if ancho > im.width:
        ancho = im.width; alto = ancho*ALTO_ANCHO
    x = max(0, min(int(cx-ancho/2), im.width-int(ancho)))
    y = max(0, min(int(cy-alto/2),  im.height-int(alto)))
    return im.crop((x, y, x+int(ancho), y+int(alto))), {"fuente":fuente}

def _hay_pieza(rec):
    """
    ¿Hay joya de verdad dentro de este recorte? Se mira el 65% central: una
    joya deja saturación viva o contraste fuerte; el expositor solo, no.

    Sin esta comprobación se publican recortes de cuero vacío. Pasó: la
    tercera toma de varios anillos salía con el expositor y sin la pieza.
    """
    a = np.asarray(rec.resize((150,200)), dtype=np.float32)/255.0
    b = int(150*0.175); c = a[int(200*0.175):200-int(200*0.175), b:150-b]
    mx, mn = c.max(2), c.min(2)
    sat = np.where(mx>0.06,(mx-mn)/np.maximum(mx,1e-6),0)
    return float(np.percentile(sat,97)) > 0.34 or float(mx.std()) > 0.16

def encuadrar_seguro(im, tipo="anillo"):
    """
    Recorta y COMPRUEBA. Si el recorte salió vacío, se abre el encuadre por
    pasos hasta que la pieza entre; si aun así no aparece, se usa el cuadro
    casi completo, que nunca puede fallar porque contiene toda la foto.
    """
    rec, info = encuadrar(im, tipo=tipo)
    if _hay_pieza(rec): return rec, info

    for aire in (7.0, 9.5, 13.0):
        rec2, _ = encuadrar(im, aire=aire, tipo=tipo)
        if _hay_pieza(rec2):
            return rec2, {"fuente":f"reabierto x{aire}"}

    alto = im.height*0.94; ancho = alto/ALTO_ANCHO
    if ancho > im.width: ancho = im.width; alto = ancho*ALTO_ANCHO
    x = int((im.width-ancho)/2); y = int((im.height-alto)/2)
    return im.crop((x,y,x+int(ancho),y+int(alto))), {"fuente":"cuadro completo"}

def _toca_borde(rec, margen=0.045):
    """
    ¿La joya toca el borde del recorte? Si la señal fuerte llega hasta el
    marco, la pieza está cortada. `_hay_pieza` no lo detecta: allí HAY joya,
    sólo que a medias, y así se publicaron anillos partidos por la mitad.
    """
    a = np.asarray(rec.resize((160,213)), dtype=np.float32)/255.0
    mx, mn = a.max(2), a.min(2)
    sat = np.where(mx>0.06,(mx-mn)/np.maximum(mx,1e-6),0)
    L = a.max(2)
    # SÓLO la joya cuenta como "cortada". El listón beige del expositor está
    # a L~0,70 y el fondo gris claro también: con un umbral de brillo bajo,
    # el 94% de las fotos daban "cortada" y todas acababan sin encuadrar.
    # La gema es saturación >0,55; el metal pulido, reflejos por encima de
    # 0,92 que ningún material mate del expositor produce.
    fuerte = (sat>0.55) | (L>0.92)
    H,W = fuerte.shape
    m = max(2, int(min(H,W)*margen))
    # y hace falta una MANCHA en el borde, no un píxel suelto: doce píxeles
    # sobre 160x213 es grano; una joya cortada deja muchos más.
    MIN = 14
    return bool(fuerte[:m].sum()>MIN or fuerte[-m:].sum()>MIN or
                fuerte[:,:m].sum()>MIN or fuerte[:,-m:].sum()>MIN)

def encuadrar_completo(im, tipo="anillo"):
    """
    Recorta, comprueba que haya pieza Y que no esté cortada. Si toca el
    borde, abre el encuadre por pasos hasta que la pieza quepa entera.
    """
    if tipo in ("cadena","pulsera"):
        return encuadrar_seguro(im, tipo=tipo)
    rec, info = encuadrar_seguro(im, tipo=tipo)
    if not _toca_borde(rec): return rec, info
    for aire in (6.2, 7.6, 9.2, 11.5):
        rec2, _ = encuadrar(im, aire=aire, tipo=tipo)
        if _hay_pieza(rec2) and not _toca_borde(rec2):
            return rec2, {"fuente":f"ampliado x{aire}"}
    alto = im.height*0.94; ancho = alto/ALTO_ANCHO
    if ancho > im.width: ancho = im.width; alto = ancho*ALTO_ANCHO
    x = int((im.width-ancho)/2); y = int((im.height-alto)/2)
    return im.crop((x,y,x+int(ancho),y+int(alto))), {"fuente":"cuadro completo"}
