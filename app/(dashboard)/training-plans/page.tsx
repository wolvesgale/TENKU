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
          <tr className="bg-surface/80">
            <th className="border px-2 py-1 text-left text-gray-100">区分</th>
            <th className="border px-2 py-1 text-gray-100">実習生</th>
            <th className="border px-2 py-1 text-gray-100">法人</th>
            <th className="border px-2 py-1 text-gray-100">職種</th>
            <th className="border px-2 py-1 text-gray-100">詳細</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-white/10">
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

      {/* 区分凡例 */}
      <div className="rounded border border-white/10 bg-white/5 p-4 text-sm">
        <p className="mb-3 font-semibold text-gray-300">
          区分について（技能実習計画認定申請書 第200号の1様式）
        </p>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-white/10">
              <th className="border border-white/10 px-3 py-1.5 text-left text-gray-200 w-12">区分</th>
              <th className="border border-white/10 px-3 py-1.5 text-left text-gray-200 w-24">実習段階</th>
              <th className="border border-white/10 px-3 py-1.5 text-left text-gray-200 w-32">類型</th>
              <th className="border border-white/10 px-3 py-1.5 text-left text-gray-200">概要</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "A", stage: "第1号", type: "企業単独型", desc: "受入企業が単独で技能実習生を受け入れる。実習期間1〜2年目。" },
              { label: "B", stage: "第1号", type: "団体監理型", desc: "監理団体（事業協同組合等）を通じて受け入れる。実習期間1〜2年目。最も一般的な類型。" },
              { label: "C", stage: "第2号", type: "企業単独型", desc: "第1号（企業単独型）修了後の継続実習。実習期間3〜4年目。" },
              { label: "D", stage: "第2号", type: "団体監理型", desc: "第1号（団体監理型）修了後の継続実習。実習期間3〜4年目。" },
              { label: "E", stage: "第3号", type: "企業単独型", desc: "第2号修了後のさらなる継続実習。優良な実習実施者のみ可。実習期間5年目。" },
              { label: "F", stage: "第3号", type: "団体監理型", desc: "第2号修了後のさらなる継続実習。優良な監理団体・実習実施者のみ可。実習期間5年目。" },
            ].map((row) => (
              <tr key={row.label} className="hover:bg-white/5">
                <td className="border border-white/10 px-3 py-1.5 text-center font-bold text-brand-blue">{row.label}</td>
                <td className="border border-white/10 px-3 py-1.5 text-gray-300">{row.stage}</td>
                <td className="border border-white/10 px-3 py-1.5 text-gray-300">{row.type}</td>
                <td className="border border-white/10 px-3 py-1.5 text-gray-400">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-gray-500 text-xs">
          ※ OTIT（外国人技能実習機構）様式200-1「技能実習計画認定申請書」の実習区分（rbtJISSHUKUBUN）に対応。
        </p>
      </div>
    </div>
  );
}
