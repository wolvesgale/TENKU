import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocumentType } from "@prisma/client";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const job = await prisma.job.findFirst({ where: { id: params.id, tenantId: session.user.tenantId }, include: { company: true } });
  if (!job) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const requestedOrgId = body?.orgId as string | undefined;
  const resolvedOrgId = requestedOrgId || job.assignedOrgId || job.company?.defaultOrgId || (session.user as any).orgId;
  if (!resolvedOrgId) return NextResponse.json({ error: "org not resolved" }, { status: 422 });

  const nextVersion = job.jobOfferVersion + 1;
  const url = `https://demo.tenku.cloud/job-offer/${job.id}/v${nextVersion}`;

  const doc = await prisma.document.create({
    data: {
      title: `${job.title} Job Offer v${nextVersion}`,
      docType: DocumentType.JOB_OFFER_PDF,
      url,
      version: nextVersion,
      tenantId: session.user.tenantId,
      jobId: job.id,
      createdById: (session.user as any).id,
    },
  });

  const updatedJob = await prisma.job.update({
    where: { id: job.id },
    data: { jobOfferVersion: nextVersion, latestJobOfferDocId: doc.id, assignedOrgId: resolvedOrgId },
  });

  return NextResponse.json({ document: doc, job: updatedJob });
}
