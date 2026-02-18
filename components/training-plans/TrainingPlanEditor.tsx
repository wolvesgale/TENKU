"use client";

import { useEffect, useMemo, useState } from "react";

type Company = {
  id: string;
  name: string;
  nameKana?: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  representativeName?: string;
  representativeKana?: string;
  corporateNumber?: string;
  notifAcceptanceNo?: string;
  industryMajor?: string;
  industryMinor?: string;
  workplaceName?: string;
  workplaceNameKana?: string;
  workplaceAddress?: string;
  workplacePostalCode?: string;
  workplacePhone?: string;
  traineeResponsibleName?: string;
  traineeResponsibleKana?: string;
  traineeResponsibleRole?: string;
  traineeInstructorName?: string;
  traineeInstructorKana?: string;
  traineeInstructorRole?: string;
  lifeInstructorName?: string;
  lifeInstructorKana?: string;
  lifeInstructorRole?: string;
};

type Person = {
  id: string;
  nameRomaji?: string;
  nameKanji?: string;
  nationality?: string;
  birthdate?: string;
  gender?: string;
  age?: number;
  returnPeriodFrom?: string;
  returnPeriodTo?: string;
};

type Organization = {
  permitNumber?: string;
  permitType?: string;
  name: string;
  nameKana?: string;
  postalCode?: string;
  address?: string;
  phone?: string;
  representativeName?: string;
  representativeKana?: string;
  supervisorResponsibleName?: string;
  supervisorResponsibleKana?: string;
  supervisingOfficeName?: string;
  supervisingOfficeNameKana?: string;
  supervisingOfficePostalCode?: string;
  supervisingOfficeAddress?: string;
  supervisingOfficePhone?: string;
  planInstructorName?: string;
  planInstructorKana?: string;
  sendingOrgName?: string;
  sendingOrgNumber?: string;
  sendingOrgNumberCountry?: string;
  sendingOrgRefNumber?: string;
};

export type TrainingPlanEditorValues = {
  companyId: string;
  personId: string;
  category: string;
  jobCode: string;
  jobName: string;
  workName: string;
  jobCode2: string;
  jobName2: string;
  workName2: string;
  trainingStartDate: string;
  trainingEndDate: string;
  trainingDurationYears: string;
  trainingDurationMonths: string;
  trainingDurationDays: string;
  trainingHoursTotal: string;
  trainingHoursLecture: string;
  trainingHoursPractice: string;
  prevCertNumber: string;
  entryTrainingRequired: string;
  freeEditOverrides: Record<string, string>;
};

type PreviewField = { key: string; label: string };

