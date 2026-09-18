import { Router } from "express";

import {
  buscarTickets,
  buscarRepuestos,
  crearRepuesto,
  listarRepuestos,
  crearSolicitudRepuesto,
  editarRepuesto,
  cambiarEstadoRepuesto
} from "../controllers/repuestoController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/buscar-ticket",
  verificarToken,
  buscarTickets
);

router.get(
  "/buscar",
  verificarToken,
  buscarRepuestos
);

router.get(
  "/admin/listar",
  verificarToken,
  listarRepuestos
);

router.post(
  "/",
  verificarToken,
  crearRepuesto
);
router.post(
  "/solicitudes",
  verificarToken,
  crearSolicitudRepuesto
);

router.put(
  "/admin/:id",
  verificarToken,
  editarRepuesto
);

router.patch(
  "/admin/:id/estado",
  verificarToken,
  cambiarEstadoRepuesto
);

export default router;