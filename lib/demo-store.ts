import { randomUUID } from "crypto";

export type Program = "TITP" | "SSW" | "TA" | "ALL";
export type CaseStatus = "OPEN" | "IN_PROGRESS" | "DONE";
export type TaskStatus = "TODO" | "DOING" | "DONE";
export type AlertStatus = "OPEN" | "SNOOZED" | "DONE";
export type ApplicationStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export type Tenant = { id: string; code: string; name: string };
export type Organization = { id: string; tenantId: string; orgType: string; displayName: string };
export type Company = {
  id: string;
  tenantId: string;
  name: string;
  address?: string;
  defaultOrgId?: string;
  defaultOrgType?: string;
};
export type Person = {
  id: string;
  tenantId: string;
  fullName: string;
  nationality?: string;
  nativeLanguage?: string;
  birthDate?: string;
  currentCompanyId?: string;
  currentProgram?: Program | string;
  residenceCardExpiry?: string;
  passportExpiry?: string;
  metaJson?: any;
};
export type PersonStatusHistory = {
  id: string;
  tenantId: string;
  personId: string;
  program: Program | string;
  residenceStatus?: string;
  startDate: string;
  endDate?: string;
  metaJson?: any;
};
export type Case = {
  id: string;
  tenantId: string;
  program: Program | string;
  caseType: string;
  status: CaseStatus | string;
  personId: string;
  companyId?: string;
  ownerOrgId?: string;
  dueDate?: string;
  metaJson?: any;
};
export type Task = {
  id: string;
  tenantId: string;
  caseId?: string;
  personId?: string;
  companyId?: string;
  taskType: string;
  status: TaskStatus;
  dueDate?: string;
  createdBy?: string;
  ruleSnapshot?: any;
};
export type Alert = {
  id: string;
  tenantId: string;
  alertType: string;
  severity: "high" | "med" | "low";
  targetType: string;
  targetId: string;
  status: AlertStatus;
  threshold?: string;
  createdAt: string;
  updatedAt: string;
};

export type JobRecord = {
  id: string;
  tenantId: string;
  companyId: string;
  title: string;
  workLocation?: string;
  salary?: string;
  notes?: string;
  occupation?: string;
  description?: string;
  benefits?: string;
  employmentType?: string;
  requirements?: string;
  applicationDeadline?: string;
};

export type Application = {
  id: string;
  tenantId: string;
  personId?: string;
  companyId?: string;
  caseId?: string;
  applicationType: string;
  status: ApplicationStatus;
  submittedAt?: string;
  documentUrl?: string;
  metadata?: any;
};

export type TrainingPlan = {
  id: string;
  tenantId: string;
  personId?: string;
  companyId?: string;
  orgId?: string;
  planType: string;
  status: ApplicationStatus | "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  plannedStart?: string;
  plannedEnd?: string;
  documentUrl?: string;
  metadata?: any;
};

export type ExpiryThresholds = {
  residenceCardExpiryDays: number;
  passportExpiryDays: number;
};

export type TenantSettings = {
  tenantId: string;
  expiryThresholds: ExpiryThresholds;
  updatedAt: string;
};

export const DEFAULT_EXPIRY_THRESHOLDS: ExpiryThresholds = {
  residenceCardExpiryDays: 60,
  passportExpiryDays: 90,
};

