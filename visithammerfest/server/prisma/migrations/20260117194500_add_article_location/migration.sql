-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "location" TEXT[] DEFAULT ARRAY[]::TEXT[];
