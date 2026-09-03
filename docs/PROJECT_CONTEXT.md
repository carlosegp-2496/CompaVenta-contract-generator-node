# DUCA OCR SaaS

Versión: 0.1 (MVP)

Última actualización: 23 Julio 2026

---

# 1. Objetivo del proyecto

Desarrollar una aplicación SaaS que permita automatizar la generación de contratos de compraventa de vehículos a partir de una Declaración Única Centroamericana (DUCA).

El objetivo principal es reducir el tiempo que un empleado de oficina dedica a procesar manualmente una compraventa, disminuyendo errores humanos y aumentando la productividad.

La aplicación estará orientada inicialmente a agencias importadoras de vehículos en El Salvador.

---

# 2. Problema que resuelve

Actualmente el proceso consiste en:

• Escanear una DUCA.

• Leer manualmente toda la información del vehículo.

• Escribir nuevamente todos los datos dentro de un contrato Word.

• Completar manualmente la información del comprador.

• Revisar errores.

Este proceso consume varios minutos por documento.

La aplicación automatizará la mayor parte del trabajo.

---

# 3. Objetivos funcionales

El sistema deberá permitir:

✔ Subir un PDF.

✔ Subir imágenes JPG o PNG.

✔ Ejecutar OCR.

✔ Detectar automáticamente los datos del vehículo.

✔ Permitir ingresar manualmente los datos del comprador.

✔ Generar automáticamente un contrato DOCX.

✔ Descargar el contrato listo para impresión.

---

# 4. Arquitectura General

                Frontend
                   │
                   ▼
             Express API
                   │
                   ▼
           File Processor
                   │
         ┌─────────┴─────────┐
         ▼                   ▼

Conversión PDF Imagen directa
│ │
└─────────┬─────────┘
▼
OCR Engine
▼
Data Parser
▼
Datos del vehículo
▼
Datos comprador (manual)
▼
Contract Builder
▼
Contract Generator
▼
Archivo DOCX

---

# 5. Stack tecnológico

Backend

• Node.js

• Express.js (pendiente)

• ES Modules

Procesamiento

• GraphicsMagick

• Ghostscript

• Tesseract.js

Generación de documentos

• docx

Frontend (pendiente)

• React (por definir)

---

# 6. Estructura actual del proyecto

/src

contractBuilder.js

contractGenerator.js

dataParser.js

dateFormatter.js

fileProcessor.js

ocrEngine.js

index.js

/docs

PROJECT_CONTEXT.md

DEVLOG.md

---

# 7. Estado actual

## Módulos implementados

✔ dateFormatter

✔ contractBuilder

✔ contractGenerator

✔ fileProcessor

✔ OCR Engine

✔ index.js (CLI)

✔ Conversión PDF → PNG

✔ OCR multipágina

✔ Manejo dinámico del número de páginas

---

## Módulos parcialmente implementados

⚠ dataParser

Actualmente funciona mediante expresiones regulares.

Debe hacerse más robusto para soportar errores del OCR.

---

## Pendientes

Backend Express

Frontend

API REST

Carga de archivos

Formulario comprador

Vista previa PDF

Generación final DOCX

Descarga del contrato

---

# 8. Decisiones de arquitectura

Durante el análisis con el cliente se tomaron las siguientes decisiones.

## Comprador

La DUCA no contiene información del comprador.

Por tanto será ingresado manualmente por el usuario.

---

## Vendedor

El vendedor corresponde al importador contenido en la DUCA.

---

## OCR

El sistema debe aceptar:

• PDF

• JPG

• PNG

El backend decidirá automáticamente cómo procesar cada archivo.

---

## Número de páginas

Aunque actualmente todas las DUCAs del cliente contienen cinco páginas, el sistema no asumirá un número fijo.

El procesamiento será dinámico para facilitar futuras modificaciones.

---

## Contrato

El contrato NO utilizará plantillas Word.

Será construido completamente mediante código usando la librería docx.

Esta decisión permite controlar con precisión:

• formato

• negritas

• mayúsculas

• variables

• espaciado

• párrafos

---

# 9. Roadmap

FASE 1

✔ OCR

✔ Parser

✔ Builder

✔ DOCX

---

FASE 2

Backend Express

Subida de archivos

API

---

FASE 3

Frontend

Formulario comprador

Vista previa

Generación del contrato

---

FASE 4

Optimización

Validaciones

Base de datos

Autenticación

Despliegue

---

# 10. Próximo paso

Robustecer dataParser.

El objetivo será hacer que pueda detectar correctamente la sección:

DATOS DEL VEHÍCULO

aunque el OCR cambie:

• acentos

• espacios

• saltos de línea

• caracteres erróneos

antes de comenzar el parseo de los campos.
