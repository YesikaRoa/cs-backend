-- DropForeignKey
ALTER TABLE "CommunityInformation" DROP CONSTRAINT "CommunityInformation_community_id_fkey";

-- AddForeignKey
ALTER TABLE "CommunityInformation" ADD CONSTRAINT "CommunityInformation_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;
