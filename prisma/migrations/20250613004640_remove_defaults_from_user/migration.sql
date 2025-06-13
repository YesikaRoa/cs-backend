/*
  Warnings:

  - You are about to drop the column `last_login` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_community_id_fkey";

-- DropForeignKey
ALTER TABLE "Testimony" DROP CONSTRAINT "Testimony_community_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_community_id_fkey";

-- DropIndex
DROP INDEX "CommunityInformation_title_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "last_login",
ALTER COLUMN "rol_id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimony" ADD CONSTRAINT "Testimony_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
