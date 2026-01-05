"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TrainingPlanDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [persons, setPersons] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/v1/training-plans/${params.id}`).then((r) => r.json()).then((res) => setItem(res.data));
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
  }, [params.id]);

  const save = async () => {
    if (!item) return;
    await fetch(`/api/v1/training-plans/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    router.push("/training-plans");
  };

  if (!item) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">実習計画詳細</h1>
      <div className="space-y-3">
        <label className="block text-sm">プラン名/種別
          <input className="w-full border px-2 py-1" value={item.planType} onChange={(e) => setItem({ ...item, planType: e.target.value })} />
        </label>
        <label className="block text-sm">対象者
          <select className="w-full border px-2 py-1" value={item.personId ?? ""} onChange={(e) => setItem({ ...item, personId: e.target.value })}>
            <option value="">選択してください</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">受入企業
          <select className="w-full border px-2 py-1" value={item.companyId ?? ""} onChange={(e) => setItem({ ...item, companyId: e.target.value })}>
            <option value="">選択してください</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-sm">開始日
            <input type="date" className="w-full border px-2 py-1" value={item.plannedStart?.slice?.(0,10) ?? ""} onChange={(e) => setItem({ ...item, plannedStart: e.target.value })} />
          </label>
          <label className="block text-sm">終了日
            <input type="date" className="w-full border px-2 py-1" value={item.plannedEnd?.slice?.(0,10) ?? ""} onChange={(e) => setItem({ ...item, plannedEnd: e.target.value })} />
          </label>
        </div>
        <label className="block text-sm">ステータス
          <select className="w-full border px-2 py-1" value={item.status} onChange={(e) => setItem({ ...item, status: e.target.value })}>
            {['DRAFT','SUBMITTED','APPROVED'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">職種/作業メモ
          <textarea className="w-full border px-2 py-1" rows={3} value={item.metadata?.description ?? ""} onChange={(e) => setItem({ ...item, metadata: { ...(item.metadata ?? {}), description: e.target.value } })} />
        </label>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={save}>保存</button>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => router.back()}>戻る</button>
        </div>
      </div>
    </div>
  );
}
