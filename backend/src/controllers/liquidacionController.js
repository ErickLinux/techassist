import {
  generarLiquidacionExcel
} from "../services/liquidacionService.js";


export const exportarLiquidacion =
  async (req, res) => {

    try {

      const mes =
        Number(req.query.mes);

      const anio =
        Number(req.query.anio);


      if (
        !mes ||
        mes < 1 ||
        mes > 12 ||
        !anio
      ) {

        return res.status(400).json({
          mensaje:
            "Mes y año son obligatorios"
        });
      }


      const resultado =
        await generarLiquidacionExcel(
          req.usuario.id,
          mes,
          anio
        );


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