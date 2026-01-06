import { NextRequest, NextResponse } from "next/server";
import { listPersons } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function pickDate(type: string, person: any) {
  if (type === "residence") return person.residenceCardExpiry;
  if (type === "passport") return person.passportExpiry;
  return undefined;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "residence";
  const program = searchParams.get("program") || undefined;
  const persons = listPersons(program).map((p) => ({ ...p }));
  const filtered = persons
    .map((p) => ({
      ...p,
      targetDate: pickDate(type, p),
    }))
    .filter((p) => p.targetDate)
    .sort((a, b) => new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime());

  return NextResponse.json({ data: filtered });
}

