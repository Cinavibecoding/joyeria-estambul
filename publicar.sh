#!/bin/bash
# ============================================================
# publicar.sh — Empaqueta la web para subir a Hostinger
#
# USO:
#   cd "/Users/victor/Desktop/Nuevo proyecto pagina "
#   bash publicar.sh
#
# Genera: estambul-web.zip listo para subir al hosting.
# ============================================================

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
DEST="$DIR/PUBLICAR"
ZIP="$DIR/estambul-web.zip"

echo "🔧 Preparando publicación..."

# 1. Limpiar carpeta de publicación
rm -rf "$DEST"
mkdir -p "$DEST/assets/img" "$DEST/assets/fuentes"

# 2. Copiar archivos esenciales
cp "$DIR/index.html"    "$DEST/"
cp "$DIR/catalogo.js"   "$DEST/"
cp "$DIR/robots.txt"    "$DEST/" 2>/dev/null || true
cp "$DIR/sitemap.xml"   "$DEST/" 2>/dev/null || true

# 3. Copiar fuentes
cp "$DIR/assets/fuentes.css"  "$DEST/assets/"
cp -r "$DIR/assets/fuentes/"  "$DEST/assets/fuentes/"

# 4. Copiar imágenes procesadas (si existen)
if [ -d "$DIR/assets/img/piezas" ]; then
  cp -r "$DIR/assets/img/piezas" "$DEST/assets/img/"
  echo "   ✓ $(find "$DIR/assets/img/piezas" -name '*.jpg' | wc -l | tr -d ' ') fotos copiadas"
else
  echo "   ⚠ No hay fotos en assets/img/piezas — corre procesar-fotos.py primero"
fi

# 5. Copiar hero y og-preview (están sueltos en assets/img/)
cp "$DIR"/assets/img/hero-*.jpg "$DEST/assets/img/" 2>/dev/null || true
cp "$DIR"/assets/img/og-preview.jpg "$DEST/assets/img/" 2>/dev/null || true

# 6. Crear ZIP
cd "$DEST"
rm -f "$ZIP"
zip -r "$ZIP" . -x ".*" "__MACOSX/*"
echo ""
echo "✅ Listo: estambul-web.zip ($(du -h "$ZIP" | cut -f1))"
echo ""
echo "Siguiente paso: sube estambul-web.zip a Hostinger."
echo "  1. Entra a hPanel → Administrador de archivos"
echo "  2. Navega a public_html/"
echo "  3. Sube el ZIP y extráelo ahí"
echo "  4. Listo — tu página está en vivo"
