-- CreateTable
CREATE TABLE "language_models_rank" (
    "id" SERIAL NOT NULL,
    "model_name" TEXT NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL,
    "aspect_scores" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "language_models_rank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multimodal_models_rank" (
    "id" SERIAL NOT NULL,
    "model_name" TEXT NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL,
    "aspect_scores" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "multimodal_models_rank_pkey" PRIMARY KEY ("id")
);
