"use client";
import { useEffect, useState } from "react";

type Organization = { id: string; displayName: string; supervisorType?: string; contactName?: string };

export default function SupervisorsPage() {
  const [items, setItems] = useState<Organization[]>([]);
  const [form, setForm] = useState({ displayName: "", supervisorType: "監理団体", contactName: "" });

  const load = () => {
    fetch("/api/v1/supervisors").then((r) => r.json()).then((res) => setItems(res.data ?? []));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.displayName) return;
    await fetch("/api/v1/supervisors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ displayName: "", supervisorType: "監理団体", contactName: "" });
    load();
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">監理団体</h1>
      <div className="flex flex-wrap gap-2 items-end">
        <label className="block text-sm text-slate-200">
          団体名
          <input
            className="w-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-white"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />
        </label>
        <label className="block text-sm text-slate-200">
          種別
          <select
            className="w-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-white"
            value={form.supervisorType}
            onChange={(e) => setForm({ ...form, supervisorType: e.target.value })}
          >
            <option value="監理団体">監理団体</option>
            <option value="登録支援機関">登録支援機関</option>
            <option value="その他">その他</option>
          </select>
        </label>
        <label className="block text-sm text-slate-200">
          担当者
          <input
            className="w-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-white"
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
          />
        </label>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit}>
          追加
        </button>
      </div>
      <table className="min-w-full border border-slate-800 text-sm">
        <thead>
          <tr className="bg-slate-900">
            <th className="border border-slate-800 px-2 py-1 text-left">団体名</th>
            <th className="border border-slate-800 px-2 py-1">種別</th>
            <th className="border border-slate-800 px-2 py-1">担当者</th>
            <th className="border border-slate-800 px-2 py-1">詳細</th>
          </tr>
        </thead>
        <tbody>
          {items.map((o) => (
            <tr key={o.id}>
              <td className="border border-slate-800 px-2 py-1">{o.displayName}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{o.supervisorType ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{o.contactName ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">
                <a className="text-blue-400" href={`/supervisors/${o.id}`}>
                  詳細
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