const tenant: Tenant = { id: "tenant_demo", code: "TENKU_DEMO", name: "TENKU Demo Tenant" };
const organizations: Organization[] = [
  { id: "org_support", tenantId: tenant.id, orgType: "SUPPORT", displayName: "TENKU支援機関" },
  { id: "org_sending", tenantId: tenant.id, orgType: "SENDING", displayName: "SkyBridge HR" },
];
const companies: Company[] = [
  { id: "cmp-001", tenantId: tenant.id, name: "Orion Logistics", address: "北海道 札幌市", defaultOrgId: "org_support", defaultOrgType: "SUPPORT" },
  { id: "cmp-002", tenantId: tenant.id, name: "Aster Foods", address: "宮城県 仙台市", defaultOrgId: "org_support", defaultOrgType: "SUPPORT" },
  { id: "cmp-003", tenantId: tenant.id, name: "Nova Robotics", address: "愛知県 名古屋市", defaultOrgId: "org_support", defaultOrgType: "SUPPORT" },
];
const persons: Person[] = [
  {
    id: "prs-001",
    tenantId: tenant.id,
    fullName: "Linh Truong",
    nationality: "ベトナム",
    nativeLanguage: "Vietnamese",
    currentProgram: "TITP",
    currentCompanyId: "cmp-001",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 200).toISOString(),
  },
  {
    id: "prs-002",
    tenantId: tenant.id,
    fullName: "Amara Singh",
    nationality: "フィリピン",
    nativeLanguage: "Tagalog",
    currentProgram: "SSW",
    currentCompanyId: "cmp-002",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100).toISOString(),
  },
  {
    id: "prs-003",
    tenantId: tenant.id,
    fullName: "Rafi Putra",
    nationality: "インドネシア",
    nativeLanguage: "Indonesian",
    currentProgram: "TA",
    currentCompanyId: "cmp-003",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "prs-004",
    tenantId: tenant.id,
    fullName: "Munkh Bileg",
    nationality: "モンゴル",
    nativeLanguage: "Mongolian",
    currentProgram: "TITP",
    currentCompanyId: "cmp-001",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 400).toISOString(),
  },
  {
    id: "prs-005",
    tenantId: tenant.id,
    fullName: "Sara Kim",
    nationality: "韓国",
    nativeLanguage: "Korean",
    currentProgram: "SSW",
    currentCompanyId: "cmp-002",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 75).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
];

const statusHistory: PersonStatusHistory[] = persons.map((p) => ({
  id: randomUUID(),
  tenantId: tenant.id,
  personId: p.id,
  program: (p.currentProgram as Program) || "TITP",
  residenceStatus: "active",
  startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
}));

const cases: Case[] = [
  {
    id: "case-001",
    tenantId: tenant.id,
    program: "TITP",
    caseType: "titp_plan_application",
    status: "OPEN",
    personId: "prs-001",
    companyId: "cmp-001",
    ownerOrgId: "org_support",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString(),
  },
  {
    id: "case-002",
    tenantId: tenant.id,
    program: "SSW",
    caseType: "ssw_periodic_notification",
    status: "IN_PROGRESS",
    personId: "prs-002",
    companyId: "cmp-002",
    ownerOrgId: "org_support",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
  {
    id: "case-003",
    tenantId: tenant.id,
    program: "TA",
    caseType: "imm_change_status_ta_for_ssw",
    status: "OPEN",
    personId: "prs-003",
    companyId: "cmp-003",
    ownerOrgId: "org_support",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: "case-004",
    tenantId: tenant.id,
    program: "TITP",
    caseType: "imm_renew_status_titp",
    status: "DONE",
    personId: "prs-004",
    companyId: "cmp-001",
    ownerOrgId: "org_support",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "case-005",
    tenantId: tenant.id,
    program: "SSW",
    caseType: "ssw_regular_interview",
    status: "OPEN",
    personId: "prs-005",
    companyId: "cmp-002",
    ownerOrgId: "org_support",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 65).toISOString(),
  },
];

