import { Router } from "express";
import prisma from "../config/prisma.js";
import { verificarToken } from "../middleware/authMiddleware.js";
import { listarDiasEspeciales, crearDiaEspecial, actualizarDiaEspecial, desactivarDiaEspecial } from "../controllers/diaEspecialController.js";

const router = Router();
router.use(verificarToken);

async function soloAdmin(req, res, next) {
  try {
    // Consultar el rol en BD; no confiar en un rol guardado en el navegador.
    const usuario = await prisma.usuario.findUnique({ where: { id: req.usuario.id }, select: { rol: true, activo: true } });
    if (!usuario?.activo || usuario.rol !== "ADMIN") return res.status(403).json({ mensaje: "Acceso exclusivo para administradores" });
    next();
  } catch (error) {
    console.error("Error validando administrador:", error);
    return res.status(500).json({ mensaje: "No fue posible verificar los permisos." });
  }
}

router.get("/", listarDiasEspeciales);
router.post("/", soloAdmin, crearDiaEspecial);
router.put("/:id", soloAdmin, actualizarDiaEspecial);
router.delete("/:id", soloAdmin, desactivarDiaEspecial);
export default router;
