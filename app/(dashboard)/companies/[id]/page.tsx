"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CompanyDetail({ params }: { params: { id: string } }) {
  const [company, setCompany] = useState<any>(null);
  const [persons, setPersons] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/v1/companies/${params.id}`).then((r) => r.json()).then((res) => setCompany(res.data));
    fetch(`/api/v1/persons`).then((r) => r.json()).then((res) => setPersons((res.data ?? []).filter((p: any) => p.currentCompanyId === params.id)));
    fetch(`/api/v1/cases`).then((r) => r.json()).then((res) => setCases((res.data ?? []).filter((c: any) => c.companyId === params.id)));
  }, [params.id]);

  if (!company) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{company.name}</h1>
          <p className="text-sm text-gray-600">{company.address ?? "-"}</p>
        </div>
        <Link className="text-blue-600" href="/companies">
          一覧へ戻る
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-slate-800 p-3 rounded bg-slate-950/40">
          <h2 className="font-semibold mb-2">企業情報</h2>
          <p>業種: {company.industry ?? "-"}</p>
          <p>担当者: {company.contactName ?? "-"}</p>
          <p>担当者電話: {company.contactTel ?? "-"}</p>
        </div>
        <div className="border border-slate-800 p-3 rounded bg-slate-950/40">
          <h2 className="font-semibold mb-2">所属者</h2>
          <ul className="space-y-1 text-sm">
            {persons.map((p) => (
              <li key={p.id}>
                <Link className="text-blue-600" href={`/persons/${p.id}`}>
                  {p.fullName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-slate-800 p-3 rounded bg-slate-950/40 md:col-span-2">
          <h2 className="font-semibold mb-2">案件</h2>
          <ul className="space-y-1 text-sm">
            {cases.map((c) => (
              <li key={c.id}>
                <Link className="text-blue-600" href={`/cases/${c.id}`}>
                  {c.caseType} (期限: {c.dueDate?.slice(0, 10) ?? "-"})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
