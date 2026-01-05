import { NextRequest, NextResponse } from "next/server";
import React from "react";
import type { JobOfferPdfData } from "@/lib/pdf/job-offer-template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const [{ getServerSession }, { prisma }, _prismaClient, { put }, { JobOfferPdf }, { renderPdfToBuffer }] =
    await Promise.all([
      import("@/lib/auth"),
      import("@/lib/prisma"),
      import("@prisma/client"),
      import("@vercel/blob"),
      import("@/lib/pdf/job-offer-template"),
      import("@/lib/pdf/render"),
    ]);

  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const jobId = params.id;

  const job = await prisma.job.findFirst({
    where: { id: jobId, tenantId: session.user.tenantId },
    include: { company: true },
  });

  if (!job) {
    return NextResponse.json({ error: "job_not_found" }, { status: 404 });
  }

  const nextVersion = (job.jobOfferVersion ?? 0) + 1;

  const data: JobOfferPdfData = {
    jobTitle: job.title,
    companyName: job.company?.name ?? "（未設定）",
    companyAddress: job.company?.address ?? "",
    contactName: job.company?.contactName ?? "",
    contactTel: job.company?.contactTel ?? "",
    workLocation: job.workLocation ?? "",
    salary: job.salary ?? "",
    notes: job.notes ?? "",
    version: nextVersion,
  };

  const pdfBuffer = await renderPdfToBuffer(React.createElement(JobOfferPdf, { data }));

  const filename = `tenku/job-offers/${jobId}/job-offer-v${String(nextVersion).padStart(3, "0")}.pdf`;
  const blob = await put(filename, pdfBuffer, {
    access: "public",
    contentType: "application/pdf",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const created = await prisma.document.create({
    data: {
      tenantId: session.user.tenantId,
      createdById: session.user.id,
      docType: "JOB_OFFER_PDF",
      url: blob.url,
      version: nextVersion,
      jobId,
    },
  });

  await prisma.job.update({
    where: { id: jobId },
    data: {
      jobOfferVersion: nextVersion,
      latestJobOfferDocId: created.id,
    },
  });

  return NextResponse.json({ document: created, url: blob.url, version: nextVersion });
}
