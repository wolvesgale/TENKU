import { NextResponse } from "next/server";
import { dashboardDocuments } from "@/lib/demo-dashboard-data";
import { listTasks } from "@/lib/demo-store";

const SYSTEM_PROMPT = `あなたはTENKU_Cloudの在留資格管理AIアシスタントです。
監理団体「兵庫中央事業協同組合」の担当者をサポートしています。

【在籍者 主要情報（2026年3月時点）】
特定技能1号:
- LE MANH HUNG（三立製菓）: 在留期限 2026-06-03 / 更新申請中
- DANG THI GIANG（紀洋会）: 在留期限 2026-04-15 / 要確認
- LUU NGOC THANH（やすらぎ園）: 在留期限 2026-11-16 / 在籍中
- TRINH THI LUONG（やすらぎ園）: 在留期限 2026-08-02 / 更新準備中
- VO CHI THIEN（紀洋会）: 在留期限 2026-12-26 / 在籍中・N1
- HOANG PHI TRUONG（丹波FC）: 在留期限 2027-01-31 / 在籍中
- CHU THI HIEN（三立製菓）: 在留期限 2027-02-27 / 在籍中
- DINH THI PHUONG（丹波FC）: 在留期限 2026-11-22 / 更新準備中
技能実習1号:
- FERDIANANTA YOHAN PAMUNGKAS（Lien）: 在留期限 2026-09-29
- ALIF ALDO FAHRIZAL（Lien）: 在留期限 2026-04-15 / 更新手続中
【受入企業（10社）】丹波FC、やすらぎ園、紀洋会、三立製菓、ワールドコンストラクション、Lien、ユニバース、MASUDA、ハリマ木材、full&co
【回答方針】簡潔・実務的。在留期限・更新を最優先。法的判断は専門家へ。`;

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

  if (lower.includes("期限") || lower.includes("due") || lower.includes("更新") || lower.includes("在留")) {
    const overdue = tasks
      .filter((t) => new Date(t.dueDate || "").getTime() < Date.now() + 1000 * 60 * 60 * 24 * 90)
      .slice(0, 4)
      .map((t) => `- ${t.title ?? t.taskType}: ${formatDate(t.dueDate)} まで / 状態 ${t.status}`);
    return overdue.length > 0
      ? `期限が近いアイテムです:\n${overdue.join("\n")}`
      : "直近90日で期限のあるタスクはありません。";
  }

  if (lower.includes("デモ") || lower.includes("demo") || lower.includes("流れ")) {
    return `TENKU_Cloudデモの基本的な流れは以下の通りです：
  1. 企業や外国人（実習生・特定技能者）を登録します。
  2. 対象者の在留期限やパスポート期限を入力・管理します。
  3. 必要に応じて申請案件（在留資格認定・変更・更新、技能実習計画認定など）を作成します。
  4. 案件ごとにタスクを自動生成し、期限や進捗を追跡します。
  5. 各案件や求人情報からテンプレートPDFを生成し、書式を出力します。
  6. アラート一覧やダッシュボードで期限の近いものを確認し、対応状況を管理します。`;
  }

  return "TENKU_Cloudアシスタントです。「次にやることは？」「更新期限は？」などをお試しください。";
}

async function callClaudeAPI(message: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return buildReply(message);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: message }],
    }),
  });

  if (!res.ok) return buildReply(message);
  const data = await res.json();
  return data.content?.[0]?.text ?? buildReply(message);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  try {
    const reply = await callClaudeAPI(body.message ?? "");
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: buildReply(body.message ?? "") });
  }
}
