import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const orgs = await prisma.organization.findMany({ where: { tenantId: session.user.tenantId } });
  return NextResponse.json({ data: orgs });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json();
  const created = await prisma.organization.create({ data: { name: body.name, orgType: body.orgType, tenantId: session.user.tenantId } });
  return NextResponse.json({ data: created }, { status: 201 });
}
