/*
  Warnings:

  - A unique constraint covering the columns `[url_image]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url_image` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "url_image" VARCHAR(130) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_url_image_key" ON "User"("url_image");
