/*
  Warnings:

  - Made the column `email` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "email" SET NOT NULL;
