import {
  crearUsuario,
  iniciarSesion,
  obtenerPerfilUsuario,
  cambiarPasswordUsuario
} from "../services/usuarioService.js";

export const registrarUsuario = async (req, res) => {
  try {
    const usuario = await crearUsuario(req.body);

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    return res.status(error.statusCode || 500).json({
      mensaje: error.statusCode
        ? error.message
        : "Error interno al registrar el usuario"
    });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const resultado = await iniciarSesion(req.body);

    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token: resultado.token,
      usuario: resultado.usuario
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(error.statusCode || 500).json({
      mensaje: error.statusCode
        ? error.message
        : "Error interno al iniciar sesión"
    });
  }
};
// ========================================
// OBTENER PERFIL
// ========================================

export const obtenerPerfil = async (req, res) => {

  try {

    const usuario = await obtenerPerfilUsuario(
      req.usuario.id
    );

    return res.status(200).json({
      usuario
    });

  } catch (error) {

    console.error(
      "Error al obtener perfil:",
      error
    );

    return res.status(
      error.statusCode || 500
    ).json({

      mensaje:
        error.statusCode
          ? error.message
          : "Error interno al obtener el perfil"

    });

  }

};

// ========================================
// CAMBIAR CONTRASEÑA
// ========================================

export const cambiarPassword = async (req, res) => {

  try {

    const resultado =
      await cambiarPasswordUsuario(
        req.usuario.id,
        req.body
      );

    return res.status(200).json({
      mensaje: resultado.mensaje
    });

  } catch (error) {

    console.error(
      "Error al cambiar contraseña:",
      error
    );

    return res.status(
      error.statusCode || 500
    ).json({

      mensaje:
        error.statusCode
          ? error.message
          : "Error interno al cambiar la contraseña"

    });

  }

};