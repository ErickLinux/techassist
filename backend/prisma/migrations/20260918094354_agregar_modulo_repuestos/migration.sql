-- CreateTable
CREATE TABLE "repuestos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "numeroParte" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipoEquipo" TEXT,
    "imagenUrl" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repuestos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_repuesto" (
    "id" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Guatemala',
    "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "soporte" TEXT NOT NULL DEFAULT 'L2 PBS',
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tiendaId" TEXT NOT NULL,
    "registroServicioId" TEXT NOT NULL,

    CONSTRAINT "solicitudes_repuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_solicitud_repuesto" (
    "id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "observacion" TEXT,
    "solicitudId" TEXT NOT NULL,
    "repuestoId" TEXT NOT NULL,

    CONSTRAINT "detalles_solicitud_repuesto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "repuestos_numeroParte_key" ON "repuestos"("numeroParte");

-- CreateIndex
CREATE INDEX "repuestos_nombre_idx" ON "repuestos"("nombre");

-- CreateIndex
CREATE INDEX "repuestos_numeroParte_idx" ON "repuestos"("numeroParte");

-- CreateIndex
CREATE INDEX "solicitudes_repuesto_usuarioId_idx" ON "solicitudes_repuesto"("usuarioId");

-- CreateIndex
CREATE INDEX "solicitudes_repuesto_tiendaId_idx" ON "solicitudes_repuesto"("tiendaId");

-- CreateIndex
CREATE INDEX "solicitudes_repuesto_registroServicioId_idx" ON "solicitudes_repuesto"("registroServicioId");

-- CreateIndex
CREATE INDEX "solicitudes_repuesto_fechaSolicitud_idx" ON "solicitudes_repuesto"("fechaSolicitud");

-- CreateIndex
CREATE INDEX "solicitudes_repuesto_estado_idx" ON "solicitudes_repuesto"("estado");

-- CreateIndex
CREATE INDEX "detalles_solicitud_repuesto_solicitudId_idx" ON "detalles_solicitud_repuesto"("solicitudId");

-- CreateIndex
CREATE INDEX "detalles_solicitud_repuesto_repuestoId_idx" ON "detalles_solicitud_repuesto"("repuestoId");

-- AddForeignKey
ALTER TABLE "solicitudes_repuesto" ADD CONSTRAINT "solicitudes_repuesto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_repuesto" ADD CONSTRAINT "solicitudes_repuesto_tiendaId_fkey" FOREIGN KEY ("tiendaId") REFERENCES "Tienda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_repuesto" ADD CONSTRAINT "solicitudes_repuesto_registroServicioId_fkey" FOREIGN KEY ("registroServicioId") REFERENCES "RegistroServicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_solicitud_repuesto" ADD CONSTRAINT "detalles_solicitud_repuesto_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes_repuesto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_solicitud_repuesto" ADD CONSTRAINT "detalles_solicitud_repuesto_repuestoId_fkey" FOREIGN KEY ("repuestoId") REFERENCES "repuestos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