const tasks: Task[] = [];
const alerts: Alert[] = [];
const jobs: JobRecord[] = [
  {
    id: "job-001",
    tenantId: tenant.id,
    companyId: "cmp-001",
    title: "ライン作業スタッフ",
    workLocation: "北海道札幌市",
    salary: "月給20万円~",
    occupation: "製造",
    employmentType: "full_time",
  },
];
const applications: Application[] = [
  {
    id: "app-001",
    tenantId: tenant.id,
    personId: "prs-001",
    companyId: "cmp-001",
    caseId: "case-001",
    applicationType: "residence_certificate",
    status: "DRAFT",
  },
];
const trainingPlans: TrainingPlan[] = [
  {
    id: "plan-001",
    tenantId: tenant.id,
    personId: "prs-002",
    companyId: "cmp-002",
    orgId: "org_support",
    planType: "skill_practice_plan",
    status: "DRAFT",
  },
];
const tenantSettings: TenantSettings[] = [
  { tenantId: tenant.id, expiryThresholds: { ...DEFAULT_EXPIRY_THRESHOLDS }, updatedAt: new Date().toISOString() },
];

function filterProgram<T extends { program?: string }>(items: T[], program?: Program | string) {
  if (!program || program === "ALL") return items;
  return items.filter((i) => i.program === program);
}

export const store = {
  tenant,
  organizations,
  companies,
  persons,
  statusHistory,
  cases,
  tasks,
  alerts,
  jobs,
  applications,
  trainingPlans,
  tenantSettings,
};

function ensureTenantSettings(tenantId: string): TenantSettings {
  const found = tenantSettings.find((s) => s.tenantId === tenantId);
  if (found) return found;
  const created: TenantSettings = {
    tenantId,
    expiryThresholds: { ...DEFAULT_EXPIRY_THRESHOLDS },
    updatedAt: new Date().toISOString(),
  };
  tenantSettings.push(created);
  return created;
}

export function getTenantSettings(tenantId: string) {
  return ensureTenantSettings(tenantId);
}

export function updateTenantSettings(tenantId: string, updates: Partial<ExpiryThresholds>) {
  const current = ensureTenantSettings(tenantId);
  const updated: TenantSettings = {
    ...current,
    expiryThresholds: { ...current.expiryThresholds, ...updates },
    updatedAt: new Date().toISOString(),
  };
  const idx = tenantSettings.findIndex((s) => s.tenantId === tenantId);
  if (idx === -1) {
    tenantSettings.push(updated);
  } else {
    tenantSettings[idx] = updated;
  }
  return updated;
}

export function getExpiryThresholds(tenantId: string) {
  return ensureTenantSettings(tenantId).expiryThresholds;
}

export function addPerson(input: Omit<Person, "id" | "tenantId">): Person {
  const person: Person = { id: randomUUID(), tenantId: tenant.id, ...input };
  persons.push(person);
  return person;
}

export function updatePerson(id: string, data: Partial<Person>): Person | null {
  const idx = persons.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  persons[idx] = { ...persons[idx], ...data };
  return persons[idx];
}

export function addCompany(input: Omit<Company, "id" | "tenantId">): Company {
  const company: Company = { id: randomUUID(), tenantId: tenant.id, ...input };
  companies.push(company);
  return company;
}

export function updateCompany(id: string, data: Partial<Company>): Company | null {
  const idx = companies.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  companies[idx] = { ...companies[idx], ...data };
  return companies[idx];
}

export function addStatus(personId: string, input: Omit<PersonStatusHistory, "id" | "tenantId" | "personId">) {
  const item: PersonStatusHistory = { id: randomUUID(), tenantId: tenant.id, personId, ...input };
  statusHistory.push(item);
  return item;
}

export function addCase(input: Omit<Case, "id" | "tenantId">): Case {
  const item: Case = { id: randomUUID(), tenantId: tenant.id, ...input };
  cases.push(item);
  return item;
}

export function updateCase(id: string, data: Partial<Case>): Case | null {
  const idx = cases.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  cases[idx] = { ...cases[idx], ...data };
  return cases[idx];
}

