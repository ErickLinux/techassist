-- AlterTable
ALTER TABLE "RegistroServicio" ALTER COLUMN "horaIngreso" DROP NOT NULL,
ALTER COLUMN "horaEgreso" DROP NOT NULL,
ALTER COLUMN "totalMinutosAtencion" SET DEFAULT 0;
