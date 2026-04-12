"use client";

import { useState } from "react";
import { TITP_CATEGORIES, getJobByCode } from "@/lib/titp-jobs";
import { SSW_SECTORS } from "@/lib/field-map";

// SSW分野
const SSW_FIELDS = SSW_SECTORS.map((s) => s.name);

// 育成就労分野（SSWと同一ベース）
const IKUSEI_FIELDS = SSW_SECTORS.map((s) => s.name);

// 産業分類（大分類）
const INDUSTRY_MAJOR = [
  "農業，林業","漁業","鉱業，採石業，砂利採取業","建設業","製造業",
  "電気・ガス・熱供給・水道業","情報通信業","運輸業，郵便業","卸売業，小売業",
  "金融業，保険業","不動産業，物品賃貸業","学術研究，専門・技術サービス業",
  "宿泊業，飲食サービス業","生活関連サービス業，娯楽業","教育，学習支援業",
  "医療，福祉","複合サービス事業","サービス業（他に分類されないもの）","公務",
];

export type CompanyFormData = {
  notifAcceptanceNo?: string;
  name: string;
  nameKana?: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  website?: string;
  representativeKana?: string;
  representativeName?: string;
  corporateNumber?: string;
  industryMajor?: string;
  industryMinor?: string;
  industryDetail?: string;
  laborInsuranceNo?: string;
  employmentInsuranceNo?: string;
  unionJoinDate?: string;
  contactName?: string;
  contactTel?: string;
  // 受入職種（技能実習）
  titpJobCode?: string;
  titpJobName?: string;
  titpWorkName?: string;
  // 特定技能の分野
  sswField?: string;
  // 育成就労の分野
  ikuseiField?: string;
  // 事業所
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

const inp = "w-full border border-border bg-surface/60 px-2 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue";
const sel = inp;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <label className="text-xs text-muted">{label}</label>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-brand-teal border-b border-border pb-1">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
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
    website: "",
    representativeKana: "",
    representativeName: "",
    corporateNumber: "",
    industryMajor: "",
    industryMinor: "",
    industryDetail: "",
    laborInsuranceNo: "",
    employmentInsuranceNo: "",
    unionJoinDate: "",
    contactName: "",
    contactTel: "",
    titpJobCode: "",
    titpJobName: "",
    titpWorkName: "",
    sswField: "",
    ikuseiField: "",
    workplaceName: "",
    workplaceNameKana: "",
    workplaceAddress: "",
    workplacePostalCode: "",
    workplacePhone: "",
    traineeResponsibleName: "",
    traineeResponsibleKana: "",
    traineeResponsibleRole: "",
    traineeInstructorName: "",
    traineeInstructorKana: "",
    traineeInstructorRole: "",
    lifeInstructorName: "",
    lifeInstructorKana: "",
    lifeInstructorRole: "",
    ...initialData,
  });

  const set = (key: keyof CompanyFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="max-w-2xl space-y-6">

      {/* ── 法人情報 ── */}
      <Section title="法人情報">
        <Field label="実習実施者届出受理番号">
          <input className={inp} value={form.notifAcceptanceNo ?? ""} onChange={set("notifAcceptanceNo")} />
        </Field>
        <Field label="法人番号">
          <input className={inp} value={form.corporateNumber ?? ""} onChange={set("corporateNumber")} />
        </Field>
        <Field label="名称">
          <input className={inp} value={form.name} onChange={set("name")} />
        </Field>
        <Field label="名称（カナ）">
          <input className={inp} value={form.nameKana ?? ""} onChange={set("nameKana")} />
        </Field>
        <Field label="郵便番号">
          <input className={inp} value={form.postalCode ?? ""} onChange={set("postalCode")} />
        </Field>
        <Field label="住所">
          <input className={inp} value={form.address ?? ""} onChange={set("address")} />
        </Field>
        <Field label="電話">
          <input className={inp} value={form.phone ?? ""} onChange={set("phone")} />
        </Field>
        <Field label="企業WEBサイト">
          <input className={inp} value={form.website ?? ""} onChange={set("website")} placeholder="https://..." />
        </Field>
        <Field label="代表者氏名">
          <input className={inp} value={form.representativeName ?? ""} onChange={set("representativeName")} />
        </Field>
        <Field label="代表者氏名（カナ）">
          <input className={inp} value={form.representativeKana ?? ""} onChange={set("representativeKana")} />
        </Field>
        <Field label="産業分類（大分類）">
          <select className={sel} value={form.industryMajor ?? ""} onChange={set("industryMajor")}>
            <option value="">選択</option>
            {INDUSTRY_MAJOR.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="産業分類（中分類）">
          <input className={inp} value={form.industryMinor ?? ""} onChange={set("industryMinor")} />
        </Field>
        <Field label="産業分類（小分類）">
          <input className={inp} value={form.industryDetail ?? ""} onChange={set("industryDetail")} />
        </Field>
        <Field label="労働保険番号">
          <input className={inp} value={form.laborInsuranceNo ?? ""} onChange={set("laborInsuranceNo")} placeholder="00-000000-000000-000" />
        </Field>
        <Field label="雇用保険適用事業所番号">
          <input className={inp} value={form.employmentInsuranceNo ?? ""} onChange={set("employmentInsuranceNo")} placeholder="0000-000000-0" />
        </Field>
        <Field label="組合加入年月日">
          <input type="date" className={inp} value={form.unionJoinDate ?? ""} onChange={set("unionJoinDate")} />
        </Field>
        <Field label="連絡担当者">
          <input className={inp} value={form.contactName ?? ""} onChange={set("contactName")} />
        </Field>
        <Field label="連絡担当者電話">
          <input className={inp} value={form.contactTel ?? ""} onChange={set("contactTel")} />
        </Field>
      </Section>

      {/* ── 受入職種・分野 ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-teal border-b border-border pb-1">受入職種・分野</h2>

        {/* 技能実習職種（カスケード） */}
        <div className="border border-border rounded-lg p-3 space-y-2 bg-surface/40">
          <p className="text-xs font-semibold text-muted">技能実習の職種</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Field label="職種コード">
              <select
                className={sel}
                value={form.titpJobCode ?? ""}
                onChange={(e) => {
                  const code = e.target.value;
                  const job = getJobByCode(code);
                  setForm((f) => ({ ...f, titpJobCode: code, titpJobName: job?.name ?? "", titpWorkName: "" }));
                }}
              >
                <option value="">選択</option>
                {TITP_CATEGORIES.map((cat) => (
                  <optgroup key={cat.code} label={`${cat.code} ${cat.name}`}>
                    {cat.jobs.map((j) => (
                      <option key={j.code} value={j.code}>{j.code} {j.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>
            <Field label="職種名">
              <input className={`${inp} bg-surface/30`} value={form.titpJobName ?? ""} readOnly placeholder="自動入力" />
            </Field>
            <Field label="作業名">
              <select
                className={sel}
                value={form.titpWorkName ?? ""}
                disabled={!form.titpJobCode}
                onChange={set("titpWorkName")}
              >
                <option value="">選択</option>
                {(getJobByCode(form.titpJobCode ?? "")?.works ?? []).map((w) => (
                  <option key={w.code} value={w.name}>{w.name}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="特定技能の分野">
            <select className={sel} value={form.sswField ?? ""} onChange={set("sswField")}>
              <option value="">選択</option>
              {SSW_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="育成就労の分野">
            <select className={sel} value={form.ikuseiField ?? ""} onChange={set("ikuseiField")}>
              <option value="">選択</option>
              {IKUSEI_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Field>
        </div>
      </section>

      {/* ── 技能実習を行わせる事業所 ── */}
      <Section title="技能実習を行わせる事業所">
        <Field label="事業所名">
          <input className={inp} value={form.workplaceName ?? ""} onChange={set("workplaceName")} />
        </Field>
        <Field label="事業所名（カナ）">
          <input className={inp} value={form.workplaceNameKana ?? ""} onChange={set("workplaceNameKana")} />
        </Field>
        <Field label="事業所郵便番号">
          <input className={inp} value={form.workplacePostalCode ?? ""} onChange={set("workplacePostalCode")} />
        </Field>
        <Field label="事業所住所">
          <input className={inp} value={form.workplaceAddress ?? ""} onChange={set("workplaceAddress")} />
        </Field>
        <Field label="事業所電話">
          <input className={inp} value={form.workplacePhone ?? ""} onChange={set("workplacePhone")} />
        </Field>
      </Section>

      {/* ── 担当者 ── */}
      <Section title="担当者">
        <Field label="実習責任者">
          <input className={inp} value={form.traineeResponsibleName ?? ""} onChange={set("traineeResponsibleName")} />
        </Field>
        <Field label="実習責任者 役職">
          <input className={inp} value={form.traineeResponsibleRole ?? ""} onChange={set("traineeResponsibleRole")} />
        </Field>
        <Field label="技能実習指導員">
          <input className={inp} value={form.traineeInstructorName ?? ""} onChange={set("traineeInstructorName")} />
        </Field>
        <Field label="技能実習指導員 役職">
          <input className={inp} value={form.traineeInstructorRole ?? ""} onChange={set("traineeInstructorRole")} />
        </Field>
        <Field label="生活指導員">
          <input className={inp} value={form.lifeInstructorName ?? ""} onChange={set("lifeInstructorName")} />
        </Field>
        <Field label="生活指導員 役職">
          <input className={inp} value={form.lifeInstructorRole ?? ""} onChange={set("lifeInstructorRole")} />
        </Field>
      </Section>

      <button
        type="button"
        className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium disabled:opacity-60 hover:opacity-90 transition"
        onClick={() => onSubmit(form)}
        disabled={submitting}
      >
        {submitting ? "保存中…" : "保存"}
      </button>
    </div>
  );
}
