import { NextRequest, NextResponse } from "next/server";
import { updateTask, store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = updateTask(params.id, body);
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const task = store.tasks.find((t) => t.id === params.id);
  if (!task) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ data: task });
}
