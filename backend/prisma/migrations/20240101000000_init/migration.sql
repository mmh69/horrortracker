-- CreateTable
CREATE TABLE "Film" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "alternativeName" TEXT,
    "year" INTEGER,
    "description" TEXT,
    "posterUrl" TEXT,
    "posterPreview" TEXT,
    "ratingKp" DOUBLE PRECISION,
    "ratingImdb" DOUBLE PRECISION,
    "ratingVotes" INTEGER,
    "movieLength" INTEGER,
    "genres" TEXT[],
    "countries" TEXT[],
    "watched" BOOLEAN NOT NULL DEFAULT false,
    "watchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Film_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);
