import { NextRequest } from "next/server";
import { generateTrainingPlanPdf } from "@/lib/pdf/otit-template";
import { store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const trainingPlan = store.trainingPlans.find((plan) => plan.id === params.id);
  if (!trainingPlan) {
    return new Response(JSON.stringify({ error: "not_found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const organization = store.demoOrganizationProfile;
  const company = store.companies.find((c) => c.id === trainingPlan.companyId);
  const person = store.persons.find((p) => p.id === trainingPlan.personId);
  const debug = req.nextUrl.searchParams.get("debug") === "1";

  const pdfBytes = await generateTrainingPlanPdf({
    organization,
    company,
    person,
    trainingPlan,
    debug,
  });

  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=training-plan-${trainingPlan.id}.pdf`,
    },
  });
}
