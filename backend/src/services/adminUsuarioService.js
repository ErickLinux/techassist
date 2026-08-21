import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

export const listarUsuarios = async () => {
  return await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      correo: true,
      bodega: true,
      activo: true,
      rol: true,
      fechaRegistro: true
    },
    orderBy: {
      nombre: "asc"
    }
  });
};


export const crearUsuarioAdmin = async ({
  nombre,
  correo,
  password,
  bodega
}) => {

  if (!nombre || !correo || !password) {
    const error = new Error(
      "Nombre, correo y contraseña son obligatorios"
    );
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error(
      "La contraseña debe contener al menos 6 caracteres"
    );
    error.statusCode = 400;
    throw error;
  }

  const correoNormalizado =
    correo.trim().toLowerCase();

  const existente =
    await prisma.usuario.findUnique({
      where: {
        correo: correoNormalizado
      }
    });

  if (existente) {
    const error = new Error(
      "Ya existe un usuario con ese correo"
    );
    error.statusCode = 409;
    throw error;
  }

  const passwordHash =
    await bcrypt.hash(password, 10);

  return await prisma.usuario.create({
    data: {
      nombre: nombre.trim(),
      correo: correoNormalizado,
      passwordHash,
      bodega: bodega?.trim() || null
    },

    select: {
      id: true,
      nombre: true,
      correo: true,
      bodega: true,
      activo: true,
      rol: true,
      fechaRegistro: true
    }
  });
};


export const cambiarEstadoUsuario = async (
  id,
  activo
) => {

  const usuario =
    await prisma.usuario.findUnique({
      where: { id }
    });

  if (!usuario) {
    const error =
      new Error("Usuario no encontrado");

    error.statusCode = 404;
    throw error;
  }

  return await prisma.usuario.update({
    where: { id },

    data: {
      activo
    },

    select: {
      id: true,
      nombre: true,
      correo: true,
      activo: true,
      rol: true
    }
  });
};
export const editarUsuarioAdmin = async (
  id,
  {
    nombre,
    correo,
    bodega
  }
) => {

  const usuario =
    await prisma.usuario.findUnique({
      where: { id }
    });

  if (!usuario) {
    const error =
      new Error("Usuario no encontrado");

    error.statusCode = 404;
    throw error;
  }

  const correoNormalizado =
    correo.trim().toLowerCase();

  const correoExistente =
    await prisma.usuario.findFirst({
      where: {
        correo: correoNormalizado,
        NOT: {
          id
        }
      }
    });

  if (correoExistente) {
    const error =
      new Error(
        "Ya existe otro usuario con ese correo"
      );

    error.statusCode = 409;
    throw error;
  }

  return await prisma.usuario.update({
    where: {
      id
    },

    data: {
      nombre: nombre.trim(),
      correo: correoNormalizado,
      bodega:
        bodega?.trim() || null
    },

    select: {
      id: true,
      nombre: true,
      correo: true,
      bodega: true,
      activo: true,
      rol: true
    }
  });
};