export function upsertAlert(key: { alertType: string; targetId: string; threshold?: string }, payload: Omit<Alert, "id" | "createdAt" | "updatedAt">) {
  const found = alerts.find(
    (a) => a.alertType === key.alertType && a.targetId === key.targetId && a.threshold === key.threshold && a.tenantId === payload.tenantId,
  );
  if (found) {
    Object.assign(found, payload, { updatedAt: new Date().toISOString() });
    return found;
  }
  const alert: Alert = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...payload,
  };
  alerts.push(alert);
  return alert;
}

export function updateAlert(id: string, data: Partial<Alert>): Alert | null {
  const idx = alerts.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  alerts[idx] = { ...alerts[idx], ...data, updatedAt: new Date().toISOString() };
  return alerts[idx];
}

export function addTask(input: Omit<Task, "id" | "tenantId">): Task {
  const task: Task = { id: randomUUID(), tenantId: tenant.id, ...input };
  tasks.push(task);
  return task;
}

export function updateTask(id: string, data: Partial<Task>): Task | null {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...data };
  return tasks[idx];
}

export function listPersons(program?: Program | string) {
  if (!program || program === "ALL") return persons;
  return persons.filter((p) => p.currentProgram === program);
}

export function listCases(program?: Program | string) {
  return filterProgram(cases, program);
}

export function listTasks(program?: Program | string) {
  if (!program || program === "ALL") return tasks;
  const personIds = persons.filter((p) => p.currentProgram === program).map((p) => p.id);
  return tasks.filter((t) => (t.personId && personIds.includes(t.personId)) || t.caseId === undefined);
}

export function addJob(input: Omit<JobRecord, "id" | "tenantId">): JobRecord {
  const record: JobRecord = { id: randomUUID(), tenantId: tenant.id, ...input };
  jobs.push(record);
  return record;
}

export function updateJob(id: string, data: Partial<JobRecord>): JobRecord | null {
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) return null;
  jobs[idx] = { ...jobs[idx], ...data };
  return jobs[idx];
}

export function listJobs() {
  return jobs;
}

export function addApplication(input: Omit<Application, "id" | "tenantId">): Application {
  const item: Application = { id: randomUUID(), tenantId: tenant.id, ...input };
  applications.push(item);
  return item;
}

export function updateApplication(id: string, data: Partial<Application>): Application | null {
  const idx = applications.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  applications[idx] = { ...applications[idx], ...data };
  return applications[idx];
}

export function listApplications() {
  return applications;
}

export function addTrainingPlan(input: Omit<TrainingPlan, "id" | "tenantId">): TrainingPlan {
  const item: TrainingPlan = { id: randomUUID(), tenantId: tenant.id, ...input };
  trainingPlans.push(item);
  return item;
}

export function updateTrainingPlan(id: string, data: Partial<TrainingPlan>): TrainingPlan | null {
  const idx = trainingPlans.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  trainingPlans[idx] = { ...trainingPlans[idx], ...data };
  return trainingPlans[idx];
}

export function listTrainingPlans() {
  return trainingPlans;
}

export function importJobsFromCsv(csv: string) {
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.trim());
  const created: JobRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const row: Record<string, string> = {};
    header.forEach((h, idx) => {
      row[h] = cols[idx] ?? "";
    });
    if (!row.title || !row.companyId) continue;
    created.push(
      addJob({
        companyId: row.companyId,
        title: row.title,
        workLocation: row.workLocation,
        salary: row.salary,
        notes: row.notes,
        occupation: row.occupation,
        description: row.description,
        benefits: row.benefits,
        employmentType: row.employmentType,
        requirements: row.requirements,
        applicationDeadline: row.applicationDeadline,
      }),
    );
  }
  return created;
}

