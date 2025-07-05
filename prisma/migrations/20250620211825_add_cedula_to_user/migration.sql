/*
  Warnings:

  - A unique constraint covering the columns `[cedula]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cedula` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cedula" VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_cedula_key" ON "User"("cedula");
