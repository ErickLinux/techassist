import prisma from "../config/prisma.js";

export const buscarTiendaPorCodigo = async (codigo) => {
  const codigoNumerico = Number(codigo);

  if (!Number.isInteger(codigoNumerico) || codigoNumerico <= 0) {
    const error = new Error("El código de tienda debe ser un número válido");
    error.statusCode = 400;
    throw error;
  }

  const tienda = await prisma.tienda.findUnique({
    where: {
      codigo: codigoNumerico
    },
    select: {
      id: true,
      codigo: true,
      nombre: true,
      departamento: true,
      municipio: true,
      activa: true
    }
  });

  if (!tienda || !tienda.activa) {
    const error = new Error(
      "No se encontró una tienda activa con ese código"
    );

    error.statusCode = 404;
    throw error;
  }

  return tienda;
};