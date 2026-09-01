import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import prisma from "../config/prisma.js";

export const generarLiquidacionExcel = async (
  usuarioId,
  mes,
  anio,
  inicio = null,
  fin = null
) => {

  const usuario = await prisma.usuario.findUnique({
    where: {
      id: usuarioId
    }
  });

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  let fechaInicio;
let fechaFin;

if (inicio && fin) {

  // Rango seleccionado por el usuario
  fechaInicio =
    new Date(`${inicio}T00:00:00-06:00`);

  // Se utiliza el día siguiente para poder usar "lt"
  fechaFin =
    new Date(`${fin}T00:00:00-06:00`);

  fechaFin.setDate(
    fechaFin.getDate() + 1
  );

} else {

  // Mes completo
  fechaInicio =
    new Date(
      `${anio}-${String(mes).padStart(2, "0")}-01T00:00:00-06:00`
    );

  if (mes === 12) {

    fechaFin =
      new Date(
        `${anio + 1}-01-01T00:00:00-06:00`
      );

  } else {

    fechaFin =
      new Date(
        `${anio}-${String(mes + 1).padStart(2, "0")}-01T00:00:00-06:00`
      );
  }
}

  const servicios =
    await prisma.registroServicio.findMany({
      where: {
        usuarioId,
        fecha: {
          gte: fechaInicio,
          lt: fechaFin
        }
      },

      include: {
        tienda: true
      },

      orderBy: {
        fecha: "asc"
      }
    });

  if (!servicios.length) {
    const error =
      new Error(
        "No existen servicios registrados para ese período"
      );

    error.statusCode = 404;
    throw error;
  }

  const plantilla =
    path.resolve(
      "templates",
      "plantilla-liquidacion.xlsx"
    );

  if (!fs.existsSync(plantilla)) {
    throw new Error(
      "No se encontró la plantilla de liquidación"
    );
  }

  const workbook =
    new ExcelJS.Workbook();

  await workbook.xlsx.readFile(
    plantilla
  );

  const hoja =
    workbook.getWorksheet(
      "KILOMETRAJE"
    );

  if (!hoja) {
    throw new Error(
      "No se encontró la hoja KILOMETRAJE"
    );
  }

  // ==============================
  // DATOS DEL TÉCNICO
  // ==============================

  // Ajustaremos estas celdas si
  // en tu archivo real están en otra posición.

  hoja.getCell("D8").value =
    usuario.nombre;

  hoja.getCell("D9").value =
    "Tecnico";


  // ==============================
  // LIMPIAR FILAS ANTERIORES
  // ==============================

  const filaInicial = 15;

  const filaFinal = 50;

  for (
    let fila = filaInicial;
    fila <= filaFinal;
    fila++
  ) {

    hoja.getCell(`B${fila}`).value =
      null;

    hoja.getCell(`C${fila}`).value =
      null;

    hoja.getCell(`D${fila}`).value =
      null;

    hoja.getCell(`E${fila}`).value =
      null;

    hoja.getCell(`F${fila}`).value =
      null;

    hoja.getCell(`G${fila}`).value =
      null;

    hoja.getCell(`H${fila}`).value =
      null;

    hoja.getCell(`I${fila}`).value =
      null;

    hoja.getCell(`M${fila}`).value =
      null;

    hoja.getCell(`N${fila}`).value =
      null;
  }


  // ==============================
  // INSERTAR SERVICIOS
  // ==============================

  servicios.forEach(
    (servicio, indice) => {

      const fila =
        filaInicial + indice;

      hoja.getCell(`B${fila}`).value =
        indice + 1;

      hoja.getCell(`C${fila}`).value =
        servicio.fecha;

      hoja.getCell(`C${fila}`).numFmt =
        "d/mm/yyyy";

      // Departamento
      hoja.getCell(`D${fila}`).value =
        servicio.tienda.departamento;

      // Municipio
      hoja.getCell(`E${fila}`).value =
        servicio.tienda.municipio;

      // Tienda
      hoja.getCell(`F${fila}`).value =
        servicio.tienda.nombre;

      // INC
      hoja.getCell(`G${fila}`).value =
        servicio.numeroTicket;

      // CAF
      hoja.getCell(`H${fila}`).value =
        servicio.numeroCaf || "-";

      // Trabajo realizado
      hoja.getCell(`I${fila}`).value =
        servicio.trabajoRealizado;

      // KM diario
      hoja.getCell(`M${fila}`).value =
        servicio.totalKilometros;

      // Total a validar
      hoja.getCell(`N${fila}`).value =
        servicio.totalKilometros;
    }
  );


  // ==============================
  // TOTAL KILÓMETROS
  // ==============================

  const filaUltimoServicio =
    filaInicial +
    servicios.length -
    1;

  const totalKilometros =
    servicios.reduce(
      (total, servicio) =>
        total +
        Number(
          servicio.totalKilometros
        ),
      0
    );


  // Puedes cambiar estas celdas
  // cuando confirmemos exactamente
  // dónde están los totales.

  hoja.getCell("C58").value =
    totalKilometros;

  hoja.getCell("D60").value =
    totalKilometros;


  // ==============================
  // CREAR ARCHIVO TEMPORAL
  // ==============================

  const carpetaSalida =
    path.resolve(
      "temp"
    );

  if (
    !fs.existsSync(carpetaSalida)
  ) {

    fs.mkdirSync(
      carpetaSalida,
      {
        recursive: true
      }
    );
  }


  let nombreArchivo;

if (inicio && fin) {

  nombreArchivo =
    `LIQUIDACION_${usuario.nombre
      .replace(/\s+/g, "_")
      .toUpperCase()}_${inicio}_AL_${fin}.xlsx`;

} else {

  nombreArchivo =
    `LIQUIDACION_${usuario.nombre
      .replace(/\s+/g, "_")
      .toUpperCase()}_${mes}_${anio}.xlsx`;
}


  const rutaSalida =
    path.join(
      carpetaSalida,
      nombreArchivo
    );


  await workbook.xlsx.writeFile(
    rutaSalida
  );


  return {
    rutaSalida,
    nombreArchivo
  };
};