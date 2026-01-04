import { NextResponse } from "next/server";
import { companies, sendingAgencies, migrants, tasks, documents, templateMonitors, ganttSchedule } from "@/lib/mockData";

const registry: Record<string, any> = {
  companies,
  "sending-agencies": sendingAgencies,
  migrants,
  tasks,
  documents,
  templates: templateMonitors,
  schedule: ganttSchedule,
};

export async function GET(_: Request, { params }: { params: { resource: string } }) {
  const data = registry[params.resource];
  if (!data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(data);
}
