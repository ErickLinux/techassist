import prisma from "../config/prisma.js";

const campos = { id: true, fecha: true, nombre: true, descripcion: true, recurrente: true, activo: true, fechaRegistro: true };

function fechaValida(valor) {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return null;
  const fecha = new Date(`${valor}T00:00:00.000Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor ? fecha : null;
}

function validarDatos(body) {
  const fecha = fechaValida(body.fecha);
  const nombre = typeof body.nombre === "string" ? body.nombre.trim() : "";
  if (!fecha) return { error: "Fecha inválida. Utiliza AAAA-MM-DD." };
  if (!nombre || nombre.length > 150) return { error: "El nombre debe contener entre 1 y 150 caracteres." };
  if (body.descripcion != null && typeof body.descripcion !== "string") return { error: "Descripción inválida." };
  if (body.recurrente != null && typeof body.recurrente !== "boolean") return { error: "El campo recurrente debe ser booleano." };
  if (body.activo != null && typeof body.activo !== "boolean") return { error: "El campo activo debe ser booleano." };
  return { fecha, nombre, descripcion: body.descripcion?.trim() || null, recurrente: body.recurrente ?? false, activo: body.activo ?? true };
}

function responderError(res, error) {
  console.error("Error días especiales:", error);
  if (error.code === "P2002") return res.status(409).json({ mensaje: "Ya existe un día especial registrado con esa fecha." });
  if (error.code === "P2025") return res.status(404).json({ mensaje: "Día especial no encontrado." });
  return res.status(500).json({ mensaje: "Error interno al procesar el día especial." });
}

export async function listarDiasEspeciales(req, res) {
  try {
    const soloActivos = req.query.todos !== "true";
    const diasEspeciales = await prisma.diaEspecial.findMany({
      where: soloActivos ? { activo: true } : {},
      select: campos,
      orderBy: [{ fecha: "asc" }]
    });
    return res.json({ diasEspeciales });
  } catch (error) { return responderError(res, error); }
}

export async function crearDiaEspecial(req, res) {
  const datos = validarDatos(req.body ?? {});
  if (datos.error) return res.status(400).json({ mensaje: datos.error });
  try {
    const diaEspecial = await prisma.diaEspecial.create({ data: datos, select: campos });
    return res.status(201).json({ mensaje: "Día especial registrado.", diaEspecial });
  } catch (error) { return responderError(res, error); }
}

export async function actualizarDiaEspecial(req, res) {
  const datos = validarDatos(req.body ?? {});
  if (datos.error) return res.status(400).json({ mensaje: datos.error });
  try {
    const diaEspecial = await prisma.diaEspecial.update({ where: { id: req.params.id }, data: datos, select: campos });
    return res.json({ mensaje: "Día especial actualizado.", diaEspecial });
  } catch (error) { return responderError(res, error); }
}

export async function desactivarDiaEspecial(req, res) {
  try {
    const diaEspecial = await prisma.diaEspecial.update({ where: { id: req.params.id }, data: { activo: false }, select: campos });
    return res.json({ mensaje: "Día especial desactivado.", diaEspecial });
  } catch (error) { return responderError(res, error); }
}
