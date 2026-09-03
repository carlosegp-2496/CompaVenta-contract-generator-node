/**
 * Extrae datos del vehiculo desde el texto ocr completo
 * @param {string} fullText
 * @returns {Object}
 */

export function parseVehicleData(fullText) {
  try {
    // Separar las paginas del DUCA, porque solo se usara la 5
    const pages = fullText.split(/=+\s*NUEVA\s+PAGINA\s*=+/i);
    console.log("Número de páginas detectadas:", pages.length);

    if (pages.length < 5) {
      console.warn(
        "Menos de 5 páginas detectadas, usando última página disponible.",
      );
    }

    // Tomar paginas no.5 (indice 4)
    const pageFive = pages[pages.length - 1];

    //testing//
    console.log("\n===== PAGE 5 RAW OCR =====\n");
    console.log(pageFive);

    // Extraer solo seccion despues de DATOS DEL VEHICULO
    const vehicleSection = extractVehicleSection(pageFive);

    console.log("\n===== VEHICLE SECTION =====\n");
    console.log(vehicleSection);

    // Parsear campos
    const vehicleData = {
      vin: extractField(vehicleSection, /VIN\s*([A-Z0-9]+)/i),
      chasis: extractField(vehicleSection, /CHASIS\s+GRABADO\s*([A-Z0-9]+)/i),
      motor: extractField(vehicleSection, /NUMERO\s+DE\s+MOTOR\s*([A-Z0-9]+)/i),
      año: extractField(vehicleSection, /AÑO\s*(\d{4})/i),
      marca: extractField(vehicleSection, /MARCA\s*([A-Z]+)/i),
      linea: extractField(
        vehicleSection,
        /LINEA\s+Y\s+ESTILO\s*([A-Z0-9\s]+)/i,
      ),
      color: extractField(vehicleSection, /COLOR\s*([A-Z]+)/i),
      cilindrada: extractField(vehicleSection, /CILINDRADA.*?(\d{3,5})/i),
      cilindros: extractField(vehicleSection, /NUMERO\s+CILINDROS\s*(\d+)/i),
    };

    return vehicleData;
  } catch (error) {
    console.error("Error en dataParser:", error);
    throw error;
  }
}

function normalizeText(text) {
  return text
    .toUpperCase()
    .replace(/0/g, "O")
    .replace(/1/g, "I")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extrae texto desde DATOS DEL VEHICULO hasta OBSERVACIONES
 */

function extractVehicleSection(text) {
  const normalized = normalizeText(text);

  // Buscaremos un inicio aproximado, esa es la idea
  const startIndex = normalized.indexOf("DATOS DEL VEHICULO");

  if (startIndex === -1) {
    throw new Error("No se encontró el inicio de DATOS DEL VEHICULO.");
  }

  // Buscaremos un final aproximado
  const endIndex = normalized.indexOf("OBSERVACIONES", startIndex);

  const section =
    endIndex !== -1
      ? normalized.slice(startIndex, endIndex)
      : normalized.slice(startIndex);

  return section;
}
/**
 * Extrae campo usando regex tolerante
 */

function extractField(text, regex, fieldName) {
  const match = text.match(regex);

  if (!match) {
    console.warn(`Campo no encontrado: ${fieldName}`);
    return null;
  }

  return match[1].trim();
}
