/**
 * Conviere numero a letras (hasta 9999 es enough para feachas y horas)
 */

export function numberToSpanishWords(num) {
  const unidades = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];

  const especiales = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];

  const decenas = [
    "",
    "",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];

  const centenas = [
    "",
    "ciento",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];

  if (num === 0) return "cero";
  if (num === 100) return "cien";

  let words = "";

  if (num >= 1000) {
    if (Math.floor(num / 1000) === 1) {
      words += "mil";
    } else {
      words += numberToSpanishWords(Math.floor(num / 1000)) + "mil";
    }
    num %= 1000;
  }

  if (num >= 100) {
    words += centenas[Math.floor(num / 100)] + "";
    num %= 100;
  }

  if (num >= 20) {
    words += decenas[Math.floor(num / 10)];
    if (num % 10 !== 0) {
      words += "y" + unidades[num % 10];
    }
  } else if (num >= 10) {
    words += especiales[num - 10];
  } else if (num > 0) {
    words += unidades[num];
  }

  return words.trim();
}

/**
 * Devuelve fecha actual en letras
 */

export function getCurrentDataInWords(ciudad = "Nejapa") {
  const now = new Date();

  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  return {
    ciudad,
    dia: numberToSpanishWords(now.getDate()),
    mes: meses[now.getMonth()],
    año: numberToSpanishWords(now.getFullYear()),
  };
}

/**
 * Devuelve hora actual en letras
 */

export function getCurrentTimeInWords() {
  const now = new Date();

  return {
    horas: numberToSpanishWords(now.getHours()),
    minutos: numberToSpanishWords(now.getMinutes()),
  };
}
