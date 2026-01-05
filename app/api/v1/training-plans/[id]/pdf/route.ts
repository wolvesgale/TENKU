import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { put } from "@vercel/blob";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { TrainingPlanPdf } from "@/lib/pdf/templates/training-plan";
import { store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const plan = store.trainingPlans.find((p) => p.id === params.id);
  if (!plan) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const person = store.persons.find((p) => p.id === plan.personId);
  const company = store.companies.find((c) => c.id === plan.companyId);

  const pdfBuffer = await renderPdfToBuffer(
    React.createElement(TrainingPlanPdf, {
      data: {
        planId: plan.id,
        planType: plan.planType,
        personName: person?.fullName,
        companyName: company?.name,
        status: plan.status,
        period: `${plan.plannedStart ?? ""} ~ ${plan.plannedEnd ?? ""}`,
        description: plan.metadata?.description,
      },
    }),
  );

  const filename = `tenku/training-plans/${plan.id}.pdf`;
  const blob = await put(filename, pdfBuffer, { access: "public", contentType: "application/pdf", token: process.env.BLOB_READ_WRITE_TOKEN });
  return NextResponse.json({ url: blob.url });
}
