import { NextRequest, NextResponse } from "next/server";
import { listSswRecords, addSswRecord } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const personId = req.nextUrl.searchParams.get("personId") ?? undefined;
  return NextResponse.json({ data: listSswRecords(personId) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addSswRecord({
    personId: body.personId,
    companyId: body.companyId,
    recordDate: body.recordDate,
    recordType: body.recordType,
    content: body.content,
    staffName: body.staffName,
    memo: body.memo,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
