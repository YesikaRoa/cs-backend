-- DropForeignKey
ALTER TABLE "ImagePost" DROP CONSTRAINT "ImagePost_post_id_fkey";

-- AddForeignKey
ALTER TABLE "ImagePost" ADD CONSTRAINT "ImagePost_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
