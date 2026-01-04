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
  const where = { tenantId: session.user.tenantId, ...(program && program !== "ALL" ? { program: program as Program } : {}) };
  const persons = await prisma.person.findMany({ where, include: { company: true } });
  return NextResponse.json({ data: persons });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json();
  const person = await prisma.person.create({
    data: {
      fullName: body.fullName,
      nationality: body.nationality,
      program: body.program,
      companyId: body.companyId || null,
      tenantId: session.user.tenantId,
    },
  });
  return NextResponse.json({ data: person }, { status: 201 });
}
