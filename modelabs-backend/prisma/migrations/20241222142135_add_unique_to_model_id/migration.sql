/*
  Warnings:

  - The primary key for the `language_model_rankings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `language_model_rankings` table. All the data in the column will be lost.
  - You are about to drop the `test_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "language_model_rankings" DROP CONSTRAINT "language_model_rankings_pkey",
DROP COLUMN "id",
ADD COLUMN     "error_message" TEXT,
ADD COLUMN     "evaluation_status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "coding" SET DEFAULT 0,
ALTER COLUMN "inference" SET DEFAULT 0,
ALTER COLUMN "knowledge_usage" SET DEFAULT 0,
ALTER COLUMN "mathematics" SET DEFAULT 0,
ALTER COLUMN "organization" SET DEFAULT 0,
ALTER COLUMN "overall_score" SET DEFAULT 0,
ADD CONSTRAINT "language_model_rankings_pkey" PRIMARY KEY ("model_id");

-- DropTable
DROP TABLE "test_data";
