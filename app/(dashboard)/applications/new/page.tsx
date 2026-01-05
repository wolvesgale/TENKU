"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TYPES = [
  { value: "residence_certificate", label: "認定証明書交付" },
  { value: "status_change", label: "変更許可" },
  { value: "period_extension", label: "期間更新" },
];

export default function NewApplicationPage() {
  const router = useRouter();
  const [persons, setPersons] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [form, setForm] = useState({
    applicationType: TYPES[0].value,
    personId: "",
    companyId: "",
    status: "DRAFT",
    submittedAt: "",
    dueDate: "",
    metadata: "",
  });

  useEffect(() => {
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
  }, []);

  const submit = async () => {
    await fetch("/api/v1/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        metadata: form.metadata ? { memo: form.metadata, dueDate: form.dueDate || undefined } : undefined,
        dueDate: undefined,
      }),
    });
    router.push("/applications");
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">申請の作成</h1>
      <div className="space-y-3">
        <label className="block text-sm">申請タイプ
          <select className="w-full border px-2 py-1" value={form.applicationType} onChange={(e) => setForm({ ...form, applicationType: e.target.value })}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">申請者 (Person)
          <select className="w-full border px-2 py-1" value={form.personId} onChange={(e) => setForm({ ...form, personId: e.target.value })}>
            <option value="">選択してください</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">所属企業 (任意)
          <select className="w-full border px-2 py-1" value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
            <option value="">選択してください</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">ステータス
          <select className="w-full border px-2 py-1" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {['DRAFT','SUBMITTED','APPROVED','REJECTED'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">申請日 (任意)
          <input type="date" className="w-full border px-2 py-1" value={form.submittedAt} onChange={(e) => setForm({ ...form, submittedAt: e.target.value })} />
        </label>
        <label className="block text-sm">提出期限/メモ (任意)
          <input type="date" className="w-full border px-2 py-1 mb-1" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <textarea className="w-full border px-2 py-1" rows={3} value={form.metadata} onChange={(e) => setForm({ ...form, metadata: e.target.value })} placeholder="自由メモ" />
        </label>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit}>保存</button>
      </div>
    </div>
  );
}
