-- AlterTable
ALTER TABLE "RegistroServicio" ADD COLUMN     "finRegresoCasa" TIMESTAMP(3),
ADD COLUMN     "inicioRegresoCasa" TIMESTAMP(3),
ADD COLUMN     "totalMinutosRegresoCasa" INTEGER NOT NULL DEFAULT 0;
