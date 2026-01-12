"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Notice = { id: string; month: string; companyId: string; supervisorId: string };
type Company = { id: string; name: string };
type Organization = { id: string; displayName: string };

export default function MinorChangeNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [supervisors, setSupervisors] = useState<Organization[]>([]);

  useEffect(() => {
    fetch("/api/v1/minor-change-notices").then((r) => r.json()).then((res) => setNotices(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
    fetch("/api/v1/supervisors").then((r) => r.json()).then((res) => setSupervisors(res.data ?? []));
  }, []);

  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? "-";
  const supervisorName = (id: string) => supervisors.find((s) => s.id === id)?.displayName ?? "-";

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">軽微変更届一覧</h1>
      <table className="min-w-full border border-slate-800 text-sm">
        <thead>
          <tr className="bg-slate-900">
            <th className="border border-slate-800 px-2 py-1 text-left">対象月</th>
            <th className="border border-slate-800 px-2 py-1">受入企業</th>
            <th className="border border-slate-800 px-2 py-1">監理団体</th>
            <th className="border border-slate-800 px-2 py-1">詳細</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice) => (
            <tr key={notice.id}>
              <td className="border border-slate-800 px-2 py-1">{notice.month?.slice(0, 7)}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{companyName(notice.companyId)}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{supervisorName(notice.supervisorId)}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">
                <Link className="text-blue-400" href={`/minor-change-notices/${notice.id}`}>
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
