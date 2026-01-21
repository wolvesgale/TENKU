import { NextRequest, NextResponse } from "next/server";
import { getMonitoringLogs, listOrganizationsByType, store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const personId = searchParams.get("personId") || undefined;
  const companyId = searchParams.get("companyId") || undefined;
  const month = searchParams.get("month") || undefined;

  const persons = store.persons.map((p) => ({
    id: p.id,
    fullName: p.fullName,
    foreignerId: p.foreignerId,
    currentCompanyId: p.currentCompanyId,
  }));
  const companies = store.companies.map((c) => ({ id: c.id, name: c.name }));
  const supervisors = listOrganizationsByType("SUPPORT").map((o) => ({ id: o.id, displayName: o.displayName }));
  const monitoringLogs = getMonitoringLogs({ personId, companyId, month }).map((log) => ({
    id: log.id,
    date: log.date,
    personId: log.personId,
    companyId: log.companyId,
    supervisorId: log.supervisorId,
    overtimeHours: log.overtimeHours,
    memo: log.memo,
  }));

  return NextResponse.json({ persons, companies, supervisors, monitoringLogs });
}
