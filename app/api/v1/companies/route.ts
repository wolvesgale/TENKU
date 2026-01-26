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
    nameKana: body.nameKana,
    notifAcceptanceNo: body.notifAcceptanceNo,
    address: body.address,
    postalCode: body.postalCode,
    phone: body.phone,
    defaultOrgId: body.defaultOrgId,
    defaultOrgType: body.defaultOrgType,
    industryMajor: body.industryMajor,
    industryMinor: body.industryMinor,
    representativeKana: body.representativeKana,
    representativeName: body.representativeName,
    corporateNumber: body.corporateNumber,
    contactName: body.contactName,
    contactTel: body.contactTel,
    workplaceName: body.workplaceName,
    workplaceNameKana: body.workplaceNameKana,
    workplaceAddress: body.workplaceAddress,
    workplacePostalCode: body.workplacePostalCode,
    workplacePhone: body.workplacePhone,
    traineeResponsibleName: body.traineeResponsibleName,
    traineeResponsibleRole: body.traineeResponsibleRole,
    traineeInstructorName: body.traineeInstructorName,
    traineeInstructorRole: body.traineeInstructorRole,
    lifeInstructorName: body.lifeInstructorName,
    lifeInstructorRole: body.lifeInstructorRole,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
