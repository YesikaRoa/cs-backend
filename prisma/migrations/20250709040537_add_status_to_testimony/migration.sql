-- CreateEnum
CREATE TYPE "TestimonyStatus" AS ENUM ('draft', 'published', 'pending_approval');

-- AlterTable
ALTER TABLE "Testimony" ADD COLUMN     "status" "TestimonyStatus" NOT NULL DEFAULT 'pending_approval';
