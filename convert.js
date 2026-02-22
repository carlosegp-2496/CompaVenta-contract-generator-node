import pdf from "pdf-poppler";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function convertPDF() {
  const file = path.join(__dirname, "duca.pdf");

  const outputDir = path.join(__dirname, "output");

  await fs.ensureDir(outputDir);

  const opts = {
    format: "png",
    out_dir: outputDir,
    out_prefix: "page",
    page: null,
  };

  await pdf.convert(file, opts);

  console.log("PDF convertido a imagen exitosamentee");
}
