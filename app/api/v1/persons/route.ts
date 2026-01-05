import { NextRequest, NextResponse } from "next/server";
import { addPerson, listPersons, store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const program = searchParams.get("program") || undefined;
  const data = listPersons(program || undefined);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addPerson({
    fullName: body.fullName,
    nationality: body.nationality,
    nativeLanguage: body.nativeLanguage,
    birthDate: body.birthDate,
    currentCompanyId: body.currentCompanyId,
    currentProgram: body.currentProgram,
    residenceCardExpiry: body.residenceCardExpiry,
    passportExpiry: body.passportExpiry,
    metaJson: body.metaJson,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
