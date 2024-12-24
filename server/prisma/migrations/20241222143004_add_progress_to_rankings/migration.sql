/*
  Warnings:

  - The primary key for the `language_model_rankings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `error_message` on the `language_model_rankings` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_status` on the `language_model_rankings` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `language_model_rankings` table. All the data in the column will be lost.
  - The required column `id` was added to the `language_model_rankings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "language_model_rankings" DROP CONSTRAINT "language_model_rankings_pkey",
DROP COLUMN "error_message",
DROP COLUMN "evaluation_status",
DROP COLUMN "progress",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "coding" DROP DEFAULT,
ALTER COLUMN "inference" DROP DEFAULT,
ALTER COLUMN "knowledge_usage" DROP DEFAULT,
ALTER COLUMN "mathematics" DROP DEFAULT,
ALTER COLUMN "organization" DROP DEFAULT,
ALTER COLUMN "overall_score" DROP DEFAULT,
ADD CONSTRAINT "language_model_rankings_pkey" PRIMARY KEY ("id");
