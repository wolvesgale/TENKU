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
  photoUrl?: string;
  residenceStatus?: string;
  residenceCardNumber?: string;
  residenceCardExpiry?: string;
  passportNo?: string;
  passportExpiry?: string;
  address?: string;
  currentCompanyName?: string;
};

const inputClassName = "w-full border px-2 py-1 rounded";

const RESIDENCE_STATUS_OPTIONS = [
  "技能実習1号",
  "技能実習2号",
  "技能実習3号",
  "特定技能1号",
  "特定技能2号",
  "特定活動",
  "その他",
];

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
    photoUrl: "",
    residenceStatus: "",
    residenceCardNumber: "",
    residenceCardExpiry: "",
    passportNo: "",
    passportExpiry: "",
    address: "",
    currentCompanyName: "",
    ...initialData,
  });

  const submit = () => {
    const fullName = form.nameKanji || form.nameRomaji || form.fullName || "";
    onSubmit({ ...form, fullName });
  };

  return (
    <div className="space-y-6">
      {/* 写真 */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">写真</h2>
        <div className="flex items-start gap-4">
          {form.photoUrl && (
            <img src={form.photoUrl} alt="顔写真" className="w-24 h-32 object-cover border rounded" />
          )}
          <label className="text-sm flex-1">
            写真URL
            <input
              className={inputClassName}
              placeholder="https://..."
              value={form.photoUrl ?? ""}
              onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
            />
          </label>
        </div>
      </section>

      {/* 基本情報 */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">基本情報</h2>
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
                <option key={n} value={n}>{n}</option>
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
          <label className="text-sm md:col-span-2">
            住所
            <input className={inputClassName} value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </label>
          <label className="text-sm md:col-span-2">
            受入企業名
            <input className={inputClassName} value={form.currentCompanyName ?? ""} onChange={(e) => setForm({ ...form, currentCompanyName: e.target.value })} />
          </label>
        </div>
      </section>

      {/* 在留資格 */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">在留資格</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm md:col-span-2">
            在留資格区分
            <select className={inputClassName} value={form.residenceStatus ?? ""} onChange={(e) => setForm({ ...form, residenceStatus: e.target.value })}>
              <option value="">選択</option>
              {RESIDENCE_STATUS_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            在留カードNo.
            <input className={inputClassName} value={form.residenceCardNumber ?? ""} onChange={(e) => setForm({ ...form, residenceCardNumber: e.target.value })} />
          </label>
          <label className="text-sm">
            在留期限
            <input type="date" className={inputClassName} value={form.residenceCardExpiry ?? ""} onChange={(e) => setForm({ ...form, residenceCardExpiry: e.target.value })} />
          </label>
        </div>
      </section>

      {/* パスポート */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">パスポート</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            パスポートNo.
            <input className={inputClassName} value={form.passportNo ?? ""} onChange={(e) => setForm({ ...form, passportNo: e.target.value })} />
          </label>
          <label className="text-sm">
            パスポート期限
            <input type="date" className={inputClassName} value={form.passportExpiry ?? ""} onChange={(e) => setForm({ ...form, passportExpiry: e.target.value })} />
          </label>
        </div>
      </section>

      {/* 帰国期間 */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">帰国期間</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            開始
            <input
              type="date"
              className={inputClassName}
              value={form.returnPeriodFrom ?? ""}
              onChange={(e) => setForm({ ...form, returnPeriodFrom: e.target.value })}
            />
          </label>
          <label className="text-sm">
            終了
            <input
              type="date"
              className={inputClassName}
              value={form.returnPeriodTo ?? ""}
              onChange={(e) => setForm({ ...form, returnPeriodTo: e.target.value })}
            />
          </label>
        </div>
      </section>

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
