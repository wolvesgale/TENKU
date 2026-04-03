import { NextRequest, NextResponse } from "next/server";
import { getInvoice, updateInvoiceStatus, updateInvoice, InvoiceStatus } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const inv = getInvoice(params.id);
  if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: inv });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  if (body.status) {
    const inv = updateInvoiceStatus(params.id, body.status as InvoiceStatus);
    if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: inv });
  }
  const inv = updateInvoice(params.id, {
    lineItems: body.lineItems,
    dueDate: body.dueDate,
    memo: body.memo,
  });
  if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: inv });
}
