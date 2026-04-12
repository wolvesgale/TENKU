import { randomUUID } from "crypto";

export type Program = "TITP" | "SSW" | "TA" | "IKUSEI" | "ALL";
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
  permitExpiry?: string;
  corporateNumber?: string;
  laborInsuranceNo?: string;
  employmentInsuranceNo?: string;
  website?: string;
  name: string;
  nameKana?: string;
  postalCode?: string;
  address?: string;
  phone?: string;
  representativeName?: string;
  representativeKana?: string;
  supervisorResponsibleName?: string;
  supervisorResponsibleKana?: string;
  supervisingOfficeName?: string;
  supervisingOfficeNameKana?: string;
  supervisingOfficePostalCode?: string;
  supervisingOfficeAddress?: string;
  supervisingOfficePhone?: string;
  planInstructorName?: string;
  planInstructorKana?: string;
  handledJobTypes?: { number: string; jobName: string }[];
  planInstructors?: { jobName: string; name: string; kana?: string }[];
  // 登録支援機関
  supportOrgNumber?: string;
  supportOrgExpiry?: string;
  // 監理支援機関
  supervisingOrgNumber?: string;
  supervisingOrgExpiry?: string;
  // 送出機関（最大3件）
  sendingOrgName?: string;
  sendingOrgNumber?: string;
  sendingOrgNumberCountry?: string;
  sendingOrgRefNumber?: string;
  sendingOrgName2?: string;
  sendingOrgNumber2?: string;
  sendingOrgNumberCountry2?: string;
  sendingOrgName3?: string;
  sendingOrgNumber3?: string;
  sendingOrgNumberCountry3?: string;
};
export type InstructorEntry = {
  name: string;
  kana?: string;
  role?: string;
  lectureDate?: string;
  lectureExpiry?: string;
};

export type TitpJobType = { jobType: string; task: string };
export type SswJobType = { field: string; category: string };

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
  traineeResponsibleKana?: string;
  traineeResponsibleRole?: string;
  traineeResponsibleLectureDate?: string;
  traineeResponsibleLectureExpiry?: string;
  traineeInstructorName?: string;
  traineeInstructorKana?: string;
  traineeInstructorRole?: string;
  lifeInstructorName?: string;
  lifeInstructorKana?: string;
  lifeInstructorRole?: string;
  traineeInstructors?: InstructorEntry[];
  lifeInstructors?: InstructorEntry[];
  titpJobTypes?: TitpJobType[];
  sswJobTypes?: SswJobType[];
  // 追加フィールド
  website?: string;
  industryDetail?: string;
  laborInsuranceNo?: string;
  employmentInsuranceNo?: string;
  unionJoinDate?: string;
  titpJobCode?: string;
  titpJobName?: string;
  titpWorkName?: string;
  sswField?: string;
  ikuseiField?: string;
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
  currentCompanyName?: string;
  currentProgram?: Program | string;
  residenceStatus?: string;
  residenceCardExpiry?: string;
  passportNo?: string;
  passportExpiry?: string;
  address?: string;
  photoUrl?: string;
  metaJson?: any;
  myNumber?: string;
  myNumberExpiry?: string;
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
  // 申請日程管理フィールド
  applicationDate?: string;
  approvalDate?: string;
  handler?: string;
  applicationNumber?: string;
  venue?: string;
  metaJson?: Record<string, any>;
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
  jobCode2?: string;
  jobName2?: string;
  workName2?: string;
  trainingStartDate?: string;
  trainingEndDate?: string;
  trainingDurationYears?: string;
  trainingDurationMonths?: string;
  trainingDurationDays?: string;
  trainingHoursTotal?: string;
  trainingHoursLecture?: string;
  trainingHoursPractice?: string;
  prevCertNumber?: string;
  entryTrainingRequired?: string;
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

// ─── SSW (特定技能) 専用型 ───────────────────────────────────────────────────

