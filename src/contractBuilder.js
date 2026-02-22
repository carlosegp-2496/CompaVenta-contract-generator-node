import { Document, Paragraph, TextRun } from "docx";

// Data = {
//   comprador: { nombre, edad, domicilio, dui, nit },
//   vehiculo: {...},
//   precio,
//   fecha: {ciudad, dia, mes, año},
//   hora: { horas, minutos}

// };

export function buildContractDocument(data) {
  const { comprador, vehiculo, precio, fecha, hora } = data;

  // Helper para pares CATEGORIA + VALOR (aqui buscamos mantener control del valor en bold que se visibiliza en la compraventa que nos envio el cliente)
  const valuePair = (label, value) => [
    new TextRun({ text: `${label}: `, bold: false }),
    new TextRun({ text: `${value}; `, bold: true }),
  ];

  //   PRIMER PARRAFO DE LA COMPRAVENTA PARA EL CLIENTE

  const firstParagraph = new Paragraph({
    children: [
      // NOSOTROS
      new TextRun({ text: "NOSOTROS: JESUS ISMAEL MOZ JUAREZ,", bold: true }),
      new TextRun({
        text: "de treinta y un años de edad, Comerciante, del domicilio de Ilopango, departamento de San Salvador; portador de mi Documento Único de Identidad y Numero de identificación Tributaria homologado número: cero cuatro cinco tres dos cuatro cuatro uno-cinco; quien actúa en representación de la Sociedad ",
      }),
      new TextRun({ text: "AUTO GARAJE MOZ CENTENO", bold: true }),
      new TextRun({ text: ", " }),
      new TextRun({
        text: "SOCIEDAD ANONIMA DE CAPITAL VARIABLE",
        bold: true,
      }),
      new TextRun({ text: ", que puede abreviarse “" }),
      new TextRun({ text: "AUTO GARAJE MC, S.A DE C.V.", bold: true }),
      new TextRun({
        text: "” del domicilio de la Sociedad de Ilopango, Departamento de San Salvador; y con Número de Identificación Tributaria cero seis uno cuatro-dos cero uno cero dos cero-uno cero cinco-seis; quien en adelante me denominaré “El Vendedor”; y ",
      }),

      //   COMPRADOR (esta parte de la compraventa tambien lleva su estilo concreto en Word a nivel de redaccion de texto y formato)
      new TextRun({ text: `${comprador.nombre}, `, bold: true }),
      new TextRun({
        text: `de ${comprador.edad} años de edad, Comerciante, del domicilio de ${comprador.domicilio}, departamento de San Salvador, portador de mi Documento Único de Identidad y Numero de Identificacion Tributaria homologado número ${comprador.dui}; quien en adelante me denominaré “El Comprador”; por medio del presente documento, `,
      }),

      //   OTORGAMOS
      new TextRun({ text: "OTORGAMOS: I) ", bold: true }),
      new TextRun({
        text: "Que la Sociedad que representa ",
      }),
      new TextRun({
        text: "AUTO GARAJE MOZ CENTENO, SOCIEDAD ANONIMA DE CAPITAL VARIABLE",
        bold: true,
      }),
      new TextRun({ text: ", que puede abreviarse “" }),
      new TextRun({ text: "AUTO GARAJE MC, S.A DE C.V.", bold: true }),
      new TextRun({
        text: "” es actual dueño y poseedor de un vehículo de las siguientes características: ",
      }),

      //   VEHICULO (value pairs)

      ...valuePair("DUCA", vehiculo.duca),
      ...valuePair("CHASIS GRABADO", vehiculo.chasisGrabado),
      ...valuePair("CHASIS VIN", vehiculo.vin),
      ...valuePair("NÚMERO DE MOTOR", vehiculo.motor),
      ...valuePair("AÑO", vehiculo.año),
      ...valuePair("MARCA", vehiculo.marca),
      ...valuePair("LINEA Y ESTILO", vehiculo.linea),
      ...valuePair("CLASE", vehiculo.clase),
      ...valuePair("COLOR", vehiculo.color),
      ...valuePair("COMBUSTIBLE", vehiculo.combustible),
      ...valuePair("CAPACIDAD", vehiculo.capacidad),
      ...valuePair("CILINDROS", vehiculo.cilindros),
      ...valuePair("CILINDRADA (CC)", vehiculo.cilindrada),
      ...valuePair("PUERTAS", vehiculo.puertas),
      ...valuePair("PLACAS", vehiculo.placas),
      ...valuePair("CONDICION DEL VEHICULO", vehiculo.condicion),
      ...valuePair("MODELO", vehiculo.modelo),

      //   INCISO II

      new TextRun({ text: "II) ", bold: true }),
      new TextRun({
        text: "Que por medio de este acto y por el precio de ",
      }),
      new TextRun({
        text: `${precio}, `,
        bold: true,
      }),
      new TextRun({
        text: "que recibo el primero de parte del segundo, ",
      }),
      new TextRun({ text: "LE VENDE", bold: true }),
      new TextRun({
        text: ", el vehículo antes descrito, haciéndole en consecuencia la tradición del dominio, posesión y demás derechos anexos que sobre dicho vehículo relacionado me corresponden, entregándoselo materialmente y me obligó al saneamiento de ley.- ",
      }),

      //   INCISO III

      new TextRun({ text: "III) ", bold: true }),
      new TextRun({
        text: "Por mi parte el comprador acepto la venta y tradición del dominio, posesión y demás derechos anexos que sobre el vehículo aquí descrito se me hacen, dándome por recibido del mismo en este momento.- Manifestamos tener conocimiento ambas partes de la actual condición del vehículo descrito, la cual es que está chocado y con daños, de lo cual estamos conscientes y conformes, realizando en esas condiciones la compraventa del vehículo.- Para los efectos legales del presente acto, ambos contratantes señalamos como domicilio especial el de la ciudad de San Salvador, a cuyos tribunales nos sometemos expresamente en caso de acción judicial.- Así nos expresamos, en fe de lo cual firmamos el presente contrato en la ciudad de ",
      }),

      new TextRun({ text: fecha.ciudad }),
      new TextRun({
        text: `, departamento de San Salvador, a los ${fecha.dia} días del mes de ${fecha.mes} del año ${fecha.año}.- `,
      }),
    ],
  });

  //   SEGUNDO PARRAFO DE LA COMPRAVENTA (segun el copy que mandó el cliente)

  const secondParagraph = new Paragraph({
    children: [
      new TextRun({
        text: `la ciudad de ${fecha.ciudad}, departamento de San Salvador, a las `,
      }),
      new TextRun({
        text: `${hora.horas} horas`,
      }),
      new TextRun({
        text: ` del día ${fecha.dia} de ${fecha.mes} del año ${fecha.año}. Ante mí, `,
      }),

      new TextRun({
        text: "JOSÉ DAVID CASTRO ORDÓÑEZ",
        bold: true,
      }),

      new TextRun({
        text: ", Notario, del domicilio de San Salvador, comparecen: JESUS ISRAEL MOZ JUAREZ, de treinta y un años de edad, Comerciante, del domicilio de Ilopango, departamento de San Salvador; quien actúa en representación de la Sociedad ",
      }),

      new TextRun({
        text: "AUTO GARAJE MOZ CENTENO, SOCIEDAD ANONIMA DE CAPITAL VARIABLE",
        bold: true,
      }),

      new TextRun({ text: ", que puede abreviarse “" }),
      new TextRun({
        text: "AUTO GARAJE MC, S.A DE C.V.",
        bold: true,
      }),
      new TextRun({
        text: "”; y ",
      }),

      new TextRun({ text: comprador.nombre, bold: true }),
      new TextRun({
        text: ", quien en adelante denominaré como “El Comprador”; ",
      }),

      new TextRun({ text: "ME DICEN: ", bold: true }),
      new TextRun({ text: "I) ", bold: true }),

      new TextRun({
        text: "Que reconocen como suyas las firmas que calzan el anterior documento de COMPRAVENTA DE VEHICULO; documento por medio del cual el primero declara es dueño del vehículo de las siguientes características: ",
      }),

      ...valuePair("DUCA", vehiculo.duca),
      ...valuePair("CHASIS GRABADO", vehiculo.chasisGrabado),
      ...valuePair("CHASIS VIN", vehiculo.vin),
      ...valuePair("NÚMERO DE MOTOR", vehiculo.motor),
      ...valuePair("AÑO", vehiculo.año),
      ...valuePair("MARCA", vehiculo.marca),
      ...valuePair("LINEA Y ESTILO", vehiculo.linea),
      ...valuePair("CLASE", vehiculo.clase),
      ...valuePair("COLOR", vehiculo.color),
      ...valuePair("COMBUSTIBLE", vehiculo.combustible),
      ...valuePair("CAPACIDAD", vehiculo.capacidad),
      ...valuePair("CILINDROS", vehiculo.cilindros),
      ...valuePair("CILINDRADA (CC)", vehiculo.cilindrada),
      ...valuePair("PUERTAS", vehiculo.puertas),
      ...valuePair("PLACAS", vehiculo.placas),
      ...valuePair("CONDICION DEL VEHICULO", vehiculo.condicion),
      ...valuePair("MODELO", vehiculo.modelo),

      new TextRun({
        text: ".- Y YO EL SUSCRITO NOTARIO, DOY FE: ",
        bold: true,
      }),

      new TextRun({
        text: "Que las firmas que calzan el anterior documento son ",
      }),

      new TextRun({
        text: "AUTÉNTICAS ",
        bold: true,
      }),

      new TextRun({
        text: "por haberlas puesto los otorgantes a mi presencia.- DOY FE.- ",
        bold: true,
      }),
    ],
  });

  //   DOCUMENTO FINAL : con esto intentamos replicar la estructura EXACTA  de la compraventa que nos envio el cliente. Contiene bold o "negritas" selectivas,
  // Contiene dos parrafos, generamos una logina de value pairs que determinan el funcionamiento de nuestro programa, por que? pues porque resulta que estos son
  // los datos que pretendemos extraer de la DUCA e ingresarlos dinamicamente a esta contrato que hemos construido con codigo. Ahora debemos integralos con Packer al contract Generator

  return new Document({
    sections: [
      {
        properties: {},
        children: [firstParagraph, secondParagraph],
      },
    ],
  });
}
