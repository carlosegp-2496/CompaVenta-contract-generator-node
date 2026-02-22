import { convertPDF } from "./convert.js";
import { runOCR } from "./ocr.js";

async function main() {
  try {
    await convertPDF();
    await runOCR();
  } catch (error) {
    console.error("Error en el proceso:", error);
  }
}

main();
