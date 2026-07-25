import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

export const crearUsuario = async ({
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

  const correoNormalizado = correo.trim().toLowerCase();

  const usuarioExistente = await prisma.usuario.findUnique({
    where: {
      correo: correoNormalizado
    }
  });

  if (usuarioExistente) {
    const error = new Error(
      "Ya existe un usuario registrado con ese correo"
    );
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
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
      fechaRegistro: true
    }
  });

  return usuario;
};