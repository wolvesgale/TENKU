"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ApplicationsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/v1/applications")
      .then((r) => r.json())
      .then((res) => setItems(res.data ?? []));
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">申請一覧</h1>
        <Link className="px-3 py-1 rounded bg-blue-600 text-white" href="/applications/new">
          新規作成
        </Link>
      </div>
      <table className="min-w-full border border-slate-800 text-sm">
        <thead>
          <tr className="bg-slate-900 text-slate-100">
            <th className="border border-slate-800 px-2 py-1 text-left">申請タイプ</th>
            <th className="border border-slate-800 px-2 py-1">申請者</th>
            <th className="border border-slate-800 px-2 py-1">企業</th>
            <th className="border border-slate-800 px-2 py-1">ステータス</th>
            <th className="border border-slate-800 px-2 py-1">提出日</th>
            <th className="border border-slate-800 px-2 py-1">詳細</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id} className="hover:bg-slate-900/40">
              <td className="border border-slate-800 px-2 py-1">{a.applicationType}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{a.personId ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{a.companyId ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{a.status}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{a.submittedAt?.slice?.(0, 10) ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">
                <Link className="text-blue-600" href={`/applications/${a.id}`}>
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