const previewFields: { title: string; fields: PreviewField[] }[] = [
  {
    title: "申請者（実習実施者）",
    fields: [
      { key: "company.name", label: "法人名" },
      { key: "company.nameKana", label: "法人名（カナ）" },
      { key: "company.postalCode", label: "郵便番号" },
      { key: "company.address", label: "住所" },
      { key: "company.phone", label: "電話" },
      { key: "company.representativeName", label: "代表者氏名" },
      { key: "company.representativeKana", label: "代表者氏名（カナ）" },
      { key: "company.corporateNumber", label: "法人番号" },
      { key: "company.notifAcceptanceNo", label: "実習実施者届出受理番号" },
      { key: "company.industryMajor", label: "産業分類（大分類）" },
      { key: "company.industryMinor", label: "産業分類（中分類）" },
    ],
  },
  {
    title: "技能実習を行わせる事業所",
    fields: [
      { key: "company.workplaceName", label: "事業所名" },
      { key: "company.workplaceNameKana", label: "事業所名（カナ）" },
      { key: "company.workplacePostalCode", label: "郵便番号" },
      { key: "company.workplaceAddress", label: "所在地" },
      { key: "company.workplacePhone", label: "電話" },
      { key: "company.traineeResponsibleName", label: "実習責任者" },
      { key: "company.traineeResponsibleKana", label: "実習責任者（カナ）" },
      { key: "company.traineeResponsibleRole", label: "実習責任者 役職" },
      { key: "company.traineeInstructorName", label: "技能実習指導員" },
      { key: "company.traineeInstructorKana", label: "技能実習指導員（カナ）" },
      { key: "company.traineeInstructorRole", label: "技能実習指導員 役職" },
      { key: "company.lifeInstructorName", label: "生活指導員" },
      { key: "company.lifeInstructorKana", label: "生活指導員（カナ）" },
      { key: "company.lifeInstructorRole", label: "生活指導員 役職" },
    ],
  },
  {
    title: "技能実習生",
    fields: [
      { key: "person.nameRomaji", label: "氏名（ローマ字）" },
      { key: "person.nameKanji", label: "氏名（漢字）" },
      { key: "person.nationality", label: "国籍" },
      { key: "person.birthdate", label: "生年月日" },
      { key: "person.gender", label: "性別" },
      { key: "person.age", label: "年齢" },
      { key: "person.returnPeriodFrom", label: "帰国期間（開始）" },
      { key: "person.returnPeriodTo", label: "帰国期間（終了）" },
    ],
  },
  {
    title: "技能実習計画",
    fields: [
      { key: "training.category", label: "区分（A〜F）" },
      { key: "training.jobCode", label: "職種コード1" },
      { key: "training.jobName", label: "職種名1" },
      { key: "training.workName", label: "作業名1" },
      { key: "training.jobCode2", label: "職種コード2" },
      { key: "training.jobName2", label: "職種名2" },
      { key: "training.workName2", label: "作業名2" },
      { key: "training.startDate", label: "実習開始日" },
      { key: "training.endDate", label: "実習終了日" },
      { key: "training.durationYears", label: "実習期間_年" },
      { key: "training.durationMonths", label: "実習期間_月" },
      { key: "training.durationDays", label: "実習期間_日" },
      { key: "training.hoursTotal", label: "実習時間合計" },
      { key: "training.hoursLecture", label: "実習時間_講習" },
      { key: "training.hoursPractice", label: "実習時間_実習" },
      { key: "training.prevCertNumber", label: "前段階認定番号" },
      { key: "training.entryTrainingRequired", label: "入国後講習（1/0）" },
    ],
  },
  {
    title: "監理団体",
    fields: [
      { key: "org.permitNumber", label: "許可番号" },
      { key: "org.permitType", label: "許可区分" },
      { key: "org.name", label: "団体名" },
      { key: "org.nameKana", label: "団体名（カナ）" },
      { key: "org.postalCode", label: "郵便番号" },
      { key: "org.address", label: "住所" },
      { key: "org.phone", label: "電話" },
      { key: "org.representativeName", label: "代表者氏名" },
      { key: "org.representativeKana", label: "代表者氏名（カナ）" },
      { key: "org.supervisorResponsibleName", label: "監理責任者" },
      { key: "org.supervisorResponsibleKana", label: "監理責任者（カナ）" },
      { key: "org.supervisingOfficeName", label: "担当事業所" },
      { key: "org.supervisingOfficeNameKana", label: "担当事業所（カナ）" },
      { key: "org.supervisingOfficePostalCode", label: "担当事業所郵便番号" },
      { key: "org.supervisingOfficeAddress", label: "担当事業所住所" },
      { key: "org.supervisingOfficePhone", label: "担当事業所電話" },
      { key: "org.planInstructorName", label: "計画指導担当者" },
      { key: "org.planInstructorKana", label: "計画指導担当者（カナ）" },
      { key: "org.sendingOrgName", label: "送出機関名" },
      { key: "org.sendingOrgNumberCountry", label: "送出機関番号（国コード）" },
      { key: "org.sendingOrgNumber", label: "送出機関番号" },
      { key: "org.sendingOrgRefNumber", label: "送出機関整理番号" },
    ],
  },
];

