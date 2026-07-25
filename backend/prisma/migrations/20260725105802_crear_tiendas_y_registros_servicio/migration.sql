-- CreateTable
CREATE TABLE "RegistroServicio" (
    "id" TEXT NOT NULL,
    "dia" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numeroTicket" TEXT NOT NULL,
    "numeroCaf" TEXT,
    "horaIngreso" TIMESTAMP(3) NOT NULL,
    "horaEgreso" TIMESTAMP(3) NOT NULL,
    "totalMinutosAtencion" INTEGER NOT NULL,
    "totalKilometros" INTEGER NOT NULL DEFAULT 0,
    "inicioViaje" TIMESTAMP(3),
    "finViaje" TIMESTAMP(3),
    "totalMinutosViaje" INTEGER NOT NULL DEFAULT 0,
    "trabajoRealizado" TEXT NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tiendaId" TEXT NOT NULL,

    CONSTRAINT "RegistroServicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tienda" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tienda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RegistroServicio_usuarioId_idx" ON "RegistroServicio"("usuarioId");

-- CreateIndex
CREATE INDEX "RegistroServicio_tiendaId_idx" ON "RegistroServicio"("tiendaId");

-- CreateIndex
CREATE INDEX "RegistroServicio_numeroTicket_idx" ON "RegistroServicio"("numeroTicket");

-- CreateIndex
CREATE INDEX "RegistroServicio_fecha_idx" ON "RegistroServicio"("fecha");

-- CreateIndex
CREATE INDEX "Tienda_departamento_idx" ON "Tienda"("departamento");

-- CreateIndex
CREATE INDEX "Tienda_municipio_idx" ON "Tienda"("municipio");

-- CreateIndex
CREATE UNIQUE INDEX "Tienda_nombre_municipio_key" ON "Tienda"("nombre", "municipio");

-- AddForeignKey
ALTER TABLE "RegistroServicio" ADD CONSTRAINT "RegistroServicio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroServicio" ADD CONSTRAINT "RegistroServicio_tiendaId_fkey" FOREIGN KEY ("tiendaId") REFERENCES "Tienda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
