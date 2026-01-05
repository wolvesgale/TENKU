"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CaseDetail({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/cases/${params.id}`).then((r) => r.json()).then((res) => {
      setItem(res.data);
      setTasks(res.data?.tasks ?? []);
    });
  }, [params.id]);

  const generate = async () => {
    setLoading(true);
    await fetch(`/api/v1/cases/${params.id}/tasks/auto-generate`, { method: "POST" });
    fetch(`/api/v1/cases/${params.id}`).then((r) => r.json()).then((res) => {
      setItem(res.data);
      setTasks(res.data?.tasks ?? []);
    });
    setLoading(false);
  };

  if (!item) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{item.caseType}</h1>
          <p className="text-sm text-gray-600">制度: {item.program} / ステータス: {item.status}</p>
          <p className="text-sm text-gray-600">期限: {item.dueDate?.slice(0, 10) ?? "-"}</p>
        </div>
        <Link className="text-blue-600" href="/cases">
          一覧へ戻る
        </Link>
      </div>
      <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={generate} disabled={loading}>
        {loading ? "生成中..." : "タスク自動生成"}
      </button>
      <div className="border rounded">
        <h2 className="font-semibold px-3 py-2 border-b">タスク</h2>
        <ul className="divide-y">
          {tasks.map((t) => (
            <li key={t.id} className="px-3 py-2 text-sm flex justify-between">
              <span>
                {t.taskType} ({t.status})
              </span>
              <span>{t.dueDate?.slice(0, 10) ?? "-"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
