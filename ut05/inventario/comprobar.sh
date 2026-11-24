#!/usr/bin/env bash
# comprobar.sh · Valida el inventario y lanza 5 pruebas de rechazo sobre el punto de acceso
echo "=== Inventario original"
xmllint --noout --schema inventario.xsd inventario.xml
python3 -c "import json;json.load(open('inventario.json'));print('inventario.json: JSON válido')"
mkdir -p pruebas
n=0
while IFS='|' read -r desc cambio; do
  n=$((n+1))
  sed -e "$cambio" -e 's|"inventario.xsd"|"../inventario.xsd"|' inventario.xml > "pruebas/P$n.xml"
  echo "=== P$n · $desc"
  xmllint --noout --schema inventario.xsd "pruebas/P$n.xml" 2>&1 | grep -v -e precomputed -e "fails to validate"
done <<'LISTA'
IP fuera de la red del aula (192.168.1.3)|s#10.20.5.3<#192.168.1.3<#
MAC con dos puntos en vez de guiones|s#02-4C-10-00-00-03#02:4C:10:00:00:03#
IP repetida (la del switch)|s#10.20.5.3<#10.20.5.2<#
Fecha de compra inexistente (30 de febrero)|s#2024-01-30#2024-02-30#
VLAN 5000 (máximo 4094)|s#vlan="20"#vlan="5000"#
LISTA
