/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `CommunityInformation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CommunityInformation_title_key" ON "CommunityInformation"("title");