export function calculateAlerts() {
  const now = Date.now();
  const expiryThresholds = getExpiryThresholds(tenant.id);
  const residenceThresholdLabel = `${expiryThresholds.residenceCardExpiryDays}d`;
  const passportThresholdLabel = `${expiryThresholds.passportExpiryDays}d`;
  persons.forEach((p) => {
    if (p.residenceCardExpiry) {
      const diff = new Date(p.residenceCardExpiry).getTime() - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days <= expiryThresholds.residenceCardExpiryDays) {
        upsertAlert(
          { alertType: "residence_expiry", targetId: p.id, threshold: residenceThresholdLabel },
          {
            tenantId: tenant.id,
            alertType: "residence_expiry",
            severity: "high",
            targetType: "person",
            targetId: p.id,
            status: "OPEN",
            threshold: residenceThresholdLabel,
          },
        );
      }
    }
    if (p.passportExpiry) {
      const diff = new Date(p.passportExpiry).getTime() - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days <= expiryThresholds.passportExpiryDays) {
        upsertAlert(
          { alertType: "passport_expiry", targetId: p.id, threshold: passportThresholdLabel },
          {
            tenantId: tenant.id,
            alertType: "passport_expiry",
            severity: "med",
            targetType: "person",
            targetId: p.id,
            status: "OPEN",
            threshold: passportThresholdLabel,
          },
        );
      }
    }
  });
  cases.forEach((c) => {
    if (c.dueDate && c.status !== "DONE") {
      const diff = new Date(c.dueDate).getTime() - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days <= 30) {
        upsertAlert(
          { alertType: "case_due", targetId: c.id, threshold: "30d" },
          { tenantId: tenant.id, alertType: "case_due", severity: "high", targetType: "case", targetId: c.id, status: "OPEN", threshold: "30d" },
        );
      }
    }
  });
  return alerts;
}

const baseRules = [
  { taskType: "case_kickoff", offsetDays: 1 },
  { taskType: "deadline_watch", offsetDays: -14 },
  { taskType: "final_review", offsetDays: -3 },
  { taskType: "submit_or_file", offsetDays: 0 },
  { taskType: "post_submit_log", offsetDays: 1 },
];

const caseSpecific: Record<string, { taskType: string; offsetDays: number }[]> = {
  titp_plan_application: [
    { taskType: "titp_plan_application", offsetDays: -7 },
    { taskType: "imm_renew_status_titp", offsetDays: -30 },
  ],
  imm_renew_status_titp: [{ taskType: "imm_renew_status_titp", offsetDays: -60 }],
  ssw_support_plan_and_imm: [{ taskType: "ssw_support_plan_and_imm", offsetDays: -20 }],
  ssw_periodic_notification: [{ taskType: "ssw_periodic_notification", offsetDays: -14 }],
  ssw_regular_interview: [{ taskType: "ssw_regular_interview", offsetDays: -10 }],
  imm_change_status_ta_for_ssw: [{ taskType: "imm_change_status_ta_for_ssw", offsetDays: -25 }],
  ta_progress_management: [{ taskType: "ta_progress_management", offsetDays: -15 }],
  imm_change_status_ssw_from_ta: [{ taskType: "imm_change_status_ssw_from_ta", offsetDays: -35 }],
};

function calcDate(base: string | undefined, offsetDays: number) {
  if (!base) return undefined;
  const d = new Date(base);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
}

export function autoGenerateTasks(caseId: string) {
  const target = cases.find((c) => c.id === caseId);
  if (!target) return [];
  const ruleSet = [...baseRules, ...(caseSpecific[target.caseType] ?? [])];
  const created: Task[] = [];
  ruleSet.forEach((rule) => {
    const dueDate = calcDate(target.dueDate, rule.offsetDays);
    const exists = tasks.find(
      (t) => t.caseId === caseId && t.taskType === rule.taskType && t.dueDate === dueDate && t.tenantId === tenant.id,
    );
    if (exists) return;
    const task = addTask({
      caseId,
      personId: target.personId,
      companyId: target.companyId,
      taskType: rule.taskType,
      status: "TODO",
      dueDate,
      ruleSnapshot: { caseType: target.caseType, offsetDays: rule.offsetDays },
    });
    created.push(task);
  });
  return created;
}

calculateAlerts();
