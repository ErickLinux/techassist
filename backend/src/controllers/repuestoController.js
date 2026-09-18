import prisma from "../config/prisma.js";


// ========================================
// BUSCAR TICKETS PARA SOLICITUD DE REPUESTO
// ========================================

export const buscarTickets = async (req, res) => {
  try {

    const usuarioId = req.usuario.id;

    const busqueda =
      req.query.q?.trim() || "";

    if (busqueda.length < 2) {
      return res.status(200).json({
        tickets: []
      });
    }


    const servicios =
      await prisma.registroServicio.findMany({

        where: {
          usuarioId,

          numeroTicket: {
            contains: busqueda,
            mode: "insensitive"
          }
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

        orderBy: {
          fecha: "desc"
        },

        take: 10
      });


    const tickets = servicios.map(
      (servicio) => ({
        id: servicio.id,

        numeroTicket:
          servicio.numeroTicket,

        fecha:
          servicio.fecha,

        numeroCaf:
          servicio.numeroCaf,

        tiendaId:
          servicio.tienda.id,

        determinante:
          servicio.tienda.codigo,

        nombreTienda:
          servicio.tienda.nombre,

        departamento:
          servicio.tienda.departamento,

        municipio:
          servicio.tienda.municipio
      })
    );


    return res.status(200).json({
      tickets
    });

  } catch (error) {

    console.error(
      "Error al buscar tickets:",
      error
    );

    return res.status(500).json({
      mensaje:
        "Error interno al buscar tickets"
    });
  }
};

// ========================================
// BUSCAR REPUESTOS
// ========================================

export const buscarRepuestos = async (req, res) => {
  try {

    const busqueda =
      req.query.q?.trim() || "";

    if (busqueda.length < 2) {
      return res.status(200).json({
        repuestos: []
      });
    }

    const repuestos =
      await prisma.repuesto.findMany({

        where: {
          activo: true,

          OR: [
            {
              nombre: {
                contains: busqueda,
                mode: "insensitive"
              }
            },
            {
              numeroParte: {
                contains: busqueda,
                mode: "insensitive"
              }
            }
          ]
        },

        select: {
          id: true,
          nombre: true,
          numeroParte: true,
          descripcion: true,
          tipoEquipo: true,
          imagenUrl: true
        },

        orderBy: {
          nombre: "asc"
        },

        take: 10
      });


    return res.status(200).json({
      repuestos
    });

  } catch (error) {

    console.error(
      "Error al buscar repuestos:",
      error
    );

    return res.status(500).json({
      mensaje:
        "Error interno al buscar repuestos"
    });
  }
};


// ========================================
// CREAR REPUESTO - SOLO ADMIN
// ========================================

export const crearRepuesto = async (req, res) => {
  try {

    if (req.usuario.rol !== "ADMIN") {
      return res.status(403).json({
        mensaje:
          "No tienes permisos para agregar repuestos"
      });
    }

    const {
      nombre,
      numeroParte,
      descripcion,
      tipoEquipo,
      imagenUrl
    } = req.body;


    // ========================================
    // VALIDACIONES
    // ========================================

    if (!nombre?.trim()) {
      return res.status(400).json({
        mensaje:
          "El nombre del repuesto es obligatorio"
      });
    }

    if (!numeroParte?.trim()) {
      return res.status(400).json({
        mensaje:
          "El número de parte es obligatorio"
      });
    }


    // ========================================
    // VALIDAR NÚMERO DE PARTE DUPLICADO
    // ========================================

    const repuestoExistente =
      await prisma.repuesto.findUnique({
        where: {
          numeroParte: numeroParte.trim()
        }
      });


    if (repuestoExistente) {
      return res.status(409).json({
        mensaje:
          "Ya existe un repuesto con ese número de parte"
      });
    }


    // ========================================
    // CREAR REPUESTO
    // ========================================

    const repuesto =
      await prisma.repuesto.create({

        data: {
          nombre:
            nombre.trim(),

          numeroParte:
            numeroParte.trim(),

          descripcion:
            descripcion?.trim() || null,

          tipoEquipo:
            tipoEquipo?.trim() || null,

          imagenUrl:
            imagenUrl?.trim() || null
        }
      });


    return res.status(201).json({
      mensaje:
        "Repuesto creado correctamente",

      repuesto
    });

  } catch (error) {

    console.error(
      "Error al crear repuesto:",
      error
    );

    return res.status(500).json({
      mensaje:
        "Error interno al crear el repuesto"
    });
  }
};

// ========================================
// LISTAR REPUESTOS - SOLO ADMIN
// ========================================

export const listarRepuestos = async (req, res) => {
  try {

    if (req.usuario.rol !== "ADMIN") {
      return res.status(403).json({
        mensaje: "No tienes permisos para consultar repuestos"
      });
    }

    const repuestos =
      await prisma.repuesto.findMany({
        orderBy: {
          nombre: "asc"
        }
      });

    return res.status(200).json({
      repuestos
    });

  } catch (error) {

    console.error(
      "Error al listar repuestos:",
      error
    );

    return res.status(500).json({
      mensaje:
        "Error interno al consultar los repuestos"
    });
  }
};

// ========================================
// CREAR SOLICITUD DE REPUESTO
// ========================================

export const crearSolicitudRepuesto =
  async (req, res) => {

    try {

      const usuarioId =
        req.usuario.id;

      const {
        fechaSolicitud,
        registroServicioId,
        repuestoId,
        descripcion
      } = req.body;


      // ========================================
      // VALIDACIONES
      // ========================================

      if (!fechaSolicitud) {
        return res.status(400).json({
          mensaje:
            "La fecha de solicitud es obligatoria"
        });
      }

      if (!registroServicioId) {
        return res.status(400).json({
          mensaje:
            "Debes seleccionar un ticket"
        });
      }

      if (!repuestoId) {
        return res.status(400).json({
          mensaje:
            "Debes seleccionar un repuesto"
        });
      }

      if (!descripcion?.trim()) {
        return res.status(400).json({
          mensaje:
            "La descripción es obligatoria"
        });
      }


      // ========================================
      // VALIDAR USUARIO
      // ========================================

      const usuario =
        await prisma.usuario.findUnique({
          where: {
            id: usuarioId
          }
        });


      if (!usuario || !usuario.activo) {

        return res.status(403).json({
          mensaje:
            "El usuario no existe o está inactivo"
        });
      }


      // ========================================
      // VALIDAR SERVICIO
      // ========================================

      const servicio =
        await prisma.registroServicio.findFirst({

          where: {
            id: registroServicioId,
            usuarioId
          },

          include: {
            tienda: true
          }
        });


      if (!servicio) {

        return res.status(404).json({
          mensaje:
            "El servicio seleccionado no existe o no pertenece al usuario"
        });
      }


      // ========================================
      // VALIDAR REPUESTO
      // ========================================

      const repuesto =
        await prisma.repuesto.findFirst({

          where: {
            id: repuestoId,
            activo: true
          }
        });


      if (!repuesto) {

        return res.status(404).json({
          mensaje:
            "El repuesto seleccionado no existe o está inactivo"
        });
      }


      // ========================================
      // FECHA GUATEMALA
      // ========================================

      const fecha =
        new Date(
          `${fechaSolicitud}T12:00:00-06:00`
        );


      // ========================================
      // CREAR SOLICITUD + DETALLE
      // ========================================

      const solicitud =
        await prisma.solicitudRepuesto.create({

          data: {

            pais: "Guatemala",

            fechaSolicitud:
              fecha,

            soporte:
              "L2 PBS",

            descripcion:
              descripcion.trim(),

            usuarioId,

            tiendaId:
              servicio.tiendaId,

            registroServicioId:
              servicio.id,

            detalles: {

              create: {
                repuestoId:
                  repuesto.id,

                cantidad: 1
              }
            }
          },

          include: {

            usuario: {
              select: {
                id: true,
                nombre: true,
                bodega: true
              }
            },

            tienda: true,

            registroServicio: {
              select: {
                id: true,
                numeroTicket: true
              }
            },

            detalles: {

              include: {
                repuesto: true
              }
            }
          }
        });


      return res.status(201).json({

        mensaje:
          "Solicitud de repuesto creada correctamente",

        solicitud
      });


    } catch (error) {

      console.error(
        "Error creando solicitud de repuesto:",
        error
      );


      return res.status(500).json({
        mensaje:
          "Error interno al crear la solicitud de repuesto"
      });
    }
  };


  // ========================================
// CAMBIAR ESTADO DE REPUESTO
// ========================================

export const cambiarEstadoRepuesto =
  async (req, res) => {

    try {

      if (req.usuario.rol !== "ADMIN") {

        return res.status(403).json({
          mensaje:
            "No tienes permisos para modificar repuestos"
        });
      }


      const { id } = req.params;
      const { activo } = req.body;


      if (typeof activo !== "boolean") {

        return res.status(400).json({
          mensaje:
            "El estado del repuesto no es válido"
        });
      }


      const repuestoExistente =
        await prisma.repuesto.findUnique({
          where: {
            id
          }
        });


      if (!repuestoExistente) {

        return res.status(404).json({
          mensaje:
            "El repuesto no existe"
        });
      }


      const repuesto =
        await prisma.repuesto.update({

          where: {
            id
          },

          data: {
            activo
          }
        });


      return res.status(200).json({

        mensaje:
          activo
            ? "Repuesto activado correctamente"
            : "Repuesto desactivado correctamente",

        repuesto
      });


    } catch (error) {

      console.error(
        "Error cambiando estado del repuesto:",
        error
      );


      return res.status(500).json({
        mensaje:
          "Error interno al modificar el estado del repuesto"
      });
    }
  };

  // ========================================
// EDITAR REPUESTO
// ========================================

export const editarRepuesto =
  async (req, res) => {

    try {

      if (req.usuario.rol !== "ADMIN") {

        return res.status(403).json({
          mensaje:
            "No tienes permisos para editar repuestos"
        });
      }


      // OBTENER ID DEL REPUESTO DESDE LA URL
      const { id } = req.params;


      const {
        nombre,
        numeroParte,
        tipoEquipo,
        descripcion,
        imagenUrl
      } = req.body;


      if (!nombre?.trim()) {

        return res.status(400).json({
          mensaje:
            "El nombre del repuesto es obligatorio"
        });
      }


      if (!numeroParte?.trim()) {

        return res.status(400).json({
          mensaje:
            "El número de parte es obligatorio"
        });
      }


      const repuestoExistente =
        await prisma.repuesto.findUnique({
          where: {
            id
          }
        });


      if (!repuestoExistente) {

        return res.status(404).json({
          mensaje:
            "El repuesto no existe"
        });
      }


      const numeroDuplicado =
        await prisma.repuesto.findFirst({

          where: {

            numeroParte:
              numeroParte.trim(),

            NOT: {
              id
            }
          }
        });


      if (numeroDuplicado) {

        return res.status(400).json({
          mensaje:
            "Ya existe otro repuesto con ese número de parte"
        });
      }


      const repuesto =
        await prisma.repuesto.update({

          where: {
            id
          },

          data: {

            nombre:
              nombre.trim(),

            numeroParte:
              numeroParte.trim(),

            tipoEquipo:
              tipoEquipo?.trim() || null,

            descripcion:
              descripcion?.trim() || null,

            imagenUrl:
              imagenUrl?.trim() || null
          }
        });


      return res.status(200).json({

        mensaje:
          "Repuesto actualizado correctamente",

        repuesto
      });


    } catch (error) {

      console.error(
        "Error editando repuesto:",
        error
      );


      return res.status(500).json({
        mensaje:
          "Error interno al editar el repuesto"
      });
    }
  };