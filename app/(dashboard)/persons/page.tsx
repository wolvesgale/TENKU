"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Person = {
  id: string;
  nameRomaji?: string;
  nameRoma?: string;
  nationality?: string;
  residenceStatus?: string;
};

const RESIDENCE_LABELS: Record<string, string> = {
  "技能実習1号": "技能実習1号",
  "技能実習2号": "技能実習2号",
  "技能実習3号": "技能実習3号",
  "特定技能1号": "特定技能1号",
  "特定技能2号": "特定技能2号",
  "特定活動": "特定活動",
  "その他": "その他",
};

function residenceLabel(status?: string) {
  if (!status) return "-";
  return RESIDENCE_LABELS[status] ?? status;
}

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
        <h1 className="text-xl font-semibold">外国人一覧</h1>
        <div className="space-x-2">
          <Link className="px-3 py-1 rounded bg-blue-600 text-white" href="/persons/new">
            新規登録
          </Link>
        </div>
      </div>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-surface/80">
            <th className="border px-2 py-1 text-left text-gray-100">氏名（ローマ字）</th>
            <th className="border px-2 py-1 text-gray-100">国籍</th>
            <th className="border px-2 py-1 text-gray-100">在留資格区分</th>
            <th className="border px-2 py-1 text-gray-100">詳細</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-white/10">
              <td className="border px-2 py-1">{p.nameRomaji ?? p.nameRoma ?? "-"}</td>
              <td className="border px-2 py-1 text-center">{p.nationality ?? "-"}</td>
              <td className="border px-2 py-1 text-center">{residenceLabel(p.residenceStatus)}</td>
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
