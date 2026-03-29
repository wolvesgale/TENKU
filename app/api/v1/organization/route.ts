import { NextRequest, NextResponse } from "next/server";
import { getDemoOrganizationProfile, updateDemoOrganizationProfile } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: getDemoOrganizationProfile() });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const updated = updateDemoOrganizationProfile({
    permitNumber: body.permitNumber,
    permitType: body.permitType,
    name: body.name,
    nameKana: body.nameKana,
    postalCode: body.postalCode,
    address: body.address,
    phone: body.phone,
    representativeName: body.representativeName,
    representativeKana: body.representativeKana,
    supervisorResponsibleName: body.supervisorResponsibleName,
    supervisorResponsibleKana: body.supervisorResponsibleKana,
    supervisingOfficeName: body.supervisingOfficeName,
    supervisingOfficeNameKana: body.supervisingOfficeNameKana,
    supervisingOfficePostalCode: body.supervisingOfficePostalCode,
    supervisingOfficeAddress: body.supervisingOfficeAddress,
    supervisingOfficePhone: body.supervisingOfficePhone,
    handledJobTypes: body.handledJobTypes,
    planInstructors: body.planInstructors,
  });
  return NextResponse.json({ data: updated });
}
