import { processFile } from "./src/fileProcessor.js";
import { extractTextFromImages } from "./src/ocrEngine.js";
import { parseVehicleData } from "./src/dataParser.js";
import { buildContractDocument } from "./src/contractBuilder.js";
import { generateContractDoc } from "./src/contractGenerator.js";
import { getFormattedDate, getFormattedTime } from "./src/dateFormatter.js";

// pipeline o flujo principal del sistema

async function main() {
  try {
    console.log("Iniciando pipeline DUCA...\n");

    // 1. Archivo de entrada
    const filePath = "./input/duca.pdf";

    // 2. Convertir a imgs
    const imagePaths = await processFile(filePath);
    console.log("PDF convertido a imágenes\n");

    // 3. OCR
    const ocrText = await extractTextFromImages(imagePaths);
    console.log("OCR completado\n");

    // 4. Parsear datos del carro
    const vehicleData = parseVehicleData(ocrText);
    console.log("Datos extraídos:\n", vehicleData, "\n");

    // 5. Datos del comprador (mock manual)
    const buyerData = {
      nombre: "JUAN CARLOS PEREZ",
      edad: "TREINTA Y CINCO",
      domicilio: "SAN SALVADOR",
      dui: "12345678-9",
    };

    // 6. Fecha dinámica
    const date = getFormattedDate();
    const time = getFormattedTime();

    // 7. Construir contrato
    const contractText = buildContractDocument({
      vehicleData,
      buyerData,
      date,
      time,
    });

    console.log("Contrato construido\n");

    // 8. Generar DOCX
    await generateContractDoc(contractText);

    console.log("PROCESO COMPLETO FINALIZADO ");
  } catch (error) {
    console.error("Error en pipeline:", error);
  }
}

main();
