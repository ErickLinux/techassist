import { Router } from "express";

import {
  registrarServicio,
  listarMisServicios,
  obtenerDetalleServicio,
  editarServicio,
  eliminarServicio
} from "../controllers/servicioController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/mis-servicios",
  verificarToken,
  listarMisServicios
);

router.get(
  "/:id",
  verificarToken,
  obtenerDetalleServicio
);

router.post(
  "/",
  verificarToken,
  registrarServicio
);

router.put(
  "/:id",
  verificarToken,
  editarServicio
);

router.delete(
  "/:id",
  verificarToken,
  eliminarServicio
);

export default router;