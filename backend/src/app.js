import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "TechAssist API funcionando correctamente"
  });
});

app.use("/api/usuarios", usuarioRoutes);

export default app;