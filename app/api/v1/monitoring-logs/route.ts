import { NextRequest, NextResponse } from "next/server";
import { addMonitoringLog, deleteMonitoringLog, listMonitoringLogs, updateMonitoringLog } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const personId = searchParams.get("personId") || undefined;
  const companyId = searchParams.get("companyId") || undefined;
  const data = listMonitoringLogs({ personId, companyId });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addMonitoringLog({
    date: body.date,
    visitedAt: body.visitedAt ?? body.date,
    personId: body.personId,
    companyId: body.companyId,
    supervisorId: body.supervisorId,
    logType: body.logType,
    overtimeHours: body.overtimeHours,
    workingTimeSystem: body.workingTimeSystem,
    changeMemo: body.changeMemo,
    memo: body.memo,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = updateMonitoringLog(body.id, body);
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const ok = deleteMonitoringLog(body.id);
  if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
