import { NextResponse } from "next/server";
import { updateHomeVisit } from "@/lib/demo-store";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = updateHomeVisit(params.id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}
