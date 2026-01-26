import { randomUUID } from "crypto";

export type Program = "TITP" | "SSW" | "TA" | "ALL";
export type CaseStatus = "OPEN" | "IN_PROGRESS" | "DONE";
export type TaskStatus = "TODO" | "DOING" | "DONE";
export type AlertStatus = "OPEN" | "SNOOZED" | "DONE";
export type ApplicationStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
export type OrganizationType = "SUPPORT" | "SENDING";

export type Tenant = { id: string; code: string; name: string };
export type Organization = { id: string; tenantId: string; orgType: OrganizationType; displayName: string };
export type DemoOrganizationProfile = {
  id: string;
  tenantId: string;
  permitNumber?: string;
  permitType?: string;
  name: string;
  address?: string;
  phone?: string;
  representativeName?: string;
  supervisorResponsibleName?: string;
  supervisingOfficeName?: string;
  supervisingOfficeAddress?: string;
  supervisingOfficePhone?: string;
  planInstructorName?: string;
  sendingOrgName?: string;
  sendingOrgNumber?: string;
  sendingOrgRefNumber?: string;
};
export type Company = {
  id: string;
  tenantId: string;
  name: string;
  nameKana?: string;
  notifAcceptanceNo?: string;
  address?: string;
  postalCode?: string;
  defaultOrgId?: string;
  defaultOrgType?: string;
  industryMajor?: string;
  industryMinor?: string;
  representativeKana?: string;
  representativeName?: string;
  corporateNumber?: string;
  phone?: string;
  contactName?: string;
  contactTel?: string;
  workplaceName?: string;
  workplaceNameKana?: string;
  workplaceAddress?: string;
  workplacePostalCode?: string;
  workplacePhone?: string;
  traineeResponsibleName?: string;
  traineeResponsibleRole?: string;
  traineeInstructorName?: string;
  traineeInstructorRole?: string;
  lifeInstructorName?: string;
  lifeInstructorRole?: string;
};
export type Person = {
  id: string;
  tenantId: string;
  foreignerId?: string;
  nickname?: string;
  nameKanji?: string;
  nameKana?: string;
  nameRoma?: string;
  nameRomaji?: string;
  gender?: string;
  displayLanguage?: string;
  residenceCardNumber?: string;
  residenceStart?: string;
  dormAddress?: string;
  arrivalDate?: string;
  assignmentDate?: string;
  employmentContractPeriod?: string;
  sendingOrgId?: string;
  certNumber1?: string;
  certDate1?: string;
  certNumber2?: string;
  certDate2?: string;
  certNumber3?: string;
  certDate3?: string;
  changeCertNumber?: string;
  changeCertDate?: string;
  traineeNoticeNumber?: string;
  traineeNoticeDate?: string;
  handlerName?: string;
  nextProcedure?: string;
  notes?: string;
  fullName: string;
  nationality?: string;
  nativeLanguage?: string;
  birthDate?: string;
  birthdate?: string;
  age?: number;
  returnPeriodFrom?: string;
  returnPeriodTo?: string;
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
  title?: string;
  severity?: "high" | "medium" | "low";
  relatedEntity?: string;
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
  category?: string;
  jobCode?: string;
  jobName?: string;
  workName?: string;
  freeEditOverrides?: Record<string, string>;
};

