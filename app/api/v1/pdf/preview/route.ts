import { NextResponse } from "next/server";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { getPdfTemplateById, type PdfTemplateId } from "@/lib/pdf/templates/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const templateId = body?.templateId as string | undefined;
    const data = body?.data;

    if (!templateId) {
      return NextResponse.json({ error: "template_id_required" }, { status: 400 });
    }

    const template = getPdfTemplateById(templateId as PdfTemplateId);
    if (!template) {
      return NextResponse.json({ error: "template_not_found" }, { status: 404 });
    }

    const element = template.render((data ?? template.sampleData) as any);
    const pdfBuffer = await renderPdfToBuffer(element);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
