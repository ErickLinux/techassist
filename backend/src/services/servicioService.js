import prisma from "../config/prisma.js";

function crearFechaHora(fecha, hora) {
  if (!fecha || !hora) {
    return null;
  }

  // Guatemala utiliza UTC-6
  return new Date(`${fecha}T${hora}:00-06:00`);
}

function ajustarCruceMedianoche(inicio, fin) {
  if (!inicio || !fin) {
    return fin;
  }

  if (fin < inicio) {
    const fechaAjustada = new Date(fin);
    fechaAjustada.setDate(fechaAjustada.getDate() + 1);
    return fechaAjustada;
  }

  return fin;
}

export const crearRegistroServicio = async ({
  usuarioId,
  fecha,
  dia,
  codigoTienda,
  numeroTicket,
  numeroCaf,
  horaIngreso,
  horaEgreso,
  totalMinutosAtencion,
  totalKilometros,
  lugarSalida,
  inicioViaje,
  finViaje,
  totalMinutosViaje,
  trabajoRealizado
}) => {

  if (
    !fecha ||
    !dia ||
    !codigoTienda ||
    !numeroTicket ||
    !horaIngreso ||
    !horaEgreso ||
    !trabajoRealizado
  ) {
    const error = new Error(
      "Faltan datos obligatorios para registrar el servicio"
    );

    error.statusCode = 400;
    throw error;
  }

  const usuario = await prisma.usuario.findUnique({
    where: {
      id: usuarioId
    }
  });

  if (!usuario || !usuario.activo) {
    const error = new Error(
      "El usuario no existe o se encuentra inactivo"
    );

    error.statusCode = 403;
    throw error;
  }

  const tienda = await prisma.tienda.findUnique({
    where: {
      codigo: Number(codigoTienda)
    }
  });

  if (!tienda || !tienda.activa) {
    const error = new Error(
      "La tienda seleccionada no existe o está inactiva"
    );

    error.statusCode = 404;
    throw error;
  }

  const fechaIngreso = crearFechaHora(
    fecha,
    horaIngreso
  );

  let fechaEgreso = crearFechaHora(
    fecha,
    horaEgreso
  );

  fechaEgreso = ajustarCruceMedianoche(
    fechaIngreso,
    fechaEgreso
  );

  let fechaInicioViaje = null;
  let fechaFinViaje = null;

  if (inicioViaje && finViaje) {
    fechaInicioViaje = crearFechaHora(
      fecha,
      inicioViaje
    );

    fechaFinViaje = crearFechaHora(
      fecha,
      finViaje
    );

    fechaFinViaje = ajustarCruceMedianoche(
      fechaInicioViaje,
      fechaFinViaje
    );
  }

  const registro = await prisma.registroServicio.create({
    data: {
      dia: dia.trim(),

      fecha: new Date(`${fecha}T12:00:00`),

      numeroTicket: numeroTicket.trim(),

      numeroCaf:
        numeroCaf?.trim() || null,

      horaIngreso: fechaIngreso,
      horaEgreso: fechaEgreso,

      totalMinutosAtencion:
        Number(totalMinutosAtencion),

      totalKilometros:
        Number(totalKilometros) || 0,
        lugarSalida:
    lugarSalida?.trim() || null,
      inicioViaje: fechaInicioViaje,
      finViaje: fechaFinViaje,

      totalMinutosViaje:
        Number(totalMinutosViaje) || 0,

      trabajoRealizado:
        trabajoRealizado.trim(),

      usuarioId,

      tiendaId: tienda.id
    },

    include: {
      usuario: {
        select: {
          id: true,
          nombre: true,
          correo: true
        }
      },

      tienda: {
        select: {
          id: true,
          codigo: true,
          nombre: true,
          departamento: true,
          municipio: true
        }
      }
    }
  });

  return registro;
};

export const obtenerServiciosPorUsuario = async (usuarioId) => {
  const servicios = await prisma.registroServicio.findMany({
    where: {
      usuarioId
    },

    orderBy: {
      fechaRegistro: "desc"
    },

    include: {
      tienda: {
        select: {
          id: true,
          codigo: true,
          nombre: true,
          departamento: true,
          municipio: true
        }
      }
    },

    take: 10
  });

  return servicios;
};

