import { NextRequest, NextResponse } from "next/server";
import { DocumentType } from "@prisma/client";
import { put } from "@vercel/blob";
import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { JobOfferPdf } from "@/lib/pdf/job-offer-template";
import { renderPdfToBuffer } from "@/lib/pdf/render";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
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

  const data: Parameters<typeof JobOfferPdf>[0]["data"] = {
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

  const pdfBuffer = await renderPdfToBuffer(<JobOfferPdf data={data} />);

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
      docType: DocumentType.JOB_OFFER_PDF,
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
