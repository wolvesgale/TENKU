import { NextResponse } from "next/server";
import { documents, tasks } from "@/lib/mockData";

function buildReply(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("次") || lower.includes("やること") || lower.includes("todo")) {
    const upcoming = tasks
      .filter((t) => t.status !== "done")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3)
      .map((t) => `- ${t.title} (期限: ${t.dueDate}, 重要度: ${t.severity})`)
      .join("\n");
    return `期限が近いタスクをピックアップしました:\n${upcoming}`;
  }

  if (lower.includes("書類") || lower.includes("不足") || lower.includes("document")) {
    const flagged = documents
      .filter((d) => d.completion < 80)
      .slice(0, 3)
      .map((d) => `- ${d.name}: 現在${d.completion}% / ステータス ${d.status}`)
      .join("\n");
    return `不足がありそうな書類です。チェックリストとコメントを確認してください:\n${flagged}`;
  }

  if (lower.includes("期限") || lower.includes("due")) {
    const overdue = tasks
      .filter((t) => new Date(t.dueDate).getTime() < Date.now() + 1000 * 60 * 60 * 24 * 14)
      .slice(0, 3)
      .map((t) => `- ${t.title}: ${t.dueDate} まで / 状態 ${t.status}`);
    return overdue.length > 0
      ? `期限が近いアイテムです:\n${overdue.join("\n")}`
      : "直近2週間で期限のあるタスクはありません。";
  }

  return "TENKUモックAIです。期限・不足項目・スケジュールの確認ができます。「次にやることは？」などを入力してください。";
}

export async function POST(req: Request) {
  const body = await req.json();
  const reply = buildReply(body.message ?? "");
  return NextResponse.json({ reply });
}
