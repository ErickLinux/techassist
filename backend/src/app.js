import express from "express";
import cors from "cors";
import adminUsuarioRoutes
  from "./routes/adminUsuarioRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import tiendaRoutes from "./routes/tiendaRoutes.js";
import servicioRoutes from "./routes/servicioRoutes.js";
import liquidacionRoutes
  from "./routes/liquidacionRoutes.js";
  
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "TechAssist API funcionando correctamente"
  });
});
app.use(
  "/api/liquidaciones",
  liquidacionRoutes
);

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tiendas", tiendaRoutes);
app.use("/api/servicios", servicioRoutes);
app.use(
  "/api/admin/usuarios",
  adminUsuarioRoutes
);

export default app;