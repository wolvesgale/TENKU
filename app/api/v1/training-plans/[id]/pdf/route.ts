import { NextRequest, NextResponse } from "next/server";
import { generateTrainingPlanPdf } from "@/lib/pdf/otit-template";
import { store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const trainingPlan = store.trainingPlans.find((plan) => plan.id === params.id);
  if (!trainingPlan) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const organization = store.demoOrganizationProfile;
  const company = store.companies.find((c) => c.id === trainingPlan.companyId);
  const person = store.persons.find((p) => p.id === trainingPlan.personId);

  const pdfBytes = await generateTrainingPlanPdf({ organization, company, person, trainingPlan });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=training-plan-${trainingPlan.id}.pdf`,
    },
  });
}
