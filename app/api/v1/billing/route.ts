import { NextRequest, NextResponse } from "next/server";
import { listInvoices, listInvoicesByTenant, addInvoice } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const tenantId = req.headers.get("x-tenant-id") ?? "tenant_demo";
  const companyId = req.nextUrl.searchParams.get("companyId") ?? undefined;
  return NextResponse.json({ data: listInvoicesByTenant(tenantId, companyId) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const inv = addInvoice({
    companyId: body.companyId,
    billingMonth: body.billingMonth,
    lineItems: body.lineItems ?? [],
    dueDate: body.dueDate,
    memo: body.memo,
  });
  return NextResponse.json({ data: inv }, { status: 201 });
}
