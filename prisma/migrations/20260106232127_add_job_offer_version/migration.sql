/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Job` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "application_deadline" TIMESTAMP(3),
ADD COLUMN     "benefits" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "employment_type" TEXT,
ADD COLUMN     "job_offer_version" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "latest_job_offer_doc_id" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "salary" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "work_location" TEXT;
