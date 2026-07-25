import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        mensaje: "Token no proporcionado"
      });
    }

    const partes = authorization.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(401).json({
        mensaje: "Formato de token inválido"
      });
    }

    const token = partes[1];

    const datosToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = datosToken;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o expirado"
    });
  }
};