import {
  listarUsuarios,
  crearUsuarioAdmin,
  cambiarEstadoUsuario
} from "../services/adminUsuarioService.js";


export const obtenerUsuarios = async (
  req,
  res
) => {

  try {

    const usuarios =
      await listarUsuarios();

    return res.status(200).json({
      usuarios
    });

  } catch (error) {

    console.error(
      "Error obteniendo usuarios:",
      error
    );

    return res.status(500).json({
      mensaje:
        "Error interno al consultar usuarios"
    });
  }
};


export const registrarUsuarioAdmin = async (
  req,
  res
) => {

  try {

    const usuario =
      await crearUsuarioAdmin(req.body);

    return res.status(201).json({
      mensaje:
        "Usuario creado correctamente",
      usuario
    });

  } catch (error) {

    console.error(
      "Error creando usuario:",
      error
    );

    return res
      .status(error.statusCode || 500)
      .json({
        mensaje:
          error.statusCode
            ? error.message
            : "Error interno al crear usuario"
      });
  }
};


export const actualizarEstadoUsuario = async (
  req,
  res
) => {

  try {

    const { id } = req.params;
    const { activo } = req.body;

    if (typeof activo !== "boolean") {
      return res.status(400).json({
        mensaje:
          "El estado activo debe ser verdadero o falso"
      });
    }

    // Evitar que el administrador
    // se desactive a sí mismo.
    if (
      id === req.usuario.id &&
      activo === false
    ) {
      return res.status(400).json({
        mensaje:
          "No puedes desactivar tu propio usuario"
      });
    }

    const usuario =
      await cambiarEstadoUsuario(
        id,
        activo
      );

    return res.status(200).json({
      mensaje: activo
        ? "Usuario activado correctamente"
        : "Usuario desactivado correctamente",

      usuario
    });

  } catch (error) {

    console.error(
      "Error cambiando estado:",
      error
    );

    return res
      .status(error.statusCode || 500)
      .json({
        mensaje:
          error.statusCode
            ? error.message
            : "Error interno al actualizar usuario"
      });
  }
};
import {
  listarUsuarios,
  crearUsuarioAdmin,
  cambiarEstadoUsuario,
  editarUsuarioAdmin
} from "../services/adminUsuarioService.js";
export const editarUsuario = async (
  req,
  res
) => {

  try {

    const {
      nombre,
      correo,
      bodega
    } = req.body;

    if (!nombre || !correo) {

      return res.status(400).json({
        mensaje:
          "Nombre y correo son obligatorios"
      });
    }

    const usuario =
      await editarUsuarioAdmin(
        req.params.id,
        {
          nombre,
          correo,
          bodega
        }
      );

    return res.status(200).json({
      mensaje:
        "Usuario actualizado correctamente",
      usuario
    });

  } catch (error) {

    console.error(
      "Error editando usuario:",
      error
    );

    return res
      .status(error.statusCode || 500)
      .json({
        mensaje:
          error.statusCode
            ? error.message
            : "Error interno al editar usuario"
      });
  }
};