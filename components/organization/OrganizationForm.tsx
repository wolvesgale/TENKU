"use client";

import { useState } from "react";

export type OrganizationFormData = {
  // 監理団体
  permitNumber?: string;
  permitType?: string;
  permitExpiry?: string;
  corporateNumber?: string;
  laborInsuranceNo?: string;
  employmentInsuranceNo?: string;
  website?: string;
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
  // 登録支援機関
  supportOrgNumber?: string;
  supportOrgExpiry?: string;
  // 監理支援機関
  supervisingOrgNumber?: string;
  supervisingOrgExpiry?: string;
  // 送出機関（複数対応のため最大3件）
  sendingOrgName?: string;
  sendingOrgNumber?: string;
  sendingOrgNumberCountry?: string;
  sendingOrgRefNumber?: string;
  sendingOrgName2?: string;
  sendingOrgNumber2?: string;
  sendingOrgNumberCountry2?: string;
  sendingOrgName3?: string;
  sendingOrgNumber3?: string;
  sendingOrgNumberCountry3?: string;
};

const inp = "w-full border border-border bg-surface/60 px-2 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue";

function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div className={`space-y-0.5 ${span2 ? "sm:col-span-2" : ""}`}>
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
    permitExpiry: "",
    corporateNumber: "",
    laborInsuranceNo: "",
    employmentInsuranceNo: "",
    website: "",
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
    supportOrgNumber: "",
    supportOrgExpiry: "",
    supervisingOrgNumber: "",
    supervisingOrgExpiry: "",
    sendingOrgName: "",
    sendingOrgNumber: "",
    sendingOrgNumberCountry: "",
    sendingOrgRefNumber: "",
    sendingOrgName2: "",
    sendingOrgNumber2: "",
    sendingOrgNumberCountry2: "",
    sendingOrgName3: "",
    sendingOrgNumber3: "",
    sendingOrgNumberCountry3: "",
    ...initialData,
  });

  const set = (key: keyof OrganizationFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="max-w-2xl space-y-6">

      {/* ── 監理団体 基本情報 ── */}
      <Section title="監理団体 基本情報">
        <Field label="許可番号">
          <input className={inp} value={form.permitNumber ?? ""} onChange={set("permitNumber")} />
        </Field>
        <Field label="許可区分（一般/特定）">
          <select className={inp} value={form.permitType ?? ""} onChange={set("permitType")}>
            <option value="">選択</option>
            <option value="一般監理事業">一般監理事業</option>
            <option value="特定監理事業">特定監理事業</option>
          </select>
        </Field>
        <Field label="許可有効期限">
          <input type="date" className={inp} value={form.permitExpiry ?? ""} onChange={set("permitExpiry")} />
        </Field>
        <Field label="法人番号">
          <input className={inp} value={form.corporateNumber ?? ""} onChange={set("corporateNumber")} placeholder="13桁" />
        </Field>
        <Field label="団体名">
          <input className={inp} value={form.name} onChange={set("name")} />
        </Field>
        <Field label="団体名（カナ）">
          <input className={inp} value={form.nameKana ?? ""} onChange={set("nameKana")} />
        </Field>
        <Field label="郵便番号">
          <input className={inp} value={form.postalCode ?? ""} onChange={set("postalCode")} placeholder="000-0000" />
        </Field>
        <Field label="住所">
          <input className={inp} value={form.address ?? ""} onChange={set("address")} />
        </Field>
        <Field label="電話番号">
          <input className={inp} value={form.phone ?? ""} onChange={set("phone")} />
        </Field>
        <Field label="WEBサイト">
          <input className={inp} value={form.website ?? ""} onChange={set("website")} placeholder="https://..." />
        </Field>
        <Field label="労働保険番号">
          <input className={inp} value={form.laborInsuranceNo ?? ""} onChange={set("laborInsuranceNo")} placeholder="00-000000-000000-000" />
        </Field>
        <Field label="雇用保険適用事業者番号">
          <input className={inp} value={form.employmentInsuranceNo ?? ""} onChange={set("employmentInsuranceNo")} placeholder="0000-000000-0" />
        </Field>
      </Section>

      {/* ── 登録支援機関 / 監理支援機関 ── */}
      <Section title="登録支援機関・監理支援機関">
        <Field label="登録支援機関番号">
          <input className={inp} value={form.supportOrgNumber ?? ""} onChange={set("supportOrgNumber")} />
        </Field>
        <Field label="登録支援機関 有効期限">
          <input type="date" className={inp} value={form.supportOrgExpiry ?? ""} onChange={set("supportOrgExpiry")} />
        </Field>
        <Field label="監理支援機関番号">
          <input className={inp} value={form.supervisingOrgNumber ?? ""} onChange={set("supervisingOrgNumber")} />
        </Field>
        <Field label="監理支援機関 有効期限">
          <input type="date" className={inp} value={form.supervisingOrgExpiry ?? ""} onChange={set("supervisingOrgExpiry")} />
        </Field>
      </Section>

      {/* ── 代表者・責任者 ── */}
      <Section title="代表者・責任者">
        <Field label="代表者氏名">
          <input className={inp} value={form.representativeName ?? ""} onChange={set("representativeName")} />
        </Field>
        <Field label="代表者氏名（カナ）">
          <input className={inp} value={form.representativeKana ?? ""} onChange={set("representativeKana")} />
        </Field>
        <Field label="監理責任者">
          <input className={inp} value={form.supervisorResponsibleName ?? ""} onChange={set("supervisorResponsibleName")} />
        </Field>
        <Field label="監理責任者（カナ）">
          <input className={inp} value={form.supervisorResponsibleKana ?? ""} onChange={set("supervisorResponsibleKana")} />
        </Field>
      </Section>

      {/* ── 担当事業所 ── */}
      <Section title="担当事業所">
        <Field label="担当事業所名">
          <input className={inp} value={form.supervisingOfficeName ?? ""} onChange={set("supervisingOfficeName")} />
        </Field>
        <Field label="担当事業所名（カナ）">
          <input className={inp} value={form.supervisingOfficeNameKana ?? ""} onChange={set("supervisingOfficeNameKana")} />
        </Field>
        <Field label="郵便番号">
          <input className={inp} value={form.supervisingOfficePostalCode ?? ""} onChange={set("supervisingOfficePostalCode")} />
        </Field>
        <Field label="住所">
          <input className={inp} value={form.supervisingOfficeAddress ?? ""} onChange={set("supervisingOfficeAddress")} />
        </Field>
        <Field label="電話">
          <input className={inp} value={form.supervisingOfficePhone ?? ""} onChange={set("supervisingOfficePhone")} />
        </Field>
        <Field label="計画指導担当者氏名">
          <input className={inp} value={form.planInstructorName ?? ""} onChange={set("planInstructorName")} />
        </Field>
        <Field label="計画指導担当者（カナ）">
          <input className={inp} value={form.planInstructorKana ?? ""} onChange={set("planInstructorKana")} />
        </Field>
      </Section>

      {/* ── 送出機関 ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-amber border-b border-border pb-1">送出機関情報</h2>

        {[
          { label: "1", name: "sendingOrgName" as const, num: "sendingOrgNumber" as const, country: "sendingOrgNumberCountry" as const, ref: "sendingOrgRefNumber" as const },
          { label: "2", name: "sendingOrgName2" as const, num: "sendingOrgNumber2" as const, country: "sendingOrgNumberCountry2" as const },
          { label: "3", name: "sendingOrgName3" as const, num: "sendingOrgNumber3" as const, country: "sendingOrgNumberCountry3" as const },
        ].map((org) => (
          <div key={org.label} className="border border-border rounded-lg p-3 space-y-2 bg-surface/40">
            <p className="text-xs font-semibold text-muted">送出機関 {org.label}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-0.5">
                <label className="text-xs text-muted">機関名</label>
                <input className={inp} value={(form[org.name] as string) ?? ""} onChange={set(org.name)} />
              </div>
              <div className="space-y-0.5">
                <label className="text-xs text-muted">国コード</label>
                <input className={inp} value={(form[org.country] as string) ?? ""} onChange={set(org.country)} placeholder="VNM / PHL / IDN …" />
              </div>
              <div className="space-y-0.5">
                <label className="text-xs text-muted">機関番号</label>
                <input className={inp} value={(form[org.num] as string) ?? ""} onChange={set(org.num)} />
              </div>
              {org.ref && (
                <div className="space-y-0.5">
                  <label className="text-xs text-muted">整理番号</label>
                  <input className={inp} value={(form[org.ref] as string) ?? ""} onChange={set(org.ref)} />
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

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
