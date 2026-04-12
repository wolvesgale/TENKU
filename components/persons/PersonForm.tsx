"use client";

import { useState } from "react";
import nationalities from "@/data/nationalities.json";

export type PersonFormData = {
  nameRomaji: string;
  nameKanji: string;
  nationality?: string;
  birthdate?: string;
  gender?: string;
  age?: number;
  returnPeriodFrom?: string;
  returnPeriodTo?: string;
  fullName: string;
  residenceCardExpiry?: string;
  myNumber?: string;
  myNumberExpiry?: string; // 在留期限と同じ → 自動入力
};

const inp = "w-full border border-border bg-surface/60 px-2 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <label className="text-xs text-muted">{label}</label>
      {children}
    </div>
  );
}

export function PersonForm({
  initialData,
  onSubmit,
  submitting,
}: {
  initialData?: Partial<PersonFormData>;
  onSubmit: (data: PersonFormData) => void;
  submitting?: boolean;
}) {
  const [form, setForm] = useState<PersonFormData>({
    nameRomaji: (initialData as { nameRoma?: string })?.nameRoma ?? "",
    nameKanji: "",
    nationality: "",
    birthdate: "",
    gender: "",
    age: undefined,
    returnPeriodFrom: "",
    returnPeriodTo: "",
    fullName: initialData?.fullName ?? initialData?.nameKanji ?? "",
    residenceCardExpiry: "",
    myNumber: "",
    myNumberExpiry: "",
    ...initialData,
  });

  const set = (key: keyof PersonFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  // 在留期限変更時にマイナンバー有効期限も自動入力
  const onResidenceExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, residenceCardExpiry: v, myNumberExpiry: v }));
  };

  const submit = () => {
    const fullName = form.nameKanji || form.nameRomaji || form.fullName || "";
    onSubmit({ ...form, fullName });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-teal border-b border-border pb-1">基本情報</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="氏名（ローマ字）">
            <input className={inp} value={form.nameRomaji} onChange={set("nameRomaji")} />
          </Field>
          <Field label="氏名（漢字・カタカナ）">
            <input className={inp} value={form.nameKanji} onChange={set("nameKanji")} />
          </Field>
          <Field label="国籍">
            <select className={inp} value={form.nationality ?? ""} onChange={set("nationality")}>
              <option value="">選択</option>
              {nationalities.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>
          <Field label="生年月日">
            <input type="date" className={inp} value={form.birthdate ?? ""} onChange={set("birthdate")} />
          </Field>
          <Field label="性別">
            <select className={inp} value={form.gender ?? ""} onChange={set("gender")}>
              <option value="">選択</option>
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="その他">その他</option>
            </select>
          </Field>
          <Field label="年齢（任意）">
            <input
              type="number"
              className={inp}
              value={form.age ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value ? Number(e.target.value) : undefined }))}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-teal border-b border-border pb-1">在留・マイナンバー</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="在留カード期限">
            <input type="date" className={inp} value={form.residenceCardExpiry ?? ""} onChange={onResidenceExpiryChange} />
          </Field>
          <Field label="マイナンバー">
            <input
              className={inp}
              value={form.myNumber ?? ""}
              onChange={set("myNumber")}
              placeholder="12桁"
              maxLength={12}
            />
          </Field>
          <Field label="マイナンバー有効期限（在留期限と同一）">
            <input
              type="date"
              className={`${inp} bg-surface/30`}
              value={form.myNumberExpiry ?? ""}
              readOnly
              title="在留カード期限を変更すると自動入力されます"
            />
          </Field>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-teal border-b border-border pb-1">帰国期間</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="帰国期間（開始）">
            <input type="date" className={inp} value={form.returnPeriodFrom ?? ""} onChange={set("returnPeriodFrom")} />
          </Field>
          <Field label="帰国期間（終了）">
            <input type="date" className={inp} value={form.returnPeriodTo ?? ""} onChange={set("returnPeriodTo")} />
          </Field>
        </div>
      </section>

      <button
        type="button"
        className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium disabled:opacity-60 hover:opacity-90 transition"
        onClick={submit}
        disabled={submitting}
      >
        {submitting ? "保存中…" : "保存"}
      </button>
    </div>
  );
}
