import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const company = await prisma.company.findFirst({ where: { id: params.id, tenantId: session.user.tenantId }, include: { persons: true, jobs: true, cases: true } });
  if (!company) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ data: company });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json();
  const updated = await prisma.company.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ data: updated });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await prisma.company.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
