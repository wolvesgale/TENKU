import { NextResponse } from "next/server";
import { listHomeVisits, addHomeVisit } from "@/lib/demo-store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const personId = searchParams.get("personId") ?? undefined;
  return NextResponse.json({ data: listHomeVisits(personId) });
}

export async function POST(req: Request) {
  const body = await req.json();
  const record = addHomeVisit({
    ...body,
    checklist: body.checklist ?? [
      { label: "在留期限と帰国日の整合確認", done: false },
      { label: "緊急連絡先の共有", done: false },
      { label: "航空券URL確認", done: false },
      { label: "国内移動URL確認", done: false },
      { label: "パスポート有効期限確認", done: false },
    ],
  });
  return NextResponse.json({ data: record }, { status: 201 });
}
