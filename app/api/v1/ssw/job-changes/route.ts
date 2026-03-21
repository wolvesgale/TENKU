import { NextRequest, NextResponse } from "next/server";
import { listSswJobChanges, addSswJobChange } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const personId = req.nextUrl.searchParams.get("personId") ?? undefined;
  return NextResponse.json({ data: listSswJobChanges(personId) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addSswJobChange({
    personId: body.personId,
    fromCompanyId: body.fromCompanyId,
    toCompanyId: body.toCompanyId,
    status: body.status ?? "planning",
    changeDate: body.changeDate,
    reason: body.reason,
    notes: body.notes,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
