import { NextRequest, NextResponse } from "next/server";
import { store, updateCase } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = store.cases.find((c) => c.id === params.id);
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const tasks = store.tasks.filter((t) => t.caseId === item.id);
  return NextResponse.json({ data: { ...item, tasks } });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = updateCase(params.id, body);
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}
