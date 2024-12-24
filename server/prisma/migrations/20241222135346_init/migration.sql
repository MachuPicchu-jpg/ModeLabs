-- CreateTable
CREATE TABLE "test_data" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "text" TEXT,
    "label" INTEGER NOT NULL,
    "question1" TEXT,
    "question2" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_data_pkey" PRIMARY KEY ("id")
);
