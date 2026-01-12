"use client";
import { useEffect, useState } from "react";

type Organization = { id: string; displayName: string; country?: string; contactName?: string };

export default function SendingOrgsPage() {
  const [items, setItems] = useState<Organization[]>([]);
  const [form, setForm] = useState({ displayName: "", country: "", contactName: "" });

  const load = () => {
    fetch("/api/v1/sending-orgs").then((r) => r.json()).then((res) => setItems(res.data ?? []));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.displayName) return;
    await fetch("/api/v1/sending-orgs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ displayName: "", country: "", contactName: "" });
    load();
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">送り出し機関</h1>
      <div className="flex flex-wrap gap-2 items-end">
        <label className="block text-sm text-slate-200">
          機関名
          <input
            className="w-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-white"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />
        </label>
        <label className="block text-sm text-slate-200">
          国
          <input
            className="w-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-white"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
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
            <th className="border border-slate-800 px-2 py-1 text-left">機関名</th>
            <th className="border border-slate-800 px-2 py-1">国</th>
            <th className="border border-slate-800 px-2 py-1">担当者</th>
            <th className="border border-slate-800 px-2 py-1">詳細</th>
          </tr>
        </thead>
        <tbody>
          {items.map((o) => (
            <tr key={o.id}>
              <td className="border border-slate-800 px-2 py-1">{o.displayName}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{o.country ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{o.contactName ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">
                <a className="text-blue-400" href={`/sending-orgs/${o.id}`}>
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
