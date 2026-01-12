"use client";

import { useEffect, useMemo, useState } from "react";
import nationalities from "@/data/nationalities.json";
import skills from "@/data/skills.json";

type Company = { id: string; name: string };
type Organization = { id: string; displayName: string };

export type PersonFormData = {
  foreignerId?: string;
  nickname?: string;
  nameKanji?: string;
  nameKana?: string;
  nameRoma?: string;
  gender?: string;
  displayLanguage?: string;
  residenceCardNumber?: string;
  residenceStart?: string;
  dormAddress?: string;
  arrivalDate?: string;
  assignmentDate?: string;
  employmentContractPeriod?: string;
  sendingOrgId?: string;
  certNumber1?: string;
  certDate1?: string;
  certNumber2?: string;
  certDate2?: string;
  certNumber3?: string;
  certDate3?: string;
  changeCertNumber?: string;
  changeCertDate?: string;
  traineeNoticeNumber?: string;
  traineeNoticeDate?: string;
  handlerName?: string;
  nextProcedure?: string;
  notes?: string;
  fullName: string;
  nationality?: string;
  nativeLanguage?: string;
  birthDate?: string;
  currentCompanyId?: string;
  currentProgram?: string;
  residenceCardExpiry?: string;
  passportExpiry?: string;
  metaJson?: {
    passportNumber?: string;
    specialty?: string;
    taskDetail?: string;
  };
};

const inputClassName = "w-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-sm text-white rounded";
const labelClassName = "block text-sm text-slate-200";

