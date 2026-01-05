import { NextRequest, NextResponse } from "next/server";
import { addStatus, store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const history = store.statusHistory.filter((s) => s.personId === params.id);
  return NextResponse.json({ data: history });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const created = addStatus(params.id, {
    program: body.program,
    residenceStatus: body.residenceStatus,
    startDate: body.startDate,
    endDate: body.endDate,
    metaJson: body.metaJson,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
