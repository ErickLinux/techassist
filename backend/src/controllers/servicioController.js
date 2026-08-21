import {
  crearRegistroServicio,
  obtenerServiciosPorUsuario,
  obtenerServicioPorId,
  actualizarRegistroServicio,
  eliminarRegistroServicio
} from "../services/servicioService.js";

export const registrarServicio = async (req, res) => {
  try {

    const registro = await crearRegistroServicio({
      ...req.body,
      usuarioId: req.usuario.id
    });

    return res.status(201).json({
      mensaje: "Servicio registrado correctamente",
      registro
    });

  } catch (error) {

    console.error(
      "Error al registrar servicio:",
      error
    );

    return res.status(
      error.statusCode || 500
    ).json({
      mensaje: error.statusCode
        ? error.message
        : "Error interno al registrar el servicio"
    });
  }
};

export const listarMisServicios = async (req, res) => {
  try {

    const servicios = await obtenerServiciosPorUsuario(
      req.usuario.id
    );

    return res.status(200).json({
      mensaje: "Servicios obtenidos correctamente",
      servicios
    });

  } catch (error) {

    console.error(
      "Error al obtener servicios:",
      error
    );

    return res.status(500).json({
      mensaje: "Error interno al consultar los servicios"
    });
  }
};
export const obtenerDetalleServicio = async (
  req,
  res
) => {

  try {

    const servicio = await obtenerServicioPorId(
      req.params.id,
      req.usuario.id
    );

    return res.status(200).json({
      mensaje: "Servicio obtenido correctamente",
      servicio
    });

  } catch (error) {

    console.error(
      "Error al consultar servicio:",
      error
    );

    return res.status(
      error.statusCode || 500
    ).json({
      mensaje: error.statusCode
        ? error.message
        : "Error interno al consultar el servicio"
    });
  }
};

export const editarServicio = async (req, res) => {
  try {

    const servicio =
      await actualizarRegistroServicio({
        servicioId: req.params.id,
        usuarioId: req.usuario.id,
        ...req.body
      });

    return res.status(200).json({
      mensaje:
        "Servicio actualizado correctamente",
      servicio
    });

  } catch (error) {

    console.error(
      "Error al actualizar servicio:",
      error
    );

    return res.status(
      error.statusCode || 500
    ).json({
      mensaje: error.statusCode
        ? error.message
        : "Error interno al actualizar el servicio"
    });
  }
};

export const eliminarServicio = async (
  req,
  res
) => {

  try {

    await eliminarRegistroServicio(
      req.params.id,
      req.usuario.id
    );

    return res.status(200).json({
      mensaje:
        "Servicio eliminado correctamente"
    });

  } catch (error) {

    console.error(
      "Error al eliminar servicio:",
      error
    );

    return res.status(
      error.statusCode || 500
    ).json({
      mensaje: error.statusCode
        ? error.message
        : "Error interno al eliminar el servicio"
    });
  }
};


