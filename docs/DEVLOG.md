# DEVLOG

---

# Sesión 01

Objetivo

Diseñar la arquitectura inicial del proyecto.

Trabajo realizado

• Se decidió utilizar Node.js.

• Se adoptó ES Modules.

• Se descartó generar el contrato usando plantillas Word.

• Se decidió construir el documento completamente mediante docx.

Resultado

Arquitectura inicial definida.

---

# Sesión 02

Objetivo

Crear el pipeline de procesamiento.

Trabajo realizado

• Se creó fileProcessor.js.

• Se implementó la conversión PDF → PNG.

• Se integró GraphicsMagick.

• Se integró Ghostscript.

Problemas encontrados

Ghostscript no estaba instalado.

Solución

Instalación y configuración correcta del entorno.

Resultado

Conversión de PDF funcionando.

---

# Sesión 03

Objetivo

Implementar OCR.

Trabajo realizado

• Integración con Tesseract.js.

• OCR multipágina.

• Limpieza básica del texto OCR.

Problemas encontrados

El OCR producía mucho ruido.

Resultado

OCR funcional.

Pendiente

Mejorar limpieza del texto.

---

# Sesión 04

Objetivo

Implementar parser.

Trabajo realizado

• Separación de páginas.

• Extracción de la página del vehículo.

• Expresiones regulares para VIN, motor, marca, color, etc.

Problemas encontrados

El OCR modifica palabras como:

VEHÍCULO

VEHICULO

VEHICUL0

Lo que rompe el parser.

Pendiente

Construir un parser más tolerante.

---

# Sesión 05

Objetivo

Diseñar el contrato.

Trabajo realizado

• Se analizó el documento legal.

• Se identificaron los datos variables.

• Se implementó contractBuilder.

• Se implementó contractGenerator.

Resultado

La estructura del contrato quedó completamente modelada.

---

# Sesión 06

Objetivo

Diseñar el futuro SaaS.

Trabajo realizado:

Se redefinió el proyecto para convertirse en una aplicación web.

Se tomó la decisión de:

• aceptar PDF

• aceptar JPG

• aceptar PNG

• solicitar manualmente los datos del comprador

• mantener un backend independiente del frontend

Resultado

Arquitectura definitiva del sistema aprobada.

---

# Estado al finalizar esta sesión

El OCR ya funciona.

La conversión PDF → PNG funciona.

El pipeline general funciona.

El punto crítico actual es robustecer dataParser para que tolere errores del OCR antes de comenzar el desarrollo del backend con Express y posteriormente el frontend.

# Log del proyecto — 1 septiembre 2026

Funcionando:

Node + ESM
Pipeline principal
PDF input
GraphicsMagick
Ghostscript
Conversión PDF → PNG
Detección flexible de páginas
OCR con Tesseract
Detección de 5 páginas
Extracción de página 5
Identificación de DATOS DEL VEHICULO

Problema actual:

OCR de la tabla de vehículo no está devolviendo los campos
dataParser.js recibe una sección prácticamente vacía
Los campos terminan en null

Problemas pendientes:

Mejorar mensajes de debugging de dataParser
Resolver buildContract is not defined
Verificar/integrar contractBuilder.js
Integrar datos manuales del comprador
Generación final del DOCX
Backend Express
Frontend para carga del DUCA + ingreso manual
Flujo completo de SaaS

# ASesion 10

# DUCA OCR Engine — Optimización del reconocimiento del número de motor

**Fecha:** 19 de octubre de 2026  
**Estado:** Experimento exitoso; pendiente de validación con documentos adicionales.

## 1. Objetivo

Mejorar el reconocimiento OCR del campo `numeroMotor` en documentos DUCA.

En la primera pasada de reconocimiento, Tesseract identificó incorrectamente el número de motor como `GANHNH330804`, con una confianza aproximada de 39. El valor esperado para el documento de prueba era `G4NHNH330804`.

El objetivo fue aislar el campo, comparar diferentes estrategias de preprocesamiento y encontrar una configuración que permitiera reconocer correctamente el valor.

## 2. Aislamiento del campo

Se trabajó en `ocrTestTable.js`, manteniendo intactos los módulos principales del motor OCR.

