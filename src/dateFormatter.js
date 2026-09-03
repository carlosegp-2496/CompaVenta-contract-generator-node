/**
 * Convierte número a letras (mejorado atendiendo las observaciones del Lic.Martinez)
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
      words += "mil ";
    } else {
      words += numberToSpanishWords(Math.floor(num / 1000)) + " mil ";
    }
    num %= 1000;
  }

  if (num >= 100) {
    words += centenas[Math.floor(num / 100)] + " ";
    num %= 100;
  }

  if (num >= 20) {
    words += decenas[Math.floor(num / 10)];
    if (num % 10 !== 0) {
      words += " y " + unidades[num % 10];
    }
  } else if (num >= 10) {
    words += especiales[num - 10];
  } else if (num > 0) {
    words += unidades[num];
  }

  return words.trim();
}

/**
 * Fecha completa en formato legal listo para insertar
 */

export function getFormattedDate(ciudad = "Nejapa") {
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

  const dia = numberToSpanishWords(now.getDate());
  const mes = meses[now.getMonth()];
  const año = numberToSpanishWords(now.getFullYear());

  return `la ciudad de ${ciudad}, a los ${dia} días del mes de ${mes} del año ${año}`;
}

/**
 * Hora lista para insertar
 */

export function getFormattedTime() {
  const now = new Date();

  const horas = numberToSpanishWords(now.getHours());
  const minutos = numberToSpanishWords(now.getMinutes());

  return `${horas} horas con ${minutos} minutos`;
}