export type MonitoringLog = {
  id: string;
  tenantId: string;
  date: string;
  personId?: string;
  companyId?: string;
  supervisorId?: string;
  logType: "巡回" | "監査";
  overtimeHours?: number;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type MinorChangeNotice = {
  id: string;
  tenantId: string;
  month: string;
  companyId: string;
  supervisorId: string;
  details: any;
  createdAt: string;
  updatedAt: string;
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

const tenant: Tenant = { id: "tenant_demo", code: "TENKU_CLOUD_DEMO", name: "TENKU_Cloud Demo Tenant" };
const organizations: Organization[] = [
  { id: "org_support", tenantId: tenant.id, orgType: "SUPPORT", displayName: "TENKU_Cloud 監理団体" },
  { id: "org_sending", tenantId: tenant.id, orgType: "SENDING", displayName: "SkyBridge HR" },
];
const demoOrganizationProfile: DemoOrganizationProfile = {
  id: "demo-org-profile",
  tenantId: tenant.id,
  permitNumber: "23-監-00123",
  permitType: "一般",
  name: "TENKU監理協同組合",
  address: "東京都千代田区1-2-3",
  phone: "03-1234-5678",
  representativeName: "山田 太郎",
  supervisorResponsibleName: "佐藤 花子",
  supervisingOfficeName: "東京事業所",
  supervisingOfficeAddress: "東京都千代田区1-2-3",
  supervisingOfficePhone: "03-1234-5678",
  planInstructorName: "鈴木 一郎",
  sendingOrgName: "VietHope Sending",
  sendingOrgNumber: "VN-9988",
  sendingOrgRefNumber: "REF-2024-01",
};
const companies: Company[] = [
  {
    id: "cmp-001",
    tenantId: tenant.id,
    name: "Orion Logistics",
    nameKana: "オリオン ロジスティクス",
    address: "北海道 札幌市",
    postalCode: "060-0001",
    phone: "011-123-4567",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "物流",
    industryMinor: "倉庫内作業",
    contactName: "佐藤 彩",
    contactTel: "011-123-4567",
    representativeName: "佐藤 彩",
    representativeKana: "サトウ アヤ",
    corporateNumber: "1234567890123",
    notifAcceptanceNo: "実習届-001",
    workplaceName: "札幌第一物流センター",
    workplaceNameKana: "サッポロ ダイイチ ブツリュウセンター",
    workplaceAddress: "北海道札幌市中央区1-2-3",
    workplacePostalCode: "060-0001",
    workplacePhone: "011-123-4567",
    traineeResponsibleName: "吉田 進",
    traineeResponsibleRole: "実習責任者",
    traineeInstructorName: "伊藤 健",
    traineeInstructorRole: "技能実習指導員",
    lifeInstructorName: "青木 玲奈",
    lifeInstructorRole: "生活指導員",
  },
  {
    id: "cmp-002",
    tenantId: tenant.id,
    name: "Aster Foods",
    nameKana: "アスター フーズ",
    address: "宮城県 仙台市",
    postalCode: "980-0001",
    phone: "022-987-6543",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "食品製造",
    industryMinor: "惣菜製造",
    contactName: "田中 健",
    contactTel: "022-987-6543",
    representativeName: "田中 健",
    representativeKana: "タナカ ケン",
    corporateNumber: "9876543210987",
    notifAcceptanceNo: "実習届-002",
    workplaceName: "仙台食品工場",
    workplaceNameKana: "センダイ ショクヒン コウジョウ",
    workplaceAddress: "宮城県仙台市青葉区2-3-4",
    workplacePostalCode: "980-0001",
    workplacePhone: "022-987-6543",
    traineeResponsibleName: "木村 遥",
    traineeResponsibleRole: "実習責任者",
    traineeInstructorName: "森田 拓",
    traineeInstructorRole: "技能実習指導員",
    lifeInstructorName: "小川 沙織",
    lifeInstructorRole: "生活指導員",
  },
  {
    id: "cmp-003",
    tenantId: tenant.id,
    name: "Nova Robotics",
    nameKana: "ノヴァ ロボティクス",
    address: "愛知県 名古屋市",
    postalCode: "450-0001",
    phone: "052-555-1212",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "製造",
    industryMinor: "機械組立",
    contactName: "山本 瑞希",
    contactTel: "052-555-1212",
    representativeName: "山本 瑞希",
    representativeKana: "ヤマモト ミズキ",
    corporateNumber: "5555555555555",
    notifAcceptanceNo: "実習届-003",
    workplaceName: "名古屋ロボット工場",
    workplaceNameKana: "ナゴヤ ロボット コウジョウ",
    workplaceAddress: "愛知県名古屋市中村区5-6-7",
    workplacePostalCode: "450-0001",
    workplacePhone: "052-555-1212",
    traineeResponsibleName: "佐々木 海",
    traineeResponsibleRole: "実習責任者",
    traineeInstructorName: "池田 徹",
    traineeInstructorRole: "技能実習指導員",
    lifeInstructorName: "森下 純",
    lifeInstructorRole: "生活指導員",
  },
];
const persons: Person[] = [
  {
    id: "prs-001",
    tenantId: tenant.id,
    fullName: "Linh Truong",
    foreignerId: "FR-0001",
    nameKanji: "リン・チュオン",
    nameKana: "リン チュオン",
    nameRoma: "Linh Truong",
    nameRomaji: "Linh Truong",
    gender: "女性",
    displayLanguage: "日本語",
    nationality: "ベトナム",
    nativeLanguage: "Vietnamese",
    birthdate: "1998-04-12",
    age: 26,
    currentProgram: "TITP",
    currentCompanyId: "cmp-001",
    sendingOrgId: "org_sending",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 200).toISOString(),
    residenceCardNumber: "VN1234567",
    residenceStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
    dormAddress: "北海道札幌市中央区1-2-3",
    arrivalDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 240).toISOString(),
    assignmentDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 190).toISOString(),
    employmentContractPeriod: "2024/04/01〜2027/03/31",
    traineeNoticeNumber: "TRA-2024-001",
    traineeNoticeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
    handlerName: "伊藤 玲奈",
    nextProcedure: "技能検定（基礎級）申請",
    metaJson: { specialty: "物流", taskDetail: "検品・仕分け", passportNumber: "TR1234567" },
  },
  {
    id: "prs-002",
    tenantId: tenant.id,
    fullName: "Amara Singh",
    foreignerId: "FR-0002",
    nameKanji: "アマラ・シン",
    nameKana: "アマラ シン",
    nameRoma: "Amara Singh",
    nameRomaji: "Amara Singh",
    gender: "女性",
    displayLanguage: "日本語",
    nationality: "フィリピン",
    nativeLanguage: "Tagalog",
    birthdate: "1996-09-03",
    age: 28,
    currentProgram: "SSW",
    currentCompanyId: "cmp-002",
    sendingOrgId: "org_sending",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100).toISOString(),
    residenceCardNumber: "PH9876543",
    residenceStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300).toISOString(),
    dormAddress: "宮城県仙台市青葉区2-3-4",
    arrivalDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 340).toISOString(),
    assignmentDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 280).toISOString(),
    employmentContractPeriod: "2023/11/01〜2026/10/31",
    traineeNoticeNumber: "TRA-2023-091",
    traineeNoticeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 260).toISOString(),
    handlerName: "鈴木 直人",
    nextProcedure: "在留期間更新準備",
  },
  {
    id: "prs-003",
    tenantId: tenant.id,
    fullName: "Rafi Putra",
    foreignerId: "FR-0003",
    nameKanji: "ラフィ・プトラ",
    nameKana: "ラフィ プトラ",
    nameRoma: "Rafi Putra",
    nameRomaji: "Rafi Putra",
    gender: "男性",
    displayLanguage: "英語",
    nationality: "インドネシア",
    nativeLanguage: "Indonesian",
    birthdate: "1999-01-17",
    age: 25,
    currentProgram: "TA",
    currentCompanyId: "cmp-003",
    sendingOrgId: "org_sending",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    residenceCardNumber: "ID5566778",
    residenceStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    dormAddress: "愛知県名古屋市中村区5-6-7",
    arrivalDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 140).toISOString(),
    assignmentDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 110).toISOString(),
    employmentContractPeriod: "2024/01/15〜2027/01/14",
    traineeNoticeNumber: "TRA-2024-021",
    traineeNoticeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 100).toISOString(),
    handlerName: "高橋 陽菜",
    nextProcedure: "技能検定（随時）申請",
  },
  {
    id: "prs-004",
    tenantId: tenant.id,
    fullName: "Munkh Bileg",
    foreignerId: "FR-0004",
    nameKanji: "ムンフ・ビレグ",
    nameKana: "ムンフ ビレグ",
    nameRoma: "Munkh Bileg",
    nameRomaji: "Munkh Bileg",
    gender: "男性",
    displayLanguage: "日本語",
    nationality: "モンゴル",
    nativeLanguage: "Mongolian",
    birthdate: "1997-11-01",
    age: 26,
    currentProgram: "TITP",
    currentCompanyId: "cmp-001",
    sendingOrgId: "org_sending",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 400).toISOString(),
    residenceCardNumber: "MN0099887",
    residenceStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 500).toISOString(),
    dormAddress: "北海道札幌市北区8-9-10",
    arrivalDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 520).toISOString(),
    assignmentDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 480).toISOString(),
    employmentContractPeriod: "2022/10/01〜2025/09/30",
    traineeNoticeNumber: "TRA-2022-045",
    traineeNoticeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 470).toISOString(),
    handlerName: "小林 芽依",
    nextProcedure: "在留期間更新手続き",
  },
  {
    id: "prs-005",
    tenantId: tenant.id,
    fullName: "Sara Kim",
    foreignerId: "FR-0005",
    nameKanji: "サラ・キム",
    nameKana: "サラ キム",
    nameRoma: "Sara Kim",
    nameRomaji: "Sara Kim",
    gender: "女性",
    displayLanguage: "韓国語",
    nationality: "韓国",
    nativeLanguage: "Korean",
    birthdate: "2000-06-08",
    age: 24,
    currentProgram: "SSW",
    currentCompanyId: "cmp-002",
    sendingOrgId: "org_sending",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 75).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    residenceCardNumber: "KR0011223",
    residenceStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 150).toISOString(),
    dormAddress: "宮城県仙台市宮城野区10-11-12",
    arrivalDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
    assignmentDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 160).toISOString(),
    employmentContractPeriod: "2024/02/01〜2027/01/31",
    traineeNoticeNumber: "TRA-2024-034",
    traineeNoticeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 140).toISOString(),
    handlerName: "渡辺 優斗",
    nextProcedure: "特定技能評価試験準備",
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

