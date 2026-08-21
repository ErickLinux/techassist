export const verificarAdmin = async (req, res, next) => {
  try {

    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado"
      });
    }

    if (req.usuario.rol !== "ADMIN") {
      return res.status(403).json({
        mensaje: "Acceso exclusivo para administradores"
      });
    }

    next();

  } catch (error) {

    console.error(
      "Error verificando administrador:",
      error
    );

    return res.status(500).json({
      mensaje: "Error interno al validar permisos"
    });
  }
};