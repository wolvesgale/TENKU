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
    address: body.address,
    phone: body.phone,
    representativeName: body.representativeName,
    supervisorResponsibleName: body.supervisorResponsibleName,
    supervisingOfficeName: body.supervisingOfficeName,
    supervisingOfficeAddress: body.supervisingOfficeAddress,
    supervisingOfficePhone: body.supervisingOfficePhone,
    planInstructorName: body.planInstructorName,
    sendingOrgName: body.sendingOrgName,
    sendingOrgNumber: body.sendingOrgNumber,
    sendingOrgRefNumber: body.sendingOrgRefNumber,
  });
  return NextResponse.json({ data: updated });
}
