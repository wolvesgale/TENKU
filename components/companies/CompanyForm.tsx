"use client";

import { useState } from "react";

type InstructorEntry = {
  name: string;
  kana?: string;
  role?: string;
  lectureDate?: string;
  lectureExpiry?: string;
};

type TitpJobType = { jobType: string; task: string };
type SswJobType = { field: string; category: string };

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
  traineeResponsibleKana?: string;
  traineeResponsibleRole?: string;
  traineeResponsibleLectureDate?: string;
  traineeResponsibleLectureExpiry?: string;
  traineeInstructors?: InstructorEntry[];
  lifeInstructors?: InstructorEntry[];
  titpJobTypes?: TitpJobType[];
  sswJobTypes?: SswJobType[];
};

const inputClassName = "w-full border px-2 py-1 rounded";

const emptyInstructor = (): InstructorEntry => ({ name: "", kana: "", role: "", lectureDate: "", lectureExpiry: "" });
const emptyTitp = (): TitpJobType => ({ jobType: "", task: "" });
const emptySsw = (): SswJobType => ({ field: "", category: "" });

function InstructorList({
  label,
  entries,
  onChange,
}: {
  label: string;
  entries: InstructorEntry[];
  onChange: (entries: InstructorEntry[]) => void;
}) {
  const update = (i: number, key: keyof InstructorEntry, val: string) => {
    const next = entries.map((e, idx) => (idx === i ? { ...e, [key]: val } : e));
    onChange(next);
  };
  const add = () => onChange([...entries, emptyInstructor()]);
  const remove = (i: number) => onChange(entries.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <button type="button" className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded" onClick={add}>
          ＋追加
        </button>
      </div>
      {entries.map((e, i) => (
        <div key={i} className="border rounded p-2 space-y-2 bg-white/5">
          <div className="grid gap-2 md:grid-cols-3">
            <label className="text-xs">
              氏名
              <input className={inputClassName} value={e.name} onChange={(ev) => update(i, "name", ev.target.value)} />
            </label>
            <label className="text-xs">
              氏名（カナ）
              <input className={inputClassName} value={e.kana ?? ""} onChange={(ev) => update(i, "kana", ev.target.value)} />
            </label>
            <label className="text-xs">
              役職
              <input className={inputClassName} value={e.role ?? ""} onChange={(ev) => update(i, "role", ev.target.value)} />
            </label>
            <label className="text-xs">
              講習受講日
              <input type="date" className={inputClassName} value={e.lectureDate ?? ""} onChange={(ev) => update(i, "lectureDate", ev.target.value)} />
            </label>
            <label className="text-xs">
              講習有効期限
              <input type="date" className={inputClassName} value={e.lectureExpiry ?? ""} onChange={(ev) => update(i, "lectureExpiry", ev.target.value)} />
            </label>
          </div>
          {entries.length > 1 && (
            <button type="button" className="text-xs text-red-400 hover:underline" onClick={() => remove(i)}>
              削除
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

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
    traineeResponsibleKana: "",
    traineeResponsibleRole: "",
    traineeResponsibleLectureDate: "",
    traineeResponsibleLectureExpiry: "",
    traineeInstructors: [emptyInstructor()],
    lifeInstructors: [emptyInstructor()],
    titpJobTypes: [emptyTitp()],
    sswJobTypes: [emptySsw()],
    ...initialData,
  });

  const set = (key: keyof CompanyFormData, val: any) => setForm((f) => ({ ...f, [key]: val }));

  // TITP job type helpers
  const updateTitp = (i: number, key: keyof TitpJobType, val: string) => {
    const next = (form.titpJobTypes ?? []).map((e, idx) => (idx === i ? { ...e, [key]: val } : e));
    set("titpJobTypes", next);
  };
  const addTitp = () => set("titpJobTypes", [...(form.titpJobTypes ?? []), emptyTitp()]);
  const removeTitp = (i: number) => set("titpJobTypes", (form.titpJobTypes ?? []).filter((_, idx) => idx !== i));

  // SSW job type helpers
  const updateSsw = (i: number, key: keyof SswJobType, val: string) => {
    const next = (form.sswJobTypes ?? []).map((e, idx) => (idx === i ? { ...e, [key]: val } : e));
    set("sswJobTypes", next);
  };
  const addSsw = () => set("sswJobTypes", [...(form.sswJobTypes ?? []), emptySsw()]);
  const removeSsw = (i: number) => set("sswJobTypes", (form.sswJobTypes ?? []).filter((_, idx) => idx !== i));

  return (
    <div className="space-y-6">
      {/* 申請者 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">申請者</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            実習実施者届出受理番号
            <input className={inputClassName} value={form.notifAcceptanceNo ?? ""} onChange={(e) => set("notifAcceptanceNo", e.target.value)} />
          </label>
          <label className="text-sm">
            法人番号
            <input className={inputClassName} value={form.corporateNumber ?? ""} onChange={(e) => set("corporateNumber", e.target.value)} />
          </label>
          <label className="text-sm">
            名称
            <input className={inputClassName} value={form.name} onChange={(e) => set("name", e.target.value)} />
          </label>
          <label className="text-sm">
            名称（カナ）
            <input className={inputClassName} value={form.nameKana ?? ""} onChange={(e) => set("nameKana", e.target.value)} />
          </label>
          <label className="text-sm">
            郵便番号
            <input className={inputClassName} value={form.postalCode ?? ""} onChange={(e) => set("postalCode", e.target.value)} />
          </label>
          <label className="text-sm">
            住所
            <input className={inputClassName} value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} />
          </label>
          <label className="text-sm">
            電話
            <input className={inputClassName} value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
          </label>
          <label className="text-sm">
            代表者氏名
            <input className={inputClassName} value={form.representativeName ?? ""} onChange={(e) => set("representativeName", e.target.value)} />
          </label>
          <label className="text-sm">
            代表者氏名（カナ）
            <input className={inputClassName} value={form.representativeKana ?? ""} onChange={(e) => set("representativeKana", e.target.value)} />
          </label>
          <label className="text-sm">
            産業分類（大分類）
            <input className={inputClassName} value={form.industryMajor ?? ""} onChange={(e) => set("industryMajor", e.target.value)} />
          </label>
          <label className="text-sm">
            産業分類（中分類）
            <input className={inputClassName} value={form.industryMinor ?? ""} onChange={(e) => set("industryMinor", e.target.value)} />
          </label>
          <label className="text-sm">
            連絡担当者
            <input className={inputClassName} value={form.contactName ?? ""} onChange={(e) => set("contactName", e.target.value)} />
          </label>
          <label className="text-sm">
            連絡担当者電話
            <input className={inputClassName} value={form.contactTel ?? ""} onChange={(e) => set("contactTel", e.target.value)} />
          </label>
        </div>
      </section>

      {/* 技能実習を行わせる事業所 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">技能実習を行わせる事業所</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            事業所名
            <input className={inputClassName} value={form.workplaceName ?? ""} onChange={(e) => set("workplaceName", e.target.value)} />
          </label>
          <label className="text-sm">
            事業所名（カナ）
            <input className={inputClassName} value={form.workplaceNameKana ?? ""} onChange={(e) => set("workplaceNameKana", e.target.value)} />
          </label>
          <label className="text-sm">
            事業所郵便番号
            <input className={inputClassName} value={form.workplacePostalCode ?? ""} onChange={(e) => set("workplacePostalCode", e.target.value)} />
          </label>
          <label className="text-sm">
            事業所住所
            <input className={inputClassName} value={form.workplaceAddress ?? ""} onChange={(e) => set("workplaceAddress", e.target.value)} />
          </label>
          <label className="text-sm">
            事業所電話
            <input className={inputClassName} value={form.workplacePhone ?? ""} onChange={(e) => set("workplacePhone", e.target.value)} />
          </label>
        </div>
      </section>

      {/* 実習責任者 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">実習責任者</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            氏名
            <input className={inputClassName} value={form.traineeResponsibleName ?? ""} onChange={(e) => set("traineeResponsibleName", e.target.value)} />
          </label>
          <label className="text-sm">
            氏名（カナ）
            <input className={inputClassName} value={form.traineeResponsibleKana ?? ""} onChange={(e) => set("traineeResponsibleKana", e.target.value)} />
          </label>
          <label className="text-sm">
            役職
            <input className={inputClassName} value={form.traineeResponsibleRole ?? ""} onChange={(e) => set("traineeResponsibleRole", e.target.value)} />
          </label>
          <div />
          <label className="text-sm">
            講習受講日 <span className="text-red-400">*</span>
            <input type="date" className={inputClassName} value={form.traineeResponsibleLectureDate ?? ""} onChange={(e) => set("traineeResponsibleLectureDate", e.target.value)} />
          </label>
          <label className="text-sm">
            講習有効期限 <span className="text-red-400">*</span>
            <input type="date" className={inputClassName} value={form.traineeResponsibleLectureExpiry ?? ""} onChange={(e) => set("traineeResponsibleLectureExpiry", e.target.value)} />
          </label>
        </div>
      </section>

      {/* 技能実習指導員 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">技能実習指導員</h2>
        <InstructorList
          label="技能実習指導員"
          entries={form.traineeInstructors ?? [emptyInstructor()]}
          onChange={(entries) => set("traineeInstructors", entries)}
        />
      </section>

      {/* 生活指導員 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">生活指導員</h2>
        <InstructorList
          label="生活指導員"
          entries={form.lifeInstructors ?? [emptyInstructor()]}
          onChange={(entries) => set("lifeInstructors", entries)}
        />
      </section>

      {/* 技能実習 職種・作業 (TITP) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">技能実習 職種・作業</h2>
          <button type="button" className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded" onClick={addTitp}>
            ＋追加
          </button>
        </div>
        {(form.titpJobTypes ?? []).map((t, i) => (
          <div key={i} className="border rounded p-2 space-y-2 bg-white/5">
            <div className="grid gap-2 md:grid-cols-2">
              <label className="text-xs">
                職種
                <input className={inputClassName} value={t.jobType} onChange={(e) => updateTitp(i, "jobType", e.target.value)} />
              </label>
              <label className="text-xs">
                作業
                <input className={inputClassName} value={t.task} onChange={(e) => updateTitp(i, "task", e.target.value)} />
              </label>
            </div>
            {(form.titpJobTypes ?? []).length > 1 && (
              <button type="button" className="text-xs text-red-400 hover:underline" onClick={() => removeTitp(i)}>
                削除
              </button>
            )}
          </div>
        ))}
      </section>

      {/* 特定技能 分野・区分 (SSW) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">特定技能 分野・区分</h2>
          <button type="button" className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded" onClick={addSsw}>
            ＋追加
          </button>
        </div>
        {(form.sswJobTypes ?? []).map((s, i) => (
          <div key={i} className="border rounded p-2 space-y-2 bg-white/5">
            <div className="grid gap-2 md:grid-cols-2">
              <label className="text-xs">
                分野
                <input className={inputClassName} value={s.field} onChange={(e) => updateSsw(i, "field", e.target.value)} />
              </label>
              <label className="text-xs">
                区分
                <input className={inputClassName} value={s.category} onChange={(e) => updateSsw(i, "category", e.target.value)} />
              </label>
            </div>
            {(form.sswJobTypes ?? []).length > 1 && (
              <button type="button" className="text-xs text-red-400 hover:underline" onClick={() => removeSsw(i)}>
                削除
              </button>
            )}
          </div>
        ))}
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
