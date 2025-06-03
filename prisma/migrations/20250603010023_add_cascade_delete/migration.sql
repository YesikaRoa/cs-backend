-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_community_id_fkey";

-- DropForeignKey
ALTER TABLE "Testimony" DROP CONSTRAINT "Testimony_community_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_community_id_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimony" ADD CONSTRAINT "Testimony_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
