import { NextRequest, NextResponse } from "next/server";
import { store, updatePerson } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const person = store.persons.find((p) => p.id === params.id);
  if (!person) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ data: person });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = updatePerson(params.id, body);
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}
