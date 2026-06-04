-- 特定技能 申請詳細 拡張マイグレーション
-- 既存データを毀損しない ADD COLUMN IF NOT EXISTS を使用

-- ─── Person: SSW拡張フィールド追加 ────────────────────────────────────────────
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "passport_number"       TEXT;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "birth_place"           TEXT;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "phone_number"          TEXT;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "email_address"         TEXT;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "last_education"        TEXT;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "japanese_test_type"    TEXT;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "japanese_test_level"   TEXT;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "japanese_test_date"    TIMESTAMP(3);
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "japanese_test_cert_no" TEXT;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "skill_test_type"       TEXT;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "skill_test_date"       TIMESTAMP(3);
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "skill_test_cert_no"    TEXT;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "titp2_completed"       BOOLEAN;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "titp2_cert_number"     TEXT;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "ssw_sector"            TEXT;
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "occupation_type"       TEXT;

-- ─── Company: SSW拡張フィールド追加 ──────────────────────────────────────────
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "corporate_number"        TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "representative_name"     TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "representative_title"    TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "fax"                     TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "labor_insurance_no"      TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "employment_insurance_no" TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "social_insurance_status" TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "ssw_receipt_no"          TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "contact_person_title"    TEXT;

-- ─── SswApplicationDetail: 新規テーブル作成 ──────────────────────────────────
CREATE TABLE IF NOT EXISTS "SswApplicationDetail" (
    "id"                   TEXT NOT NULL,
    "tenant_id"            TEXT NOT NULL,
    "person_id"            TEXT,
    "company_id"           TEXT,
    "app_type"             TEXT NOT NULL,
    "status"               TEXT NOT NULL DEFAULT 'DRAFT',
    "sector_code"          TEXT,
    "sector_label"         TEXT,
    "occupation_type"      TEXT,
    "employer_type"        TEXT,
    "japanese_test_exempt" BOOLEAN,
    "skill_test_passed"    BOOLEAN,
    "japanese_test_passed" BOOLEAN,
    "contract_start_date"  TIMESTAMP(3),
    "contract_end_date"    TIMESTAMP(3),
    "monthly_salary"       INTEGER,
    "work_location"        TEXT,
    "work_content"         TEXT,
    "employment_type"      TEXT,
    "is_delegated"         BOOLEAN,
    "support_org_name"     TEXT,
    "support_org_reg_no"   TEXT,
    "target_submit_date"   TIMESTAMP(3),
    "submitted_date"       TIMESTAMP(3),
    "approved_date"        TIMESTAMP(3),
    "rejected_date"        TIMESTAMP(3),
    "doc_checklist"        JSONB,
    "notes"                TEXT,
    "metadata"             JSONB,
    "created_at"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"           TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SswApplicationDetail_pkey" PRIMARY KEY ("id")
);

-- ForeignKey制約
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'SswApplicationDetail_tenant_id_fkey'
  ) THEN
    ALTER TABLE "SswApplicationDetail"
      ADD CONSTRAINT "SswApplicationDetail_tenant_id_fkey"
      FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'SswApplicationDetail_person_id_fkey'
  ) THEN
    ALTER TABLE "SswApplicationDetail"
      ADD CONSTRAINT "SswApplicationDetail_person_id_fkey"
      FOREIGN KEY ("person_id") REFERENCES "Person"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'SswApplicationDetail_company_id_fkey'
  ) THEN
    ALTER TABLE "SswApplicationDetail"
      ADD CONSTRAINT "SswApplicationDetail_company_id_fkey"
      FOREIGN KEY ("company_id") REFERENCES "Company"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
