/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Tienda` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `Tienda` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tienda_nombre_municipio_key";

-- AlterTable
ALTER TABLE "Tienda" ADD COLUMN     "codigo" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tienda_codigo_key" ON "Tienda"("codigo");

-- CreateIndex
CREATE INDEX "Tienda_codigo_idx" ON "Tienda"("codigo");
