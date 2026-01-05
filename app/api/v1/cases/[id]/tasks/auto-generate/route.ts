import { NextRequest, NextResponse } from "next/server";
import { autoGenerateTasks, store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = store.cases.find((c) => c.id === params.id);
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const created = autoGenerateTasks(params.id);
  return NextResponse.json({ data: created });
}
