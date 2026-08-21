import { Router } from "express";

import {
  exportarLiquidacion
} from "../controllers/liquidacionController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";


const router =
  Router();


router.get(
  "/exportar",
  verificarToken,
  exportarLiquidacion
);


export default router;