import { NextRequest, NextResponse } from "next/server";
import { store, updateCompany } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const company = store.companies.find((c) => c.id === params.id);
  if (!company) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ data: company });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = updateCompany(params.id, body);
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}
