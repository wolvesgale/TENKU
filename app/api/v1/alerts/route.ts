import { NextRequest, NextResponse } from "next/server";
import { calculateAlerts, store, updateAlert } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "OPEN";
  const data = calculateAlerts().filter((a) => !status || a.status === status);
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const updated = updateAlert(body.id, { status: body.status });
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}
