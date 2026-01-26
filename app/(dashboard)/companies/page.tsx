"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Company = { id: string; name: string; address?: string; workplaceName?: string };

export default function CompaniesPage() {
  const [items, setItems] = useState<Company[]>([]);
  useEffect(() => {
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setItems(res.data ?? []));
  }, []);
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">法人一覧</h1>
        <Link className="px-3 py-1 bg-blue-600 text-white rounded" href="/companies/new">
          新規登録
        </Link>
      </div>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-2 py-1 text-left">法人名</th>
            <th className="border px-2 py-1">事業所名</th>
            <th className="border px-2 py-1">所在地</th>
            <th className="border px-2 py-1">詳細</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <td className="border px-2 py-1">{c.name}</td>
              <td className="border px-2 py-1">{c.workplaceName ?? "-"}</td>
              <td className="border px-2 py-1">{c.address ?? "-"}</td>
              <td className="border px-2 py-1 text-center">
                <Link className="text-blue-600" href={`/companies/${c.id}`}>
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
