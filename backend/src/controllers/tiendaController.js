import {
  buscarTiendaPorCodigo
} from "../services/tiendaService.js";

export const obtenerTiendaPorCodigo = async (req, res) => {
  try {
    const tienda = await buscarTiendaPorCodigo(
      req.params.codigo
    );

    return res.status(200).json({
      mensaje: "Tienda encontrada correctamente",
      tienda
    });
  } catch (error) {
    console.error("Error al buscar tienda:", error);

    return res.status(error.statusCode || 500).json({
      mensaje: error.statusCode
        ? error.message
        : "Error interno al buscar la tienda"
    });
  }
};