import {
  crearUsuario,
  iniciarSesion,
  obtenerPerfilUsuario,
  cambiarPasswordUsuario,
  solicitarRecuperacionPassword,
  verificarCodigoRecuperacion,
  restablecerPasswordUsuario
} from "../services/usuarioService.js";
import {
  enviarCodigoRecuperacion
} from "../services/emailService.js";

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

// ========================================
// SOLICITAR RECUPERACIÓN DE CONTRASEÑA
// ========================================

export const solicitarRecuperacion = async (req, res) => {
  try {
    const { correo } = req.body;

    console.log(
      "=== INICIO RECUPERACION PASSWORD ==="
    );

    console.log(
      "Correo recibido:",
      correo
    );

    const resultado =
      await solicitarRecuperacionPassword(correo);

    console.log(
      "Resultado recuperación:",
      {
        enviado: resultado.enviado,
        correo: resultado.correo
      }
    );

    if (resultado.enviado) {

      console.log(
        "Intentando enviar correo a:",
        resultado.correo
      );

      await enviarCodigoRecuperacion({
        correo: resultado.correo,
        nombre: resultado.nombre,
        codigo: resultado.codigo
      });

      console.log(
        "Correo enviado correctamente a:",
        resultado.correo
      );
    }

    console.log(
      "=== FIN RECUPERACION PASSWORD ==="
    );

    return res.status(200).json({
      mensaje:
        "Si el correo está registrado, recibirás un código de recuperación."
    });

  } catch (error) {

    console.error(
      "ERROR RECUPERACION PASSWORD:",
      error
    );

    return res.status(
      error.status || 500
    ).json({
      mensaje:
        error.message ||
        "Error interno al solicitar la recuperación"
    });
  }
};

// ========================================
// VERIFICAR CÓDIGO DE RECUPERACIÓN
// ========================================

export const verificarCodigo = async (
  req,
  res
) => {

  try {

    const {
      correo,
      codigo
    } = req.body;


    await verificarCodigoRecuperacion(
      correo,
      codigo
    );


    return res.status(200).json({

      mensaje:
        "Código verificado correctamente",

      valido: true

    });


  } catch (error) {

    console.error(
      "Error verificando código:",
      error
    );


    return res.status(
      error.statusCode || 500
    ).json({

      mensaje:
        error.statusCode
          ? error.message
          : "Error interno al verificar el código"

    });

  }

};

// ========================================
// RESTABLECER CONTRASEÑA
// ========================================

export const restablecerPassword = async (
  req,
  res
) => {

  try {

    const {
      correo,
      codigo,
      nuevaPassword
    } = req.body;


    const resultado =
      await restablecerPasswordUsuario(
        correo,
        codigo,
        nuevaPassword
      );


    return res.status(200).json({

      mensaje:
        resultado.mensaje

    });


  } catch (error) {

    console.error(
      "Error restableciendo contraseña:",
      error
    );


    return res.status(
      error.statusCode || 500
    ).json({

      mensaje:
        error.statusCode
          ? error.message
          : "Error interno al restablecer la contraseña"

    });

  }

};