import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { put } from "@vercel/blob";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { MinorChangeNoticePdf } from "@/lib/pdf/templates/minor-change-notice";
import { store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const notice = store.minorChangeNotices.find((n) => n.id === params.id);
  if (!notice) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const company = store.companies.find((c) => c.id === notice.companyId);
  const supervisor = store.organizations.find((o) => o.id === notice.supervisorId);
  const sendingOrg = store.organizations.find((o) => o.id === notice.sendingOrgId);
  const changeMemo = Array.isArray(notice.details) ? notice.details[0]?.changeMemo : undefined;

  const pdfBuffer = await renderPdfToBuffer(
    React.createElement(MinorChangeNoticePdf, {
      data: {
        noticeId: notice.id,
        month: notice.month,
        companyName: company?.name,
        supervisorName: supervisor?.displayName,
        sendingOrgName: sendingOrg?.displayName,
        changeMemo,
        details: notice.details ?? [],
      },
    }),
  );

  const filename = `tenku/minor-change-notices/${notice.id}.pdf`;
  const blob = await put(filename, pdfBuffer, { access: "public", contentType: "application/pdf", token: process.env.BLOB_READ_WRITE_TOKEN });
  return NextResponse.json({ url: blob.url });
}
