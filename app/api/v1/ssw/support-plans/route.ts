import { NextRequest, NextResponse } from "next/server";
import { listSswSupportPlans, addSswSupportPlan } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const personId = req.nextUrl.searchParams.get("personId") ?? undefined;
  return NextResponse.json({ data: listSswSupportPlans(personId) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addSswSupportPlan({
    personId: body.personId,
    companyId: body.companyId,
    planType: body.planType ?? "1",
    status: body.status ?? "draft",
    startDate: body.startDate,
    endDate: body.endDate,
    supportOrgId: body.supportOrgId,
    isDelegated: body.isDelegated ?? false,
    memo: body.memo,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