Se creó un procesamiento experimental para recortar la región del número de motor a partir de `duca_table.png` y generar una imagen ampliada para realizar pruebas independientes.

Se utilizó GraphicsMagick para procesar las imágenes y Tesseract.js 7.0.0 para reconocer el texto.

## 3. Primera prueba: reconocimiento del campo completo

Se ejecutó Tesseract.js sobre el recorte que incluía la etiqueta y el valor del motor, utilizando `PSM.SINGLE_BLOCK`.

Se solicitaron los datos de texto, TSV, hOCR y bloques para inspeccionar los resultados del reconocimiento.

**Resultado:**

- Etiqueta reconocida: `NUMERO DE MOTOR`.
- Confianza de la etiqueta: aproximadamente 96.6.
- Valor reconocido: `GA4NHNH330804`.
- Confianza del valor: aproximadamente 57.3.

La etiqueta se reconoció correctamente, pero el número presentó errores en sus primeros caracteres. Esto confirmó la necesidad de procesar el valor en un recorte más específico.

## 4. Segunda prueba: comparación de preprocesamiento

Se generaron tres variantes del recorte del valor a partir de `duca_engine_enlarged.png`.

### Variante A — Escala de grises sin ampliación adicional

- Procesamiento: recorte y conversión a escala de grises.
- Resultado: `G4NHNH330804`.
- Confianza: 64.28.

La lectura fue correcta, pero la confianza fue relativamente baja.

### Variante B — Escala de grises y ampliación al 200 %

- Procesamiento: recorte, conversión a escala de grises y ampliación adicional al 200 %, sin aplicar otro filtro de contraste.
- Resultado: `G4NHNH330804`.
- Confianza: 89.77.

Esta variante obtuvo el mejor resultado de las tres pruebas.

### Variante C — Ampliación al 300 % y contraste adicional

- Procesamiento: recorte, ampliación al 300 %, escala de grises y contraste adicional.
- Resultado: `S4NHNH330804`.
- Confianza: 63.95.

Tesseract confundió el primer carácter `G` con `S`. La ampliación adicional al 300 % no mejoró el reconocimiento.

### Tabla comparativa

| Variante | Procesamiento adicional                    | Resultado OCR  | Confianza |
| -------- | ------------------------------------------ | -------------- | --------: |
| A        | Escala de grises, sin ampliación adicional | `G4NHNH330804` |     64.28 |
| B        | Escala de grises y ampliación al 200 %     | `G4NHNH330804` |     89.77 |
| C        | Ampliación al 300 % y contraste adicional  | `S4NHNH330804` |     63.95 |

**Hallazgo:** la variante B fue la más efectiva para el documento evaluado.

**Nota técnica:** las tres variantes parten de `duca_engine_enlarged.png`, que ya había recibido un procesamiento previo. Por tanto, la variante B evita añadir otro filtro de contraste, pero no elimina necesariamente el contraste aplicado en etapas anteriores.

## 5. Tercera prueba: validación de reproducibilidad

Se ejecutó tres veces consecutivas el reconocimiento de `engine_B.png`, manteniendo la misma configuración de Tesseract.

| Intento | Texto reconocido | Confianza |
| ------- | ---------------- | --------: |
| 1       | `G4NHNH330804`   |        89 |
| 2       | `G4NHNH330804`   |        89 |
| 3       | `G4NHNH330804`   |        89 |

Los tres intentos devolvieron exactamente el valor esperado, con una confianza de 89 en cada ejecución.

Esto confirma que el resultado es reproducible para la imagen y configuración utilizadas. Sin embargo, todavía no demuestra que la estrategia funcione con otros documentos DUCA.

## 6. Hallazgos técnicos

- Procesar un campo individualmente puede mejorar el resultado obtenido al reconocer una tabla completa.
- La variante B, con ampliación adicional al 200 % y escala de grises, obtuvo la mayor confianza.
- Una ampliación mayor no garantiza mejores resultados; en este caso, la variante C produjo un error en el primer carácter.
- El TSV permite inspeccionar la confianza asociada al texto reconocido.
- La confianza de Tesseract no garantiza por sí sola que el dato sea correcto.
- Los parámetros del OCR deben controlarse para evitar que una configuración específica afecte otros reconocimientos.

## 7. Archivos experimentales

- `ocrTestTable.js`: script de pruebas
