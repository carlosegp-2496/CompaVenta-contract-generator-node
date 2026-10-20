import { createWorker, PSM } from "tesseract.js";
import { extractDucaFields } from "./extractDucaFields.js";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const GM_PATH = String.raw`C:\Program Files\GraphicsMagick-1.3.46-Q16\gm.exe`;

const imagePath = "./tmp/duca_table.png";

async function preprocessField31() {
  const inputPath = "./tmp/duca_table.png";
  const outputPath = "./tmp/duca_field31_enlarged.png";

  await execFileAsync(GM_PATH, [
    "convert",
    inputPath,
    "-crop",
    "800x100+950+110",
    "+repage",
    "-resize",
    "200%",
    "-colorspace",
    "Gray",
    "-contrast",
    outputPath,
  ]);

  console.log("Recorte del campo 31 preparado.");

  return outputPath;
}

async function preprocessEngineNumber() {
  const inputPath = "./tmp/duca_table.png";
  const outputPath = "./tmp/duca_engine_enlarged.png";

  await execFileAsync(GM_PATH, [
    "convert",
    inputPath,
    "-crop",
    "700x60+50+175",
    "+repage",
    "-resize",
    "200%",
    "-colorspace",
    "Gray",
    "-contrast",
    outputPath,
  ]);

  console.log("Recorte del número de motor preparado.");

  return outputPath;
}

async function preprocessEngineValue() {
  const inputPath = "./tmp/duca_engine_enlarged.png";
  const outputPath = "./tmp/duca_engine_value.png";

  await execFileAsync(GM_PATH, [
    "convert",
    inputPath,
    "-crop",
    "320x60+670+35",
    "+repage",
    "-resize",
    "300%",
    "-colorspace",
    "Gray",
    "-contrast",
    outputPath,
  ]);

  console.log("Recorte del valor del motor preparado.");

  return outputPath;
}

async function preprocessEngineVariants() {
  const inputPath = "./tmp/duca_engine_enlarged.png";

  const variants = [
    {
      name: "A - Grises sin ampliación",
      output: "./tmp/engine_A.png",
      options: ["-colorspace", "Gray"],
    },
    {
      name: "B - Grises al 200%",
      output: "./tmp/engine_B.png",
      options: ["-colorspace", "Gray", "-resize", "200%"],
    },
    {
      name: "C - Tratamiento actual",
      output: "./tmp/engine_C.png",
      options: ["-resize", "300%", "-colorspace", "Gray", "-contrast"],
    },
  ];

  for (const variant of variants) {
    await execFileAsync(GM_PATH, [
      "convert",
      inputPath,
      "-crop",
      "320x60+670+35",
      "+repage",
      ...variant.options,
      variant.output,
    ]);

    console.log(`Imagen preparada: ${variant.name}`);
  }

  return variants;
}

async function testTableOCR() {
  let worker;

  try {
    console.log("Iniciando OCR con coordenadas...");

    worker = await createWorker("spa");

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SPARSE_TEXT,
    });

    const { data } = await worker.recognize(
      imagePath,
      {},
      {
        text: true,
        blocks: true,
        hocr: true,
        tsv: true,
        box: true,
      },
    );

    console.log("\n===== TEXTO OCR =====\n");
    console.log(data.text);

    console.log("\n===== CAMPOS EXTRAÍDOS =====\n");

    const vehicleData = extractDucaFields(data.hocr);

    console.log(JSON.stringify(vehicleData, null, 2));

    console.log("\n===== SEGUNDA PASADA: CAMPO 31 =====\n");

    const field31Image = await preprocessField31();

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    });

    const { data: field31Data } = await worker.recognize(
      field31Image,
      {},
      { text: true },
    );

    console.log("Texto reconocido:", JSON.stringify(field31Data.text));

    console.log("\n===== TERCERA PASADA: NÚMERO DE MOTOR =====");

    const engineImage = await preprocessEngineNumber();

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    });

    const { data: engineData } = await worker.recognize(
      engineImage,
      {},

      {
        text: true,
        tsv: true,
        hocr: true,
        blocks: true,
      },
    );

    console.log("Texto reconocido:", JSON.stringify(engineData.text));
    console.log("Confianza:", engineData.confidence);
    console.log("Datos disponibles:", Object.keys(engineData));

    console.log("TSV del número de motor:");
    console.log(engineData.tsv);

    console.log("\n===== COMPARACIÓN DE PREPROCESAMIENTO =====");

    const variants = await preprocessEngineVariants();

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_LINE,
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    });

    for (const variant of variants) {
      const { data } = await worker.recognize(
        variant.output,
        {},
        {
          text: true,
          tsv: true,
        },
      );

      console.log(`\n--- ${variant.name} ---`);
      console.log("Texto:", JSON.stringify(data.text.trim()));
      console.log("Confianza general:", data.confidence);
      console.log("TSV:", data.tsv);
    }

    console.log("\n===== VALIDACIÓN: VARIANTE B =====");

    for (let i = 1; i <= 3; i++) {
      const { data } = await worker.recognize(
        "./tmp/engine_B.png",
        {},
        {
          text: true,
          tsv: true,
        },
      );

      console.log(
        `Intento ${i}:`,
        JSON.stringify(data.text.trim()),
        "| Confianza:",
        data.confidence,
      );
    }

    console.log("\n===== RESULTADO BOX =====\n");

    if (data.box) {
      console.log(data.box);
    } else {
      console.log("Tesseract no devolvió datos BOX.");
    }

    console.log("\n===== PALABRAS Y COORDENADAS AGRUPADAS =====");

    if (!data.hocr) {
      console.log("No hay datos HOCR.");
    } else {
      const regex =
        /<span class='ocrx_word'[^>]*title='bbox (\d+) (\d+) (\d+) (\d+); x_wconf (\d+)'>(.*?)<\/span>/gs;

      const words = [];
      let match;

      while ((match = regex.exec(data.hocr)) !== null) {
        words.push({
          x: Number(match[1]),
          y: Number(match[2]),
          right: Number(match[3]),
          bottom: Number(match[4]),
          confidence: Number(match[5]),
          text: match[6],
        });
      }

      // Agrupar palabras que pertenecen aproximadamente a la misma fila.
      const rows = [];

      for (const word of words) {
        let row = rows.find((item) => Math.abs(item.y - word.y) <= 3);

        if (!row) {
          row = { y: word.y, words: [] };
          rows.push(row);
        }

        row.words.push(word);
      }

      rows.sort((a, b) => a.y - b.y);

      for (const row of rows) {
        row.words.sort((a, b) => a.x - b.x);

        const text = row.words.map((word) => word.text).join(" ");

        console.log(`Y: ${String(row.y).padStart(3)} | ${text}`);

        for (const word of row.words) {
          console.log(
            `   X: ${String(word.x).padStart(4)} | ` +
              `Confianza: ${String(word.confidence).padStart(2)} | ` +
              `${word.text}`,
          );
        }
      }

      console.log(`\nTotal de palabras detectadas: ${words.length}`);
    }

    console.log("\n===== FIN DEL EXPERIMENTO =====");
  } catch (error) {
    console.error("Error durante el experimento OCR:", error);
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}

testTableOCR();
