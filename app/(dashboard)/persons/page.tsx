"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Person = {
  id: string;
  nameKanji?: string;
  nameRomaji?: string;
  nationality?: string;
  birthdate?: string;
};

export default function PersonsPage() {
  const [items, setItems] = useState<Person[]>([]);

  useEffect(() => {
    fetch("/api/v1/persons")
      .then((r) => r.json())
      .then((res) => setItems(res.data ?? []));
  }, []);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">実習生一覧</h1>
        <div className="space-x-2">
          <Link className="px-3 py-1 rounded bg-blue-600 text-white" href="/persons/new">
            新規登録
          </Link>
        </div>
      </div>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-surface/80">
            <th className="border px-2 py-1 text-left text-gray-100">氏名（漢字）</th>
            <th className="border px-2 py-1 text-gray-100">氏名（ローマ字）</th>
            <th className="border px-2 py-1 text-gray-100">国籍</th>
            <th className="border px-2 py-1 text-gray-100">生年月日</th>
            <th className="border px-2 py-1 text-gray-100">詳細</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-white/10">
              <td className="border px-2 py-1">{p.nameKanji ?? "-"}</td>
              <td className="border px-2 py-1">{p.nameRomaji ?? "-"}</td>
              <td className="border px-2 py-1 text-center">{p.nationality ?? "-"}</td>
              <td className="border px-2 py-1 text-center">{p.birthdate ?? "-"}</td>
              <td className="border px-2 py-1 text-center">
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
