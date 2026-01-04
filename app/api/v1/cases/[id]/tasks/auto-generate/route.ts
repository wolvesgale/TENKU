import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTasks } from "@/lib/task-rules";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const theCase = await prisma.case.findFirst({ where: { id: params.id, tenantId: session.user.tenantId } });
  if (!theCase) return NextResponse.json({ error: "not found" }, { status: 404 });

  const generated = generateTasks(theCase.caseType, theCase.program);
  const created = await prisma.$transaction(
    generated.map((g) =>
      prisma.task.create({
        data: {
          title: g.title,
          dueDate: g.dueDate,
          status: g.status,
          ruleSnapshot: g.ruleSnapshot,
          caseId: theCase.id,
          tenantId: session.user!.tenantId!,
        },
      })
    )
  );

  return NextResponse.json({ tasks: created });
}
