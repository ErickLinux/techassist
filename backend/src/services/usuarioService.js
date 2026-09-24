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



// ========================================
// SOLICITAR RECUPERACIÓN DE CONTRASEÑA
// ========================================

export const solicitarRecuperacionPassword = async (
  correo
) => {

  if (!correo) {

    const error = new Error(
      "El correo es obligatorio"
    );

    error.statusCode = 400;

    throw error;
  }


  const correoNormalizado =
    correo.trim().toLowerCase();


  // Buscar usuario

  const usuario =
    await prisma.usuario.findUnique({
      where: {
        correo: correoNormalizado
      }
    });


  // ========================================
  // IMPORTANTE:
  // No indicamos si el correo existe o no.
  // ========================================

  if (!usuario || !usuario.activo) {

    return {
      enviado: false
    };

  }


  // ========================================
  // GENERAR CÓDIGO DE 6 DÍGITOS
  // ========================================

  const codigo =
    Math.floor(
      100000 +
      Math.random() * 900000
    ).toString();


  // ========================================
  // GUARDAR HASH DEL CÓDIGO
  // ========================================

  const codigoHash =
    await bcrypt.hash(
      codigo,
      10
    );


  // ========================================
  // EXPIRACIÓN: 10 MINUTOS
  // ========================================

  const expiracion =
    new Date(
      Date.now() +
      10 * 60 * 1000
    );


  // ========================================
  // GUARDAR EN BASE DE DATOS
  // ========================================

  await prisma.usuario.update({

    where: {
      id: usuario.id
    },

    data: {

      codigoRecuperacionHash:
        codigoHash,

      codigoRecuperacionExpira:
        expiracion

    }

  });


  return {

  enviado: true,

  correo:
    usuario.correo,

  nombre:
    usuario.nombre,

  codigo

};

};

// ========================================
// VERIFICAR CÓDIGO DE RECUPERACIÓN
// ========================================

export const verificarCodigoRecuperacion = async (
  correo,
  codigo
) => {

  // ========================================
  // VALIDAR CAMPOS
  // ========================================

  if (!correo || !codigo) {

    const error = new Error(
      "El correo y el código son obligatorios"
    );

    error.statusCode = 400;

    throw error;
  }


  const correoNormalizado =
    correo.trim().toLowerCase();


  // ========================================
  // BUSCAR USUARIO
  // ========================================

  const usuario =
    await prisma.usuario.findUnique({

      where: {
        correo: correoNormalizado
      }

    });


  if (
    !usuario ||
    !usuario.codigoRecuperacionHash ||
    !usuario.codigoRecuperacionExpira
  ) {

    const error = new Error(
      "El código es inválido o ha expirado"
    );

    error.statusCode = 400;

    throw error;
  }


  // ========================================
  // VALIDAR EXPIRACIÓN
  // ========================================

  const ahora =
    new Date();


  if (
    ahora >
    usuario.codigoRecuperacionExpira
  ) {

    // Limpiar código vencido

    await prisma.usuario.update({

      where: {
        id: usuario.id
      },

      data: {

        codigoRecuperacionHash:
          null,

        codigoRecuperacionExpira:
          null

      }

    });


    const error = new Error(
      "El código es inválido o ha expirado"
    );

    error.statusCode = 400;

    throw error;
  }


  // ========================================
  // COMPARAR CÓDIGO
  // ========================================

  const codigoCorrecto =
    await bcrypt.compare(
      codigo.toString(),
      usuario.codigoRecuperacionHash
    );


  if (!codigoCorrecto) {

    const error = new Error(
      "El código es inválido o ha expirado"
    );

    error.statusCode = 400;

    throw error;
  }


  // ========================================
  // CÓDIGO CORRECTO
  // ========================================

  return {
    valido: true
  };

};

// ========================================
// RESTABLECER CONTRASEÑA
// ========================================

export const restablecerPasswordUsuario = async (
  correo,
  codigo,
  nuevaPassword
) => {

  // ========================================
  // VALIDAR CAMPOS
  // ========================================

  if (!correo || !codigo || !nuevaPassword) {

    const error = new Error(
      "El correo, código y nueva contraseña son obligatorios"
    );

    error.statusCode = 400;

    throw error;
  }


  // ========================================
  // VALIDAR LONGITUD
  // ========================================

  if (nuevaPassword.length < 6) {

    const error = new Error(
      "La nueva contraseña debe contener al menos 6 caracteres"
    );

    error.statusCode = 400;

    throw error;
  }


  const correoNormalizado =
    correo.trim().toLowerCase();


  // ========================================
  // BUSCAR USUARIO
  // ========================================

  const usuario =
    await prisma.usuario.findUnique({

      where: {
        correo: correoNormalizado
      }

    });


  if (
    !usuario ||
    !usuario.codigoRecuperacionHash ||
    !usuario.codigoRecuperacionExpira
  ) {

    const error = new Error(
      "El código es inválido o ha expirado"
    );

    error.statusCode = 400;

    throw error;
  }


  // ========================================
  // VALIDAR EXPIRACIÓN
  // ========================================

  const ahora =
    new Date();


  if (
    ahora >
    usuario.codigoRecuperacionExpira
  ) {

    await prisma.usuario.update({

      where: {
        id: usuario.id
      },

      data: {

        codigoRecuperacionHash:
          null,

        codigoRecuperacionExpira:
          null

      }

    });


    const error = new Error(
      "El código es inválido o ha expirado"
    );

    error.statusCode = 400;

    throw error;
  }


  // ========================================
  // VALIDAR CÓDIGO NUEVAMENTE
  // ========================================

  const codigoCorrecto =
    await bcrypt.compare(
      codigo.toString(),
      usuario.codigoRecuperacionHash
    );


  if (!codigoCorrecto) {

    const error = new Error(
      "El código es inválido o ha expirado"
    );

    error.statusCode = 400;

    throw error;
  }


  // ========================================
  // EVITAR LA MISMA CONTRASEÑA
  // ========================================

  const mismaPassword =
    await bcrypt.compare(
      nuevaPassword,
      usuario.passwordHash
    );


  if (mismaPassword) {

    const error = new Error(
      "La nueva contraseña debe ser diferente a la contraseña anterior"
    );

    error.statusCode = 400;

    throw error;
  }


  // ========================================
  // ENCRIPTAR NUEVA CONTRASEÑA
  // ========================================

  const nuevoPasswordHash =
    await bcrypt.hash(
      nuevaPassword,
      10
    );


  // ========================================
  // ACTUALIZAR CONTRASEÑA
  // Y ELIMINAR CÓDIGO
  // ========================================

  await prisma.usuario.update({

    where: {
      id: usuario.id
    },

    data: {

      passwordHash:
        nuevoPasswordHash,

      codigoRecuperacionHash:
        null,

      codigoRecuperacionExpira:
        null

    }

  });


  return {

    mensaje:
      "Contraseña restablecida correctamente"

  };

};