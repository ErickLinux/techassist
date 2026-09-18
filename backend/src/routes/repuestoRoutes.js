import { Router } from "express";

import {
  buscarTickets,
  buscarRepuestos,
  crearRepuesto,
  listarRepuestos,
  crearSolicitudRepuesto
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

export default router;