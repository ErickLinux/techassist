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

// ========================================
// OBTENER PERFIL DEL USUARIO
// ========================================

export const obtenerPerfilUsuario = async (usuarioId) => {

  const usuario = await prisma.usuario.findUnique({
    where: {
      id: usuarioId
    },

    select: {
      id: true,
      nombre: true,
      correo: true,
      bodega: true,
      rol: true,
      activo: true,
      fechaRegistro: true
    }
  });


  if (!usuario) {

    const error = new Error(
      "Usuario no encontrado"
    );

    error.statusCode = 404;

    throw error;
  }


  return usuario;
};


// ========================================
// CAMBIAR CONTRASEÑA
// ========================================

export const cambiarPasswordUsuario = async (
  usuarioId,
  {
    passwordActual,
    passwordNueva
  }
) => {

  // Validar campos

  if (!passwordActual || !passwordNueva) {

    const error = new Error(
      "La contraseña actual y la nueva contraseña son obligatorias"
    );

    error.statusCode = 400;

    throw error;
  }


  // Validar longitud

  if (passwordNueva.length < 6) {

    const error = new Error(
      "La nueva contraseña debe contener al menos 6 caracteres"
    );

    error.statusCode = 400;

    throw error;
  }


  // Buscar usuario

  const usuario = await prisma.usuario.findUnique({
    where: {
      id: usuarioId
    }
  });


  if (!usuario) {

    const error = new Error(
      "Usuario no encontrado"
    );

    error.statusCode = 404;

    throw error;
  }


  // Validar contraseña actual

  const passwordCorrecta = await bcrypt.compare(
    passwordActual,
    usuario.passwordHash
  );


  if (!passwordCorrecta) {

    const error = new Error(
      "La contraseña actual es incorrecta"
    );

    error.statusCode = 401;

    throw error;
  }


  // Evitar usar la misma contraseña

  const mismaPassword = await bcrypt.compare(
    passwordNueva,
    usuario.passwordHash
  );


  if (mismaPassword) {

    const error = new Error(
      "La nueva contraseña debe ser diferente a la contraseña actual"
    );

    error.statusCode = 400;

    throw error;
  }


  // Encriptar nueva contraseña

  const nuevoPasswordHash = await bcrypt.hash(
    passwordNueva,
    10
  );


  // Actualizar usuario

  await prisma.usuario.update({
    where: {
      id: usuarioId
    },

    data: {
      passwordHash: nuevoPasswordHash
    }
  });


  return {
    mensaje: "Contraseña actualizada correctamente"
  };
};