const tasks: Task[] = [
  {
    id: "tsk-201",
    tenantId: tenant.id,
    title: "計画認定: Nova Robotics 2025 改訂",
    taskType: "plan_revision_review",
    status: "DOING",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
    relatedEntity: "documents/plan",
    severity: "high",
  },
  {
    id: "tsk-202",
    tenantId: tenant.id,
    title: "入国後講習レポート提出 (Orion)",
    taskType: "post_arrival_orientation",
    status: "TODO",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    relatedEntity: "companies/cmp-001",
    severity: "medium",
  },
  {
    id: "tsk-203",
    tenantId: tenant.id,
    title: "監査報告ドラフトレビュー",
    taskType: "audit_report_review",
    status: "TODO",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    relatedEntity: "documents/audit",
    severity: "high",
  },
  {
    id: "tsk-204",
    tenantId: tenant.id,
    title: "請求書 前月複製の確認",
    taskType: "billing_clone_check",
    status: "DOING",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    relatedEntity: "billing",
    severity: "low",
  },
  {
    id: "tsk-205",
    tenantId: tenant.id,
    title: "在留更新手続きタスク発行",
    taskType: "imm_renew_status_titp",
    status: "DONE",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    relatedEntity: "cases/case-004",
    severity: "medium",
  },
];
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
    category: "A",
    jobCode: "05-12",
    jobName: "惣菜製造",
    workName: "盛り付け・包装",
    freeEditOverrides: {},
  },
];
const monitoringLogs: MonitoringLog[] = [
  {
    id: "mlog-001",
    tenantId: tenant.id,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    personId: "prs-001",
    companyId: "cmp-001",
    supervisorId: "org_support",
    logType: "巡回",
    overtimeHours: 30,
    memo: "職場環境良好。寮の衛生状況も問題なし。",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mlog-002",
    tenantId: tenant.id,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    personId: "prs-002",
    companyId: "cmp-002",
    supervisorId: "org_support",
    logType: "監査",
    overtimeHours: 48,
    memo: "繁忙期のため残業増。軽微変更届の対象。",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
const minorChangeNotices: MinorChangeNotice[] = [
  {
    id: "mcn-001",
    tenantId: tenant.id,
    month: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    companyId: "cmp-002",
    supervisorId: "org_support",
    details: [
      {
        foreignerId: "FR-0002",
        personName: "Amara Singh",
        overtimeHours: 48,
        reason: "繁忙期の受注増加により残業が増加。",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
  demoOrganizationProfile,
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
  monitoringLogs,
  minorChangeNotices,
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

export function addOrganization(input: Omit<Organization, "id" | "tenantId">): Organization {
  const org: Organization = { id: randomUUID(), tenantId: tenant.id, ...input };
  organizations.push(org);
  return org;
}

export function updateOrganization(id: string, data: Partial<Organization>): Organization | null {
  const idx = organizations.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  organizations[idx] = { ...organizations[idx], ...data };
  return organizations[idx];
}

export function getDemoOrganizationProfile() {
  return demoOrganizationProfile;
}

export function updateDemoOrganizationProfile(data: Partial<DemoOrganizationProfile>) {
  Object.assign(demoOrganizationProfile, data);
  return demoOrganizationProfile;
}

export function deleteOrganization(id: string): boolean {
  const idx = organizations.findIndex((o) => o.id === id);
  if (idx === -1) return false;
  organizations.splice(idx, 1);
  return true;
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

const OVERTIME_THRESHOLD_STANDARD = 45;
const OVERTIME_THRESHOLD_FLEX = 42;

function ensureMinorChangeNotice({
  month,
  companyId,
  supervisorId,
  detail,
}: {
  month: string;
  companyId: string;
  supervisorId: string;
  detail: { foreignerId?: string; personName?: string; overtimeHours?: number; reason?: string };
}) {
  const monthKey = new Date(month).toISOString().slice(0, 7);
  const existing = minorChangeNotices.find(
    (n) => n.companyId === companyId && n.supervisorId === supervisorId && n.month.slice(0, 7) === monthKey,
  );
  if (existing) {
    const current = Array.isArray(existing.details) ? existing.details : [];
    existing.details = [...current, detail];
    existing.updatedAt = new Date().toISOString();
    return existing;
  }
  const notice: MinorChangeNotice = {
    id: randomUUID(),
    tenantId: tenant.id,
    month: new Date(monthKey + "-01T00:00:00.000Z").toISOString(),
    companyId,
    supervisorId,
    details: [detail],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  minorChangeNotices.push(notice);
  return notice;
}

export function addMonitoringLog(input: Omit<MonitoringLog, "id" | "tenantId" | "createdAt" | "updatedAt">) {
  const log: MonitoringLog = {
    id: randomUUID(),
    tenantId: tenant.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...input,
  };
  monitoringLogs.push(log);

  const overtimeThreshold = log.memo?.includes("変形") ? OVERTIME_THRESHOLD_FLEX : OVERTIME_THRESHOLD_STANDARD;
  if (typeof log.overtimeHours === "number" && log.overtimeHours >= overtimeThreshold) {
    const person = persons.find((p) => p.id === log.personId);
    ensureMinorChangeNotice({
      month: log.date,
      companyId: log.companyId ?? "",
      supervisorId: log.supervisorId ?? "",
      detail: {
        foreignerId: person?.foreignerId,
        personName: person?.fullName,
        overtimeHours: log.overtimeHours,
        reason: "理由未入力",
      },
    });
  }
  return log;
}

export function updateMonitoringLog(id: string, data: Partial<MonitoringLog>) {
  const idx = monitoringLogs.findIndex((log) => log.id === id);
  if (idx === -1) return null;
  monitoringLogs[idx] = { ...monitoringLogs[idx], ...data, updatedAt: new Date().toISOString() };
  return monitoringLogs[idx];
}

export function deleteMonitoringLog(id: string) {
  const idx = monitoringLogs.findIndex((log) => log.id === id);
  if (idx === -1) return false;
  monitoringLogs.splice(idx, 1);
  return true;
}

export function listMonitoringLogs(filter?: { personId?: string; companyId?: string }) {
  return monitoringLogs.filter((log) => {
    if (filter?.personId && log.personId !== filter.personId) return false;
    if (filter?.companyId && log.companyId !== filter.companyId) return false;
    return true;
  });
}

export function listMinorChangeNotices() {
  return minorChangeNotices;
}

export function addMinorChangeNotice(input: Omit<MinorChangeNotice, "id" | "tenantId" | "createdAt" | "updatedAt">) {
  const notice: MinorChangeNotice = {
    id: randomUUID(),
    tenantId: tenant.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...input,
  };
  minorChangeNotices.push(notice);
  return notice;
}

export function updateMinorChangeNotice(id: string, data: Partial<MinorChangeNotice>) {
  const idx = minorChangeNotices.findIndex((notice) => notice.id === id);
  if (idx === -1) return null;
  minorChangeNotices[idx] = { ...minorChangeNotices[idx], ...data, updatedAt: new Date().toISOString() };
  return minorChangeNotices[idx];
}

export function deleteMinorChangeNotice(id: string) {
  const idx = minorChangeNotices.findIndex((notice) => notice.id === id);
  if (idx === -1) return false;
  minorChangeNotices.splice(idx, 1);
  return true;
}

export function listOrganizationsByType(orgType: OrganizationType) {
  return organizations.filter((org) => org.orgType === orgType);
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

export function importPersonsFromCsv(csv: string) {
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.trim());
  const created: Person[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const row: Record<string, string> = {};
    header.forEach((h, idx) => {
      row[h] = cols[idx] ?? "";
    });
    if (!row["外国人ID"] || !row["氏名"]) continue;
    const person = addPerson({
      foreignerId: row["外国人ID"],
      fullName: row["氏名"],
      nationality: row["国籍"],
      nameKanji: row["氏名（漢字）"],
      nameKana: row["氏名（カナ）"],
      nameRoma: row["氏名（ローマ字）"],
      gender: row["性別"],
      displayLanguage: row["表示言語"],
      residenceCardNumber: row["在留カード番号"],
      residenceStart: row["在留開始日"],
      dormAddress: row["寮住所"],
      arrivalDate: row["来日日"],
      assignmentDate: row["配属日"],
      employmentContractPeriod: row["雇用契約期間"],
      traineeNoticeNumber: row["実習実施者届出受理番号"],
      handlerName: row["担当者"],
      nextProcedure: row["次の手続き"],
      notes: row["メモ"],
      currentProgram: row["制度"] || "TITP",
    });
    created.push(person);
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

type TaskRule = { taskType: string; dueDateOffsetDays: number };

const DUE_DATE_OFFSETS = {
  collectDocs: -30,
  fillForm: -14,
  submit: 0,
  supportPlanInputs: -30,
  supportPlanDraft: -21,
};

const baseTaskRules: TaskRule[] = [
  { taskType: "collect_docs", dueDateOffsetDays: DUE_DATE_OFFSETS.collectDocs },
  { taskType: "fill_form", dueDateOffsetDays: DUE_DATE_OFFSETS.fillForm },
  { taskType: "submit", dueDateOffsetDays: DUE_DATE_OFFSETS.submit },
];

const caseSpecificRules: Record<string, TaskRule[]> = {
  ssw_support_plan_and_imm: [
    { taskType: "collect_support_plan_inputs", dueDateOffsetDays: DUE_DATE_OFFSETS.supportPlanInputs },
    { taskType: "draft_support_plan", dueDateOffsetDays: DUE_DATE_OFFSETS.supportPlanDraft },
    { taskType: "submit", dueDateOffsetDays: DUE_DATE_OFFSETS.submit },
  ],
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
  const ruleSet = [...baseTaskRules, ...(caseSpecificRules[target.caseType] ?? [])];
  const created: Task[] = [];
  ruleSet.forEach((rule) => {
    const dueDate = calcDate(target.dueDate, rule.dueDateOffsetDays);
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
      ruleSnapshot: { caseType: target.caseType, dueDateOffsetDays: rule.dueDateOffsetDays },
    });
    created.push(task);
  });
  return created;
}

calculateAlerts();
