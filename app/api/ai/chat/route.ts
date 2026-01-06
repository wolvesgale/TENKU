import { NextResponse } from "next/server";
import { dashboardDocuments } from "@/lib/demo-dashboard-data";
import { listTasks } from "@/lib/demo-store";

function formatDate(value?: string) {
  if (!value) return "未設定";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

function buildReply(message: string) {
  const lower = message.toLowerCase();
  const tasks = listTasks();

  if (lower.includes("次") || lower.includes("やること") || lower.includes("todo")) {
    const upcoming = tasks
      .filter((t) => t.status !== "DONE")
      .sort((a, b) => new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime())
      .slice(0, 3)
      .map((t) => `- ${t.title ?? t.taskType} (期限: ${formatDate(t.dueDate)}${t.severity ? `, 重要度: ${t.severity}` : ""})`)
      .join("\n");
    return upcoming
      ? `期限が近いタスクをピックアップしました:\n${upcoming}`
      : "期限が近いタスクは登録されていません。";
  }

  if (lower.includes("書類") || lower.includes("不足") || lower.includes("document")) {
    const flagged = dashboardDocuments
      .filter((d) => d.completion < 80)
      .slice(0, 3)
      .map((d) => `- ${d.name}: 現在${d.completion}% / ステータス ${d.status}`)
      .join("\n");
    return `不足がありそうな書類です。チェックリストとコメントを確認してください:\n${flagged}`;
  }

  if (lower.includes("期限") || lower.includes("due")) {
    const overdue = tasks
      .filter((t) => new Date(t.dueDate || "").getTime() < Date.now() + 1000 * 60 * 60 * 24 * 14)
      .slice(0, 3)
      .map((t) => `- ${t.title ?? t.taskType}: ${formatDate(t.dueDate)} まで / 状態 ${t.status}`);
    return overdue.length > 0
      ? `期限が近いアイテムです:\n${overdue.join("\n")}`
      : "直近2週間で期限のあるタスクはありません。";
  }

  if (lower.includes("デモ") || lower.includes("demo") || lower.includes("流れ")) {
    return `TENKUデモの流れは次のステップで確認できます：
  1. 外国人（実習生・特定技能者）と受入企業を登録する。
  2. 在留カード・パスポートの期限を入力してアラートを確認する。
  3. 在留資格の認定・変更・更新などの案件を作成する。
  4. 案件に紐づくタスクを自動生成し、期限と進捗を管理する。
  5. 実習計画や求人情報を登録し、関連データを揃える。
  6. テンプレートからPDFをプレビュー・出力して書式を整備する。
  7. AIモーダルで不足項目や次のアクションを問い合わせて支援を受ける。`;
  }

  return "TENKUモックAIです。期限・不足項目・スケジュールの確認ができます。「次にやることは？」や「デモの流れは？」などを入力してください。";
}

export async function POST(req: Request) {
  const body = await req.json();
  const reply = buildReply(body.message ?? "");
  return NextResponse.json({ reply });
}