const buildBaseValues = ({
  organization,
  company,
  person,
  values,
}: {
  organization: Organization;
  company?: Company;
  person?: Person;
  values: TrainingPlanEditorValues;
}) => ({
  "company.name": company?.name ?? "",
  "company.nameKana": company?.nameKana ?? "",
  "company.postalCode": company?.postalCode ?? "",
  "company.address": company?.address ?? "",
  "company.phone": company?.phone ?? "",
  "company.representativeName": company?.representativeName ?? "",
  "company.representativeKana": company?.representativeKana ?? "",
  "company.corporateNumber": company?.corporateNumber ?? "",
  "company.notifAcceptanceNo": company?.notifAcceptanceNo ?? "",
  "company.industryMajor": company?.industryMajor ?? "",
  "company.industryMinor": company?.industryMinor ?? "",
  "company.workplaceName": company?.workplaceName ?? "",
  "company.workplaceNameKana": company?.workplaceNameKana ?? "",
  "company.workplacePostalCode": company?.workplacePostalCode ?? "",
  "company.workplaceAddress": company?.workplaceAddress ?? "",
  "company.workplacePhone": company?.workplacePhone ?? "",
  "company.traineeResponsibleName": company?.traineeResponsibleName ?? "",
  "company.traineeResponsibleKana": company?.traineeResponsibleKana ?? "",
  "company.traineeResponsibleRole": company?.traineeResponsibleRole ?? "",
  "company.traineeInstructorName": company?.traineeInstructorName ?? "",
  "company.traineeInstructorKana": company?.traineeInstructorKana ?? "",
  "company.traineeInstructorRole": company?.traineeInstructorRole ?? "",
  "company.lifeInstructorName": company?.lifeInstructorName ?? "",
  "company.lifeInstructorKana": company?.lifeInstructorKana ?? "",
  "company.lifeInstructorRole": company?.lifeInstructorRole ?? "",
  "person.nameRomaji": person?.nameRomaji ?? "",
  "person.nameKanji": person?.nameKanji ?? "",
  "person.nationality": person?.nationality ?? "",
  "person.birthdate": person?.birthdate ?? "",
  "person.gender": person?.gender ?? "",
  "person.age": person?.age?.toString() ?? "",
  "person.returnPeriodFrom": person?.returnPeriodFrom ?? "",
  "person.returnPeriodTo": person?.returnPeriodTo ?? "",
  "training.category": values.category ?? "",
  "training.jobCode": values.jobCode ?? "",
  "training.jobName": values.jobName ?? "",
  "training.workName": values.workName ?? "",
  "training.jobCode2": values.jobCode2 ?? "",
  "training.jobName2": values.jobName2 ?? "",
  "training.workName2": values.workName2 ?? "",
  "training.startDate": values.trainingStartDate ?? "",
  "training.endDate": values.trainingEndDate ?? "",
  "training.durationYears": values.trainingDurationYears ?? "",
  "training.durationMonths": values.trainingDurationMonths ?? "",
  "training.durationDays": values.trainingDurationDays ?? "",
  "training.hoursTotal": values.trainingHoursTotal ?? "",
  "training.hoursLecture": values.trainingHoursLecture ?? "",
  "training.hoursPractice": values.trainingHoursPractice ?? "",
  "training.prevCertNumber": values.prevCertNumber ?? "",
  "training.entryTrainingRequired": values.entryTrainingRequired ?? "",
  "org.permitNumber": organization.permitNumber ?? "",
  "org.permitType": organization.permitType ?? "",
  "org.name": organization.name ?? "",
  "org.nameKana": organization.nameKana ?? "",
  "org.postalCode": organization.postalCode ?? "",
  "org.address": organization.address ?? "",
  "org.phone": organization.phone ?? "",
  "org.representativeName": organization.representativeName ?? "",
  "org.representativeKana": organization.representativeKana ?? "",
  "org.supervisorResponsibleName": organization.supervisorResponsibleName ?? "",
  "org.supervisorResponsibleKana": organization.supervisorResponsibleKana ?? "",
  "org.supervisingOfficeName": organization.supervisingOfficeName ?? "",
  "org.supervisingOfficeNameKana": organization.supervisingOfficeNameKana ?? "",
  "org.supervisingOfficePostalCode": organization.supervisingOfficePostalCode ?? "",
  "org.supervisingOfficeAddress": organization.supervisingOfficeAddress ?? "",
  "org.supervisingOfficePhone": organization.supervisingOfficePhone ?? "",
  "org.planInstructorName": organization.planInstructorName ?? "",
  "org.planInstructorKana": organization.planInstructorKana ?? "",
  "org.sendingOrgName": organization.sendingOrgName ?? "",
  "org.sendingOrgNumberCountry": organization.sendingOrgNumberCountry ?? "",
  "org.sendingOrgNumber": organization.sendingOrgNumber ?? "",
  "org.sendingOrgRefNumber": organization.sendingOrgRefNumber ?? "",
});

