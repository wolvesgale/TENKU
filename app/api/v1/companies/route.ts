import { NextRequest, NextResponse } from "next/server";
import { addCompany, store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: store.companies });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addCompany({
    name: body.name,
    address: body.address,
    defaultOrgId: body.defaultOrgId,
    defaultOrgType: body.defaultOrgType,
    industry: body.industry,
    contactName: body.contactName,
    contactTel: body.contactTel,
    contactEmail: body.contactEmail,
    notes: body.notes,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
