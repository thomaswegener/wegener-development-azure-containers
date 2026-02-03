-- CreateEnum
CREATE TYPE "FaqRegion" AS ENUM ('HAMMERFEST', 'MASOY', 'PORSANGER');

-- AlterTable
ALTER TABLE "Faq" ADD COLUMN     "region" "FaqRegion" NOT NULL DEFAULT 'HAMMERFEST';
