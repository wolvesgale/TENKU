"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TrainingPlansPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/v1/training-plans")
      .then((r) => r.json())
      .then((res) => setItems(res.data ?? []));
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">実習計画</h1>
        <Link className="px-3 py-1 rounded bg-blue-600 text-white" href="/training-plans/new">
          新規作成
        </Link>
      </div>
      <table className="min-w-full border border-slate-800 text-sm">
        <thead>
          <tr className="bg-slate-900 text-slate-100">
            <th className="border border-slate-800 px-2 py-1 text-left">プラン名/種別</th>
            <th className="border border-slate-800 px-2 py-1">対象者</th>
            <th className="border border-slate-800 px-2 py-1">受入企業</th>
            <th className="border border-slate-800 px-2 py-1">期間</th>
            <th className="border border-slate-800 px-2 py-1">ステータス</th>
            <th className="border border-slate-800 px-2 py-1">詳細</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-slate-900/40">
              <td className="border border-slate-800 px-2 py-1">{p.planType}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{p.personId ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{p.companyId ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">
                {(p.plannedStart?.slice?.(0,10) ?? "-") + " ~ " + (p.plannedEnd?.slice?.(0,10) ?? "-")}
              </td>
              <td className="border border-slate-800 px-2 py-1 text-center">{p.status}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">
                <Link className="text-blue-600" href={`/training-plans/${p.id}`}>
                  編集
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