export function PersonForm({
  initialData,
  onSubmit,
  submitting,
}: {
  initialData?: Partial<PersonFormData>;
  onSubmit: (data: PersonFormData) => void;
  submitting?: boolean;
}) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sendingOrgs, setSendingOrgs] = useState<Organization[]>([]);
  const [form, setForm] = useState<PersonFormData>({
    fullName: "",
    currentProgram: "TITP",
    ...initialData,
    metaJson: {
      passportNumber: initialData?.metaJson?.passportNumber ?? "",
      specialty: initialData?.metaJson?.specialty ?? "",
      taskDetail: initialData?.metaJson?.taskDetail ?? "",
    },
  });

  useEffect(() => {
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
    fetch("/api/v1/sending-orgs").then((r) => r.json()).then((res) => setSendingOrgs(res.data ?? []));
  }, []);

  const genderOptions = useMemo(() => ["男性", "女性", "その他"], []);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">基本情報</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className={labelClassName}>
            外国人ID
            <input className={inputClassName} value={form.foreignerId ?? ""} onChange={(e) => setForm({ ...form, foreignerId: e.target.value })} />
          </label>
          <label className={labelClassName}>
            氏名（表示）
            <input className={inputClassName} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </label>
          <label className={labelClassName}>
            氏名（漢字）
            <input className={inputClassName} value={form.nameKanji ?? ""} onChange={(e) => setForm({ ...form, nameKanji: e.target.value })} />
          </label>
          <label className={labelClassName}>
            氏名（カナ）
            <input className={inputClassName} value={form.nameKana ?? ""} onChange={(e) => setForm({ ...form, nameKana: e.target.value })} />
          </label>
          <label className={labelClassName}>
            氏名（ローマ字）
            <input className={inputClassName} value={form.nameRoma ?? ""} onChange={(e) => setForm({ ...form, nameRoma: e.target.value })} />
          </label>
          <label className={labelClassName}>
            ニックネーム
            <input className={inputClassName} value={form.nickname ?? ""} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
          </label>
          <label className={labelClassName}>
            性別
            <select className={inputClassName} value={form.gender ?? ""} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="">選択</option>
              {genderOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClassName}>
            表示言語
            <input className={inputClassName} value={form.displayLanguage ?? ""} onChange={(e) => setForm({ ...form, displayLanguage: e.target.value })} />
          </label>
          <label className={labelClassName}>
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
          <label className={labelClassName}>
            母国語
            <input className={inputClassName} value={form.nativeLanguage ?? ""} onChange={(e) => setForm({ ...form, nativeLanguage: e.target.value })} />
          </label>
          <label className={labelClassName}>
            生年月日
            <input
              type="date"
              className={inputClassName}
              value={form.birthDate?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">在留・契約情報</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className={labelClassName}>
            在留カード番号
            <input className={inputClassName} value={form.residenceCardNumber ?? ""} onChange={(e) => setForm({ ...form, residenceCardNumber: e.target.value })} />
          </label>
          <label className={labelClassName}>
            在留開始日
            <input
              type="date"
              className={inputClassName}
              value={form.residenceStart?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, residenceStart: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            在留期限
            <input
              type="date"
              className={inputClassName}
              value={form.residenceCardExpiry?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, residenceCardExpiry: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            パスポート期限
            <input
              type="date"
              className={inputClassName}
              value={form.passportExpiry?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, passportExpiry: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            パスポート番号
            <input
              className={inputClassName}
              value={form.metaJson?.passportNumber ?? ""}
              onChange={(e) => setForm({ ...form, metaJson: { ...form.metaJson, passportNumber: e.target.value } })}
            />
          </label>
          <label className={labelClassName}>
            雇用契約期間
            <input
              className={inputClassName}
              value={form.employmentContractPeriod ?? ""}
              onChange={(e) => setForm({ ...form, employmentContractPeriod: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            配属日
            <input
              type="date"
              className={inputClassName}
              value={form.assignmentDate?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, assignmentDate: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            来日日
            <input
              type="date"
              className={inputClassName}
              value={form.arrivalDate?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            寮住所
            <input className={inputClassName} value={form.dormAddress ?? ""} onChange={(e) => setForm({ ...form, dormAddress: e.target.value })} />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">所属・制度</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className={labelClassName}>
            制度
            <select className={inputClassName} value={form.currentProgram ?? ""} onChange={(e) => setForm({ ...form, currentProgram: e.target.value })}>
              <option value="TITP">TITP</option>
              <option value="SSW">SSW</option>
              <option value="TA">TA</option>
            </select>
          </label>
          <label className={labelClassName}>
            受入企業
            <select
              className={inputClassName}
              value={form.currentCompanyId ?? ""}
              onChange={(e) => setForm({ ...form, currentCompanyId: e.target.value })}
            >
              <option value="">選択</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClassName}>
            送り出し機関
            <select
              className={inputClassName}
              value={form.sendingOrgId ?? ""}
              onChange={(e) => setForm({ ...form, sendingOrgId: e.target.value })}
            >
              <option value="">選択</option>
              {sendingOrgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.displayName}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClassName}>
            専門分野
            <select
              className={inputClassName}
              value={form.metaJson?.specialty ?? ""}
              onChange={(e) => setForm({ ...form, metaJson: { ...form.metaJson, specialty: e.target.value } })}
            >
              <option value="">選択</option>
              {skills.specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClassName}>
            業務詳細
            <select
              className={inputClassName}
              value={form.metaJson?.taskDetail ?? ""}
              onChange={(e) => setForm({ ...form, metaJson: { ...form.metaJson, taskDetail: e.target.value } })}
            >
              <option value="">選択</option>
              {skills.tasks.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">資格・届出</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className={labelClassName}>
            認定番号1
            <input className={inputClassName} value={form.certNumber1 ?? ""} onChange={(e) => setForm({ ...form, certNumber1: e.target.value })} />
          </label>
          <label className={labelClassName}>
            認定日1
            <input
              type="date"
              className={inputClassName}
              value={form.certDate1?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, certDate1: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            認定番号2
            <input className={inputClassName} value={form.certNumber2 ?? ""} onChange={(e) => setForm({ ...form, certNumber2: e.target.value })} />
          </label>
          <label className={labelClassName}>
            認定日2
            <input
              type="date"
              className={inputClassName}
              value={form.certDate2?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, certDate2: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            認定番号3
            <input className={inputClassName} value={form.certNumber3 ?? ""} onChange={(e) => setForm({ ...form, certNumber3: e.target.value })} />
          </label>
          <label className={labelClassName}>
            認定日3
            <input
              type="date"
              className={inputClassName}
              value={form.certDate3?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, certDate3: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            変更認定番号
            <input
              className={inputClassName}
              value={form.changeCertNumber ?? ""}
              onChange={(e) => setForm({ ...form, changeCertNumber: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            変更認定日
            <input
              type="date"
              className={inputClassName}
              value={form.changeCertDate?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, changeCertDate: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            実習実施者届出受理番号
            <input
              className={inputClassName}
              value={form.traineeNoticeNumber ?? ""}
              onChange={(e) => setForm({ ...form, traineeNoticeNumber: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            実習実施者届出受理日
            <input
              type="date"
              className={inputClassName}
              value={form.traineeNoticeDate?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, traineeNoticeDate: e.target.value })}
            />
          </label>
          <label className={labelClassName}>
            担当者
            <input className={inputClassName} value={form.handlerName ?? ""} onChange={(e) => setForm({ ...form, handlerName: e.target.value })} />
          </label>
          <label className={labelClassName}>
            次の手続き
            <input className={inputClassName} value={form.nextProcedure ?? ""} onChange={(e) => setForm({ ...form, nextProcedure: e.target.value })} />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">メモ</h2>
        <label className={labelClassName}>
          メモ
          <textarea
            className={`${inputClassName} min-h-[80px]`}
            value={form.notes ?? ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </label>
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
