-- Add LOCATION to MediaLinkType enum
ALTER TYPE "MediaLinkType" ADD VALUE IF NOT EXISTS 'LOCATION';

-- Add conceptIds to content tables
ALTER TABLE "Partner" ADD COLUMN "conceptIds" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Activity" ADD COLUMN "conceptIds" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Store" ADD COLUMN "conceptIds" TEXT[] NOT NULL DEFAULT '{}';

-- Create Location table
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'PENDING',
    "showOnHome" BOOLEAN NOT NULL DEFAULT false,
    "showOnMenu" BOOLEAN NOT NULL DEFAULT true,
    "name" JSONB NOT NULL,
    "summary" JSONB,
    "heroMediaId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "publishedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");
