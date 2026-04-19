import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { listTranslationJobs, addTranslationJob, updateTranslationJob } from "@/lib/demo-store";

const LANG_NAMES: Record<string, string> = {
  ID: "インドネシア語 (Bahasa Indonesia)",
  VI: "ベトナム語 (Tiếng Việt)",
  NE: "ネパール語 (नेपाली)",
  EN: "英語 (English)",
};

export async function GET() {
  return NextResponse.json({ data: listTranslationJobs() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, targetLang, sourceText } = body as { title: string; targetLang: string; sourceText: string };

  const job = addTranslationJob({
    title, sourceLang: "JA", targetLang: targetLang as any,
    sourceText, status: "pending",
  });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    updateTranslationJob(job.id, { status: "error", translatedText: "ANTHROPIC_API_KEY が設定されていません" });
    return NextResponse.json({ data: job }, { status: 201 });
  }

  try {
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: `以下の日本語テキストを${LANG_NAMES[targetLang] ?? targetLang}に翻訳してください。翻訳結果のみを出力し、説明は不要です。\n\n${sourceText}`,
      }],
    });

    const translatedText = (msg.content[0] as any).text ?? "";
    const updated = updateTranslationJob(job.id, {
      status: "done",
      translatedText,
      completedAt: new Date().toISOString(),
    });
    return NextResponse.json({ data: updated }, { status: 201 });
  } catch (e: any) {
    updateTranslationJob(job.id, { status: "error", translatedText: e?.message ?? "翻訳エラー" });
    return NextResponse.json({ data: job, error: e?.message }, { status: 500 });
  }
}
