import { NextRequest, NextResponse } from "next/server";
import { listTasks, store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const program = searchParams.get("program") || undefined;
  let data = listTasks(program || undefined);
  if (status) data = data.filter((t) => t.status === status);
  return NextResponse.json({ data });
}
