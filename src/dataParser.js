/**
 * Extrae datos del vehiculo desde el texto ocr completo
 * @param {string} fullText
 * @returns {Object}
 */

export function parseVehicleData(fullText) {
  try {
    // Separar las paginas del DUCA, porque solo se usara la 5
    const pages = fullText.split("===== NUEVA PAGINA =====");

    if (pages.length < 5) {
      throw new Error("El documento no contiene 5 páginas.");
    }

    // Tomar paginas no.5 (indice 4)
    const pageFive = pages[4];

    // Extraer solo seccion despues de DATOS DEL VEHICULO
    const vehicleSection = extractVehicleSection(pageFive);

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

/**
 * Extrae texto desde DATOS DEL VEHICULO hasta OBSERVACIONES
 */

function extractVehicleSection(text) {
  const match = text.match(/DATOS\s+DEL\s+VEHICULO([\s\S]*?)OBSERVACIONES/i);

  if (!match) {
    throw new Error("No se encontró la sección DATOS DEL VEHICULO.");
  }

  return match[1];
}

/**
 * Extrae campo usando regex tolerante
 */

function extractField(text, regex) {
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}
