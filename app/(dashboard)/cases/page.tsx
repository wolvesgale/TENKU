"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { programLabels } from "@/lib/utils";

type Case = { id: string; program: string; caseType: string; status: string; dueDate?: string; personId: string };

export default function CasesPage({ searchParams }: { searchParams?: { program?: string; status?: string; case_type?: string } }) {
  const program = searchParams?.program || "ALL";
  const [items, setItems] = useState<Case[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (program) params.append("program", program);
    if (searchParams?.status) params.append("status", searchParams.status);
    if (searchParams?.case_type) params.append("case_type", searchParams.case_type);
    fetch(`/api/v1/cases?${params.toString()}`)
      .then((r) => r.json())
      .then((res) => setItems(res.data ?? []));
  }, [program, searchParams?.status, searchParams?.case_type]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">申請案件 ({programLabels[program] ?? program})</h1>
        <div className="space-x-2">
          {(["ALL", "TITP", "SSW", "TA"] as const).map((p) => (
            <Link key={p} href={`/cases?program=${p}`} className={`px-3 py-1 rounded border ${p === program ? "bg-black text-white" : "bg-white"}`}>
              {programLabels[p] ?? p}
            </Link>
          ))}
          <Link className="px-3 py-1 bg-blue-600 text-white rounded" href="/cases/new">
            新規作成
          </Link>
        </div>
      </div>
      <table className="min-w-full border border-slate-800 text-sm">
        <thead>
          <tr className="bg-slate-900 text-slate-100">
            <th className="border border-slate-800 px-2 py-1 text-left">案件種別</th>
            <th className="border border-slate-800 px-2 py-1">制度</th>
            <th className="border border-slate-800 px-2 py-1">ステータス</th>
            <th className="border border-slate-800 px-2 py-1">期限</th>
            <th className="border border-slate-800 px-2 py-1">詳細</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <td className="border border-slate-800 px-2 py-1">{c.caseType}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{programLabels[c.program ?? "ALL"] ?? c.program}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{c.status}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{c.dueDate?.slice(0, 10) ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">
                <Link className="text-blue-600" href={`/cases/${c.id}`}>
                  詳細
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
