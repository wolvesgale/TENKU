import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { put } from "@vercel/blob";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { MonitoringLogPdf } from "@/lib/pdf/templates/monitoring-log";
import { store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const log = store.monitoringLogs.find((l) => l.id === params.id);
  if (!log) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const person = store.persons.find((p) => p.id === log.personId);
  const company = store.companies.find((c) => c.id === log.companyId);
  const supervisor = store.organizations.find((o) => o.id === log.supervisorId);

  const pdfBuffer = await renderPdfToBuffer(
    React.createElement(MonitoringLogPdf, {
      data: {
        logId: log.id,
        date: log.date?.slice(0, 10),
        logType: log.logType,
        personName: person?.fullName,
        companyName: company?.name,
        supervisorName: supervisor?.displayName,
        overtimeHours: log.overtimeHours,
        memo: log.memo,
      },
    }),
  );

  const filename = `tenku/monitoring-logs/${log.id}.pdf`;
  const blob = await put(filename, pdfBuffer, { access: "public", contentType: "application/pdf", token: process.env.BLOB_READ_WRITE_TOKEN });
  return NextResponse.json({ url: blob.url });
}
