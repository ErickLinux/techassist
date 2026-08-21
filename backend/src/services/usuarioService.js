import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";
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
  rol: true,
  fechaRegistro: true
}
  });

  return usuario;
};

export const iniciarSesion = async ({ correo, password }) => {
  if (!correo || !password) {
    const error = new Error(
      "El correo y la contraseña son obligatorios"
    );
    error.statusCode = 400;
    throw error;
  }

  const correoNormalizado = correo.trim().toLowerCase();

  const usuario = await prisma.usuario.findUnique({
    where: {
      correo: correoNormalizado
    }
  });

  if (!usuario) {
    const error = new Error(
      "Correo o contraseña incorrectos"
    );
    error.statusCode = 401;
    throw error;
  }

  if (!usuario.activo) {
    const error = new Error(
      "El usuario se encuentra desactivado"
    );
    error.statusCode = 403;
    throw error;
  }

  const passwordCorrecta = await bcrypt.compare(
    password,
    usuario.passwordHash
  );

  if (!passwordCorrecta) {
    const error = new Error(
      "Correo o contraseña incorrectos"
    );
    error.statusCode = 401;
    throw error;
  }

const token = jwt.sign(
  {
    id: usuario.id,
    correo: usuario.correo,
    rol: usuario.rol
  },

  process.env.JWT_SECRET,

  {
    expiresIn: "8h"
  }
);

  return {
  token,

  usuario: {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    bodega: usuario.bodega,
    rol: usuario.rol
  }
};
};