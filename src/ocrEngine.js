import Tesseract from "tesseract.js";
import fs from "fs/promises";
import path from "path";
import { error } from "console";

/**
 * Ejecuta OCR sobre todas las imagenes PNG dentro de un directorio
 * @param {string} imagesDir - Folder que contene las imgs convertidas del pdf
 * @returns {promises<string>} Texto completo del ocr
 */

export async function extractTextFromImages(imagesDir) {
  try {
    const fullDirPath = path.resolve(imagesDir);

    const files = await fs.readdir(fullDirPath);

    const imageFiles = files
      .filter((file) => file.toLowerCase().endsWith(".png"))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    if (!imageFiles.length) {
      throw new Error("No se encontraron imágenes PNG para procesar.");
    }

    console.log(` Procesando ${imageFiles.length} páginas con OCR... `);

    const results = await Promise.all(
      imageFiles.map((file) => {
        const imagePath = path.join(fullDirPath, file);

        return Tesseract.recognize(imagePath, "spa", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              console.log(`Reconociendo ${file}...`);
            }
          },
        });
      }),
    );

    const fullText = results
      .map((result) => result.data.text)
      .join("\n\n==== NUEVA PAGINA ====\n\n");

    const cleanedText = cleanOCRText(fullText);

    return cleanedText;
  } catch (error) {
    console.error("Error en OCR Engine:", error);
    throw error;
  }
}

/**
 * Limpieza basica de textto Ocr
 * Reduce ruido comun
 */
function cleanOCRText(text) {
  return text
    .replace(/[|]/g, "I")
    .replace(/[“”]/g, '"')
    .replace(/\r/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

// previous version /refactored
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export async function runOCR() {
//   const imagePath = path.join(__dirname, "output/page-1.png");

//   const result = await Tesseract.recognize(imagePath, "spa", {
//     logger: (m) => console.log(m.status),
//   });

//   console.log("\n========= TEXT OCR =========\n");
//   console.log(result.data.text);

//   return result.data.text;
// }
