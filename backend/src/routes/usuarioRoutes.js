import { Router } from "express";

import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  cambiarPassword
} from "../controllers/usuarioController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();

router.post("/registro", registrarUsuario);

router.post("/login", loginUsuario);

router.get(
  "/perfil",
  verificarToken,
  obtenerPerfil
);

router.put(
  "/cambiar-password",
  verificarToken,
  cambiarPassword
);

export default router;