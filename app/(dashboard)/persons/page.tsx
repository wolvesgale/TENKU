"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { programLabels } from "@/lib/utils";

type Person = {
  id: string;
  fullName: string;
  currentProgram?: string;
  currentCompanyId?: string;
  residenceCardExpiry?: string;
  passportExpiry?: string;
};

export default function PersonsPage({ searchParams }: { searchParams?: { program?: string } }) {
  const [items, setItems] = useState<Person[]>([]);
  const program = searchParams?.program || "ALL";

  useEffect(() => {
    fetch(`/api/v1/persons?program=${program}`)
      .then((r) => r.json())
      .then((res) => setItems(res.data ?? []));
  }, [program]);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">外国人一覧 ({programLabels[program] ?? program})</h1>
        <div className="space-x-2">
          {(["ALL", "TITP", "SSW", "TA"] as const).map((p) => (
            <Link key={p} className={`px-3 py-1 rounded border ${p === program ? "bg-black text-white" : "bg-white"}`} href={`/persons?program=${p}`}>
              {programLabels[p] ?? p}
            </Link>
          ))}
          <Link className="px-3 py-1 rounded bg-blue-600 text-white" href="/persons/new">
            新規登録
          </Link>
          <Link className="px-3 py-1 rounded bg-slate-700 text-white" href="/persons/upload">
            CSVアップロード
          </Link>
        </div>
      </div>
      <table className="min-w-full border border-slate-800 text-sm">
        <thead>
          <tr className="bg-slate-900 text-slate-100">
            <th className="border border-slate-800 px-2 py-1 text-left">氏名</th>
            <th className="border border-slate-800 px-2 py-1">制度</th>
            <th className="border border-slate-800 px-2 py-1">在留期限</th>
            <th className="border border-slate-800 px-2 py-1">パスポ期限</th>
            <th className="border border-slate-800 px-2 py-1">詳細</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-slate-900/40">
              <td className="border border-slate-800 px-2 py-1">{p.fullName}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{programLabels[p.currentProgram ?? "ALL"] ?? p.currentProgram}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{p.residenceCardExpiry?.slice(0, 10) ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{p.passportExpiry?.slice(0, 10) ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">
                <Link className="text-blue-600" href={`/persons/${p.id}`}>
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
