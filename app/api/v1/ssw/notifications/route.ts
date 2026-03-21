import { NextRequest, NextResponse } from "next/server";
import { listSswNotifications, addSswNotification } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const personId = req.nextUrl.searchParams.get("personId") ?? undefined;
  return NextResponse.json({ data: listSswNotifications(personId) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addSswNotification({
    personId: body.personId,
    companyId: body.companyId,
    notifType: body.notifType ?? "regular",
    category: body.category,
    dueDate: body.dueDate,
    submittedDate: body.submittedDate,
    status: body.status ?? "pending",
    memo: body.memo,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
