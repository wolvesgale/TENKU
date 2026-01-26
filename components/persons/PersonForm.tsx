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
};

const inputClassName = "w-full border px-2 py-1 rounded";

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
    ...initialData,
  });

  const submit = () => {
    const fullName = form.nameKanji || form.nameRomaji || form.fullName || "";
    onSubmit({ ...form, fullName });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          氏名（ローマ字）
          <input className={inputClassName} value={form.nameRomaji} onChange={(e) => setForm({ ...form, nameRomaji: e.target.value })} />
        </label>
        <label className="text-sm">
          氏名（漢字）
          <input className={inputClassName} value={form.nameKanji} onChange={(e) => setForm({ ...form, nameKanji: e.target.value })} />
        </label>
        <label className="text-sm">
          国籍
          <select className={inputClassName} value={form.nationality ?? ""} onChange={(e) => setForm({ ...form, nationality: e.target.value })}>
            <option value="">選択</option>
            {nationalities.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          生年月日
          <input
            type="date"
            className={inputClassName}
            value={form.birthdate ?? ""}
            onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
          />
        </label>
        <label className="text-sm">
          性別
          <select className={inputClassName} value={form.gender ?? ""} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="">選択</option>
            <option value="男性">男性</option>
            <option value="女性">女性</option>
            <option value="その他">その他</option>
          </select>
        </label>
        <label className="text-sm">
          年齢（任意）
          <input
            type="number"
            className={inputClassName}
            value={form.age ?? ""}
            onChange={(e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : undefined })}
          />
        </label>
        <label className="text-sm">
          帰国期間（開始）
          <input
            type="date"
            className={inputClassName}
            value={form.returnPeriodFrom ?? ""}
            onChange={(e) => setForm({ ...form, returnPeriodFrom: e.target.value })}
          />
        </label>
        <label className="text-sm">
          帰国期間（終了）
          <input
            type="date"
            className={inputClassName}
            value={form.returnPeriodTo ?? ""}
            onChange={(e) => setForm({ ...form, returnPeriodTo: e.target.value })}
          />
        </label>
      </div>
      <button
        type="button"
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        onClick={submit}
        disabled={submitting}
      >
        {submitting ? "保存中..." : "保存"}
      </button>
    </div>
  );
}
