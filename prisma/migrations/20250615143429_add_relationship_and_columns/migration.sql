/*
  Warnings:

  - Added the required column `community_id` to the `CommunityInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "name_clap" VARCHAR(50) NOT NULL DEFAULT 'N/A',
ADD COLUMN     "rif_community" VARCHAR(15) NOT NULL DEFAULT '00000000';

-- AlterTable
ALTER TABLE "CommunityInformation" ADD COLUMN     "community_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CommunityInformation" ADD CONSTRAINT "CommunityInformation_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
