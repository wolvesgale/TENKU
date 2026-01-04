import { prisma } from "@/lib/prisma";
import { Program } from "@prisma/client";

export type ProgramFilter = "ALL" | "TITP" | "SSW" | "TA";

const programFilter = (program?: ProgramFilter) => (program && program !== "ALL" ? { program: program as Program } : {});

export async function getDashboardSummary(tenantId: string, program?: ProgramFilter) {
  const [caseCount, taskCount, alertCount, recentLogs] = await Promise.all([
    prisma.case.count({ where: { tenantId, ...programFilter(program) } }),
    prisma.task.count({
      where: {
        tenantId,
        status: { not: "DONE" as any },
        case: program ? { program: program === "ALL" ? undefined : (program as Program) } : undefined,
      },
    }),
    prisma.alert.count({ where: { tenantId } }),
    prisma.log.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return { caseCount, taskCount, alertCount, recentLogs };
}

export async function listPersons(tenantId: string, program?: ProgramFilter) {
  return prisma.person.findMany({ where: { tenantId, ...programFilter(program) }, include: { company: true } });
}

export async function getPerson(id: string, tenantId: string) {
  return prisma.person.findFirst({
    where: { id, tenantId },
    include: { company: true, statusHistory: { orderBy: { effectiveDate: "desc" } }, cases: true, documents: true },
  });
}

export async function listCompanies(tenantId: string) {
  return prisma.company.findMany({ where: { tenantId }, include: { org: true, cases: true } });
}

export async function getCompany(id: string, tenantId?: string) {
  return prisma.company.findFirst({ where: { id, tenantId }, include: { org: true, persons: true, jobs: true, cases: true } });
}

export async function listOrgs(tenantId: string) {
  return prisma.organization.findMany({ where: { tenantId }, include: { companies: true, jobs: true } });
}

export async function getOrg(id: string, tenantId?: string) {
  return prisma.organization.findFirst({ where: { id, tenantId }, include: { companies: true, jobs: true, users: true } });
}

export async function listJobs(tenantId: string, program?: ProgramFilter) {
  return prisma.job.findMany({ where: { tenantId, ...programFilter(program) }, include: { company: true, assignedOrg: true } });
}

export async function getJob(id: string, tenantId?: string) {
  return prisma.job.findFirst({ where: { id, tenantId }, include: { company: true, assignedOrg: true, documents: true, cases: true } });
}

export async function listCases(tenantId: string, program?: ProgramFilter) {
  return prisma.case.findMany({ where: { tenantId, ...programFilter(program) }, include: { company: true, person: true, job: true } });
}

export async function getCase(id: string, tenantId?: string) {
  return prisma.case.findFirst({ where: { id, tenantId }, include: { company: true, person: true, job: true, tasks: true, documents: true } });
}

export async function listTasks(tenantId: string, program?: ProgramFilter) {
  return prisma.task.findMany({
    where: {
      tenantId,
      case: program ? { program: program === "ALL" ? undefined : (program as Program) } : undefined,
    },
    include: { case: true },
  });
}

export async function listDocuments(tenantId: string) {
  return prisma.document.findMany({ where: { tenantId }, include: { case: true, job: true, person: true } });
}

export async function listLogs(tenantId: string) {
  return prisma.log.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } });
}
