import express from "express";

import {
  obtenerUsuarios,
  registrarUsuarioAdmin,
  actualizarEstadoUsuario
} from "../controllers/adminUsuarioController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

import {
  verificarAdmin
} from "../middleware/adminMiddleware.js";


const router = express.Router();


// Todas estas rutas requieren
// autenticación y rol ADMIN.

router.use(
  verificarToken,
  verificarAdmin
);


// Listar usuarios
router.get(
  "/",
  obtenerUsuarios
);


// Crear usuario
router.post(
  "/",
  registrarUsuarioAdmin
);


// Activar / desactivar
router.patch(
  "/:id/estado",
  actualizarEstadoUsuario
);


export default router;