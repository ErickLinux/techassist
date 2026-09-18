import { Router } from "express";

import {
  buscarTickets,
  buscarRepuestos,
  crearRepuesto,
  listarRepuestos
} from "../controllers/repuestoController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";




const router = Router();


// ========================================
// BUSCAR TICKETS
// ========================================

router.get(
  "/buscar-ticket",
  verificarToken,
  buscarTickets
);

// ========================================
// CREAR REPUESTO - SOLO ADMIN
// ========================================

router.post(
  "/",
  verificarToken,
  crearRepuesto
);
export default router;

// ========================================
// BUSCAR REPUESTOS
// ========================================

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