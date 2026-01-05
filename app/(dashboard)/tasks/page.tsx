"use client";
import { useEffect, useState } from "react";
import { programLabels } from "@/lib/utils";

type Task = { id: string; taskType: string; status: string; dueDate?: string; personId?: string; caseId?: string };

export default function TasksPage({ searchParams }: { searchParams?: { status?: string; program?: string } }) {
  const status = searchParams?.status || "";
  const program = searchParams?.program || "ALL";
  const [items, setItems] = useState<Task[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (program) params.set("program", program);
    fetch(`/api/v1/tasks?${params.toString()}`)
      .then((r) => r.json())
      .then((res) => setItems(res.data ?? []));
  }, [status, program]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">タスク一覧</h1>
      <div className="flex gap-2 text-sm">
        {(["ALL", "TITP", "SSW", "TA"] as const).map((p) => (
          <a key={p} className={`px-3 py-1 rounded border ${p === program ? "bg-black text-white" : "bg-white"}`} href={`/tasks?program=${p}`}>
            {programLabels[p] ?? p}
          </a>
        ))}
      </div>
      <ul className="divide-y border rounded">
        {items.map((t) => (
          <li key={t.id} className="px-3 py-2 text-sm flex justify-between">
            <span>
              {t.taskType} / {t.status}
            </span>
            <span>{t.dueDate?.slice(0, 10) ?? "-"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
