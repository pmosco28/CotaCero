# Ejemplos descargables

Los enlaces «Ver ejemplo» del catálogo (`index.html`) apuntan a estos archivos.
El producto gratuito (01 Volumetría) no lleva ejemplo en PDF.

| Archivo | Producto que lo enlaza |
|---|---|
| `informe-ejemplo.pdf` | 02 Informe de entorno y conectividad |
| `plano-ejemplo.pdf` | 03 Plano planimétrico para trámite municipal |

Los dos son **genéricos**: el lote, la clave (`0000000000000`), las calles y los
equipamientos son inventados. Llevan el sello «DOCUMENTO DE EJEMPLO» y una marca de agua.

## Estructura de cada PDF

1. **Parte 1 · Resumen** para el cliente, en lenguaje simple: qué significa, qué
   recibe y cuáles son los próximos pasos.
2. **Parte 2 · Detalle técnico**: tablas con datos y fuentes (informe) o la lámina
   con su cajetín (plano).

## Cómo editarlos

Las fuentes están en `fuente/` (HTML). Para regenerar un PDF: abrir el HTML en
Chrome → Imprimir → Guardar como PDF, con márgenes «Ninguno» y «Gráficos de fondo»
activado. El informe es A4 vertical y el plano, A4 horizontal.

Si más adelante se cambia un ejemplo por uno de un predio real, quitar los datos
personales del propietario y mantener el sello de ejemplo.
