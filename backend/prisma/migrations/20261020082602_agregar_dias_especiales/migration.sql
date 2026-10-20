-- CreateTable
CREATE TABLE "dias_especiales" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "recurrente" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dias_especiales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dias_especiales_activo_idx" ON "dias_especiales"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "dias_especiales_fecha_key" ON "dias_especiales"("fecha");
