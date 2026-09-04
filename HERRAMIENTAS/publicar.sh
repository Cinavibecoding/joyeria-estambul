#!/bin/bash
# Arma el paquete que se sube a Hostinger.
# Se ejecuta desde la raíz del proyecto:  bash HERRAMIENTAS/publicar.sh
set -e
cd "$(dirname "$0")/.."
rm -rf PUBLICAR estambul-web.zip
mkdir -p PUBLICAR/assets/img/piezas/mini PUBLICAR/assets/fuentes
cp index.html catalogo.js PUBLICAR/
cp assets/fuentes.css PUBLICAR/assets/
cp assets/fuentes/*.woff2 PUBLICAR/assets/fuentes/
cp assets/img/*.jpg PUBLICAR/assets/img/              # NUNCA descartadas/
cp assets/img/piezas/*.jpg PUBLICAR/assets/img/piezas/
cp assets/img/piezas/mini/*.jpg PUBLICAR/assets/img/piezas/mini/
cd PUBLICAR && zip -qr ../estambul-web.zip .
cd ..
echo "paquete: $(find PUBLICAR -type f | wc -l | tr -d ' ') archivos · $(du -sh estambul-web.zip | cut -f1)"
