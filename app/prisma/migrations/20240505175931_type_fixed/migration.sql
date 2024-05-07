/*
  Warnings:

  - You are about to drop the column `introVideLink` on the `tutors` table. All the data in the column will be lost.
  - Added the required column `introVideoLink` to the `tutors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tutors" DROP COLUMN "introVideLink",
ADD COLUMN     "introVideoLink" TEXT NOT NULL;
