import Tesseract from "tesseract.js";
import path from "path";

const imagePath = path.resolve("./tmp/duca_page.5.png");

console.log("=================================");
console.log("      PRUEBA OCR - PÁGINA 5");
console.log("=================================");
console.log(`Imagen: ${imagePath}`);
console.log();

try {
  const result = await Tesseract.recognize(imagePath, "spa", {
    logger: (message) => {
      if (message.status === "recognizing text") {
        console.log(`Progreso OCR: ${Math.round(message.progress * 100)}%`);
      }
    },

    tessedit_pageseg_mode: "11",
  });

  console.log("\n===== RESULTADO OCR =====\n");

  console.log(result.data.text);

  console.log("\n===== FIN OCR =====\n");
} catch (error) {
  console.error("Error durante la prueba OCR:", error);
}
