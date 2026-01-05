import { NextRequest, NextResponse } from "next/server";
import { importJobsFromCsv } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("text/csv") || contentType.includes("application/octet-stream")) {
    const text = await req.text();
    const created = importJobsFromCsv(text);
    return NextResponse.json({ data: created }, { status: 201 });
  }
  const body = await req.json();
  const csv = typeof body?.csv === "string" ? body.csv : "";
  const created = importJobsFromCsv(csv);
  return NextResponse.json({ data: created }, { status: 201 });
}
