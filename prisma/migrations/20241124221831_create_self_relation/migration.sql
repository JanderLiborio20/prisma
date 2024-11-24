/*
  Warnings:

  - Added the required column `affiliatedId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "affiliatedId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_affiliatedId_fkey" FOREIGN KEY ("affiliatedId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
