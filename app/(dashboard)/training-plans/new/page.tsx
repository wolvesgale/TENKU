"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTrainingPlanPage() {
  const router = useRouter();
  const [persons, setPersons] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [form, setForm] = useState({
    planType: "skill_practice_plan",
    personId: "",
    companyId: "",
    plannedStart: "",
    plannedEnd: "",
    description: "",
    status: "DRAFT",
  });

  useEffect(() => {
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
  }, []);

  const submit = async () => {
    await fetch("/api/v1/training-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        metadata: form.description ? { description: form.description } : undefined,
      }),
    });
    router.push("/training-plans");
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">実習計画の作成</h1>
      <div className="space-y-3">
        <label className="block text-sm">プラン名/種別
          <input className="w-full border px-2 py-1" value={form.planType} onChange={(e) => setForm({ ...form, planType: e.target.value })} />
        </label>
        <label className="block text-sm">対象者
          <select className="w-full border px-2 py-1" value={form.personId} onChange={(e) => setForm({ ...form, personId: e.target.value })}>
            <option value="">選択してください</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">受入企業
          <select className="w-full border px-2 py-1" value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
            <option value="">選択してください</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-sm">開始日
            <input type="date" className="w-full border px-2 py-1" value={form.plannedStart} onChange={(e) => setForm({ ...form, plannedStart: e.target.value })} />
          </label>
          <label className="block text-sm">終了日
            <input type="date" className="w-full border px-2 py-1" value={form.plannedEnd} onChange={(e) => setForm({ ...form, plannedEnd: e.target.value })} />
          </label>
        </div>
        <label className="block text-sm">職種/作業内容
          <textarea className="w-full border px-2 py-1" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <label className="block text-sm">ステータス
          <select className="w-full border px-2 py-1" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {['DRAFT','SUBMITTED','APPROVED'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit}>保存</button>
      </div>
    </div>
  );
}
