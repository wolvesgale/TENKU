"use client";

import { useState } from "react";

export type CompanyFormData = {
  name: string;
  address?: string;
  industry?: string;
  contactName?: string;
  contactTel?: string;
};

const inputClassName = "w-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-white text-sm rounded";

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
    name: "",
    address: "",
    industry: "",
    contactName: "",
    contactTel: "",
    ...initialData,
  });

  return (
    <div className="space-y-3 max-w-lg">
      <label className="block text-sm text-slate-200">
        企業名
        <input className={inputClassName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </label>
      <label className="block text-sm text-slate-200">
        所在地
        <input className={inputClassName} value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </label>
      <label className="block text-sm text-slate-200">
        業種
        <input className={inputClassName} value={form.industry ?? ""} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
      </label>
      <label className="block text-sm text-slate-200">
        担当者
        <input className={inputClassName} value={form.contactName ?? ""} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
      </label>
      <label className="block text-sm text-slate-200">
        担当者電話
        <input className={inputClassName} value={form.contactTel ?? ""} onChange={(e) => setForm({ ...form, contactTel: e.target.value })} />
      </label>
      <button className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60" onClick={() => onSubmit(form)} disabled={submitting}>
        {submitting ? "保存中" : "保存"}
      </button>
    </div>
  );
}
