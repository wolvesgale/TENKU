import { NextRequest, NextResponse } from "next/server";
import { addOrganization, deleteOrganization, listOrganizationsByType, updateOrganization } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: listOrganizationsByType("SUPPORT") });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addOrganization({
    orgType: "SUPPORT",
    displayName: body.displayName,
    supervisorType: body.supervisorType,
    address: body.address,
    contactName: body.contactName,
    contactTel: body.contactTel,
    contactEmail: body.contactEmail,
    notes: body.notes,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = updateOrganization(body.id, {
    displayName: body.displayName,
    supervisorType: body.supervisorType,
    address: body.address,
    contactName: body.contactName,
    contactTel: body.contactTel,
    contactEmail: body.contactEmail,
    notes: body.notes,
  });
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const ok = deleteOrganization(body.id);
  if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
