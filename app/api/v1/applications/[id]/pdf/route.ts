import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { put } from "@vercel/blob";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { CoeApplicationPdf } from "@/lib/pdf/templates/coe-application";
import { store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const app = store.applications.find((a) => a.id === params.id);
  if (!app) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const person = store.persons.find((p) => p.id === app.personId);
  const company = store.companies.find((c) => c.id === app.companyId);

  const pdfBuffer = await renderPdfToBuffer(
    React.createElement(CoeApplicationPdf, {
      data: {
        applicationId: app.id,
        applicationType: app.applicationType,
        personName: person?.fullName,
        companyName: company?.name,
        status: app.status,
        submittedAt: app.submittedAt,
        dueDate: (app as any).dueDate,
        memo: app.metadata?.memo,
      },
    }),
  );

  const filename = `tenku/applications/${app.id}.pdf`;
  const blob = await put(filename, pdfBuffer, { access: "public", contentType: "application/pdf", token: process.env.BLOB_READ_WRITE_TOKEN });
  return NextResponse.json({ url: blob.url });
}
