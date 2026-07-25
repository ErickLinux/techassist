import { crearUsuario } from "../services/usuarioService.js";

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
      mensaje:
        error.statusCode
          ? error.message
          : "Error interno al registrar el usuario"
    });
  }
};