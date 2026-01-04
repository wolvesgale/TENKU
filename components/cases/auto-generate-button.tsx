"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AutoGenerateTasksButton({ caseId }: { caseId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setMessage(null);
    const res = await fetch(`/api/v1/cases/${caseId}/tasks/auto-generate`, { method: "POST" });
    const data = await res.json();
    setMessage(res.ok ? `Generated ${data.tasks.length} tasks` : data.error || "Failed");
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <Button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "タスク自動生成"}
      </Button>
      {message && <p className="text-sm text-muted">{message}</p>}
    </div>
  );
}
