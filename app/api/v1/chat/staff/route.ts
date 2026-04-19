import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `あなたは監理団体・登録支援機関の職員をサポートするAIアシスタントです。
以下の専門知識に基づいて、正確で実務的な回答をしてください。

【対応範囲】
- 技能実習制度（技能実習法・外国人技能実習機構(OTIT)の規定）
- 特定技能制度（入管法・特定技能在留資格・支援計画義務）
- 育成就労制度（2024年改正・移行スケジュール）
- 特定活動46号（技能実習修了者の移行手続き）
- 在留資格申請手続き（COE・COS・EXT）
- 支援計画の作成・1号/2号の違い
- 定期面談義務（4ヶ月以内に1回）
- 送出機関との連携・覚書管理
- 書類の様式・記載方法

【回答スタイル】
- 実務担当者向けに具体的・簡潔に回答する
- 法令条文よりも実務的な解釈・手順を優先する
- 不確かな情報には「確認が必要」と明示する
- 最新の制度改正（2024年育成就労法成立）を考慮する`;

export async function POST(req: Request) {
  const { messages } = await req.json() as { messages: { role: "user" | "assistant"; content: string }[] };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: "ANTHROPIC_API_KEY が設定されていません。環境変数を確認してください。" });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });
    const reply = (response.content[0] as any).text ?? "";
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ reply: `エラーが発生しました: ${e?.message}` }, { status: 500 });
  }
}
