/*
  Warnings:

  - You are about to drop the column `accuracy` on the `language_model_rankings` table. All the data in the column will be lost.
  - You are about to drop the column `robustness` on the `language_model_rankings` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `language_model_rankings` table. All the data in the column will be lost.
  - You are about to drop the column `speed` on the `language_model_rankings` table. All the data in the column will be lost.
  - You are about to drop the column `accuracy` on the `multimodal_model_rankings` table. All the data in the column will be lost.
  - You are about to drop the column `robustness` on the `multimodal_model_rankings` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `multimodal_model_rankings` table. All the data in the column will be lost.
  - You are about to drop the column `speed` on the `multimodal_model_rankings` table. All the data in the column will be lost.
  - Added the required column `coding` to the `language_model_rankings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inference` to the `language_model_rankings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `knowledge_usage` to the `language_model_rankings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mathematics` to the `language_model_rankings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_name` to the `language_model_rankings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization` to the `language_model_rankings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overall_score` to the `language_model_rankings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audio_processing` to the `multimodal_model_rankings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `integration` to the `multimodal_model_rankings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_name` to the `multimodal_model_rankings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overall_score` to the `multimodal_model_rankings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text_understanding` to the `multimodal_model_rankings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visual_recognition` to the `multimodal_model_rankings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "language_model_rankings" DROP COLUMN "accuracy",
DROP COLUMN "robustness",
DROP COLUMN "score",
DROP COLUMN "speed",
ADD COLUMN     "coding" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "inference" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "knowledge_usage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mathematics" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "model_name" TEXT NOT NULL,
ADD COLUMN     "organization" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "overall_score" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "multimodal_model_rankings" DROP COLUMN "accuracy",
DROP COLUMN "robustness",
DROP COLUMN "score",
DROP COLUMN "speed",
ADD COLUMN     "audio_processing" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "integration" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "model_name" TEXT NOT NULL,
ADD COLUMN     "overall_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "text_understanding" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "visual_recognition" DOUBLE PRECISION NOT NULL;
