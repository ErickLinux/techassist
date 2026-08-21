import express from "express";

import {
  obtenerUsuarios,
  registrarUsuarioAdmin,
  actualizarEstadoUsuario,
  editarUsuario
} from "../controllers/adminUsuarioController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

import {
  verificarAdmin
} from "../middleware/adminMiddleware.js";


const router = express.Router();


// ==============================
// SEGURIDAD ADMIN
// ==============================

router.use(
  verificarToken,
  verificarAdmin
);


// ==============================
// LISTAR USUARIOS
// ==============================

router.get(
  "/",
  obtenerUsuarios
);


// ==============================
// CREAR USUARIO
// ==============================

router.post(
  "/",
  registrarUsuarioAdmin
);


// ==============================
// EDITAR USUARIO
// ==============================

router.put(
  "/:id",
  editarUsuario
);


// ==============================
// ACTIVAR / DESACTIVAR
// ==============================

router.patch(
  "/:id/estado",
  actualizarEstadoUsuario
);


export default router;