"use client";

import { useState } from "react";

export type OrganizationFormData = {
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

const inputClassName = "w-full border px-2 py-1 rounded";

export function OrganizationForm({
  initialData,
  onSubmit,
  submitting,
}: {
  initialData?: Partial<OrganizationFormData>;
  onSubmit: (data: OrganizationFormData) => void;
  submitting?: boolean;
}) {
  const [form, setForm] = useState<OrganizationFormData>({
    permitNumber: "",
    permitType: "",
    name: "",
    nameKana: "",
    postalCode: "",
    address: "",
    phone: "",
    representativeName: "",
    representativeKana: "",
    supervisorResponsibleName: "",
    supervisorResponsibleKana: "",
    supervisingOfficeName: "",
    supervisingOfficeNameKana: "",
    supervisingOfficePostalCode: "",
    supervisingOfficeAddress: "",
    supervisingOfficePhone: "",
    planInstructorName: "",
    planInstructorKana: "",
    sendingOrgName: "",
    sendingOrgNumber: "",
    sendingOrgNumberCountry: "",
    sendingOrgRefNumber: "",
    ...initialData,
  });

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">許可情報</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            許可番号
            <input className={inputClassName} value={form.permitNumber ?? ""} onChange={(e) => setForm({ ...form, permitNumber: e.target.value })} />
          </label>
          <label className="text-sm">
            許可区分（一般/特定）
            <input className={inputClassName} value={form.permitType ?? ""} onChange={(e) => setForm({ ...form, permitType: e.target.value })} />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">監理団体</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            団体名
            <input className={inputClassName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="text-sm">
            団体名（カナ）
            <input className={inputClassName} value={form.nameKana ?? ""} onChange={(e) => setForm({ ...form, nameKana: e.target.value })} />
          </label>
          <label className="text-sm">
            郵便番号
            <input className={inputClassName} placeholder="例: 123-4567" value={form.postalCode ?? ""} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
          </label>
          <label className="text-sm">
            住所
            <input className={inputClassName} value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </label>
          <label className="text-sm">
            電話番号
            <input className={inputClassName} value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">代表者・責任者</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            代表者氏名
            <input className={inputClassName} value={form.representativeName ?? ""} onChange={(e) => setForm({ ...form, representativeName: e.target.value })} />
          </label>
          <label className="text-sm">
            代表者氏名（カナ）
            <input className={inputClassName} value={form.representativeKana ?? ""} onChange={(e) => setForm({ ...form, representativeKana: e.target.value })} />
          </label>
          <label className="text-sm">
            監理責任者
            <input className={inputClassName} value={form.supervisorResponsibleName ?? ""} onChange={(e) => setForm({ ...form, supervisorResponsibleName: e.target.value })} />
          </label>
          <label className="text-sm">
            監理責任者（カナ）
            <input className={inputClassName} value={form.supervisorResponsibleKana ?? ""} onChange={(e) => setForm({ ...form, supervisorResponsibleKana: e.target.value })} />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">担当事業所</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            担当事業所名
            <input className={inputClassName} value={form.supervisingOfficeName ?? ""} onChange={(e) => setForm({ ...form, supervisingOfficeName: e.target.value })} />
          </label>
          <label className="text-sm">
            担当事業所名（カナ）
            <input className={inputClassName} value={form.supervisingOfficeNameKana ?? ""} onChange={(e) => setForm({ ...form, supervisingOfficeNameKana: e.target.value })} />
          </label>
          <label className="text-sm">
            担当事業所郵便番号
            <input className={inputClassName} placeholder="例: 123-4567" value={form.supervisingOfficePostalCode ?? ""} onChange={(e) => setForm({ ...form, supervisingOfficePostalCode: e.target.value })} />
          </label>
          <label className="text-sm">
            担当事業所住所
            <input className={inputClassName} value={form.supervisingOfficeAddress ?? ""} onChange={(e) => setForm({ ...form, supervisingOfficeAddress: e.target.value })} />
          </label>
          <label className="text-sm">
            担当事業所電話
            <input className={inputClassName} value={form.supervisingOfficePhone ?? ""} onChange={(e) => setForm({ ...form, supervisingOfficePhone: e.target.value })} />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">計画指導担当者</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            計画指導担当者氏名
            <input className={inputClassName} value={form.planInstructorName ?? ""} onChange={(e) => setForm({ ...form, planInstructorName: e.target.value })} />
          </label>
          <label className="text-sm">
            計画指導担当者（カナ）
            <input className={inputClassName} value={form.planInstructorKana ?? ""} onChange={(e) => setForm({ ...form, planInstructorKana: e.target.value })} />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">送出機関</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            送出機関名
            <input className={inputClassName} value={form.sendingOrgName ?? ""} onChange={(e) => setForm({ ...form, sendingOrgName: e.target.value })} />
          </label>
          <label className="text-sm">
            送出機関番号（国コード）
            <input className={inputClassName} placeholder="例: VNM" value={form.sendingOrgNumberCountry ?? ""} onChange={(e) => setForm({ ...form, sendingOrgNumberCountry: e.target.value })} />
          </label>
          <label className="text-sm">
            送出機関番号
            <input className={inputClassName} value={form.sendingOrgNumber ?? ""} onChange={(e) => setForm({ ...form, sendingOrgNumber: e.target.value })} />
          </label>
          <label className="text-sm">
            送出機関整理番号
            <input className={inputClassName} value={form.sendingOrgRefNumber ?? ""} onChange={(e) => setForm({ ...form, sendingOrgRefNumber: e.target.value })} />
          </label>
        </div>
      </section>

      <button
        type="button"
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        onClick={() => onSubmit(form)}
        disabled={submitting}
      >
        {submitting ? "保存中..." : "保存"}
      </button>
    </div>
  );
}
