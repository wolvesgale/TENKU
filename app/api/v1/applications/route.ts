import { NextRequest, NextResponse } from "next/server";
import { addApplication, listApplications } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: listApplications() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addApplication({
    personId: body.personId,
    companyId: body.companyId,
    caseId: body.caseId,
    applicationType: body.applicationType,
    status: body.status ?? "DRAFT",
    submittedAt: body.submittedAt,
    documentUrl: body.documentUrl,
    metadata: body.metadata,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
