import { NextResponse } from "next/server";
import { listTaRecords, addTaRecord } from "@/lib/demo-store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage") as any;
  return NextResponse.json({ data: listTaRecords(stage ?? undefined) });
}

export async function POST(req: Request) {
  const body = await req.json();
  const record = addTaRecord(body);
  return NextResponse.json({ data: record }, { status: 201 });
}
