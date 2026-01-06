import { NextRequest, NextResponse } from "next/server";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { ensurePdfSetup } from "@/lib/pdf/setup";
import { getPdfTemplateById, type PdfTemplateId } from "@/lib/pdf/templates/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    ensurePdfSetup();
    const { searchParams } = new URL(req.url);
    const templateId = searchParams.get("templateId") as PdfTemplateId | null;
    if (!templateId) {
      return NextResponse.json({ error: "missing_template", message: "templateId is required" }, { status: 400 });
    }

    const template = getPdfTemplateById(templateId);
    if (!template) {
      return NextResponse.json(
        { error: "template_not_found", message: `Unknown templateId: ${templateId}` },
        { status: 404 },
      );
    }

    const pdfBuffer = await renderPdfToBuffer(template.render(template.sampleData));
    if (pdfBuffer.byteLength < 1024) {
      return NextResponse.json(
        { error: "pdf_too_small", message: "Generated PDF buffer is unexpectedly small" },
        { status: 500 },
      );
    }

    const filename = `${template.id}-preview.pdf`;
    const disposition = searchParams.get("download") === "1" ? "attachment" : "inline";

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="${filename}"`,
        "Cache-Control": "no-store",
        "Content-Length": pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("[pdf preview] Failed to generate preview PDF", error);
    return NextResponse.json({ error: "render_failed", message: "Failed to generate PDF preview" }, { status: 500 });
  }
}
