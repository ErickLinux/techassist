-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "codigoRecuperacionExpira" TIMESTAMP(3),
ADD COLUMN     "codigoRecuperacionHash" TEXT;
