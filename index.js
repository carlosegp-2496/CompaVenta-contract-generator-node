import { extractTextFromImages } from "./ocrEngine.js";
import { parseVehicleData } from "./dataParser.js";
import { getCurrentDateInWords, getCurrentTimeInWords } from "./dateFormatter";
import { generateContractDoc } from "./contractGenerator.js";

/**
 * Flujo principal del sistema
 */

async function main() {
  try {
    console.log("Iniciando proceso DUCA ---> Contrato ...");

    // Ejecutar OCR
    const fullText = await extractTextFromImages("./images");

    // Parsear datos del vehiculo
    const vehicleData = parseVehicleData(fullText);

    console.log("Datos extraídos:");
    console.log(vehicleData);

    // Fecha y hora dinamica
    const fecha = getCurrentDateInWords("Nejapa");
    const hora = getCurrentTimeInWords();

    // Construir objeto final para el contrato
    const contractData = {
      vehiculo: vehicleData,
      fecha,
      hora,
      // aqui tenemos que agregar comprado y precio
    };

    // Generar contrato o compraventa
    await generateContractDoc(contractData);

    console.log("Proceso completado correctamente.");
  } catch (error) {
    console.error("Error en el flujo principal:", error);
  }
}

main();

// import { convertPDF } from "./convert.js";
// import { runOCR } from "./ocr.js";

// async function main() {
//   try {
//     await convertPDF();
//     await runOCR();
//   } catch (error) {
//     console.error("Error en el proceso:", error);
//   }
// }

// main();
