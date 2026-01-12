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
    foreignerId: body.foreignerId,
    nickname: body.nickname,
    nameKanji: body.nameKanji,
    nameKana: body.nameKana,
    nameRoma: body.nameRoma,
    gender: body.gender,
    displayLanguage: body.displayLanguage,
    residenceCardNumber: body.residenceCardNumber,
    residenceStart: body.residenceStart,
    dormAddress: body.dormAddress,
    arrivalDate: body.arrivalDate,
    assignmentDate: body.assignmentDate,
    employmentContractPeriod: body.employmentContractPeriod,
    sendingOrgId: body.sendingOrgId,
    certNumber1: body.certNumber1,
    certDate1: body.certDate1,
    certNumber2: body.certNumber2,
    certDate2: body.certDate2,
    certNumber3: body.certNumber3,
    certDate3: body.certDate3,
    changeCertNumber: body.changeCertNumber,
    changeCertDate: body.changeCertDate,
    traineeNoticeNumber: body.traineeNoticeNumber,
    traineeNoticeDate: body.traineeNoticeDate,
    handlerName: body.handlerName,
    nextProcedure: body.nextProcedure,
    notes: body.notes,
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
