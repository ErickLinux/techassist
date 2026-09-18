import express from "express";
import cors from "cors";

import adminUsuarioRoutes
  from "./routes/adminUsuarioRoutes.js";

import usuarioRoutes
  from "./routes/usuarioRoutes.js";

import tiendaRoutes
  from "./routes/tiendaRoutes.js";

import servicioRoutes
  from "./routes/servicioRoutes.js";

import liquidacionRoutes
  from "./routes/liquidacionRoutes.js";

import repuestoRoutes
  from "./routes/repuestoRoutes.js";


const app = express();


// ========================================
// MIDDLEWARES
// ========================================

app.use(cors());
app.use(express.json());


// ========================================
// RUTA PRINCIPAL
// ========================================

app.get("/", (req, res) => {

  res.json({
    mensaje:
      "TechAssist API funcionando correctamente"
  });

});


// ========================================
// RUTAS API
// ========================================

app.use(
  "/api/liquidaciones",
  liquidacionRoutes
);

app.use(
  "/api/usuarios",
  usuarioRoutes
);

app.use(
  "/api/tiendas",
  tiendaRoutes
);

app.use(
  "/api/servicios",
  servicioRoutes
);

app.use(
  "/api/repuestos",
  repuestoRoutes
);

app.use(
  "/api/admin/usuarios",
  adminUsuarioRoutes
);

app.get(
  "/api/prueba-repuestos",
  (req, res) => {

    res.json({
      mensaje:
        "Modulo de repuestos cargado correctamente"
    });

  }
);
export default app;