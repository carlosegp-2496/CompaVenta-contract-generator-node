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
