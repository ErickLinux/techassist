import { Router } from "express";

import {
  obtenerTiendaPorCodigo
} from "../controllers/tiendaController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/codigo/:codigo",
  verificarToken,
  obtenerTiendaPorCodigo
);

export default router;