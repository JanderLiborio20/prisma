-- DropIndex
DROP INDEX "users_name_age_idx";

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");
