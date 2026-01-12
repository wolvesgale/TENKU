import { NextRequest, NextResponse } from "next/server";
import { importPersonsFromCsv } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }
  const csv = await file.text();
  const result = importPersonsFromCsv(csv);
  return NextResponse.json({
    data: result.created,
    createdCount: result.created.length,
    failedCount: result.failures.length,
    failures: result.failures.slice(0, 5),
  });
}
