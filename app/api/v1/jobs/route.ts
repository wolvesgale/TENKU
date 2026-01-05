import { NextRequest, NextResponse } from "next/server";
import { addJob, listJobs } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: listJobs() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addJob({
    companyId: body.companyId,
    title: body.title,
    workLocation: body.workLocation,
    salary: body.salary,
    notes: body.notes,
    occupation: body.occupation,
    description: body.description,
    benefits: body.benefits,
    employmentType: body.employmentType,
    requirements: body.requirements,
    applicationDeadline: body.applicationDeadline,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
