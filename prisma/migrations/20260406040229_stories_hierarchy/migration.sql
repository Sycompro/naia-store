/*
  Warnings:

  - You are about to drop the `Story` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Story";

-- CreateTable
CREATE TABLE "StoryGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'FEMALE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorySlide" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'IMAGE',
    "duration" INTEGER NOT NULL DEFAULT 5000,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StorySlide_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StorySlide" ADD CONSTRAINT "StorySlide_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StoryGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
