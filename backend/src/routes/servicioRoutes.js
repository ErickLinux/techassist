import { Router } from "express";

import {
  registrarServicio,
  listarMisServicios,
  obtenerDetalleServicio,
  editarServicio,
  eliminarServicio,
  eliminarServiciosMultiples
} from "../controllers/servicioController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";


const router = Router();


// =============================================
// LISTAR MIS SERVICIOS
// =============================================

router.get(
  "/mis-servicios",
  verificarToken,
  listarMisServicios
);


// =============================================
// REGISTRAR SERVICIO
// =============================================

router.post(
  "/",
  verificarToken,
  registrarServicio
);


// =============================================
// ELIMINAR VARIOS SERVICIOS
// IMPORTANTE: DEBE ESTAR ANTES DE /:id
// =============================================

router.delete(
  "/eliminar-multiples",
  verificarToken,
  eliminarServiciosMultiples
);


// =============================================
// OBTENER DETALLE
// =============================================

router.get(
  "/:id",
  verificarToken,
  obtenerDetalleServicio
);


// =============================================
// EDITAR SERVICIO
// =============================================

router.put(
  "/:id",
  verificarToken,
  editarServicio
);


// =============================================
// ELIMINAR UN SERVICIO
// =============================================

router.delete(
  "/:id",
  verificarToken,
  eliminarServicio
);


export default router;