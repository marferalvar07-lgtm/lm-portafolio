# Inventario de red · Aula 1.12

Ejercicio de la UT 5 (Lenguajes de marcas, 1.º ASIR). Seis dispositivos de la red `10.20.5.0/24`.

- `inventario.xml` + `inventario.xsd`: el inventario y su esquema. La IP solo se admite si es de la red del aula, la MAC va con guiones, la fecha de compra es `xs:date` y no se pueden repetir código, IP ni MAC.
- `inventario.json`: los mismos datos en JSON.
- `comprobar.sh`: valida todo y lanza 5 pruebas de rechazo.

| | XML | JSON |
|---|---|---|
| Bytes formateado / minificado | 2286 / 1984 | 2371 / 1554 |
| Validación | XSD (patrones de IP y MAC, fechas, unicidad) | Necesitaría JSON Schema |
| Leerlo desde un script | analizador XML | `jq`, `json.load`, `JSON.parse` |

**Para monitorización: JSON.** Herramientas como Zabbix, NetBox, Grafana o un inventario dinámico de Ansible trabajan con JSON por su API, y un script lo recorre directamente. El XML validado queda como copia oficial del inventario.
