import Tesseract from "tesseract.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runOCR() {
  const imagePath = path.join(__dirname, "output/page-1.png");

  const result = await Tesseract.recognize(imagePath, "spa", {
    logger: (m) => console.log(m.status),
  });

  console.log("\n========= TEXT OCR =========\n");
  console.log(result.data.text);

  return result.data.text;
}
