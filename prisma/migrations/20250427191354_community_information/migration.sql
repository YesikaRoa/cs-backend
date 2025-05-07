-- CreateTable
CREATE TABLE "CommunityInformation" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(20) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "CommunityInformation_pkey" PRIMARY KEY ("id")
);
