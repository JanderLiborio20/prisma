-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "instagram" TEXT,
    "github" TEXT,
    "bio" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
