"use client";

import { useState } from "react";

type HandledJobType = { number: string; jobName: string };
type PlanInstructor = { jobName: string; name: string; kana?: string };

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
  handledJobTypes?: HandledJobType[];
  planInstructors?: PlanInstructor[];
};

const inputClassName = "w-full border px-2 py-1 rounded";
const emptyJob = (): HandledJobType => ({ number: "", jobName: "" });
const emptyInstructor = (): PlanInstructor => ({ jobName: "", name: "", kana: "" });

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
    handledJobTypes: [emptyJob()],
    planInstructors: [emptyInstructor()],
    ...initialData,
  });

  const set = (key: keyof OrganizationFormData, val: any) => setForm((f) => ({ ...f, [key]: val }));

  // 取り扱い職種
  const updateJob = (i: number, key: keyof HandledJobType, val: string) => {
    const next = (form.handledJobTypes ?? []).map((e, idx) => (idx === i ? { ...e, [key]: val } : e));
    set("handledJobTypes", next);
  };
  const addJob = () => set("handledJobTypes", [...(form.handledJobTypes ?? []), emptyJob()]);
  const removeJob = (i: number) => set("handledJobTypes", (form.handledJobTypes ?? []).filter((_, idx) => idx !== i));

  // 計画指導担当者
  const updateInstructor = (i: number, key: keyof PlanInstructor, val: string) => {
    const next = (form.planInstructors ?? []).map((e, idx) => (idx === i ? { ...e, [key]: val } : e));
    set("planInstructors", next);
  };
  const addInstructor = () => set("planInstructors", [...(form.planInstructors ?? []), emptyInstructor()]);
  const removeInstructor = (i: number) => set("planInstructors", (form.planInstructors ?? []).filter((_, idx) => idx !== i));

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">許可情報</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            許可番号
            <input className={inputClassName} value={form.permitNumber ?? ""} onChange={(e) => set("permitNumber", e.target.value)} />
          </label>
          <label className="text-sm">
            許可区分（一般/特定）
            <input className={inputClassName} value={form.permitType ?? ""} onChange={(e) => set("permitType", e.target.value)} />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">監理団体</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            団体名
            <input className={inputClassName} value={form.name} onChange={(e) => set("name", e.target.value)} />
          </label>
          <label className="text-sm">
            団体名（カナ）
            <input className={inputClassName} value={form.nameKana ?? ""} onChange={(e) => set("nameKana", e.target.value)} />
          </label>
          <label className="text-sm">
            郵便番号
            <input className={inputClassName} placeholder="例: 123-4567" value={form.postalCode ?? ""} onChange={(e) => set("postalCode", e.target.value)} />
          </label>
          <label className="text-sm">
            住所
            <input className={inputClassName} value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} />
          </label>
          <label className="text-sm">
            電話番号
            <input className={inputClassName} value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">代表者・責任者</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            代表者氏名
            <input className={inputClassName} value={form.representativeName ?? ""} onChange={(e) => set("representativeName", e.target.value)} />
          </label>
          <label className="text-sm">
            代表者氏名（カナ）
            <input className={inputClassName} value={form.representativeKana ?? ""} onChange={(e) => set("representativeKana", e.target.value)} />
          </label>
          <label className="text-sm">
            監理責任者
            <input className={inputClassName} value={form.supervisorResponsibleName ?? ""} onChange={(e) => set("supervisorResponsibleName", e.target.value)} />
          </label>
          <label className="text-sm">
            監理責任者（カナ）
            <input className={inputClassName} value={form.supervisorResponsibleKana ?? ""} onChange={(e) => set("supervisorResponsibleKana", e.target.value)} />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">担当事業所</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            担当事業所名
            <input className={inputClassName} value={form.supervisingOfficeName ?? ""} onChange={(e) => set("supervisingOfficeName", e.target.value)} />
          </label>
          <label className="text-sm">
            担当事業所名（カナ）
            <input className={inputClassName} value={form.supervisingOfficeNameKana ?? ""} onChange={(e) => set("supervisingOfficeNameKana", e.target.value)} />
          </label>
          <label className="text-sm">
            担当事業所郵便番号
            <input className={inputClassName} placeholder="例: 123-4567" value={form.supervisingOfficePostalCode ?? ""} onChange={(e) => set("supervisingOfficePostalCode", e.target.value)} />
          </label>
          <label className="text-sm">
            担当事業所住所
            <input className={inputClassName} value={form.supervisingOfficeAddress ?? ""} onChange={(e) => set("supervisingOfficeAddress", e.target.value)} />
          </label>
          <label className="text-sm">
            担当事業所電話
            <input className={inputClassName} value={form.supervisingOfficePhone ?? ""} onChange={(e) => set("supervisingOfficePhone", e.target.value)} />
          </label>
        </div>
      </section>

      {/* 取り扱い職種 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">取り扱い職種</h2>
          <button type="button" className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded" onClick={addJob}>
            ＋追加
          </button>
        </div>
        {(form.handledJobTypes ?? []).map((j, i) => (
          <div key={i} className="border rounded p-2 space-y-2 bg-white/5">
            <div className="grid gap-2 md:grid-cols-2">
              <label className="text-xs">
                番号
                <input className={inputClassName} value={j.number} onChange={(e) => updateJob(i, "number", e.target.value)} />
              </label>
              <label className="text-xs">
                職種名
                <input className={inputClassName} value={j.jobName} onChange={(e) => updateJob(i, "jobName", e.target.value)} />
              </label>
            </div>
            {(form.handledJobTypes ?? []).length > 1 && (
              <button type="button" className="text-xs text-red-400 hover:underline" onClick={() => removeJob(i)}>
                削除
              </button>
            )}
          </div>
        ))}
      </section>

      {/* 計画指導担当者（職種別） */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">計画指導担当者</h2>
          <button type="button" className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded" onClick={addInstructor}>
            ＋追加
          </button>
        </div>
        {(form.planInstructors ?? []).map((p, i) => (
          <div key={i} className="border rounded p-2 space-y-2 bg-white/5">
            <div className="grid gap-2 md:grid-cols-3">
              <label className="text-xs">
                対象職種
                <input className={inputClassName} value={p.jobName} onChange={(e) => updateInstructor(i, "jobName", e.target.value)} />
              </label>
              <label className="text-xs">
                氏名
                <input className={inputClassName} value={p.name} onChange={(e) => updateInstructor(i, "name", e.target.value)} />
              </label>
              <label className="text-xs">
                氏名（カナ）
                <input className={inputClassName} value={p.kana ?? ""} onChange={(e) => updateInstructor(i, "kana", e.target.value)} />
              </label>
            </div>
            {(form.planInstructors ?? []).length > 1 && (
              <button type="button" className="text-xs text-red-400 hover:underline" onClick={() => removeInstructor(i)}>
                削除
              </button>
            )}
          </div>
        ))}
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
