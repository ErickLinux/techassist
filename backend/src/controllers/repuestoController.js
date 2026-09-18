import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


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