/*
  Warnings:

  - You are about to drop the column `created_at` on the `datasets` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `datasets` table. All the data in the column will be lost.
  - Added the required column `category` to the `datasets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategory` to the `datasets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `datasets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `datasets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `datasets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "datasets" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "downloads" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "subCategory" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userEmail" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'public';
