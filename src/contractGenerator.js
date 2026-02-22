import { buildContractDocument } from "./contractBuilder.js";
import { Packer } from "docx";
import { promises as fs } from "fs";
import path from "path";

// Objetivo de este js file: Generar el archivo DOCX de la compraventa
/** 
*@param {Object} data - Datos estructurados de la compraventa 
*@param {Object} data.comprador
*@param {Object} data.vendedor
*@param {Object} data.vehiculo
*@param {Object} options - Opciones adicionales
*@returns {Promise<string>} - Ruta del archivo generado

*/

export async function generateContractDoc(data, options = {}) {
  try {
    const {
      outputDir = "output",
      fileName = `COMPRAVENTA_${Date.now()}.docx`,
    } = options;

    // Contruir el documento
    const document = buildContractDocument(data);

    // Convertir a buffer
    const buffer = await Packer.toBuffer(document);

    // Asegurarse que el directorio existe
    const fullOutputDir = path.resolve(outputDir);
    await fs.mkdir(fullOutputDir, { recursive: true });

    // Ruta final del archivo
    const filePath = path.join(fullOutputDir, fileName);

    // Guardamos el archivo
    await fs.writeFile(filePath, buffer);

    console.log("Compraventa generada correctamente");
    console.log(filePath);

    return filePath;
  } catch (error) {
    console.error("Error generando la compraventa:", error);
    throw error;
  }
}
