/*
  Warnings:

  - A unique constraint covering the columns `[title,community_id]` on the table `CommunityInformation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CommunityInformation_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "CommunityInformation_title_community_id_key" ON "CommunityInformation"("title", "community_id");
