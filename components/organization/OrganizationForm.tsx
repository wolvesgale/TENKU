"use client";

import { useState } from "react";

export type OrganizationFormData = {
  permitNumber?: string;
  permitType?: string;
  name: string;
  address?: string;
  phone?: string;
  representativeName?: string;
  supervisorResponsibleName?: string;
  supervisingOfficeName?: string;
  supervisingOfficeAddress?: string;
  supervisingOfficePhone?: string;
  planInstructorName?: string;
  sendingOrgName?: string;
  sendingOrgNumber?: string;
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
    address: "",
    phone: "",
    representativeName: "",
    supervisorResponsibleName: "",
    supervisingOfficeName: "",
    supervisingOfficeAddress: "",
    supervisingOfficePhone: "",
    planInstructorName: "",
    sendingOrgName: "",
    sendingOrgNumber: "",
    sendingOrgRefNumber: "",
    ...initialData,
  });

  return (
    <div className="space-y-4">
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
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          団体名
          <input className={inputClassName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="text-sm">
          住所
          <input className={inputClassName} value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </label>
        <label className="text-sm">
          電話番号
          <input className={inputClassName} value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        <label className="text-sm">
          代表者氏名
          <input className={inputClassName} value={form.representativeName ?? ""} onChange={(e) => setForm({ ...form, representativeName: e.target.value })} />
        </label>
        <label className="text-sm">
          監理責任者
          <input
            className={inputClassName}
            value={form.supervisorResponsibleName ?? ""}
            onChange={(e) => setForm({ ...form, supervisorResponsibleName: e.target.value })}
          />
        </label>
        <label className="text-sm">
          担当事業所名
          <input className={inputClassName} value={form.supervisingOfficeName ?? ""} onChange={(e) => setForm({ ...form, supervisingOfficeName: e.target.value })} />
        </label>
        <label className="text-sm">
          担当事業所住所
          <input
            className={inputClassName}
            value={form.supervisingOfficeAddress ?? ""}
            onChange={(e) => setForm({ ...form, supervisingOfficeAddress: e.target.value })}
          />
        </label>
        <label className="text-sm">
          担当事業所電話
          <input
            className={inputClassName}
            value={form.supervisingOfficePhone ?? ""}
            onChange={(e) => setForm({ ...form, supervisingOfficePhone: e.target.value })}
          />
        </label>
        <label className="text-sm">
          計画指導担当者
          <input className={inputClassName} value={form.planInstructorName ?? ""} onChange={(e) => setForm({ ...form, planInstructorName: e.target.value })} />
        </label>
        <label className="text-sm">
          送出機関名
          <input className={inputClassName} value={form.sendingOrgName ?? ""} onChange={(e) => setForm({ ...form, sendingOrgName: e.target.value })} />
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
