#!/usr/bin/env bash
# rechazos.sh · Pruebas R1-R7: ¿quién detecta cada error, la DTD o el XSD?
# Genera las copias en rechazos/ y al final muestra un resumen.
# Uso:  bash rechazos.sh

CARPETA=rechazos
mkdir -p "$CARPETA"
RESUMEN=""

prueba() {   # $1 = número, $2 = descripción, $3 = orden sed
  local n="$1" desc="$2" cambio="$3"
  local fdtd="$CARPETA/dtd_$n.xml" fxsd="$CARPETA/xsd_$n.xml"

  sed -e "$cambio" -e 's|"catalogo.dtd"|"../catalogo.dtd"|' catalogo.xml     > "$fdtd"
  sed -e "$cambio" -e 's|"catalogo.xsd"|"../catalogo.xsd"|' catalogo-xsd.xml > "$fxsd"

  echo "################ $n · $desc"
  echo "--- DTD:";  xmllint --noout --valid "$fdtd" 2>&1 | head -n 2
  if xmllint --noout --valid "$fdtd" 2>/dev/null; then d="no lo detecta"; else d="RECHAZA"; fi
  echo "--- XSD:";  xmllint --noout --schema catalogo.xsd "$fxsd" 2>&1 | grep -v -e precomputed -e "fails to validate" | head -n 2
  if xmllint --noout --schema catalogo.xsd "$fxsd" 2>/dev/null; then x="no lo detecta"; else x="RECHAZA"; fi
  RESUMEN+=$(printf "%-4s %-34s %-15s %s" "$n" "$desc" "$d" "$x")$'\n'
}

prueba R1 'precio "gratis"'            's|>29.95<|>gratis<|'
prueba R2 'ref repetida (BR-0201)'     's|ref="BR-0202"|ref="BR-0201"|'
prueba R3 'categoria "ropa"'           '/BR-0202/s|"accesorio"|"ropa"|'
prueba R4 'sin <stock>'                '/<stock>18<\/stock>/d'
prueba R5 'ref="X-2"'                  's|ref="BR-0202"|ref="X-2"|'
prueba R6 'stock -3'                   's|<stock>18</stock>|<stock>-3</stock>|'
prueba R7 'precio antes que nombre'    '/Candado U Pro/{h;d};/>29.95</{G}'

echo
echo "================== RESUMEN =================="
printf "%-4s %-34s %-15s %s\n" "N.º" "Cambio en BR-0202" "DTD" "XSD"
printf "%s" "$RESUMEN"
