-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "slug" TEXT,
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "slug" TEXT;

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "legacyId" INTEGER,
    "status" "ContentStatus" NOT NULL DEFAULT 'PENDING',
    "category" TEXT,
    "question" JSONB NOT NULL,
    "answer" JSONB,
    "publishedAt" TIMESTAMP(3),
    "publishedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Faq_legacyId_key" ON "Faq"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_slug_key" ON "Activity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_slug_key" ON "Partner"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Store_slug_key" ON "Store"("slug");
