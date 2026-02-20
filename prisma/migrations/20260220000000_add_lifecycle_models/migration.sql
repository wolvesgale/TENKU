-- CreateEnum
CREATE TYPE "TravelType" AS ENUM ('FLIGHT', 'BUS');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('DRAFT', 'PREP', 'READY', 'OUTBOUND', 'RETURNED');

-- AlterEnum: add SUPERVISING, TRAINING to OrganizationType
ALTER TYPE "OrganizationType" ADD VALUE 'SUPERVISING';
ALTER TYPE "OrganizationType" ADD VALUE 'TRAINING';

-- CreateTable: TravelPlan
CREATE TABLE "TravelPlan" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "trip_group_id" TEXT,
    "travel_type" "TravelType" NOT NULL,
    "provider" TEXT,
    "booking_url" TEXT,
    "trip_status" "TripStatus" NOT NULL DEFAULT 'DRAFT',
    "departure_date" TIMESTAMP(3),
    "return_date" TIMESTAMP(3),
    "notes" TEXT,
    "meta_json" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Engagement
CREATE TABLE "Engagement" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "org_id" TEXT,
    "program" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "meta_json" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable: SupportPlan
CREATE TABLE "SupportPlan" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "person_id" TEXT,
    "company_id" TEXT,
    "org_id" TEXT,
    "plan_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "scheduled_date" TIMESTAMP(3),
    "conducted_date" TIMESTAMP(3),
    "document_url" TEXT,
    "memo" TEXT,
    "meta_json" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable: EducationCourse
CREATE TABLE "EducationCourse" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "classroom_course_id" TEXT,
    "name" TEXT NOT NULL,
    "section" TEXT,
    "synced_at" TIMESTAMP(3),
    "meta_json" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable: EducationSubmission
CREATE TABLE "EducationSubmission" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "person_id" TEXT,
    "course_work_id" TEXT,
    "course_work_title" TEXT,
    "submitted_at" TIMESTAMP(3),
    "due_date" TIMESTAMP(3),
    "score" DOUBLE PRECISION,
    "max_score" DOUBLE PRECISION,
    "state" TEXT,
    "audio_url" TEXT,
    "meta_json" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable: TranslationJob
CREATE TABLE "TranslationJob" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "person_id" TEXT,
    "source_language" TEXT NOT NULL DEFAULT 'ja',
    "target_language" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "source_url" TEXT,
    "result_url" TEXT,
    "notes" TEXT,
    "meta_json" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TranslationJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey: TravelPlan
ALTER TABLE "TravelPlan" ADD CONSTRAINT "TravelPlan_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TravelPlan" ADD CONSTRAINT "TravelPlan_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: Engagement
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: SupportPlan
ALTER TABLE "SupportPlan" ADD CONSTRAINT "SupportPlan_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SupportPlan" ADD CONSTRAINT "SupportPlan_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SupportPlan" ADD CONSTRAINT "SupportPlan_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: EducationCourse
ALTER TABLE "EducationCourse" ADD CONSTRAINT "EducationCourse_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: EducationSubmission
ALTER TABLE "EducationSubmission" ADD CONSTRAINT "EducationSubmission_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "EducationCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EducationSubmission" ADD CONSTRAINT "EducationSubmission_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: TranslationJob
ALTER TABLE "TranslationJob" ADD CONSTRAINT "TranslationJob_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TranslationJob" ADD CONSTRAINT "TranslationJob_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
