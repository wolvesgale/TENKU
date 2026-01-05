import { NextRequest, NextResponse } from "next/server";
import { addTrainingPlan, listTrainingPlans } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: listTrainingPlans() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addTrainingPlan({
    personId: body.personId,
    companyId: body.companyId,
    orgId: body.orgId,
    planType: body.planType,
    status: body.status ?? "DRAFT",
    plannedStart: body.plannedStart,
    plannedEnd: body.plannedEnd,
    documentUrl: body.documentUrl,
    metadata: body.metadata,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
