import { NextRequest, NextResponse } from "next/server";
import { addMinorChangeNotice, deleteMinorChangeNotice, listMinorChangeNotices, updateMinorChangeNotice } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: listMinorChangeNotices() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const details = Array.isArray(body.details) ? (body.details as Array<{ overtimeHours?: number; reason?: string }>) : [];
  const invalidDetail = details.find((detail) => detail.overtimeHours === undefined || detail.reason === undefined || detail.reason === "");
  if (!body.month || !body.companyId || !body.supervisorId || details.length === 0 || invalidDetail) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const created = addMinorChangeNotice({
    month: body.month,
    companyId: body.companyId,
    supervisorId: body.supervisorId,
    sendingOrgId: body.sendingOrgId,
    details,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = updateMinorChangeNotice(body.id, body);
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const ok = deleteMinorChangeNotice(body.id);
  if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
