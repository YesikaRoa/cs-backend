/*
  Warnings:

  - You are about to alter the column `url` on the `ImagePost` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(130)`.

*/
-- AlterTable
ALTER TABLE "ImagePost" ALTER COLUMN "url" SET DATA TYPE VARCHAR(130);
