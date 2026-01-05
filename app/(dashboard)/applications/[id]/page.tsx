"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TYPES = [
  { value: "residence_certificate", label: "認定証明書交付" },
  { value: "status_change", label: "変更許可" },
  { value: "period_extension", label: "期間更新" },
];

export default function ApplicationDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [persons, setPersons] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/v1/applications/${params.id}`).then((r) => r.json()).then((res) => setItem(res.data));
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
  }, [params.id]);

  const save = async () => {
    if (!item) return;
    await fetch(`/api/v1/applications/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    router.push("/applications");
  };

  if (!item) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">申請詳細</h1>
      <div className="space-y-3">
        <label className="block text-sm">申請タイプ
          <select className="w-full border px-2 py-1" value={item.applicationType} onChange={(e) => setItem({ ...item, applicationType: e.target.value })}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">申請者
          <select className="w-full border px-2 py-1" value={item.personId ?? ""} onChange={(e) => setItem({ ...item, personId: e.target.value })}>
            <option value="">選択してください</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">企業
          <select className="w-full border px-2 py-1" value={item.companyId ?? ""} onChange={(e) => setItem({ ...item, companyId: e.target.value })}>
            <option value="">選択してください</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">ステータス
          <select className="w-full border px-2 py-1" value={item.status} onChange={(e) => setItem({ ...item, status: e.target.value })}>
            {['DRAFT','SUBMITTED','APPROVED','REJECTED'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">申請日
          <input type="date" className="w-full border px-2 py-1" value={item.submittedAt?.slice?.(0,10) ?? ""} onChange={(e) => setItem({ ...item, submittedAt: e.target.value })} />
        </label>
        <label className="block text-sm">メモ
          <textarea className="w-full border px-2 py-1" rows={3} value={item.metadata?.memo ?? ""} onChange={(e) => setItem({ ...item, metadata: { ...(item.metadata ?? {}), memo: e.target.value } })} />
        </label>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={save}>保存</button>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => router.back()}>戻る</button>
        </div>
      </div>
    </div>
  );
}
