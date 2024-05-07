/*
  Warnings:

  - You are about to drop the column `email` on the `tutors` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `tutors` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `tutors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `tutors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `tutors` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "tutors_email_key";

-- DropIndex
DROP INDEX "tutors_username_key";

-- AlterTable
ALTER TABLE "tutors" DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "username",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isTutor" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "tutors_userId_key" ON "tutors"("userId");

-- AddForeignKey
ALTER TABLE "tutors" ADD CONSTRAINT "tutors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
