import { NextResponse } from "next/server";
import { tasks, documents } from "@/lib/mockData";

export async function POST(request: Request) {
  const { message } = await request.json();
  const lower = (message as string).toLowerCase();

  let reply = "モック応答です。質問を認識できませんでしたが、期限が近いタスクを提示します。\n";

  if (lower.includes("次") || lower.includes("やる")) {
    const urgent = tasks
      .filter((t) => t.status !== "done")
      .slice(0, 3)
      .map((t) => `・${t.title} / 期限: ${t.dueDate} / 重要度: ${t.severity}`)
      .join("\n");
    reply = `次の推奨アクションです:\n${urgent}`;
  } else if (lower.includes("不足") || lower.includes("書類")) {
    const riskyDocs = documents
      .filter((d) => d.completion < 80)
      .map((d) => `・${d.name} (${d.status}) → 残り${100 - d.completion}%`)
      .join("\n");
    reply = `不足項目の候補です。モック計算: \n${riskyDocs}`;
  } else if (lower.includes("期限") || lower.includes("due")) {
    const urgent = tasks
      .filter((t) => t.status !== "done")
      .slice(0, 3)
      .map((t) => `・${t.title} / 期限: ${t.dueDate}`)
      .join("\n");
    reply = `期限が近いタスク: \n${urgent}`;
  }

  return NextResponse.json({ reply });
}
