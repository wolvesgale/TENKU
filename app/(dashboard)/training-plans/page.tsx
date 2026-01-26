"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type TrainingPlan = {
  id: string;
  companyId?: string;
  personId?: string;
  category?: string;
  jobName?: string;
};

type Company = { id: string; name: string };

type Person = { id: string; nameKanji?: string; nameRomaji?: string };

export default function TrainingPlansPage() {
  const [items, setItems] = useState<TrainingPlan[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    fetch("/api/v1/training-plans")
      .then((r) => r.json())
      .then((res) => setItems(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
  }, []);

  const companyName = (id?: string) => companies.find((c) => c.id === id)?.name ?? "-";
  const personName = (id?: string) => {
    const person = persons.find((p) => p.id === id);
    return person?.nameKanji ?? person?.nameRomaji ?? "-";
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">技能実習計画</h1>
        <Link className="px-3 py-1 rounded bg-blue-600 text-white" href="/training-plans/new">
          新規作成
        </Link>
      </div>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-2 py-1 text-left">区分</th>
            <th className="border px-2 py-1">実習生</th>
            <th className="border px-2 py-1">法人</th>
            <th className="border px-2 py-1">職種</th>
            <th className="border px-2 py-1">詳細</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="border px-2 py-1">{p.category ?? "-"}</td>
              <td className="border px-2 py-1 text-center">{personName(p.personId)}</td>
              <td className="border px-2 py-1 text-center">{companyName(p.companyId)}</td>
              <td className="border px-2 py-1 text-center">{p.jobName ?? "-"}</td>
              <td className="border px-2 py-1 text-center">
                <Link className="text-blue-600" href={`/training-plans/${p.id}`}>
                  プレビュー
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
