/*
  Warnings:
  - You are about to drop the column `cedula` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dni]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dni` to the `User` table without a default value. This is not possible if the table is not empty.
*/
-- DropIndex
DROP INDEX "User_cedula_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cedula",
ADD COLUMN     "dni" VARCHAR(15) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");