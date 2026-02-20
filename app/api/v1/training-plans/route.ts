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
    category: body.category,
    jobCode: body.jobCode,
    jobName: body.jobName,
    workName: body.workName,
    jobCode2: body.jobCode2,
    jobName2: body.jobName2,
    workName2: body.workName2,
    trainingStartDate: body.trainingStartDate,
    trainingEndDate: body.trainingEndDate,
    trainingDurationYears: body.trainingDurationYears,
    trainingDurationMonths: body.trainingDurationMonths,
    trainingDurationDays: body.trainingDurationDays,
    trainingHoursTotal: body.trainingHoursTotal,
    trainingHoursLecture: body.trainingHoursLecture,
    trainingHoursPractice: body.trainingHoursPractice,
    prevCertNumber: body.prevCertNumber,
    entryTrainingRequired: body.entryTrainingRequired,
    freeEditOverrides: body.freeEditOverrides ?? {},
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
