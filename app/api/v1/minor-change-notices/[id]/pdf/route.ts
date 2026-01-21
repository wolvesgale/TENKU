import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { MinorChangeNoticePdf } from "@/lib/pdf/templates/minor-change-notice";
import { store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const traceId = Math.random().toString(36).slice(2, 10);
  try {
    const notice = store.minorChangeNotices.find((n) => n.id === params.id);
    if (!notice) return NextResponse.json({ error: "not_found", message: "Notice not found", traceId }, { status: 404 });
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

    const filename = `minor-change-notice_${notice.month?.slice(0, 7) ?? "month"}_${notice.id}.pdf`;
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-store",
        "Content-Length": pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("[minor-change-notices/pdf] Failed to render", {
      traceId,
      noticeId: params.id,
      companyId: store.minorChangeNotices.find((n) => n.id === params.id)?.companyId,
      supervisorId: store.minorChangeNotices.find((n) => n.id === params.id)?.supervisorId,
      error,
    });
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "PDFの生成に失敗しました。", traceId },
      { status: 500 },
    );
  }
}
