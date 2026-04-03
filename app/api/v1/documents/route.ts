import { NextRequest, NextResponse } from "next/server";
import { listDocuments, addDocument } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  return NextResponse.json({
    data: listDocuments({
      personId: searchParams.get("personId") ?? undefined,
      companyId: searchParams.get("companyId") ?? undefined,
      applicationId: searchParams.get("applicationId") ?? undefined,
    }),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const doc = addDocument({
    personId: body.personId,
    companyId: body.companyId,
    applicationId: body.applicationId,
    category: body.category ?? "other",
    filename: body.filename,
    mimeType: body.mimeType ?? "application/octet-stream",
    sizeBytes: body.sizeBytes,
    dataUrl: body.dataUrl,
    uploadedAt: body.uploadedAt ?? new Date().toISOString(),
    uploadedBy: body.uploadedBy,
    memo: body.memo,
  });
  return NextResponse.json({ data: doc }, { status: 201 });
}
