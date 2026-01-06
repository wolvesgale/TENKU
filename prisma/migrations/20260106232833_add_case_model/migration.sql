/*
  Warnings:

  - You are about to drop the column `caseType` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `metaJson` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `ownerOrgId` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `personId` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Case` table. All the data in the column will be lost.
  - Added the required column `case_type` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `program` on the `Case` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CaseProgram" AS ENUM ('ALL', 'TITP', 'SSW', 'TA');

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_personId_fkey";

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_tenantId_fkey";

-- AlterTable
ALTER TABLE "Case" DROP COLUMN "caseType",
DROP COLUMN "companyId",
DROP COLUMN "dueDate",
DROP COLUMN "metaJson",
DROP COLUMN "ownerOrgId",
DROP COLUMN "personId",
DROP COLUMN "tenantId",
ADD COLUMN     "case_type" TEXT NOT NULL,
ADD COLUMN     "company_id" TEXT,
ADD COLUMN     "due_date" TIMESTAMP(3),
ADD COLUMN     "meta_json" JSONB,
ADD COLUMN     "owner_org_id" TEXT,
ADD COLUMN     "person_id" TEXT,
ADD COLUMN     "tenant_id" TEXT NOT NULL,
DROP COLUMN "program",
ADD COLUMN     "program" "CaseProgram" NOT NULL;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
