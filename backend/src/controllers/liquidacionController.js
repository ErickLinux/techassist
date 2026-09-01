import {
  generarLiquidacionExcel
} from "../services/liquidacionService.js";


export const exportarLiquidacion =
  async (req, res) => {

    try {

      const mes =
        req.query.mes
          ? Number(req.query.mes)
          : null;

      const anio =
        req.query.anio
          ? Number(req.query.anio)
          : null;

      const inicio =
        req.query.inicio || null;

      const fin =
        req.query.fin || null;


      // ==============================
      // VALIDAR FILTRO
      // ==============================

      const tieneRango =
        inicio && fin;

      const tieneMes =
        mes &&
        mes >= 1 &&
        mes <= 12 &&
        anio;


      if (!tieneRango && !tieneMes) {

        return res.status(400).json({
          mensaje:
            "Debes seleccionar un mes y año o un rango de fechas"
        });
      }


      // Validar que el rango esté completo
      if (
        (inicio && !fin) ||
        (!inicio && fin)
      ) {

        return res.status(400).json({
          mensaje:
            "Debes seleccionar fecha de inicio y fecha final"
        });
      }


      // Validar orden de fechas
      if (tieneRango) {

        const fechaInicio =
          new Date(`${inicio}T00:00:00`);

        const fechaFin =
          new Date(`${fin}T23:59:59`);

        if (fechaInicio > fechaFin) {

          return res.status(400).json({
            mensaje:
              "La fecha de inicio no puede ser mayor que la fecha final"
          });
        }
      }


      // ==============================
      // GENERAR EXCEL
      // ==============================

      const resultado =
        await generarLiquidacionExcel(
          req.usuario.id,
          mes,
          anio,
          inicio,
          fin
        );


      // ==============================
      // DESCARGAR ARCHIVO
      // ==============================

      return res.download(
        resultado.rutaSalida,
        resultado.nombreArchivo,
        (error) => {

          if (error) {

            console.error(
              "Error enviando Excel:",
              error
            );
          }
        }
      );


    } catch (error) {

      console.error(
        "Error exportando liquidación:",
        error
      );


      return res.status(
        error.statusCode || 500
      ).json({
        mensaje:
          error.statusCode
            ? error.message
            : "Error interno al generar la liquidación"
      });
    }
  };