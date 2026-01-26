"use client";

import { useState } from "react";

export type CompanyFormData = {
  notifAcceptanceNo?: string;
  name: string;
  nameKana?: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  representativeKana?: string;
  representativeName?: string;
  corporateNumber?: string;
  industryMajor?: string;
  industryMinor?: string;
  contactName?: string;
  contactTel?: string;
  workplaceName?: string;
  workplaceNameKana?: string;
  workplaceAddress?: string;
  workplacePostalCode?: string;
  workplacePhone?: string;
  traineeResponsibleName?: string;
  traineeResponsibleRole?: string;
  traineeInstructorName?: string;
  traineeInstructorRole?: string;
  lifeInstructorName?: string;
  lifeInstructorRole?: string;
};

const inputClassName = "w-full border px-2 py-1 rounded";

export function CompanyForm({
  initialData,
  onSubmit,
  submitting,
}: {
  initialData?: Partial<CompanyFormData>;
  onSubmit: (data: CompanyFormData) => void;
  submitting?: boolean;
}) {
  const [form, setForm] = useState<CompanyFormData>({
    notifAcceptanceNo: "",
    name: "",
    nameKana: "",
    address: "",
    postalCode: "",
    phone: "",
    representativeKana: "",
    representativeName: "",
    corporateNumber: "",
    industryMajor: "",
    industryMinor: "",
    contactName: "",
    contactTel: "",
    workplaceName: "",
    workplaceNameKana: "",
    workplaceAddress: "",
    workplacePostalCode: "",
    workplacePhone: "",
    traineeResponsibleName: "",
    traineeResponsibleRole: "",
    traineeInstructorName: "",
    traineeInstructorRole: "",
    lifeInstructorName: "",
    lifeInstructorRole: "",
    ...initialData,
  });

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">申請者（実習実施者）</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            実習実施者届出受理番号
            <input className={inputClassName} value={form.notifAcceptanceNo ?? ""} onChange={(e) => setForm({ ...form, notifAcceptanceNo: e.target.value })} />
          </label>
          <label className="text-sm">
            法人番号
            <input className={inputClassName} value={form.corporateNumber ?? ""} onChange={(e) => setForm({ ...form, corporateNumber: e.target.value })} />
          </label>
          <label className="text-sm">
            名称
            <input className={inputClassName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="text-sm">
            名称（カナ）
            <input className={inputClassName} value={form.nameKana ?? ""} onChange={(e) => setForm({ ...form, nameKana: e.target.value })} />
          </label>
          <label className="text-sm">
            郵便番号
            <input className={inputClassName} value={form.postalCode ?? ""} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
          </label>
          <label className="text-sm">
            住所
            <input className={inputClassName} value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </label>
          <label className="text-sm">
            電話
            <input className={inputClassName} value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label className="text-sm">
            代表者氏名
            <input className={inputClassName} value={form.representativeName ?? ""} onChange={(e) => setForm({ ...form, representativeName: e.target.value })} />
          </label>
          <label className="text-sm">
            代表者氏名（カナ）
            <input className={inputClassName} value={form.representativeKana ?? ""} onChange={(e) => setForm({ ...form, representativeKana: e.target.value })} />
          </label>
          <label className="text-sm">
            産業分類（大分類）
            <input className={inputClassName} value={form.industryMajor ?? ""} onChange={(e) => setForm({ ...form, industryMajor: e.target.value })} />
          </label>
          <label className="text-sm">
            産業分類（中分類）
            <input className={inputClassName} value={form.industryMinor ?? ""} onChange={(e) => setForm({ ...form, industryMinor: e.target.value })} />
          </label>
          <label className="text-sm">
            連絡担当者
            <input className={inputClassName} value={form.contactName ?? ""} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
          </label>
          <label className="text-sm">
            連絡担当者電話
            <input className={inputClassName} value={form.contactTel ?? ""} onChange={(e) => setForm({ ...form, contactTel: e.target.value })} />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">技能実習を行わせる事業所</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            事業所名
            <input className={inputClassName} value={form.workplaceName ?? ""} onChange={(e) => setForm({ ...form, workplaceName: e.target.value })} />
          </label>
          <label className="text-sm">
            事業所名（カナ）
            <input className={inputClassName} value={form.workplaceNameKana ?? ""} onChange={(e) => setForm({ ...form, workplaceNameKana: e.target.value })} />
          </label>
          <label className="text-sm">
            事業所郵便番号
            <input className={inputClassName} value={form.workplacePostalCode ?? ""} onChange={(e) => setForm({ ...form, workplacePostalCode: e.target.value })} />
          </label>
          <label className="text-sm">
            事業所住所
            <input className={inputClassName} value={form.workplaceAddress ?? ""} onChange={(e) => setForm({ ...form, workplaceAddress: e.target.value })} />
          </label>
          <label className="text-sm">
            事業所電話
            <input className={inputClassName} value={form.workplacePhone ?? ""} onChange={(e) => setForm({ ...form, workplacePhone: e.target.value })} />
          </label>
          <label className="text-sm">
            実習責任者
            <input className={inputClassName} value={form.traineeResponsibleName ?? ""} onChange={(e) => setForm({ ...form, traineeResponsibleName: e.target.value })} />
          </label>
          <label className="text-sm">
            実習責任者 役職
            <input className={inputClassName} value={form.traineeResponsibleRole ?? ""} onChange={(e) => setForm({ ...form, traineeResponsibleRole: e.target.value })} />
          </label>
          <label className="text-sm">
            技能実習指導員
            <input className={inputClassName} value={form.traineeInstructorName ?? ""} onChange={(e) => setForm({ ...form, traineeInstructorName: e.target.value })} />
          </label>
          <label className="text-sm">
            技能実習指導員 役職
            <input className={inputClassName} value={form.traineeInstructorRole ?? ""} onChange={(e) => setForm({ ...form, traineeInstructorRole: e.target.value })} />
          </label>
          <label className="text-sm">
            生活指導員
            <input className={inputClassName} value={form.lifeInstructorName ?? ""} onChange={(e) => setForm({ ...form, lifeInstructorName: e.target.value })} />
          </label>
          <label className="text-sm">
            生活指導員 役職
            <input className={inputClassName} value={form.lifeInstructorRole ?? ""} onChange={(e) => setForm({ ...form, lifeInstructorRole: e.target.value })} />
          </label>
        </div>
      </section>

      <button
        type="button"
        className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        onClick={() => onSubmit(form)}
        disabled={submitting}
      >
        {submitting ? "保存中" : "保存"}
      </button>
    </div>
  );
}
