import { Router } from "express";

import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  cambiarPassword,
  solicitarRecuperacion,
  verificarCodigo,
  restablecerPassword
} from "../controllers/usuarioController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();

router.post("/registro", registrarUsuario);

router.post("/login", loginUsuario);
router.post(
  "/recuperar-password",
  solicitarRecuperacion
);
router.post(
  "/verificar-codigo",
  verificarCodigo
);
router.put(
  "/restablecer-password",
  restablecerPassword
);

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