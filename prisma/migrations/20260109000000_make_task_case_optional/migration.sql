/*
  Warnings:

  - You are about to alter the column `case_id` on the `Task` table to be nullable. The data in that column could be lost if there are existing non-null constraints.
  - You are about to alter the column `title` on the `Task` table to be nullable.
*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "case_id" DROP NOT NULL,
ALTER COLUMN "title" DROP NOT NULL;
