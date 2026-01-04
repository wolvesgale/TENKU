import { PrismaClient, Program, OrgType, CaseStatus, TaskStatus, DocumentType, AlertSeverity } from "@prisma/client";
import bcrypt from "bcryptjs";

export const seedPrisma = new PrismaClient();

export async function runSeed() {
  const tenant = await seedPrisma.tenant.upsert({
    where: { code: "240224" },
    update: {},
    create: { id: "tenant1", name: "TENKU Support Agency", code: "240224" },
  });

  const password = await bcrypt.hash(process.env.SEED_DEMO_PASSWORD ?? "techtas720", 10);
  const email = process.env.SEED_DEMO_EMAIL ?? "support@techtas.jp";

  const supervisor = await seedPrisma.organization.upsert({
    where: { id: "org-supervisor" },
    update: {},
    create: { id: "org-supervisor", name: "Stratus Supervisory", orgType: OrgType.SUPERVISOR, tenantId: tenant.id },
  });
  const support = await seedPrisma.organization.upsert({
    where: { id: "org-support" },
    update: {},
    create: { id: "org-support", name: "Nimbus Support", orgType: OrgType.SUPPORT, tenantId: tenant.id },
  });
  const sending = await seedPrisma.organization.upsert({
    where: { id: "org-sending" },
    update: {},
    create: { id: "org-sending", name: "SkyBridge HR", orgType: OrgType.SENDING, tenantId: tenant.id },
  });
  const training = await seedPrisma.organization.upsert({
    where: { id: "org-training" },
    update: {},
    create: { id: "org-training", name: "Aurora Training", orgType: OrgType.TRAINING, tenantId: tenant.id },
  });

  const user = await seedPrisma.user.upsert({
    where: { email },
    update: {},
    create: {
      id: "user-demo",
      email,
      name: "TENKU Demo User",
      password,
      tenantId: tenant.id,
      orgId: support.id,
    },
  });

  const companyA = await seedPrisma.company.upsert({
    where: { id: "company-01" },
    update: {},
    create: {
      id: "company-01",
      name: "Orion Robotics",
      location: "Hokkaido, Sapporo",
      tenantId: tenant.id,
      defaultOrgId: supervisor.id,
    },
  });
  const companyB = await seedPrisma.company.upsert({
    where: { id: "company-02" },
    update: {},
    create: {
      id: "company-02",
      name: "Aster Foods",
      location: "Osaka, Suita",
      tenantId: tenant.id,
      defaultOrgId: support.id,
    },
  });

  await seedPrisma.person.createMany({
    data: [
      { id: "person-01", fullName: "Linh Truong", nationality: "VN", program: Program.TITP, tenantId: tenant.id, companyId: companyA.id },
      { id: "person-02", fullName: "Rafi Putra", nationality: "ID", program: Program.SSW, tenantId: tenant.id, companyId: companyA.id },
      { id: "person-03", fullName: "Amara Singh", nationality: "NP", program: Program.TA, tenantId: tenant.id, companyId: companyB.id },
      { id: "person-04", fullName: "Kai Morales", nationality: "PH", program: Program.SSW, tenantId: tenant.id, companyId: companyB.id },
      { id: "person-05", fullName: "Munkh Bileg", nationality: "MN", program: Program.TITP, tenantId: tenant.id, companyId: companyB.id },
    ],
    skipDuplicates: true,
  });

  await seedPrisma.personStatusHistory.createMany({
    data: [
      { id: "psh-01", personId: "person-01", status: "Arrived", program: Program.TITP, effectiveDate: new Date("2024-07-01"), tenantId: tenant.id },
      { id: "psh-02", personId: "person-02", status: "Interview", program: Program.SSW, effectiveDate: new Date("2024-07-10"), tenantId: tenant.id },
      { id: "psh-03", personId: "person-03", status: "Training", program: Program.TA, effectiveDate: new Date("2024-07-12"), tenantId: tenant.id },
    ],
    skipDuplicates: true,
  });

  await seedPrisma.job.createMany({
    data: [
      { id: "job-01", title: "Factory Automation Operator", program: Program.TITP, companyId: companyA.id, tenantId: tenant.id, assignedOrgId: supervisor.id },
      { id: "job-02", title: "Food Safety Specialist", program: Program.SSW, companyId: companyB.id, tenantId: tenant.id, assignedOrgId: support.id },
      { id: "job-03", title: "Warehouse Coordinator", program: Program.TA, companyId: companyA.id, tenantId: tenant.id, assignedOrgId: supervisor.id },
    ],
    skipDuplicates: true,
  });

  await seedPrisma.case.createMany({
    data: [
      { id: "case-01", title: "TITP Plan Submission", program: Program.TITP, caseType: "titp_plan_application", status: CaseStatus.IN_REVIEW, companyId: companyA.id, personId: "person-01", jobId: "job-01", tenantId: tenant.id, ownerId: user.id },
      { id: "case-02", title: "SSW Support Plan", program: Program.SSW, caseType: "ssw_support_plan_and_imm", status: CaseStatus.DRAFT, companyId: companyB.id, personId: "person-04", jobId: "job-02", tenantId: tenant.id, ownerId: user.id },
      { id: "case-03", title: "Status Change for TA", program: Program.TA, caseType: "imm_change_status_ta_for_ssw", status: CaseStatus.DRAFT, companyId: companyB.id, personId: "person-03", jobId: "job-03", tenantId: tenant.id, ownerId: user.id },
      { id: "case-04", title: "Pre-arrival Checks", program: Program.TITP, caseType: "titp_plan_application", status: CaseStatus.SUBMITTED, companyId: companyA.id, personId: "person-02", jobId: "job-01", tenantId: tenant.id, ownerId: user.id },
      { id: "case-05", title: "SSW Extension", program: Program.SSW, caseType: "ssw_support_plan_and_imm", status: CaseStatus.IN_REVIEW, companyId: companyB.id, personId: "person-05", jobId: "job-02", tenantId: tenant.id, ownerId: user.id },
    ],
    skipDuplicates: true,
  });

  await seedPrisma.task.createMany({
    data: [
      { id: "task-01", title: "Kickoff with company", dueDate: new Date("2024-08-05"), status: TaskStatus.IN_PROGRESS, tenantId: tenant.id, caseId: "case-01" },
      { id: "task-02", title: "Collect documents", dueDate: new Date("2024-08-10"), status: TaskStatus.TODO, tenantId: tenant.id, caseId: "case-02" },
      { id: "task-03", title: "Submit application", dueDate: new Date("2024-08-18"), status: TaskStatus.TODO, tenantId: tenant.id, caseId: "case-03" },
    ],
    skipDuplicates: true,
  });

  await seedPrisma.document.createMany({
    data: [
      { id: "doc-01", title: "Job Offer v1", docType: DocumentType.JOB_OFFER_PDF, url: "https://demo.tenku.cloud/docs/job-01-v1.pdf", version: 1, tenantId: tenant.id, jobId: "job-01", createdById: user.id },
      { id: "doc-02", title: "Support Plan Draft", docType: DocumentType.OTHER, url: "https://demo.tenku.cloud/docs/support-plan.pdf", version: 1, tenantId: tenant.id, caseId: "case-02", createdById: user.id },
    ],
    skipDuplicates: true,
  });

  await seedPrisma.log.createMany({
    data: [
      { id: "log-01", entityType: "CASE", entityId: "case-01", message: "Draft created", tenantId: tenant.id, userId: user.id },
      { id: "log-02", entityType: "JOB", entityId: "job-01", message: "Job offer generated", tenantId: tenant.id, userId: user.id },
    ],
    skipDuplicates: true,
  });

  await seedPrisma.alert.createMany({
    data: [
      { id: "alert-01", title: "Document due in 3 days", severity: AlertSeverity.WARN, tenantId: tenant.id, entityType: "CASE", entityId: "case-01" },
      { id: "alert-02", title: "Task overdue", severity: AlertSeverity.CRITICAL, tenantId: tenant.id, entityType: "TASK", entityId: "task-02" },
    ],
    skipDuplicates: true,
  });

  await seedPrisma.scheduleEvent.createMany({
    data: [
      { id: "sch-01", title: "Pre-arrival orientation", startDate: new Date("2024-08-02"), endDate: new Date("2024-08-03"), program: Program.TITP, entityType: "CASE", entityId: "case-01", tenantId: tenant.id },
      { id: "sch-02", title: "Immigration submission", startDate: new Date("2024-08-18"), endDate: new Date("2024-08-18"), program: Program.SSW, entityType: "CASE", entityId: "case-02", tenantId: tenant.id },
    ],
    skipDuplicates: true,
  });
}

if (require.main === module) {
  runSeed()
    .then(() => {
      console.log("Seed completed");
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await seedPrisma.$disconnect();
    });
}
