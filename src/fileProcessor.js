import path from "path";
import fs from "fs";
import { fromPath } from "pdf2pic";

/**
 * esto convetira cualquier archivo DUCA en lista de imgs
 * @param {string} filePath
 * @returns {Promise<string[]>} rutas de imgs
 */
export async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    return await convertPdfToImages(filePath);
  }

  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    return [filePath];
  }

  throw new Error("Formato de archivo no soportado");
}

/**
 * Convierte PDF en imgs
 */

async function convertPdfToImages(pdfPath) {
  const outputDir = "./tmp";

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const convert = fromPath(pdfPath, {
    density: 300,
    saveFilename: "duca_page",
    savePath: outputDir,
    format: "png",
    width: 2000,
    height: 2000,
  });

  console.log("Procesando PDF:", pdfPath);

  // Segun conversaciones con el cliente, no asumiremos que solo habran 5 paginas, por ello:
  const pages = [];
  let i = 1;

  while (true) {
    try {
      const result = await convert(i);
      console.log(`Página ${i} convertida:`, result.path);
      pages.push(result.path);
      i++;
    } catch (error) {
      console.log(`Detenido en página ${i}`);
      console.log("Error real:", error.message);

      // Solo vamos a reomper si ya procesamos al menos una página
      if (i === 1) {
        throw new Error(
          "No se pudo convertir el PDF. Verifica GraphicsMagik o la ruta del archivo.",
        );
      }

      break;
    }
  }

  if (pages.length === 0) {
    throw new Error("No se pudieron convertir páginas del PDF.");
  }

  return pages;
}
