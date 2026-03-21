import { NextRequest, NextResponse } from "next/server";
import { listSswApplications, addSswApplication } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const personId = req.nextUrl.searchParams.get("personId") ?? undefined;
  return NextResponse.json({ data: listSswApplications(personId) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addSswApplication({
    personId: body.personId,
    companyId: body.companyId,
    appType: body.appType ?? "EXT",
    sector: body.sector ?? "",
    employerType: body.employerType ?? "corporate",
    nationality: body.nationality,
    status: body.status ?? "draft",
    submittedAt: body.submittedAt,
    approvedAt: body.approvedAt,
    targetDate: body.targetDate,
    notes: body.notes,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
