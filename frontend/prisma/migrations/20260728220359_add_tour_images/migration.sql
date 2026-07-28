-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tour" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFa" TEXT,
    "titleAr" TEXT,
    "titleRu" TEXT,
    "titleZh" TEXT,
    "titleEs" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionFa" TEXT,
    "descriptionAr" TEXT,
    "descriptionRu" TEXT,
    "descriptionZh" TEXT,
    "descriptionEs" TEXT,
    "type" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'MODERATE',
    "durationDays" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "discountPrice" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "capacity" INTEGER NOT NULL,
    "minAge" INTEGER NOT NULL DEFAULT 18,
    "maxGroupSize" INTEGER NOT NULL DEFAULT 15,
    "location" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT,
    "address" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "includes" TEXT NOT NULL DEFAULT '[]',
    "includesFa" TEXT,
    "excludes" TEXT NOT NULL DEFAULT '[]',
    "excludesFa" TEXT,
    "requirements" TEXT NOT NULL DEFAULT '[]',
    "requirementsFa" TEXT,
    "itinerary" TEXT NOT NULL DEFAULT '[]',
    "itineraryFa" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "averageRating" REAL NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalBookings" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "guideLang" TEXT NOT NULL DEFAULT 'EN',
    "imageUrl" TEXT,
    "galleryImages" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "provinceId" TEXT,
    "createdBy" TEXT,
    CONSTRAINT "Tour_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tour_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tour" ("address", "averageRating", "capacity", "city", "createdAt", "createdBy", "currency", "description", "descriptionAr", "descriptionEn", "descriptionEs", "descriptionFa", "descriptionRu", "descriptionZh", "difficulty", "discountPrice", "durationDays", "excludes", "excludesFa", "guideLang", "id", "includes", "includesFa", "isArchived", "isFeatured", "itinerary", "itineraryFa", "latitude", "location", "longitude", "maxGroupSize", "minAge", "price", "province", "provinceId", "requirements", "requirementsFa", "slug", "status", "title", "titleAr", "titleEn", "titleEs", "titleFa", "titleRu", "titleZh", "totalBookings", "totalReviews", "type", "updatedAt", "views") SELECT "address", "averageRating", "capacity", "city", "createdAt", "createdBy", "currency", "description", "descriptionAr", "descriptionEn", "descriptionEs", "descriptionFa", "descriptionRu", "descriptionZh", "difficulty", "discountPrice", "durationDays", "excludes", "excludesFa", "guideLang", "id", "includes", "includesFa", "isArchived", "isFeatured", "itinerary", "itineraryFa", "latitude", "location", "longitude", "maxGroupSize", "minAge", "price", "province", "provinceId", "requirements", "requirementsFa", "slug", "status", "title", "titleAr", "titleEn", "titleEs", "titleFa", "titleRu", "titleZh", "totalBookings", "totalReviews", "type", "updatedAt", "views" FROM "Tour";
DROP TABLE "Tour";
ALTER TABLE "new_Tour" RENAME TO "Tour";
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");
CREATE INDEX "Tour_type_idx" ON "Tour"("type");
CREATE INDEX "Tour_difficulty_idx" ON "Tour"("difficulty");
CREATE INDEX "Tour_status_idx" ON "Tour"("status");
CREATE INDEX "Tour_isFeatured_idx" ON "Tour"("isFeatured");
CREATE INDEX "Tour_province_idx" ON "Tour"("province");
CREATE INDEX "Tour_slug_idx" ON "Tour"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
