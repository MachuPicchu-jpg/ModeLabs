/*
  Warnings:

  - A unique constraint covering the columns `[model_id]` on the table `language_model_rankings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "language_model_rankings_model_id_key" ON "language_model_rankings"("model_id");
