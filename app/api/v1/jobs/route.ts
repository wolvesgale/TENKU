import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Program } from "@prisma/client";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const program = searchParams.get("program");
  const jobs = await prisma.job.findMany({
    where: { tenantId: session.user.tenantId, ...(program && program !== "ALL" ? { program: program as Program } : {}) },
    include: { company: true, assignedOrg: true },
  });
  return NextResponse.json({ data: jobs });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json();
  const created = await prisma.job.create({ data: { ...body, tenantId: session.user.tenantId } });
  return NextResponse.json({ data: created }, { status: 201 });
}