export type SswInterviewStatus = "scheduled" | "completed" | "cancelled";
export type SswInterview = {
  id: string;
  tenantId: string;
  personId: string;
  companyId?: string;
  interviewNo: number; // 第N回
  scheduledDate: string;
  conductedDate?: string;
  status: SswInterviewStatus;
  conductorName?: string;
  location?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type SswNotifType = "regular" | "adhoc";
export type SswNotifStatus = "pending" | "submitted" | "overdue";
export type SswNotification = {
  id: string;
  tenantId: string;
  personId: string;
  companyId?: string;
  notifType: SswNotifType; // 定期届出 or 随時届出
  category: string; // 届出種別
  dueDate: string;
  submittedDate?: string;
  status: SswNotifStatus;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type SswSupportPlanType = "1" | "2";
export type SswSupportPlanStatus = "draft" | "approved" | "in_progress" | "completed";
export type SswSupportPlan = {
  id: string;
  tenantId: string;
  personId: string;
  companyId?: string;
  planType: SswSupportPlanType; // 1号 or 2号
  status: SswSupportPlanStatus;
  startDate?: string;
  endDate?: string;
  supportOrgId?: string;
  isDelegated: boolean; // 支援委託かどうか
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type SswAppType = "COE" | "COS" | "EXT";
export type SswAppStatus = "draft" | "submitted" | "approved" | "rejected";
export type SswApplication = {
  id: string;
  tenantId: string;
  personId: string;
  companyId?: string;
  appType: SswAppType; // Certificate of Eligibility / Change of Status / Extension
  sector: string; // 特定産業分野
  employerType: "corporate" | "individual"; // 法人 or 個人事業主
  nationality?: string;
  status: SswAppStatus;
  submittedAt?: string;
  approvedAt?: string;
  targetDate?: string; // 申請予定日 or 期限
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type SswRecord = {
  id: string;
  tenantId: string;
  personId: string;
  companyId?: string;
  recordDate: string;
  recordType: string; // 支援内容カテゴリ
  content: string;
  staffName?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type SswJobChangeStatus = "planning" | "notified" | "completed" | "cancelled";
export type SswJobChange = {
  id: string;
  tenantId: string;
  personId: string;
  fromCompanyId: string;
  toCompanyId?: string;
  status: SswJobChangeStatus;
  changeDate?: string;
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// ─────────────────────────────────────────────────────────────────────────────

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
  { id: "org_support", tenantId: tenant.id, orgType: "SUPPORT", displayName: "兵庫中央事業協同組合" },
  { id: "sa-001", tenantId: tenant.id, orgType: "SENDING", displayName: "MEKONG SUPPLY OF HUMAN RESOURCES JSC" },
  { id: "sa-002", tenantId: tenant.id, orgType: "SENDING", displayName: "UNIVERSAL LANGUAGE SKILL (ULS)" },
  { id: "sa-003", tenantId: tenant.id, orgType: "SENDING", displayName: "DAYSTAR社（日本支店）" },
  { id: "sa-004", tenantId: tenant.id, orgType: "SENDING", displayName: "GAKUBUN社" },
  { id: "sa-005", tenantId: tenant.id, orgType: "SENDING", displayName: "TRASESCO" },
  { id: "sa-006", tenantId: tenant.id, orgType: "SENDING", displayName: "World Labour Overseas Pvt.Ltd" },
  { id: "sa-007", tenantId: tenant.id, orgType: "SENDING", displayName: "COOPIMEX JSC" },
];
const demoOrganizationProfile: DemoOrganizationProfile = {
  id: "demo-org-profile",
  tenantId: tenant.id,
  permitNumber: "許2108000111",
  permitType: "一般監理事業",
  name: "兵庫中央事業協同組合",
  nameKana: "ヒョウゴチュウオウジギョウキョウドウクミアイ",
  postalCode: "669-4131",
  address: "兵庫県丹波市春日町七日市590",
  phone: "0795-78-9215",
  representativeName: "吉住 正基",
  representativeKana: "ヨシズミ マサキ",
  supervisorResponsibleName: "堀兼 友仁",
  supervisorResponsibleKana: "ホリカネ トモヒト",
  supervisingOfficeName: "兵庫中央事業協同組合",
  supervisingOfficeNameKana: "ヒョウゴチュウオウジギョウキョウドウクミアイ",
  supervisingOfficePostalCode: "669-4131",
  supervisingOfficeAddress: "兵庫県丹波市春日町七日市590",
  supervisingOfficePhone: "0795-78-9215",
  sendingOrgName: "MEKONG SUPPLY OF HUMAN RESOURCES JSC",
  sendingOrgNumber: "VNM000455",
  sendingOrgNumberCountry: "ベトナム",
  sendingOrgRefNumber: "294",
};
const companies: Company[] = [
  {
    id: "cmp-001",
    tenantId: tenant.id,
    name: "株式会社丹波フレッシュチキン",
    address: "兵庫県丹波市春日町七日市75番地",
    postalCode: "669-4131",
    phone: "0795-74-0451",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "食料品製造業",
    industryMinor: "畜産食料品製造業",
    representativeName: "瀧下 正和",
    representativeKana: "タキシタ マサカズ",
    corporateNumber: "8140001041030",
    contactName: "豊嶋 治彦",
    contactTel: "0795-74-0451",
    workplaceName: "株式会社丹波フレッシュチキン",
    workplaceAddress: "兵庫県丹波市春日町七日市75番地",
    workplacePostalCode: "669-4131",
    workplacePhone: "0795-74-0451",
    traineeResponsibleName: "豊嶋 治彦",
    traineeResponsibleRole: "取締役部長",
  },
  {
    id: "cmp-002",
    tenantId: tenant.id,
    name: "社会福祉法人丹南厚生会 やすらぎ園",
    address: "兵庫県丹波篠山市味間奥833-3",
    postalCode: "669-2223",
    phone: "079-594-3333",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "医療・福祉",
    industryMinor: "老人福祉・介護事業",
    representativeName: "谷口 弘",
    representativeKana: "タニグチ ヒロシ",
    corporateNumber: "1140005008593",
    contactName: "芝 拓哉",
    contactTel: "079-594-3333",
    workplaceName: "社会福祉法人丹南厚生会 やすらぎ園",
    workplaceAddress: "兵庫県丹波篠山市味間奥833-3",
    workplacePostalCode: "669-2223",
    workplacePhone: "079-594-3333",
    traineeResponsibleName: "芝 拓哉",
    traineeResponsibleRole: "施設長代理",
  },
  {
    id: "cmp-003",
    tenantId: tenant.id,
    name: "医療法人社団紀洋会",
    address: "兵庫県丹波篠山市東吹1015-1",
    postalCode: "669-2202",
    phone: "079-594-1616",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "医療・福祉",
    industryMinor: "老人福祉・介護事業",
    representativeName: "余田 洋右",
    representativeKana: "ヨダ ヒロスケ",
    corporateNumber: "5140005008598",
    contactName: "細田 亥俊",
    contactTel: "079-594-1616",
    workplaceName: "医療法人社団紀洋会",
    workplaceAddress: "兵庫県丹波篠山市東吹1015-1",
    workplacePostalCode: "669-2202",
    workplacePhone: "079-594-1616",
    traineeResponsibleName: "細田 亥俊",
    traineeResponsibleRole: "事務部長",
  },
  {
    id: "cmp-004",
    tenantId: tenant.id,
    name: "三立製菓株式会社",
    address: "兵庫県丹波市柏原町大新屋75番地",
    postalCode: "669-3315",
    phone: "0795-72-3901",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "食料品製造業",
    industryMinor: "パン・菓子製造業",
    representativeName: "清水 康光",
    representativeKana: "シミズ ヤスミツ",
    corporateNumber: "9080401002067",
    contactName: "伊藤 英紀",
    contactTel: "0795-72-3901",
    workplaceName: "三立製菓株式会社",
    workplaceAddress: "兵庫県丹波市柏原町大新屋75番地",
    workplacePostalCode: "669-3315",
    workplacePhone: "0795-72-3901",
    traineeResponsibleName: "伊藤 英紀",
    traineeResponsibleRole: "工場長",
  },
  {
    id: "cmp-005",
    tenantId: tenant.id,
    name: "株式会社ワールドコンストラクション",
    address: "兵庫県朝来市山東町溝黒521-1",
    postalCode: "669-5132",
    phone: "079-676-3711",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "建設業",
    industryMinor: "建設機械施工・掘削作業",
    representativeName: "石田 竜二",
    representativeKana: "イシダ リュウジ",
    corporateNumber: "140001046977",
    contactName: "石田 謙二",
    contactTel: "079-676-3711",
    workplaceName: "株式会社ワールドコンストラクション",
    workplaceAddress: "兵庫県朝来市山東町溝黒521-1",
    workplacePostalCode: "669-5132",
    workplacePhone: "079-676-3711",
    traineeResponsibleName: "石田 謙二",
    traineeResponsibleRole: "専務取締役",
  },
  {
    id: "cmp-006",
    tenantId: tenant.id,
    name: "株式会社Lien",
    address: "兵庫県尼崎市堂光寺2丁目1-10-403",
    postalCode: "660-0811",
    phone: "06-6439-6578",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "建設業",
    industryMinor: "左官作業",
    representativeName: "長堂 健優",
    representativeKana: "ナガドウ ケンユウ",
    corporateNumber: "7140001118028",
    contactName: "長堂 健優",
    contactTel: "06-6439-6578",
    workplaceName: "株式会社Lien",
    workplaceAddress: "兵庫県尼崎市堂光寺2丁目1-10-403",
    workplacePostalCode: "660-0811",
    workplacePhone: "06-6439-6578",
    traineeResponsibleName: "長堂 健優",
    traineeResponsibleRole: "代表",
  },
  {
    id: "cmp-007",
    tenantId: tenant.id,
    name: "株式会社ユニバース",
    address: "兵庫県養父市大屋町由良1355",
    postalCode: "667-0304",
    phone: "079-669-2031",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "製造業",
    industryMinor: "機械加工",
    representativeName: "中島 秀範",
    representativeKana: "ナカシマ ヒデノリ",
    corporateNumber: "8120101021842",
    contactName: "西 友広",
    contactTel: "079-669-2031",
    workplaceName: "株式会社ユニバース",
    workplaceAddress: "兵庫県養父市大屋町由良1355",
    workplacePostalCode: "667-0304",
    workplacePhone: "079-669-2031",
    traineeResponsibleName: "西 友広",
    traineeResponsibleRole: "担当者",
  },
  {
    id: "cmp-008",
    tenantId: tenant.id,
    name: "株式会社MASUDA",
    address: "広島県福山市坪生町一丁目30番7号",
    postalCode: "721-0903",
    phone: "084-982-7337",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "建設業",
    industryMinor: "とび・鉄骨工事・シーリング工事",
    representativeName: "升田 智之",
    representativeKana: "マスダ トモユキ",
    corporateNumber: "6240001036006",
    contactName: "岩下 慎吾",
    contactTel: "084-982-7337",
    workplaceName: "株式会社MASUDA",
    workplaceAddress: "広島県福山市坪生町一丁目30番7号",
    workplacePostalCode: "721-0903",
    workplacePhone: "084-982-7337",
    traineeResponsibleName: "岩下 慎吾",
    traineeResponsibleRole: "専務取締役",
  },
  {
    id: "cmp-009",
    tenantId: tenant.id,
    name: "ハリマ木材工業株式会社",
    address: "兵庫県たつの市新宮町新宮710",
    postalCode: "679-4313",
    phone: "0791-75-0030",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "製造業",
    industryMinor: "家具製造業",
    representativeName: "母里 英雄",
    representativeKana: "モリ ヒデオ",
    corporateNumber: "8140001038836",
    contactName: "母里 祐司",
    contactTel: "0791-75-0030",
    workplaceName: "ハリマ木材工業株式会社",
    workplaceAddress: "兵庫県たつの市新宮町新宮710",
    workplacePostalCode: "679-4313",
    workplacePhone: "0791-75-0030",
    traineeResponsibleName: "母里 祐司",
    traineeResponsibleRole: "専務取締役",
  },
  {
    id: "cmp-010",
    tenantId: tenant.id,
    name: "合同会社full&co",
    address: "広島県福山市手城町4丁目9番12号",
    postalCode: "721-0966",
    phone: "0849-99-5072",
    defaultOrgId: "org_support",
    defaultOrgType: "SUPPORT",
    industryMajor: "建設業",
    industryMinor: "構造物鉄工作業",
    representativeName: "空閑 満",
    representativeKana: "クガ ミツル",
    corporateNumber: "2240003004939",
    contactName: "空閑 由佳",
    contactTel: "0849-99-5072",
    workplaceName: "合同会社full&co",
    workplaceAddress: "広島県福山市手城町4丁目9番12号",
    workplacePostalCode: "721-0966",
    workplacePhone: "0849-99-5072",
    traineeResponsibleName: "空閑 由佳",
    traineeResponsibleRole: "担当者",
  },
];
const persons: Person[] = [
  // ===== T_特技: 特定技能・特定活動 =====
  {
    id: "ssw-001", tenantId: tenant.id,
    fullName: "LUU NGOC THANH", nameRoma: "LUU NGOC THANH", nameRomaji: "LUU NGOC THANH",
    gender: "男性", nationality: "ベトナム", birthdate: "1992-07-26", age: 33,
    currentProgram: "SSW", currentCompanyId: "cmp-002", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-11-16", assignmentDate: "2021-11-01",
    metaJson: { japaneseProficiency: "N3", previousStatus: "特定技能１", memo: "元ベトナム国軍。明るく、真面目。", renewalDue: "2025-09-16" },
  },
  {
    id: "ssw-002", tenantId: tenant.id,
    fullName: "TA THI THANH THE", nameRoma: "TA THI THANH THE", nameRomaji: "TA THI THANH THE",
    gender: "女性", nationality: "ベトナム", birthdate: "1996-11-12", age: 29,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2027-01-02", assignmentDate: "2021-12-17",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "特定技能2号を希望。", renewalDue: "2026-10-02" },
  },
  {
    id: "ssw-003", tenantId: tenant.id,
    fullName: "TRINH THI LUONG", nameRoma: "TRINH THI LUONG", nameRomaji: "TRINH THI LUONG",
    gender: "女性", nationality: "ベトナム", birthdate: "1989-10-27", age: 36,
    currentProgram: "SSW", currentCompanyId: "cmp-002", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-08-02", assignmentDate: "2022-08-04",
    metaJson: { japaneseProficiency: "N3", previousStatus: "特定技能１", memo: "子供2人(ベトナム在住)。", renewalDue: "2026-05-02" },
  },
  {
    id: "ssw-004", tenantId: tenant.id,
    fullName: "VO CHI THIEN", nameRoma: "VO CHI THIEN", nameRomaji: "VO CHI THIEN",
    gender: "男性", nationality: "ベトナム", birthdate: "1993-12-01", age: 32,
    currentProgram: "SSW", currentCompanyId: "cmp-003", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-12-26", assignmentDate: "2023-02-01",
    metaJson: { japaneseProficiency: "N1", previousStatus: "特定技能１", memo: "介護福祉士を目指す。妻・子供1人ベトナム在住。", renewalDue: "2025-12-26" },
  },
  {
    id: "ssw-005", tenantId: tenant.id,
    fullName: "VO THI THIEN KIM", nameRoma: "VO THI THIEN KIM", nameRomaji: "VO THI THIEN KIM",
    gender: "女性", nationality: "ベトナム", birthdate: "1995-06-05", age: 30,
    currentProgram: "SSW", currentCompanyId: "cmp-004", sendingOrgId: "sa-001",
    residenceCardExpiry: "2027-03-08", assignmentDate: "2023-02-14",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "優しく真面目。", renewalDue: "2025-12-08" },
  },
  {
    id: "ssw-006", tenantId: tenant.id,
    fullName: "NGUYEN THI HONG NHO", nameRoma: "NGUYEN THI HONG NHO", nameRomaji: "NGUYEN THI HONG NHO",
    gender: "女性", nationality: "ベトナム", birthdate: "1998-06-09", age: 27,
    currentProgram: "SSW", currentCompanyId: "cmp-004", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-04-11", assignmentDate: "2023-03-08",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "優しく真面目。LE VAN SANGと結婚。", renewalDue: "2026-01-11" },
  },
  {
    id: "ssw-007", tenantId: tenant.id,
    fullName: "DINH THI PHUONG", nameRoma: "DINH THI PHUONG", nameRomaji: "DINH THI PHUONG",
    gender: "女性", nationality: "ベトナム", birthdate: "1999-05-02", age: 26,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-11-22", assignmentDate: "2023-09-23",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "優しい。", renewalDue: "2026-08-22" },
  },
  {
    id: "ssw-008", tenantId: tenant.id,
    fullName: "TRAN THI DUYEN", nameRoma: "TRAN THI DUYEN", nameRomaji: "TRAN THI DUYEN",
    gender: "女性", nationality: "ベトナム", birthdate: "1990-05-30", age: 35,
    currentProgram: "SSW", currentCompanyId: "cmp-003", sendingOrgId: "sa-001",
    assignmentDate: "2023-07-18",
    metaJson: { japaneseProficiency: "N3", previousStatus: "特定技能１", memo: "帰国。出産帰国6/30。" },
  },
  {
    id: "ssw-009", tenantId: tenant.id,
    fullName: "DANG THI GIANG", nameRoma: "DANG THI GIANG", nameRomaji: "DANG THI GIANG",
    gender: "女性", nationality: "ベトナム", birthdate: "1988-06-25", age: 37,
    currentProgram: "SSW", currentCompanyId: "cmp-003", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-04-15", assignmentDate: "2023-06-19",
    metaJson: { japaneseProficiency: "N3", previousStatus: "特定技能１", memo: "真面目だけど自分優先の考え。", renewalDue: "2026-01-15" },
  },
  {
    id: "ssw-010", tenantId: tenant.id,
    fullName: "DOAN THI THANH NGAN", nameRoma: "DOAN THI THANH NGAN", nameRomaji: "DOAN THI THANH NGAN",
    gender: "女性", nationality: "ベトナム", birthdate: "1997-11-10", age: 28,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-10-25", assignmentDate: "2023-11-03",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "普通な感じ。", renewalDue: "2026-07-25" },
  },
  {
    id: "ssw-011", tenantId: tenant.id,
    fullName: "LY NHU QUYNH", nameRoma: "LY NHU QUYNH", nameRomaji: "LY NHU QUYNH",
    gender: "女性", nationality: "ベトナム", birthdate: "2001-08-15", age: 24,
    currentProgram: "SSW", currentCompanyId: "cmp-004", sendingOrgId: "sa-001",
    residenceCardExpiry: "2027-02-28", assignmentDate: "2024-03-04",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "普通な感じ。", renewalDue: "2025-11-28" },
  },
  {
    id: "ssw-012", tenantId: tenant.id,
    fullName: "HOANG PHI TRUONG", nameRoma: "HOANG PHI TRUONG", nameRomaji: "HOANG PHI TRUONG",
    gender: "男性", nationality: "ベトナム", birthdate: "2000-03-20", age: 25,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2027-01-31", assignmentDate: "2024-02-01",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "真面目。元実習生農業。", renewalDue: "2025-10-31" },
  },
  {
    id: "ssw-013", tenantId: tenant.id,
    fullName: "TRUONG CONG KHANH", nameRoma: "TRUONG CONG KHANH", nameRomaji: "TRUONG CONG KHANH",
    gender: "男性", nationality: "ベトナム", birthdate: "1995-10-24", age: 30,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2027-03-19", assignmentDate: "2024-03-23",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "真面目。B型肝炎で通院中。", renewalDue: "2025-12-19" },
  },
  {
    id: "ssw-014", tenantId: tenant.id,
    fullName: "TRINH THI CAM HONG", nameRoma: "TRINH THI CAM HONG", nameRomaji: "TRINH THI CAM HONG",
    gender: "女性", nationality: "ベトナム", birthdate: "1991-02-01", age: 34,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-11-30", assignmentDate: "2024-03-02",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "優しい。仕事の評価は低い。", renewalDue: "2026-08-30" },
  },
  {
    id: "ssw-015", tenantId: tenant.id,
    fullName: "NGUYEN NGOC LAN ANH", nameRoma: "NGUYEN NGOC LAN ANH", nameRomaji: "NGUYEN NGOC LAN ANH",
    gender: "女性", nationality: "ベトナム", birthdate: "1998-12-29", age: 27,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-04-23", assignmentDate: "2024-04-25",
    metaJson: { japaneseProficiency: "N2", previousStatus: "特定技能１", memo: "日本語がよくできる。真面目。", renewalDue: "2026-01-23" },
  },
  {
    id: "ssw-016", tenantId: tenant.id,
    fullName: "NGUYEN NGOC ANH", nameRoma: "NGUYEN NGOC ANH", nameRomaji: "NGUYEN NGOC ANH",
    gender: "女性", nationality: "ベトナム", birthdate: "1991-02-23", age: 34,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-08-07", assignmentDate: "2024-06-17",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "優しい。島根県で技能実習・食鳥処理経験。", renewalDue: "2026-05-07" },
  },
  {
    id: "ssw-017", tenantId: tenant.id,
    fullName: "LE MANH HUNG", nameRoma: "LE MANH HUNG", nameRomaji: "LE MANH HUNG",
    gender: "男性", nationality: "ベトナム", birthdate: "1992-12-14", age: 33,
    currentProgram: "SSW", currentCompanyId: "cmp-004", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-06-03", assignmentDate: "2024-06-03",
    metaJson: { japaneseProficiency: "N4", previousStatus: "特定技能１", memo: "真面目。特定技能2号を希望。CHU THI HIENの夫。", renewalDue: "2026-03-03" },
  },
  {
    id: "ssw-018", tenantId: tenant.id,
    fullName: "LAM THI DINH", nameRoma: "LAM THI DINH", nameRomaji: "LAM THI DINH",
    gender: "女性", nationality: "ベトナム", birthdate: "1999-11-01", age: 26,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-09-21", assignmentDate: "2024-11-27",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "普通。BUI VAN HIEUと結婚。一時帰国予定。", renewalDue: "2026-06-21" },
  },
  {
    id: "ssw-019", tenantId: tenant.id,
    fullName: "SAN SREYNEANG", nameRoma: "SAN SREYNEANG", nameRomaji: "SAN SREYNEANG",
    gender: "女性", nationality: "カンボジア", birthdate: "1992-12-20", age: 33,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-005",
    residenceCardExpiry: "2026-02-05", assignmentDate: "2025-02-20",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "真面目。日本語上手。妊娠の為10月に退職・帰国希望。" },
  },
  {
    id: "ssw-020", tenantId: tenant.id,
    fullName: "CHU THI HIEN", nameRoma: "CHU THI HIEN", nameRomaji: "CHU THI HIEN",
    gender: "女性", nationality: "ベトナム", birthdate: "1993-01-21", age: 33,
    currentProgram: "SSW", currentCompanyId: "cmp-004", sendingOrgId: "sa-001",
    residenceCardExpiry: "2027-02-27", assignmentDate: "2025-03-17",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "真面目。LE MANH HUNGの妻。", renewalDue: "2025-11-27" },
  },
  {
    id: "ssw-021", tenantId: tenant.id,
    fullName: "SANH SA MOURN", nameRoma: "SANH SA MOURN", nameRomaji: "SANH SA MOURN",
    gender: "女性", nationality: "カンボジア", birthdate: "1991-06-09", age: 34,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-005",
    residenceCardExpiry: "2027-03-28", assignmentDate: "2025-04-01",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "普通。岩手県で海鮮の技能実習経験。仕事評価◎。", renewalDue: "2025-12-28" },
  },
  {
    id: "ssw-022", tenantId: tenant.id,
    fullName: "NIL CHHORVY", nameRoma: "NIL CHHORVY", nameRomaji: "NIL CHHORVY",
    gender: "女性", nationality: "カンボジア", birthdate: "1995-06-14", age: 30,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-005",
    residenceCardExpiry: "2027-03-28", assignmentDate: "2025-04-01",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "普通。岩手県で海鮮の技能実習経験。仕事評価◎。", renewalDue: "2025-12-28" },
  },
  {
    id: "ssw-023", tenantId: tenant.id,
    fullName: "NGUYEN THI HA TRANG", nameRoma: "NGUYEN THI HA TRANG", nameRomaji: "NGUYEN THI HA TRANG",
    gender: "女性", nationality: "ベトナム", birthdate: "2001-08-21", age: 24,
    currentProgram: "SSW", currentCompanyId: "cmp-004", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-04-17", assignmentDate: "2025-04-21",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "優しく、明るい。", renewalDue: "2026-01-17" },
  },
  {
    id: "ssw-024", tenantId: tenant.id,
    fullName: "NGUYEN THI HOA TRA", nameRoma: "NGUYEN THI HOA TRA", nameRomaji: "NGUYEN THI HOA TRA",
    gender: "女性", nationality: "ベトナム", birthdate: "1994-11-05", age: 31,
    currentProgram: "SSW", currentCompanyId: "cmp-004", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-05-29", assignmentDate: "2025-06-02",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "真面目。播磨町で技能実習段ボール製造経験。", renewalDue: "2026-02-28" },
  },
  {
    id: "ssw-025", tenantId: tenant.id,
    fullName: "NGUYEN THI DUNG", nameRoma: "NGUYEN THI DUNG", nameRomaji: "NGUYEN THI DUNG",
    gender: "女性", nationality: "ベトナム", birthdate: "1993-12-20", age: 32,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-08-25", assignmentDate: "2025-08-28",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "元丹波フレッシュチキン技能実習生。", renewalDue: "2026-05-25" },
  },
  {
    id: "ssw-026", tenantId: tenant.id,
    fullName: "NGUYEN THI THU LIEU", nameRoma: "NGUYEN THI THU LIEU", nameRomaji: "NGUYEN THI THU LIEU",
    gender: "女性", nationality: "ベトナム", birthdate: "1998-02-06", age: 27,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    assignmentDate: "2025-06-09",
    metaJson: { japaneseProficiency: "N3", previousStatus: "特定技能１", memo: "日本語がよくできる。退職。" },
  },
  {
    id: "ssw-027", tenantId: tenant.id,
    fullName: "LE THI ANH", nameRoma: "LE THI ANH", nameRomaji: "LE THI ANH",
    gender: "女性", nationality: "ベトナム", birthdate: "2000-12-12", age: 25,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-05-26", assignmentDate: "2025-06-02",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "性格普通。日本語は出来ない。", renewalDue: "2026-02-26" },
  },
  {
    id: "ssw-028", tenantId: tenant.id,
    fullName: "DOAN THI MAI TRANG", nameRoma: "DOAN THI MAI TRANG", nameRomaji: "DOAN THI MAI TRANG",
    gender: "女性", nationality: "ベトナム", birthdate: "2003-08-21", age: 22,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-05-26", assignmentDate: "2025-07-17",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "7月14日入国。性格普通。日本語は出来ない。", renewalDue: "2026-02-26" },
  },
  {
    id: "ssw-029", tenantId: tenant.id,
    fullName: "LE VAN SANG", nameRoma: "LE VAN SANG", nameRomaji: "LE VAN SANG",
    gender: "男性", nationality: "ベトナム", birthdate: "1994-12-02", age: 31,
    currentProgram: "SSW", currentCompanyId: "cmp-004", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-06-26", assignmentDate: "2025-07-15",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "NGUYEN THI HONG NHOと結婚。真面目。", renewalDue: "2026-03-26" },
  },
  {
    id: "ssw-030", tenantId: tenant.id,
    fullName: "CHEA SREYNEOTH", nameRoma: "CHEA SREYNEOTH", nameRomaji: "CHEA SREYNEOTH",
    gender: "女性", nationality: "カンボジア", birthdate: "1994-05-27", age: 31,
    currentProgram: "TA", currentCompanyId: "cmp-001", sendingOrgId: "sa-005",
    residenceCardExpiry: "2026-11-25", assignmentDate: "2025-07-15",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定活動", memo: "日本語が出来る。", renewalDue: "2026-08-25" },
  },
  {
    id: "ssw-031", tenantId: tenant.id,
    fullName: "SOUN SOLOT", nameRoma: "SOUN SOLOT", nameRomaji: "SOUN SOLOT",
    gender: "女性", nationality: "カンボジア", birthdate: "2000-10-02", age: 25,
    currentProgram: "TA", currentCompanyId: "cmp-001", sendingOrgId: "sa-005",
    residenceCardExpiry: "2026-11-25", assignmentDate: "2025-07-15",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定活動", memo: "日本語が出来ない。", renewalDue: "2026-08-25" },
  },
  {
    id: "ssw-032", tenantId: tenant.id,
    fullName: "BUI VAN HIEU", nameRoma: "BUI VAN HIEU", nameRomaji: "BUI VAN HIEU",
    gender: "男性", nationality: "ベトナム", birthdate: "1999-11-03", age: 26,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-08-11", assignmentDate: "2025-08-21",
    metaJson: { japaneseProficiency: "N3", previousStatus: "特定技能１", memo: "再雇用。自動車免許あり。事故1回。LAM THI DINHと結婚。", renewalDue: "2026-05-11" },
  },
  {
    id: "ssw-033", tenantId: tenant.id,
    fullName: "LE THI HONG HAI", nameRoma: "LE THI HONG HAI", nameRomaji: "LE THI HONG HAI",
    gender: "女性", nationality: "ベトナム", birthdate: "2001-12-24", age: 24,
    currentProgram: "SSW", currentCompanyId: "cmp-004", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-09-24", assignmentDate: "2025-09-17",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能1", memo: "ワガママ。8月18日再入国。", renewalDue: "2026-06-24" },
  },
  {
    id: "ssw-034", tenantId: tenant.id,
    fullName: "NGUYEN THI VAN", nameRoma: "NGUYEN THI VAN", nameRomaji: "NGUYEN THI VAN",
    gender: "女性", nationality: "ベトナム", birthdate: "2002-11-24", age: 23,
    currentProgram: "SSW", currentCompanyId: "cmp-004", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-10-10", assignmentDate: "2025-10-07",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能１", memo: "現在技能実習。申請中の認可待ち。", renewalDue: "2026-07-10" },
  },
  {
    id: "ssw-035", tenantId: tenant.id,
    fullName: "WANG YUE", nameRoma: "WANG YUE", nameRomaji: "WANG YUE",
    gender: "男性", nationality: "中国", birthdate: "1989-08-11", age: 36,
    currentProgram: "TA", currentCompanyId: "cmp-007",
    residenceCardExpiry: "2026-04-07", assignmentDate: "2025-10-07",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定活動", memo: "1月より当組合へ移動予定。", renewalDue: "2026-01-07" },
  },
  {
    id: "ssw-036", tenantId: tenant.id,
    fullName: "ZHOU KEYI", nameRoma: "ZHOU KEYI", nameRomaji: "ZHOU KEYI",
    gender: "男性", nationality: "中国", birthdate: "1995-10-24", age: 30,
    currentProgram: "TA", currentCompanyId: "cmp-007",
    residenceCardExpiry: "2026-04-07", assignmentDate: "2025-10-07",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定活動", memo: "1月より当組合へ移動予定。", renewalDue: "2026-01-07" },
  },
  {
    id: "ssw-037", tenantId: tenant.id,
    fullName: "NGUYEN HONG HIEU", nameRoma: "NGUYEN HONG HIEU", nameRomaji: "NGUYEN HONG HIEU",
    gender: "男性", nationality: "ベトナム", birthdate: "1999-12-19", age: 26,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-001",
    residenceCardExpiry: "2026-02-27", assignmentDate: "2026-03-03",
    metaJson: { japaneseProficiency: "N4", previousStatus: "特定技能1", memo: "相生市より移籍。3/10予定。", renewalDue: "2025-11-27" },
  },
  {
    id: "ssw-038", tenantId: tenant.id,
    fullName: "OEURN SREYNIICH", nameRoma: "OEURN SREYNIICH", nameRomaji: "OEURN SREYNIICH",
    gender: "女性", nationality: "カンボジア", birthdate: "1999-12-19", age: 26,
    currentProgram: "SSW", currentCompanyId: "cmp-001", sendingOrgId: "sa-005",
    metaJson: { japaneseProficiency: "無", previousStatus: "特定技能1", memo: "宮城県気仙沼市より移籍。5/11予定。" },
  },
  // ===== T_技実: 技能実習 =====
  {
    id: "titp-101", tenantId: tenant.id,
    fullName: "FERDIANANTA YOHAN PAMUNGKAS", nameRoma: "FERDIANANTA YOHAN PAMUNGKAS", nameRomaji: "FERDIANANTA YOHAN PAMUNGKAS",
    gender: "男性", nationality: "インドネシア", birthdate: "2004-02-18", age: 21,
    currentProgram: "TITP", currentCompanyId: "cmp-006", sendingOrgId: "sa-002",
    residenceCardExpiry: "2026-09-29", assignmentDate: "2025-11-01",
    metaJson: { japaneseProficiency: "無", previousStatus: "技能実習1", memo: "小山さん11月" },
  },
  {
    id: "titp-102", tenantId: tenant.id,
    fullName: "ALIF ALDO FAHRIZAL", nameRoma: "ALIF ALDO FAHRIZAL", nameRomaji: "ALIF ALDO FAHRIZAL",
    gender: "男性", nationality: "インドネシア", birthdate: "2001-06-26", age: 24,
    currentProgram: "TITP", currentCompanyId: "cmp-006", sendingOrgId: "sa-002",
    residenceCardExpiry: "2026-04-15", assignmentDate: "2025-03-05",
    metaJson: { japaneseProficiency: "無", previousStatus: "技能実習1", memo: "小山さん1月" },
  },
  {
    id: "titp-103", tenantId: tenant.id,
    fullName: "NURUL ROHMAN", nameRoma: "NURUL ROHMAN", nameRomaji: "NURUL ROHMAN",
    gender: "男性", nationality: "インドネシア", birthdate: "2005-01-22", age: 21,
    currentProgram: "TITP", currentCompanyId: "cmp-006", sendingOrgId: "sa-002",
    residenceCardExpiry: "2026-04-15", assignmentDate: "2025-03-05",
    metaJson: { japaneseProficiency: "無", previousStatus: "技能実習1", memo: "小山さん1月" },
  },
  {
    id: "titp-104", tenantId: tenant.id,
    fullName: "NGUYEN DINH TU", nameRoma: "NGUYEN DINH TU", nameRomaji: "NGUYEN DINH TU",
    gender: "男性", nationality: "ベトナム", birthdate: "2005-12-27", age: 20,
    currentProgram: "TITP", currentCompanyId: "cmp-005", sendingOrgId: "sa-001",
    assignmentDate: "2026-06-01",
    metaJson: { japaneseProficiency: "無", previousStatus: "技能実習1", memo: "4月25日入国予定6月より入社予定。徴兵により入隊手続き3月4日。" },
  },
  {
    id: "titp-105", tenantId: tenant.id,
    fullName: "BUI MINH QUI", nameRoma: "BUI MINH QUI", nameRomaji: "BUI MINH QUI",
    gender: "男性", nationality: "ベトナム", birthdate: "2002-07-08", age: 23,
    currentProgram: "TITP", currentCompanyId: "cmp-005", sendingOrgId: "sa-001",
    assignmentDate: "2026-06-01",
    metaJson: { japaneseProficiency: "無", previousStatus: "技能実習1", memo: "4月25日入国予定6月より入社予定。" },
  },
  {
    id: "titp-106", tenantId: tenant.id,
    fullName: "NGUYEN THAI NGUYEN", nameRoma: "NGUYEN THAI NGUYEN", nameRomaji: "NGUYEN THAI NGUYEN",
    gender: "男性", nationality: "ベトナム", birthdate: "2007-08-06", age: 18,
    currentProgram: "TITP", currentCompanyId: "cmp-009", sendingOrgId: "sa-001",
    metaJson: { japaneseProficiency: "無", previousStatus: "技能実習1", memo: "3/16面接" },
  },
  {
    id: "titp-107", tenantId: tenant.id,
    fullName: "NGUYEN DUY THANH", nameRoma: "NGUYEN DUY THANH", nameRomaji: "NGUYEN DUY THANH",
    gender: "男性", nationality: "ベトナム", birthdate: "2002-07-14", age: 23,
    currentProgram: "TITP", currentCompanyId: "cmp-009", sendingOrgId: "sa-001",
    metaJson: { japaneseProficiency: "無", previousStatus: "技能実習1", memo: "3/16面接" },
  },
  {
    id: "titp-108", tenantId: tenant.id,
    fullName: "PHAM TRUNG HIEU", nameRoma: "PHAM TRUNG HIEU", nameRomaji: "PHAM TRUNG HIEU",
    gender: "男性", nationality: "ベトナム", birthdate: "2005-09-28", age: 20,
    currentProgram: "TITP", currentCompanyId: "cmp-010", sendingOrgId: "sa-001",
    metaJson: { japaneseProficiency: "無", previousStatus: "技能実習1", memo: "3/17面接" },
  },
  {
    id: "titp-109", tenantId: tenant.id,
    fullName: "NGUYEN DANG KHOA", nameRoma: "NGUYEN DANG KHOA", nameRomaji: "NGUYEN DANG KHOA",
    gender: "男性", nationality: "ベトナム", birthdate: "2005-12-25", age: 20,
    currentProgram: "TITP", currentCompanyId: "cmp-010", sendingOrgId: "sa-001",
    metaJson: { japaneseProficiency: "無", previousStatus: "技能実習1", memo: "3/17面接" },
  },
  {
    id: "titp-110", tenantId: tenant.id,
    fullName: "LE PHU QUY", nameRoma: "LE PHU QUY", nameRomaji: "LE PHU QUY",
    gender: "男性", nationality: "ベトナム", birthdate: "2004-04-24", age: 21,
    currentProgram: "TITP", currentCompanyId: "cmp-008", sendingOrgId: "sa-001",
    metaJson: { japaneseProficiency: "無", previousStatus: "技能実習1", memo: "3/17面接" },
  },
  {
    id: "titp-111", tenantId: tenant.id,
    fullName: "NGUYEN QOC TOAN", nameRoma: "NGUYEN QOC TOAN", nameRomaji: "NGUYEN QOC TOAN",
    gender: "男性", nationality: "ベトナム", birthdate: "2004-09-03", age: 21,
    currentProgram: "TITP", currentCompanyId: "cmp-008", sendingOrgId: "sa-001",
    metaJson: { japaneseProficiency: "無", previousStatus: "技能実習1", memo: "3/17面接" },
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
    personId: "titp-101",
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
    personId: "ssw-001",
    companyId: "cmp-002",
    ownerOrgId: "org_support",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
  {
    id: "case-003",
    tenantId: tenant.id,
    program: "SSW",
    caseType: "imm_change_status_ta_for_ssw",
    status: "OPEN",
    personId: "ssw-003",
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
    personId: "titp-102",
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
    personId: "ssw-002",
    companyId: "cmp-002",
    ownerOrgId: "org_support",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 65).toISOString(),
  },
];