export function TrainingPlanEditor({
  organization,
  companies,
  persons,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "保存",
}: {
  organization: Organization;
  companies: Company[];
  persons: Person[];
  initialValues: TrainingPlanEditorValues;
  onSubmit: (values: TrainingPlanEditorValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<TrainingPlanEditorValues>(initialValues);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const selectedCompany = useMemo(() => companies.find((c) => c.id === values.companyId), [companies, values.companyId]);
  const selectedPerson = useMemo(() => persons.find((p) => p.id === values.personId), [persons, values.personId]);

  const baseValues = useMemo(
    () => buildBaseValues({ organization, company: selectedCompany, person: selectedPerson, values }),
    [organization, selectedCompany, selectedPerson, values],
  );

  const mergedValues: Record<string, string> = useMemo(
    () => ({ ...baseValues, ...values.freeEditOverrides }) as Record<string, string>,
    [baseValues, values.freeEditOverrides],
  );

  const updateOverride = (key: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      freeEditOverrides: { ...prev.freeEditOverrides, [key]: value },
    }));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-4">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">計画の選択</h2>
          <label className="block text-sm">
            法人
            <select
              className="w-full border px-2 py-1 rounded"
              value={values.companyId}
              onChange={(e) => setValues((prev) => ({ ...prev, companyId: e.target.value }))}
            >
              <option value="">選択してください</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            実習生
            <select
              className="w-full border px-2 py-1 rounded"
              value={values.personId}
              onChange={(e) => setValues((prev) => ({ ...prev, personId: e.target.value }))}
            >
              <option value="">選択してください</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameKanji ?? p.nameRomaji ?? p.id}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">計画情報</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              区分（A〜F）
              <input
                className="w-full border px-2 py-1 rounded"
                value={values.category}
                onChange={(e) => setValues((prev) => ({ ...prev, category: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              前段階認定番号
              <input
                className="w-full border px-2 py-1 rounded"
                value={values.prevCertNumber}
                onChange={(e) => setValues((prev) => ({ ...prev, prevCertNumber: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              職種コード1
              <input
                className="w-full border px-2 py-1 rounded"
                value={values.jobCode}
                onChange={(e) => setValues((prev) => ({ ...prev, jobCode: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              職種名1
              <input
                className="w-full border px-2 py-1 rounded"
                value={values.jobName}
                onChange={(e) => setValues((prev) => ({ ...prev, jobName: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              作業名1
              <input
                className="w-full border px-2 py-1 rounded"
                value={values.workName}
                onChange={(e) => setValues((prev) => ({ ...prev, workName: e.target.value }))}
              />
            </label>
            <div />
            <label className="text-sm">
              職種コード2
              <input
                className="w-full border px-2 py-1 rounded"
                value={values.jobCode2}
                onChange={(e) => setValues((prev) => ({ ...prev, jobCode2: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              職種名2
              <input
                className="w-full border px-2 py-1 rounded"
                value={values.jobName2}
                onChange={(e) => setValues((prev) => ({ ...prev, jobName2: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              作業名2
              <input
                className="w-full border px-2 py-1 rounded"
                value={values.workName2}
                onChange={(e) => setValues((prev) => ({ ...prev, workName2: e.target.value }))}
              />
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">実習期間・時間</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              実習開始日
              <input
                type="date"
                className="w-full border px-2 py-1 rounded"
                value={values.trainingStartDate}
                onChange={(e) => setValues((prev) => ({ ...prev, trainingStartDate: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              実習終了日
              <input
                type="date"
                className="w-full border px-2 py-1 rounded"
                value={values.trainingEndDate}
                onChange={(e) => setValues((prev) => ({ ...prev, trainingEndDate: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              実習期間_年
              <input
                className="w-full border px-2 py-1 rounded"
                placeholder="例: 1"
                value={values.trainingDurationYears}
                onChange={(e) => setValues((prev) => ({ ...prev, trainingDurationYears: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              実習期間_月
              <input
                className="w-full border px-2 py-1 rounded"
                placeholder="例: 0"
                value={values.trainingDurationMonths}
                onChange={(e) => setValues((prev) => ({ ...prev, trainingDurationMonths: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              実習期間_日
              <input
                className="w-full border px-2 py-1 rounded"
                placeholder="例: 0"
                value={values.trainingDurationDays}
                onChange={(e) => setValues((prev) => ({ ...prev, trainingDurationDays: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              入国後講習（1=必要 / 0=不要）
              <input
                className="w-full border px-2 py-1 rounded"
                placeholder="1 または 0"
                value={values.entryTrainingRequired}
                onChange={(e) => setValues((prev) => ({ ...prev, entryTrainingRequired: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              実習時間合計（時間）
              <input
                className="w-full border px-2 py-1 rounded"
                value={values.trainingHoursTotal}
                onChange={(e) => setValues((prev) => ({ ...prev, trainingHoursTotal: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              うち講習時間
              <input
                className="w-full border px-2 py-1 rounded"
                value={values.trainingHoursLecture}
                onChange={(e) => setValues((prev) => ({ ...prev, trainingHoursLecture: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              うち実習時間
              <input
                className="w-full border px-2 py-1 rounded"
                value={values.trainingHoursPractice}
                onChange={(e) => setValues((prev) => ({ ...prev, trainingHoursPractice: e.target.value }))}
              />
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" className="btn-primary disabled:opacity-60" onClick={submit} disabled={submitting}>
            {submitting ? "保存中..." : submitLabel}
          </button>
          {onCancel && (
            <button type="button" className="btn-ghost" onClick={onCancel} disabled={submitting}>
              戻る
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">プレビュー & 加筆修正</h2>
          <p className="text-sm text-gray-500">入力値は即座に反映されます。</p>
        </div>
        <div className="space-y-4">
          {previewFields.map((section) => (
            <div key={section.title} className="glass-card p-4 space-y-2">
              <h3 className="font-semibold text-sm text-gray-100 mb-1">{section.title}</h3>
              {section.fields.map((field) => (
                <div key={field.key} className="grid gap-2 md:grid-cols-[180px_2fr_1fr] items-start">
                  <span className="text-xs text-muted">{field.label}</span>
                  <span className="text-sm break-all text-gray-100">{mergedValues[field.key] || "—"}</span>
                  <input
                    className="bg-transparent border border-border px-2 py-1 rounded text-sm text-gray-100"
                    placeholder="加筆修正（任意）"
                    value={values.freeEditOverrides[field.key] ?? ""}
                    onChange={(e) => updateOverride(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
