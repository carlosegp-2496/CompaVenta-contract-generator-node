const FIELD_DEFINITIONS = {
  16: { key: "paisProcedencia", label: "País de procedencia", column: "left" },
  17: { key: "chasisGrabado", label: "Chasis grabado", column: "left" },
  18: { key: "vin", label: "VIN", column: "left" },
  19: { key: "numeroMotor", label: "Número de motor", column: "left" },
  20: { key: "anio", label: "Año", column: "left" },
  21: { key: "marca", label: "Marca", column: "left" },
  22: { key: "lineaEstilo", label: "Línea y estilo", column: "left" },
  23: { key: "clase", label: "Clase", column: "left" },
  24: { key: "color", label: "Color", column: "left" },
  25: { key: "tipoCombustible", label: "Tipo de combustible", column: "left" },
  26: { key: "tipoCapacidad", label: "Tipo de capacidad", column: "left" },
  27: { key: "capacidad", label: "Capacidad", column: "left" },
  28: { key: "numeroCilindros", label: "Número de cilindros", column: "left" },

  29: { key: "cilindrada", label: "Cilindrada", column: "right" },
  30: { key: "peso", label: "Peso", column: "right" },
  31: { key: "numeroPuertas", label: "Número de puertas", column: "right" },
  32: {
    key: "placaContenedor",
    label: "No. placa/contenedor",
    column: "right",
  },
  33: {
    key: "paisEstadoPlaca",
    label: "País/estado de placa",
    column: "right",
  },
  34: {
    key: "condicionVehiculo",
    label: "Condición del vehículo",
    column: "right",
  },
  35: {
    key: "ubicacionVolante",
    label: "Ubicación del volante",
    column: "right",
  },
  36: { key: "fechaProduccion", label: "Fecha de producción", column: "right" },
  37: { key: "modelo", label: "Modelo", column: "right" },
  38: { key: "tipoCama", label: "Tipo de cama", column: "right" },
  39: { key: "tipoIngreso", label: "Tipo de ingreso", column: "right" },
  40: { key: "usoVehiculo", label: "Uso del vehículo", column: "right" },
  41: {
    key: "categoriaEspecial",
    label: "Categoría especial",
    column: "right",
  },
  42: { key: "observaciones", label: "Observaciones", column: "left" },
};

function parseHocrWords(hocr) {
  const regex =
    /<span class=['"]ocrx_word['"][^>]*title=['"]bbox (\d+) (\d+) (\d+) (\d+); x_wconf (\d+)['"][^>]*>(.*?)<\/span>/gs;

  const words = [];
  let match;

  while ((match = regex.exec(hocr)) !== null) {
    words.push({
      x: Number(match[1]),
      y: Number(match[2]),
      right: Number(match[3]),
      bottom: Number(match[4]),
      confidence: Number(match[5]),
      text: match[6].replace(/<[^>]*>/g, "").trim(),
    });
  }

  return words;
}

function groupWordsIntoRows(words, tolerance = 3) {
  const rows = [];

  for (const word of words) {
    let row = rows.find((item) => Math.abs(item.y - word.y) <= tolerance);

    if (!row) {
      row = { y: word.y, words: [] };
      rows.push(row);
    }

    row.words.push(word);
  }

  rows.sort((a, b) => a.y - b.y);

  for (const row of rows) {
    row.words.sort((a, b) => a.x - b.x);
  }

  return rows;
}

function getFieldNumber(word, column) {
  // Los números de la columna izquierda están cerca de X=50.
  // Los de la columna derecha están cerca de X=978.
  const correctColumn =
    column === "left" ? word.x < 100 : word.x >= 950 && word.x < 1000;

  if (!correctColumn) return null;

  const match = word.text.match(/^(\d{1,2})\.?$/);

  return match ? Number(match[1]) : null;
}

function extractDucaFields(hocr) {
  const words = parseHocrWords(hocr);
  const rows = groupWordsIntoRows(words);
  const fields = {};

  for (const [number, definition] of Object.entries(FIELD_DEFINITIONS)) {
    const fieldNumber = Number(number);

    const row = rows.find((item) =>
      item.words.some(
        (word) => getFieldNumber(word, definition.column) === fieldNumber,
      ),
    );

    if (!row) {
      fields[definition.key] = {
        label: definition.label,
        value: null,
        confidence: null,
        status: "not_detected",
      };

      continue;
    }

    // En esta tabla, los valores de la columna izquierda aparecen
    // aproximadamente entre X=350 y X=900.
    // Los valores de la columna derecha aparecen desde X=1400.
    const valueWords = row.words.filter((word) => {
      if (definition.column === "left") {
        return word.x >= 350 && word.x < 900;
      }

      return word.x >= 1400;
    });

    const value = valueWords
      .map((word) => word.text)
      .join(" ")
      .trim();

    const confidence =
      valueWords.length > 0
        ? Math.min(...valueWords.map((word) => word.confidence))
        : null;

    let status;

    if (!value) {
      status = "needs_review";
    } else if (confidence < 60) {
      status = "low_confidence";
    } else {
      status = "extracted";
    }

    fields[definition.key] = {
      label: definition.label,
      value: value || null,
      confidence,
      status,
    };
  }

  return fields;
}

export { extractDucaFields };
