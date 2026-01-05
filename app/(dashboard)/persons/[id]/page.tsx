"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PersonDetail({ params }: { params: { id: string } }) {
  const [person, setPerson] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/v1/persons/${params.id}`).then((r) => r.json()).then((res) => setPerson(res.data));
    fetch(`/api/v1/persons/${params.id}/status-history`).then((r) => r.json()).then((res) => setHistory(res.data ?? []));
    fetch(`/api/v1/cases?person_id=${params.id}`)
      .then((r) => r.json())
      .then((res) => setCases((res.data ?? []).filter((c: any) => c.personId === params.id)));
  }, [params.id]);

  if (!person) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{person.fullName}</h1>
          <p className="text-sm text-gray-600">制度: {person.currentProgram}</p>
        </div>
        <Link className="text-blue-600" href="/persons">
          一覧へ戻る
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border p-3 rounded">
          <h2 className="font-semibold mb-2">在留情報</h2>
          <p>在留カード: {person.residenceCardExpiry?.slice(0, 10) ?? "-"}</p>
          <p>パスポート: {person.passportExpiry?.slice(0, 10) ?? "-"}</p>
          <p>国籍: {person.nationality ?? "-"}</p>
        </div>
        <div className="border p-3 rounded">
          <h2 className="font-semibold mb-2">ステータス履歴</h2>
          <ul className="space-y-1">
            {history.map((h) => (
              <li key={h.id} className="text-sm">
                {h.program} / {h.residenceStatus ?? "-"} ({h.startDate?.slice(0, 10)} - {h.endDate?.slice(0, 10) ?? "継続"})
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border p-3 rounded">
        <h2 className="font-semibold mb-2">案件</h2>
        <ul className="space-y-1 text-sm">
          {cases.map((c) => (
            <li key={c.id}>
              <Link className="text-blue-600" href={`/cases/${c.id}`}>
                {c.caseType} / 期限 {c.dueDate?.slice(0, 10) ?? "-"}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
