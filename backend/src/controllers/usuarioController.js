import {
  crearUsuario,
  iniciarSesion
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
export const obtenerPerfil = async (req, res) => {
  return res.status(200).json({
    mensaje: "Acceso autorizado",
    usuarioToken: req.usuario
  });
};