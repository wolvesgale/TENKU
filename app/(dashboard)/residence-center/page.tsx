"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ResidenceCenterPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/v1/alerts?status=OPEN").then((r) => r.json()).then((res) => setAlerts(res.data ?? []));
    fetch("/api/v1/cases").then((r) => r.json()).then((res) => setCases(res.data ?? []));
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">在留・申請センター</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded">
          <h2 className="font-semibold px-3 py-2 border-b">アラート</h2>
          <ul className="divide-y">
            {alerts.map((a) => (
              <li key={a.id} className="px-3 py-2 text-sm flex justify-between">
                <span>
                  {a.alertType} / {a.targetType}:{a.targetId}
                </span>
                <span className="text-red-600">{a.severity}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border rounded">
          <h2 className="font-semibold px-3 py-2 border-b">案件リンク</h2>
          <ul className="divide-y text-sm">
            {cases.map((c) => (
              <li key={c.id} className="px-3 py-2 flex justify-between">
                <span>{c.caseType}</span>
                <Link className="text-blue-600" href={`/cases/${c.id}`}>
                  詳細
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
