/*
  Warnings:

  - You are about to drop the column `caseId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `case_id` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'DOING', 'DONE');

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_caseId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_tenantId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "caseId",
DROP COLUMN "dueDate",
DROP COLUMN "tenantId",
ADD COLUMN     "case_id" TEXT NOT NULL,
ADD COLUMN     "due_date" TIMESTAMP(3),
ADD COLUMN     "meta_json" JSONB,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
