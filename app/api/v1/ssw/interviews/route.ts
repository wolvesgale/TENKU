import { NextRequest, NextResponse } from "next/server";
import { listSswInterviews, addSswInterview } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const personId = req.nextUrl.searchParams.get("personId") ?? undefined;
  return NextResponse.json({ data: listSswInterviews(personId) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addSswInterview({
    personId: body.personId,
    companyId: body.companyId,
    interviewNo: body.interviewNo ?? 1,
    scheduledDate: body.scheduledDate,
    conductedDate: body.conductedDate,
    status: body.status ?? "scheduled",
    conductorName: body.conductorName,
    location: body.location,
    memo: body.memo,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