const tasks: Task[] = [
  {
    id: "tsk-201",
    tenantId: tenant.id,
    title: "計画認定: 丹波フレッシュチキン 2025 改訂",
    taskType: "plan_revision_review",
    status: "DOING",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
    relatedEntity: "documents/plan",
    severity: "high",
  },
  {
    id: "tsk-202",
    tenantId: tenant.id,
    title: "入国後講習レポート提出 (丹波FC)",
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
  { id: "app-001", tenantId: tenant.id, personId: "ssw-001", companyId: "cmp-002", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-10-29", approvalDate: "2025-12-01", handler: "堀兼", applicationNumber: "神オンＥＶ25003433", venue: "神戸", metaJson: { online: true } },
  { id: "app-002", tenantId: tenant.id, personId: "ssw-034", companyId: "cmp-004", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-07-28", approvalDate: "2025-10-10", handler: "林", applicationNumber: "神オンＣＶ25001161", venue: "神戸", metaJson: { online: true } },
  { id: "app-003", tenantId: tenant.id, personId: "ssw-010", companyId: "cmp-001", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-09-10", approvalDate: "2025-10-15", handler: "堀兼", applicationNumber: "E510881", venue: "神戸", metaJson: { online: false } },
  { id: "app-004", tenantId: tenant.id, personId: "ssw-007", companyId: "cmp-001", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-09-30", approvalDate: "2025-10-24", handler: "堀兼", venue: "神戸", metaJson: { online: false } },
  { id: "app-005", tenantId: tenant.id, personId: "ssw-018", companyId: "cmp-001", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-09-30", approvalDate: "2025-10-24", handler: "堀兼", venue: "神戸", metaJson: { online: false } },
  { id: "app-006", tenantId: tenant.id, personId: "ssw-030", companyId: "cmp-001", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-10-27", approvalDate: "2025-11-28", handler: "堀兼", venue: "神戸", metaJson: { online: false } },
  { id: "app-007", tenantId: tenant.id, personId: "ssw-031", companyId: "cmp-001", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-10-27", approvalDate: "2025-11-28", handler: "堀兼", venue: "神戸", metaJson: { online: false } },
  { id: "app-008", tenantId: tenant.id, personId: "ssw-012", companyId: "cmp-001", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-10-31", approvalDate: "2025-12-10", handler: "垣内", applicationNumber: "神オンＥＶ25003503", venue: "神戸", metaJson: { online: true } },
  { id: "app-009", tenantId: tenant.id, personId: "ssw-002", companyId: "cmp-001", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-11-27", approvalDate: "2026-01-07", handler: "垣内", applicationNumber: "神オンＥＶ25003880", venue: "神戸", metaJson: { online: true } },
  { id: "app-010", tenantId: tenant.id, personId: "ssw-014", companyId: "cmp-001", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-11-28", approvalDate: "2026-01-07", handler: "垣内", applicationNumber: "神オンＥＶ25003902", venue: "神戸", metaJson: { online: true } },
  { id: "app-011", tenantId: tenant.id, personId: "ssw-020", companyId: "cmp-004", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-12-18", approvalDate: "2026-01-26", handler: "垣内", applicationNumber: "神オンＥＶ25004252", venue: "神戸", metaJson: { online: true } },
  { id: "app-012", tenantId: tenant.id, personId: "ssw-011", companyId: "cmp-004", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-12-08", approvalDate: "2026-01-16", handler: "垣内", applicationNumber: "神オンＥＶ25004092", venue: "神戸", metaJson: { online: true } },
  { id: "app-013", tenantId: tenant.id, personId: "ssw-005", companyId: "cmp-004", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2025-12-08", approvalDate: "2026-01-16", handler: "垣内", applicationNumber: "神オンＥＶ25004090", venue: "神戸", metaJson: { online: true } },
  { id: "app-014", tenantId: tenant.id, personId: "ssw-006", companyId: "cmp-004", applicationType: "ssw_renewal", status: "SUBMITTED", applicationDate: "2026-02-25", handler: "垣内", applicationNumber: "神オンＥＶ26000774", venue: "神戸", metaJson: { online: true } },
  { id: "app-015", tenantId: tenant.id, personId: "ssw-009", companyId: "cmp-003", applicationType: "care_visa", status: "DRAFT", handler: "垣内", venue: "神戸", metaJson: { online: false } },
  { id: "app-016", tenantId: tenant.id, personId: "ssw-035", companyId: "cmp-007", applicationType: "residence_change", status: "SUBMITTED", applicationDate: "2026-01-09", handler: "垣内", applicationNumber: "神オンＣＶ26000020", venue: "神戸", metaJson: { online: true, notes: "JAIM待ち" } },
  { id: "app-017", tenantId: tenant.id, personId: "ssw-036", companyId: "cmp-007", applicationType: "residence_change", status: "SUBMITTED", applicationDate: "2026-01-09", handler: "垣内", applicationNumber: "神オンＣＶ26000022", venue: "神戸", metaJson: { online: true, notes: "JAIM待ち" } },
  { id: "app-018", tenantId: tenant.id, personId: "ssw-023", companyId: "cmp-004", applicationType: "ssw_renewal", status: "SUBMITTED", applicationDate: "2026-02-13", handler: "垣内", applicationNumber: "神オンＥＶ26000601", venue: "神戸", metaJson: { online: true } },
  { id: "app-019", tenantId: tenant.id, personId: "ssw-015", companyId: "cmp-001", applicationType: "ssw_renewal", status: "SUBMITTED", applicationDate: "2026-02-13", handler: "垣内", applicationNumber: "神オンＥＶ26000604", venue: "神戸", metaJson: { online: true } },
  { id: "app-020", tenantId: tenant.id, personId: "ssw-029", companyId: "cmp-004", applicationType: "ssw_renewal", status: "DRAFT", handler: "垣内", venue: "神戸", metaJson: { online: false } },
  { id: "app-021", tenantId: tenant.id, personId: "ssw-027", companyId: "cmp-001", applicationType: "ssw_renewal", status: "SUBMITTED", applicationDate: "2026-03-10", handler: "垣内", applicationNumber: "神オンＥＶ26001070", venue: "神戸", metaJson: { online: true } },
  { id: "app-022", tenantId: tenant.id, personId: "ssw-037", companyId: "cmp-001", applicationType: "residence_change", status: "APPROVED", applicationDate: "2026-01-19", approvalDate: "2026-02-18", handler: "垣内", applicationNumber: "神オンＣＶ26000080", venue: "神戸", metaJson: { online: true } },
  { id: "app-023", tenantId: tenant.id, personId: "ssw-017", companyId: "cmp-004", applicationType: "ssw_renewal", status: "SUBMITTED", applicationDate: "2026-03-10", handler: "垣内", applicationNumber: "神オンＥＶ26001072", venue: "神戸", metaJson: { online: true } },
  { id: "app-024", tenantId: tenant.id, personId: "ssw-028", companyId: "cmp-001", applicationType: "ssw_renewal", status: "SUBMITTED", applicationDate: "2026-03-10", handler: "垣内", applicationNumber: "神オンＥＶ26001071", venue: "神戸", metaJson: { online: true } },
  { id: "app-025", tenantId: tenant.id, personId: "ssw-024", companyId: "cmp-004", applicationType: "ssw_renewal", status: "SUBMITTED", applicationDate: "2026-03-10", handler: "垣内", applicationNumber: "神オンＥＶ26001069", venue: "神戸", metaJson: { online: true } },
  { id: "app-026", tenantId: tenant.id, personId: "titp-103", companyId: "cmp-006", applicationType: "titp_renewal", status: "SUBMITTED", applicationDate: "2026-03-19", handler: "垣内", applicationNumber: "神オンＣＹ26000832", venue: "神戸", metaJson: { online: true } },
  { id: "app-027", tenantId: tenant.id, personId: "titp-102", companyId: "cmp-006", applicationType: "titp_renewal", status: "SUBMITTED", applicationDate: "2026-03-19", handler: "垣内", applicationNumber: "神オンＣＹ26000831", venue: "神戸", metaJson: { online: true } },
  { id: "app-028", tenantId: tenant.id, personId: "ssw-013", companyId: "cmp-001", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2026-01-23", approvalDate: "2026-03-05", handler: "垣内", applicationNumber: "神オンＥＶ26000271", venue: "神戸", metaJson: { online: true } },
  { id: "app-029", tenantId: tenant.id, personId: "ssw-004", companyId: "cmp-003", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2026-01-23", approvalDate: "2026-03-06", handler: "垣内", applicationNumber: "神オンＥＶ26000272", venue: "神戸", metaJson: { online: true } },
  { id: "app-030", tenantId: tenant.id, personId: "ssw-021", companyId: "cmp-001", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2026-01-23", approvalDate: "2026-03-05", handler: "垣内", applicationNumber: "神オンＥＶ26000267", venue: "神戸", metaJson: { online: true } },
  { id: "app-031", tenantId: tenant.id, personId: "ssw-022", companyId: "cmp-001", applicationType: "ssw_renewal", status: "APPROVED", applicationDate: "2026-01-23", approvalDate: "2026-03-05", handler: "垣内", applicationNumber: "神オンＥＶ26000269", venue: "神戸", metaJson: { online: true } },
  { id: "app-032", tenantId: tenant.id, personId: "titp-105", companyId: "cmp-005", applicationType: "titp_entry", status: "SUBMITTED", applicationDate: "2026-03-12", handler: "垣内", applicationNumber: "神オン認Ｙ26000499", venue: "神戸", metaJson: { online: true } },
  { id: "app-033", tenantId: tenant.id, personId: "ssw-038", companyId: "cmp-001", applicationType: "ssw_renewal", status: "SUBMITTED", applicationDate: "2026-03-13", handler: "垣内", applicationNumber: "仙オンＣＶ26000750", venue: "神戸", metaJson: { online: true } },
];
const trainingPlans: TrainingPlan[] = [
  {
    id: "plan-001",
    tenantId: tenant.id,
    personId: "ssw-001",
    companyId: "cmp-002",
    orgId: "org_support",
    planType: "skill_practice_plan",
    status: "DRAFT",
    category: "A",
    jobCode: "14-01",
    jobName: "介護",
    workName: "身体介護・日常生活支援",
    trainingStartDate: "2025-04-01",
    trainingEndDate: "2028-03-31",
    trainingDurationYears: "3",
    trainingDurationMonths: "0",
    trainingDurationDays: "0",
    trainingHoursTotal: "2080",
    trainingHoursLecture: "240",
    trainingHoursPractice: "1840",
    entryTrainingRequired: "1",
    freeEditOverrides: {},
  },
];
const monitoringLogs: MonitoringLog[] = [
  {
    id: "mlog-001",
    tenantId: tenant.id,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    personId: "titp-101",
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
    personId: "ssw-001",
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
        personName: "NGUYEN THI HUONG",
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

// ─── SSW デモデータ ──────────────────────────────────────────────────────────

const sswInterviews: SswInterview[] = [
  {
    id: "swi-001",
    tenantId: tenant.id,
    personId: "ssw-001",
    companyId: "cmp-002",
    interviewNo: 1,
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    conductedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 118).toISOString(),
    status: "completed",
    conductorName: "鈴木 直人",
    location: "やすらぎ園 会議室",
    memo: "就労環境・賃金・相談事項なし。次回は4ヶ月後。",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 125).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 118).toISOString(),
  },
  {
    id: "swi-002",
    tenantId: tenant.id,
    personId: "ssw-001",
    companyId: "cmp-002",
    interviewNo: 2,
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "scheduled",
    conductorName: "鈴木 直人",
    location: "オンライン",
    memo: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "swi-003",
    tenantId: tenant.id,
    personId: "ssw-002",
    companyId: "cmp-002",
    interviewNo: 1,
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    status: "scheduled",
    conductorName: "渡辺 優斗",
    location: "やすらぎ園 会議室",
    memo: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

const sswNotifications: SswNotification[] = [
  {
    id: "swn-001",
    tenantId: tenant.id,
    personId: "ssw-001",
    companyId: "cmp-002",
    notifType: "regular",
    category: "受入れ・活動状況に係る届出",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
    status: "pending",
    memo: "四半期定期届出",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "swn-002",
    tenantId: tenant.id,
    personId: "ssw-002",
    companyId: "cmp-002",
    notifType: "adhoc",
    category: "受入れ困難に係る届出",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    submittedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "submitted",
    memo: "休職に伴う随時届出。提出済み。",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "swn-003",
    tenantId: tenant.id,
    personId: "ssw-001",
    companyId: "cmp-002",
    notifType: "regular",
    category: "受入れ・活動状況に係る届出",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString(),
    submittedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 68).toISOString(),
    status: "submitted",
    memo: "前四半期定期届出。提出済み。",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 68).toISOString(),
  },
];

const sswSupportPlans: SswSupportPlan[] = [
  {
    id: "ssp-001",
    tenantId: tenant.id,
    personId: "ssw-001",
    companyId: "cmp-002",
    planType: "1",
    status: "in_progress",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 65).toISOString(),
    supportOrgId: "org_support",
    isDelegated: true,
    memo: "登録支援機関への支援委託。全11項目対応中。",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 310).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "ssp-002",
    tenantId: tenant.id,
    personId: "ssw-002",
    companyId: "cmp-002",
    planType: "1",
    status: "approved",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 150).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 215).toISOString(),
    supportOrgId: "org_support",
    isDelegated: true,
    memo: "承認済み。定期面談スケジュール調整中。",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 160).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
  },
];

const sswApplications: SswApplication[] = [
  {
    id: "swa-001",
    tenantId: tenant.id,
    personId: "ssw-001",
    companyId: "cmp-002",
    appType: "EXT",
    sector: "食品製造業",
    employerType: "corporate",
    nationality: "フィリピン",
    status: "draft",
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    notes: "在留期間満了前更新。雇用契約継続。",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "swa-002",
    tenantId: tenant.id,
    personId: "ssw-002",
    companyId: "cmp-002",
    appType: "COE",
    sector: "食品製造業",
    employerType: "corporate",
    nationality: "韓国",
    status: "submitted",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    notes: "海外からの新規招聘。特定技能1号食品製造。",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
];

const sswRecords: SswRecord[] = [
  {
    id: "swr-001",
    tenantId: tenant.id,
    personId: "ssw-001",
    companyId: "cmp-002",
    recordDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 118).toISOString(),
    recordType: "定期面談",
    content: "就労状況・賃金・住居環境・不満点なし。日本語学習継続中。",
    staffName: "鈴木 直人",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 118).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 118).toISOString(),
  },
  {
    id: "swr-002",
    tenantId: tenant.id,
    personId: "ssw-001",
    companyId: "cmp-002",
    recordDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    recordType: "生活支援",
    content: "住居更新手続きサポート。賃貸契約書確認・翻訳提供。",
    staffName: "鈴木 直人",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
];

const sswJobChanges: SswJobChange[] = [];

// ─────────────────────────────────────────────────────────────────────────────

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
  sswInterviews,
  sswNotifications,
  sswSupportPlans,
  sswApplications,
  sswRecords,
  sswJobChanges,
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


// ─── SSW CRUD 関数 ────────────────────────────────────────────────────────────

export function listSswInterviews(personId?: string) {
  if (personId) return sswInterviews.filter((i) => i.personId === personId);
  return sswInterviews;
}
export function addSswInterview(input: Omit<SswInterview, "id" | "tenantId" | "createdAt" | "updatedAt">): SswInterview {
  const item: SswInterview = { id: randomUUID(), tenantId: tenant.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...input };
  sswInterviews.push(item);
  return item;
}
export function updateSswInterview(id: string, data: Partial<SswInterview>): SswInterview | null {
  const idx = sswInterviews.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  sswInterviews[idx] = { ...sswInterviews[idx], ...data, updatedAt: new Date().toISOString() };
  return sswInterviews[idx];
}

export function listSswNotifications(personId?: string) {
  if (personId) return sswNotifications.filter((n) => n.personId === personId);
  return sswNotifications;
}
export function addSswNotification(input: Omit<SswNotification, "id" | "tenantId" | "createdAt" | "updatedAt">): SswNotification {
  const item: SswNotification = { id: randomUUID(), tenantId: tenant.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...input };
  sswNotifications.push(item);
  return item;
}
export function updateSswNotification(id: string, data: Partial<SswNotification>): SswNotification | null {
  const idx = sswNotifications.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  sswNotifications[idx] = { ...sswNotifications[idx], ...data, updatedAt: new Date().toISOString() };
  return sswNotifications[idx];
}

export function listSswSupportPlans(personId?: string) {
  if (personId) return sswSupportPlans.filter((p) => p.personId === personId);
  return sswSupportPlans;
}
export function addSswSupportPlan(input: Omit<SswSupportPlan, "id" | "tenantId" | "createdAt" | "updatedAt">): SswSupportPlan {
  const item: SswSupportPlan = { id: randomUUID(), tenantId: tenant.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...input };
  sswSupportPlans.push(item);
  return item;
}
export function updateSswSupportPlan(id: string, data: Partial<SswSupportPlan>): SswSupportPlan | null {
  const idx = sswSupportPlans.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  sswSupportPlans[idx] = { ...sswSupportPlans[idx], ...data, updatedAt: new Date().toISOString() };
  return sswSupportPlans[idx];
}

export function listSswApplications(personId?: string) {
  if (personId) return sswApplications.filter((a) => a.personId === personId);
  return sswApplications;
}
export function addSswApplication(input: Omit<SswApplication, "id" | "tenantId" | "createdAt" | "updatedAt">): SswApplication {
  const item: SswApplication = { id: randomUUID(), tenantId: tenant.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...input };
  sswApplications.push(item);
  return item;
}
export function updateSswApplication(id: string, data: Partial<SswApplication>): SswApplication | null {
  const idx = sswApplications.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  sswApplications[idx] = { ...sswApplications[idx], ...data, updatedAt: new Date().toISOString() };
  return sswApplications[idx];
}

export function listSswRecords(personId?: string) {
  if (personId) return sswRecords.filter((r) => r.personId === personId);
  return sswRecords;
}
export function addSswRecord(input: Omit<SswRecord, "id" | "tenantId" | "createdAt" | "updatedAt">): SswRecord {
  const item: SswRecord = { id: randomUUID(), tenantId: tenant.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...input };
  sswRecords.push(item);
  return item;
}

export function listSswJobChanges(personId?: string) {
  if (personId) return sswJobChanges.filter((j) => j.personId === personId);
  return sswJobChanges;
}
export function addSswJobChange(input: Omit<SswJobChange, "id" | "tenantId" | "createdAt" | "updatedAt">): SswJobChange {
  const item: SswJobChange = { id: randomUUID(), tenantId: tenant.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...input };
  sswJobChanges.push(item);
  return item;
}
export function updateSswJobChange(id: string, data: Partial<SswJobChange>): SswJobChange | null {
  const idx = sswJobChanges.findIndex((j) => j.id === id);
  if (idx === -1) return null;
  sswJobChanges[idx] = { ...sswJobChanges[idx], ...data, updatedAt: new Date().toISOString() };
  return sswJobChanges[idx];
}

// ─── Document（書類管理）型 ───────────────────────────────────────────────────

export type DocumentCategory =
  | "passport"        // パスポートコピー
  | "residence_card"  // 在留カード
  | "contract"        // 雇用契約書
  | "support_plan"    // 支援計画書
  | "application_pdf" // 申請書PDF
  | "approval_notice" // 許可通知書
  | "other";          // その他

export type StoredDocument = {
  id: string;
  tenantId: string;
  personId?: string;
  companyId?: string;
  applicationId?: string;
  category: DocumentCategory;
  filename: string;
  mimeType: string;
  sizeBytes?: number;
  /** デモ用：base64 data URI または仮URL */
  dataUrl?: string;
  uploadedAt: string;
  uploadedBy?: string;
  memo?: string;
};

// ─── Invoice（請求書）型 ──────────────────────────────────────────────────────

export type InvoiceStatus = "draft" | "confirmed" | "sent" | "paid";

export type InvoiceLineItem = {
  description: string;
  unitPrice: number;
  quantity: number;
  amount: number;
};

export type Invoice = {
  id: string;
  tenantId: string;
  invoiceNumber: string; // INV-YYYYMM-NNN
  companyId: string;
  billingMonth: string;  // YYYY-MM
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;   // 0.10
  taxAmount: number;
  totalAmount: number;
  dueDate?: string;
  confirmedAt?: string;
  sentAt?: string;
  paidAt?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

// ─── デモデータ ───────────────────────────────────────────────────────────────

const documents: StoredDocument[] = [
  {
    id: "doc-001",
    tenantId: "tenant_demo",
    personId: "prs-002",
    category: "passport",
    filename: "passport_amara_singh.pdf",
    mimeType: "application/pdf",
    sizeBytes: 512000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300).toISOString(),
    uploadedBy: "鈴木 直人",
    memo: "Amara Singh パスポートコピー（2025年更新）",
  },
  {
    id: "doc-002",
    tenantId: "tenant_demo",
    personId: "prs-002",
    category: "contract",
    filename: "employment_contract_amara_2023.pdf",
    mimeType: "application/pdf",
    sizeBytes: 256000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 280).toISOString(),
    uploadedBy: "鈴木 直人",
    memo: "特定技能雇用契約書（2023年11月締結）",
  },
  {
    id: "doc-003",
    tenantId: "tenant_demo",
    personId: "prs-002",
    applicationId: "swa-001",
    category: "application_pdf",
    filename: "ssw_ext_application_amara_2024.pdf",
    mimeType: "application/pdf",
    sizeBytes: 890000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    uploadedBy: "鈴木 直人",
    memo: "在留期間更新申請書一式（下書き）",
  },
  {
    id: "doc-004",
    tenantId: "tenant_demo",
    personId: "prs-005",
    category: "support_plan",
    filename: "support_plan_sara_kim.pdf",
    mimeType: "application/pdf",
    sizeBytes: 320000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 140).toISOString(),
    uploadedBy: "渡辺 優斗",
    memo: "1号特定技能外国人支援計画書（承認済み）",
  },
];

// 請求書シーケンス管理
const invoiceSeq: Record<string, number> = {};
function nextInvoiceNumber(month: string): string {
  const key = month.replace("-", "");
  invoiceSeq[key] = (invoiceSeq[key] ?? 0) + 1;
  return `INV-${key}-${String(invoiceSeq[key]).padStart(3, "0")}`;
}

const now = new Date();
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

const TAX_RATE = 0.1;

function buildInvoice(
  companyId: string,
  billingMonth: string,
  lineItems: InvoiceLineItem[],
  status: InvoiceStatus,
  extra?: Partial<Invoice>
): Invoice {
  const subtotal = lineItems.reduce((s, l) => s + l.amount, 0);
  const taxAmount = Math.floor(subtotal * TAX_RATE);
  return {
    id: randomUUID(),
    tenantId: "tenant_demo",
    invoiceNumber: nextInvoiceNumber(billingMonth),
    companyId,
    billingMonth,
    status,
    lineItems,
    subtotal,
    taxRate: TAX_RATE,
    taxAmount,
    totalAmount: subtotal + taxAmount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...extra,
  };
}

const invoices: Invoice[] = [
  buildInvoice(
    "cmp-001",
    `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`,
    [
      { description: "監理費（技能実習1号）× 3名", unitPrice: 30000, quantity: 3, amount: 90000 },
      { description: "監理費（技能実習2号）× 1名", unitPrice: 35000, quantity: 1, amount: 35000 },
    ],
    "paid",
    { paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString() }
  ),
  buildInvoice(
    "cmp-002",
    `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`,
    [
      { description: "支援費（特定技能1号）× 2名", unitPrice: 50000, quantity: 2, amount: 100000 },
    ],
    "sent",
    { sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() }
  ),
  buildInvoice(
    "cmp-001",
    `${thisMonth.getFullYear()}-${String(thisMonth.getMonth() + 1).padStart(2, "0")}`,
    [
      { description: "監理費（技能実習1号）× 3名", unitPrice: 30000, quantity: 3, amount: 90000 },
      { description: "監理費（技能実習2号）× 1名", unitPrice: 35000, quantity: 1, amount: 35000 },
    ],
    "draft"
  ),
  buildInvoice(
    "cmp-002",
    `${thisMonth.getFullYear()}-${String(thisMonth.getMonth() + 1).padStart(2, "0")}`,
    [
      { description: "支援費（特定技能1号）× 2名", unitPrice: 50000, quantity: 2, amount: 100000 },
    ],
    "confirmed",
    { confirmedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString() }
  ),
];

// ─── Document CRUD ────────────────────────────────────────────────────────────

export function listDocuments(filter?: { personId?: string; companyId?: string; applicationId?: string }) {
  return documents.filter((d) => {
    if (filter?.personId && d.personId !== filter.personId) return false;
    if (filter?.companyId && d.companyId !== filter.companyId) return false;
    if (filter?.applicationId && d.applicationId !== filter.applicationId) return false;
    return true;
  });
}

export function addDocument(input: Omit<StoredDocument, "id" | "tenantId">): StoredDocument {
  const doc: StoredDocument = { id: randomUUID(), tenantId: "tenant_demo", ...input };
  documents.push(doc);
  return doc;
}

export function deleteDocument(id: string): boolean {
  const idx = documents.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  documents.splice(idx, 1);
  return true;
}

// ─── Invoice CRUD ─────────────────────────────────────────────────────────────

export function listInvoices(companyId?: string) {
  if (companyId) return invoices.filter((i) => i.companyId === companyId);
  return invoices;
}

export function getInvoice(id: string) {
  return invoices.find((i) => i.id === id) ?? null;
}

export function addInvoice(input: {
  companyId: string;
  billingMonth: string;
  lineItems: InvoiceLineItem[];
  dueDate?: string;
  memo?: string;
}): Invoice {
  const inv = buildInvoice(input.companyId, input.billingMonth, input.lineItems, "draft", {
    dueDate: input.dueDate,
    memo: input.memo,
  });
  invoices.push(inv);
  return inv;
}

export function updateInvoiceStatus(id: string, status: InvoiceStatus): Invoice | null {
  const inv = invoices.find((i) => i.id === id);
  if (!inv) return null;
  inv.status = status;
  inv.updatedAt = new Date().toISOString();
  if (status === "confirmed") inv.confirmedAt = new Date().toISOString();
  if (status === "sent") inv.sentAt = new Date().toISOString();
  if (status === "paid") inv.paidAt = new Date().toISOString();
  return inv;
}

export function updateInvoice(id: string, data: Partial<Pick<Invoice, "lineItems" | "dueDate" | "memo">>): Invoice | null {
  const idx = invoices.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  if (data.lineItems) {
    const subtotal = data.lineItems.reduce((s, l) => s + l.amount, 0);
    const taxAmount = Math.floor(subtotal * TAX_RATE);
    invoices[idx] = {
      ...invoices[idx],
      ...data,
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
      updatedAt: new Date().toISOString(),
    };
  } else {
    invoices[idx] = { ...invoices[idx], ...data, updatedAt: new Date().toISOString() };
  }
  return invoices[idx];
}

// ─── マルチテナント定義 ───────────────────────────────────────────────────────

export type DemoTenantAccount = {
  tenantId: string;
  tenantCode: string;
  name: string;
  email: string;
  password: string;
  role: "tenantAdmin";
};

/** デモ用テナントアカウント一覧（ログインページで使用） */
export const DEMO_TENANT_ACCOUNTS: DemoTenantAccount[] = [
  {
    tenantId: "tenant_demo",
    tenantCode: "240224",
    name: "TENKU監理協同組合",
    email: "support@techtas.jp",
    password: "techtas720",
    role: "tenantAdmin",
  },
  {
    tenantId: "tenant_hikari",
    tenantCode: "360101",
    name: "ひかり監理組合",
    email: "info@hikari-kanri.jp",
    password: "hikari2024",
    role: "tenantAdmin",
  },
  {
    tenantId: "tenant_sunrise",
    tenantCode: "480502",
    name: "サンライズ協同組合",
    email: "demo@sunrise-coop.jp",
    password: "sunrise2024",
    role: "tenantAdmin",
  },
];

/** テナントコードまたはメール+パスワードで認証 */
export function authenticateDemoTenant(
  tenantCode: string,
  email: string,
  password: string
): DemoTenantAccount | null {
  return (
    DEMO_TENANT_ACCOUNTS.find(
      (a) =>
        a.tenantCode === tenantCode &&
        a.email === email &&
        a.password === password
    ) ?? null
  );
}

// ─── テナント別デモデータ ────────────────────────────────────────────────────

/** ひかり監理組合（tenant_hikari）の企業データ */
const hikariCompanies: Company[] = [
  {
    id: "hcmp-001",
    tenantId: "tenant_hikari",
    name: "富士フーズ株式会社",
    nameKana: "フジフーズカブシキガイシャ",
    address: "静岡県富士市中央2-3-1",
    postalCode: "417-0001",
    phone: "0545-51-2345",
    defaultOrgId: "org_hikari",
    industryMajor: "食品製造",
    industryMinor: "水産加工",
    representativeName: "中田 浩一",
    representativeKana: "ナカダ コウイチ",
    corporateNumber: "2345678901234",
    contactName: "鈴木 美咲",
    contactTel: "0545-51-2345",
  },
  {
    id: "hcmp-002",
    tenantId: "tenant_hikari",
    name: "東海農業協同組合",
    nameKana: "トウカイノウギョウキョウドウクミアイ",
    address: "愛知県豊橋市花田町1-1-1",
    postalCode: "440-0001",
    phone: "0532-30-1111",
    defaultOrgId: "org_hikari",
    industryMajor: "農業",
    industryMinor: "野菜栽培",
    representativeName: "加藤 達也",
    representativeKana: "カトウ タツヤ",
    corporateNumber: "3456789012345",
    contactName: "伊藤 真紀",
    contactTel: "0532-30-1111",
  },
];

/** ひかり監理組合（tenant_hikari）の外国人データ */
const hikariPersons: Person[] = [
  {
    id: "hprs-001",
    tenantId: "tenant_hikari",
    fullName: "Nguyen Van An",
    foreignerId: "HK-0001",
    nameKanji: "グエン・バン・アン",
    nameKana: "グエン バン アン",
    nameRoma: "Nguyen Van An",
    nameRomaji: "Nguyen Van An",
    gender: "男性",
    nationality: "ベトナム",
    birthdate: "1999-03-15",
    age: 25,
    currentProgram: "TITP",
    currentCompanyId: "hcmp-001",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 400).toISOString(),
    dormAddress: "静岡県富士市中央2-3-101",
    handlerName: "山田 一郎",
    nextProcedure: "在留期間更新",
  },
  {
    id: "hprs-002",
    tenantId: "tenant_hikari",
    fullName: "Tran Thi Mai",
    foreignerId: "HK-0002",
    nameKanji: "チャン・ティ・マイ",
    nameKana: "チャン ティ マイ",
    nameRoma: "Tran Thi Mai",
    nameRomaji: "Tran Thi Mai",
    gender: "女性",
    nationality: "ベトナム",
    birthdate: "2001-07-22",
    age: 23,
    currentProgram: "SSW",
    currentCompanyId: "hcmp-001",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 250).toISOString(),
    dormAddress: "静岡県富士市中央2-3-102",
    handlerName: "山田 一郎",
    nextProcedure: "在留期間更新申請（EXT）",
  },
  {
    id: "hprs-003",
    tenantId: "tenant_hikari",
    fullName: "Bui Thi Lan",
    foreignerId: "HK-0003",
    nameKanji: "ブイ・ティ・ラン",
    nameKana: "ブイ ティ ラン",
    nameRoma: "Bui Thi Lan",
    nameRomaji: "Bui Thi Lan",
    gender: "女性",
    nationality: "ベトナム",
    birthdate: "2000-11-08",
    age: 24,
    currentProgram: "TITP",
    currentCompanyId: "hcmp-002",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 270).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 500).toISOString(),
    dormAddress: "愛知県豊橋市花田町1-1-201",
    handlerName: "田中 花子",
    nextProcedure: "技能検定（基礎級）申請",
  },
];

/** サンライズ協同組合（tenant_sunrise）の企業データ */
const sunriseCompanies: Company[] = [
  {
    id: "scmp-001",
    tenantId: "tenant_sunrise",
    name: "九州介護サービス株式会社",
    nameKana: "キュウシュウカイゴサービスカブシキガイシャ",
    address: "福岡県福岡市博多区博多駅前3-1-1",
    postalCode: "812-0011",
    phone: "092-411-5678",
    defaultOrgId: "org_sunrise",
    industryMajor: "介護",
    industryMinor: "訪問介護",
    representativeName: "松本 健二",
    representativeKana: "マツモト ケンジ",
    corporateNumber: "4567890123456",
    contactName: "川口 さやか",
    contactTel: "092-411-5678",
  },
];

/** サンライズ協同組合（tenant_sunrise）の外国人データ */
const sunrisePersons: Person[] = [
  {
    id: "sprs-001",
    tenantId: "tenant_sunrise",
    fullName: "Dela Cruz Maria",
    foreignerId: "SR-0001",
    nameKanji: "デラクルス・マリア",
    nameKana: "デラクルス マリア",
    nameRoma: "Dela Cruz Maria",
    nameRomaji: "Dela Cruz Maria",
    gender: "女性",
    nationality: "フィリピン",
    birthdate: "1997-05-20",
    age: 27,
    currentProgram: "SSW",
    currentCompanyId: "scmp-001",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 350).toISOString(),
    dormAddress: "福岡県福岡市博多区1-2-3",
    handlerName: "中村 隼人",
    nextProcedure: "特定技能1号 EXT申請",
  },
  {
    id: "sprs-002",
    tenantId: "tenant_sunrise",
    fullName: "Santos Juan",
    foreignerId: "SR-0002",
    nameKanji: "サントス・フアン",
    nameKana: "サントス フアン",
    nameRoma: "Santos Juan",
    nameRomaji: "Santos Juan",
    gender: "男性",
    nationality: "フィリピン",
    birthdate: "1995-09-12",
    age: 29,
    currentProgram: "SSW",
    currentCompanyId: "scmp-001",
    residenceCardExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toISOString(),
    passportExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 600).toISOString(),
    dormAddress: "福岡県福岡市博多区1-2-4",
    handlerName: "中村 隼人",
    nextProcedure: "支援計画更新",
  },
];

// ─── テナント別データ参照 ────────────────────────────────────────────────────

const TENANT_COMPANIES: Record<string, Company[]> = {
  tenant_demo:    companies,
  tenant_hikari:  hikariCompanies,
  tenant_sunrise: sunriseCompanies,
};

const TENANT_PERSONS: Record<string, Person[]> = {
  tenant_demo:    persons,
  tenant_hikari:  hikariPersons,
  tenant_sunrise: sunrisePersons,
};

/**
 * テナントIDに対応した企業リストを返す
 * 未知のテナントは空配列を返す（データ漏洩防止）
 */
export function listCompaniesByTenant(tenantId: string): Company[] {
  return TENANT_COMPANIES[tenantId] ?? [];
}

/**
 * テナントIDに対応した外国人リストを返す
 */
export function listPersonsByTenant(tenantId: string, program?: string): Person[] {
  const list = TENANT_PERSONS[tenantId] ?? [];
  if (!program || program === "ALL") return list;
  return list.filter((p) => p.currentProgram === program);
}

/**
 * テナントIDを考慮してケースを返す
 */
export function listCasesByTenant(tenantId: string, program?: string): Case[] {
  const tenantPersonIds = new Set((TENANT_PERSONS[tenantId] ?? []).map((p) => p.id));
  const filtered = cases.filter((c) => tenantPersonIds.has(c.personId) && c.tenantId === tenantId);
  if (!program || program === "ALL") return filtered;
  return filtered.filter((c) => c.program === program);
}

/**
 * テナントを認識してデータを追加する
 */
export function addPersonToTenant(tenantId: string, input: Omit<Person, "id" | "tenantId">): Person {
  const person: Person = { id: randomUUID(), tenantId, ...input };
  (TENANT_PERSONS[tenantId] ?? persons).push(person);
  return person;
}

export function addCompanyToTenant(tenantId: string, input: Omit<Company, "id" | "tenantId">): Company {
  const company: Company = { id: randomUUID(), tenantId, ...input };
  (TENANT_COMPANIES[tenantId] ?? companies).push(company);
  return company;
}

export function listInvoicesByTenant(tenantId: string, companyId?: string): Invoice[] {
  const tenantCompanyIds = new Set((TENANT_COMPANIES[tenantId] ?? []).map((c) => c.id));
  const filtered = invoices.filter((inv) => tenantCompanyIds.has(inv.companyId));
  if (companyId) return filtered.filter((inv) => inv.companyId === companyId);
  return filtered;
}
