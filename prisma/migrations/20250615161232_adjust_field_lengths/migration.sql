/*
  Warnings:

  - Made the column `description` on table `Community` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Community" ALTER COLUMN "description" SET NOT NULL;
