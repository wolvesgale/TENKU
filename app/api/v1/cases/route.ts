import { NextRequest, NextResponse } from "next/server";
import { addCase, autoGenerateTasks, listCases, store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const program = searchParams.get("program") || undefined;
  const status = searchParams.get("status") || undefined;
  const caseType = searchParams.get("case_type") || undefined;
  let data = listCases(program);
  if (status) data = data.filter((c) => c.status === status);
  if (caseType) data = data.filter((c) => c.caseType === caseType);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addCase({
    program: body.program,
    caseType: body.caseType,
    status: body.status ?? "OPEN",
    personId: body.personId,
    companyId: body.companyId,
    ownerOrgId: body.ownerOrgId,
    dueDate: body.dueDate,
    metaJson: body.metaJson,
  });
  const tasks = autoGenerateTasks(created.id);
  return NextResponse.json({ data: { ...created, tasks } }, { status: 201 });
}