export const obtenerServicioPorId = async (
  servicioId,
  usuarioId
) => {

  const servicio = await prisma.registroServicio.findFirst({
    where: {
      id: servicioId,
      usuarioId: usuarioId
    },

    include: {
      tienda: {
        select: {
          id: true,
          codigo: true,
          nombre: true,
          departamento: true,
          municipio: true
        }
      },

      usuario: {
        select: {
          id: true,
          nombre: true,
          correo: true
        }
      }
    }
  });

  if (!servicio) {
    const error = new Error(
      "Servicio no encontrado"
    );

    error.statusCode = 404;
    throw error;
  }

  return servicio;
};

export const actualizarRegistroServicio = async ({
  servicioId,
  usuarioId,
  fecha,
  codigoTienda,
  numeroTicket,
  numeroCaf,
  horaIngreso,
  horaEgreso,
  totalKilometros,
  lugarSalida,
  inicioViaje,
  finViaje,
  trabajoRealizado
}) => {

  const servicioExistente =
  await prisma.registroServicio.findFirst({
    where: {
      id: servicioId,
      usuarioId
    }
  });

  if (!servicioExistente) {
    const error = new Error(
      "Servicio no encontrado o no tienes permiso para editarlo"
    );

    error.statusCode = 404;
    throw error;
  }

  const tienda = await prisma.tienda.findUnique({
    where: {
      codigo: Number(codigoTienda)
    }
  });

  if (!tienda || !tienda.activa) {
    const error = new Error(
      "La tienda seleccionada no existe o está inactiva"
    );

    error.statusCode = 404;
    throw error;
  }

  const fechaIngreso =
    crearFechaHora(fecha, horaIngreso);

  let fechaEgreso =
    crearFechaHora(fecha, horaEgreso);

  fechaEgreso =
    ajustarCruceMedianoche(
      fechaIngreso,
      fechaEgreso
    );

  const totalMinutosAtencion =
    Math.round(
      (fechaEgreso - fechaIngreso) / 60000
    );

  let fechaInicioViaje = null;
  let fechaFinViaje = null;
  let totalMinutosViaje = 0;

  if (inicioViaje && finViaje) {

    fechaInicioViaje =
      crearFechaHora(fecha, inicioViaje);

    fechaFinViaje =
      crearFechaHora(fecha, finViaje);

    fechaFinViaje =
      ajustarCruceMedianoche(
        fechaInicioViaje,
        fechaFinViaje
      );

    totalMinutosViaje =
      Math.round(
        (fechaFinViaje - fechaInicioViaje) / 60000
      );
  }

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
  ];

  const fechaServicio =
    new Date(`${fecha}T12:00:00`);

  const dia =
    diasSemana[fechaServicio.getDay()];

  const servicio =
    await prisma.registroServicio.update({
      where: {
        id: servicioId
      },

      data: {
        fecha: fechaServicio,
        dia,

        numeroTicket:
          numeroTicket.trim(),

        numeroCaf:
          numeroCaf?.trim() || null,

        horaIngreso: fechaIngreso,
        horaEgreso: fechaEgreso,

        totalMinutosAtencion,

        totalKilometros:
          Number(totalKilometros) || 0,

lugarSalida:
  lugarSalida?.trim() || null,
        inicioViaje: fechaInicioViaje,
        finViaje: fechaFinViaje,

        totalMinutosViaje,

        trabajoRealizado:
          trabajoRealizado.trim(),

        tiendaId: tienda.id
      },

      include: {
        tienda: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            correo: true
          }
        }
      }
    });

  return servicio;
};


export const eliminarRegistroServicio = async (
  servicioId,
  usuarioId
) => {

  const servicio =
    await prisma.registroServicio.findFirst({
      where: {
        id: servicioId,
        usuarioId
      }
    });

  if (!servicio) {

    const error =
      new Error(
        "Servicio no encontrado o no tienes permiso para eliminarlo"
      );

    error.statusCode = 404;

    throw error;
  }

  await prisma.registroServicio.delete({
    where: {
      id: servicioId
    }
  });

  return {
    id: servicioId
  };
};

