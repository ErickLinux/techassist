import { Router } from "express";

import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil
} from "../controllers/usuarioController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/perfil", verificarToken, obtenerPerfil);

export default router;