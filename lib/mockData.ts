export type Company = {
  id: string;
  name: string;
  location: string;
  trainees: number;
  completion: number;
  riskScore: number;
  nextAudit: string;
  sector: string;
};

export type SendingAgency = {
  id: string;
  name: string;
  country: string;
  migrants: number;
  completion: number;
  riskScore: number;
  contact: string;
};

export type Migrant = {
  id: string;
  name: string;
  status: string;
  visaExpireDate: string;
  phase: string;
  company: string;
  riskScore: number;
  completion: number;
};

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  status: "open" | "in_progress" | "done";
  relatedEntity: string;
  severity: "low" | "medium" | "high";
};

export type Document = {
  id: string;
  name: string;
  type: string;
  status: string;
  lastUpdated: string;
  owner: string;
  completion: number;
  deadline: string;
  riskScore: number;
};

export type KPI = {
  title: string;
  value: number;
  change: string;
  trend: "up" | "down";
};

export const companies: Company[] = [
  {
    id: "cmp-001",
    name: "Orion Logistics Hub",
    location: "北海道 札幌市",
    trainees: 58,
    completion: 73,
    riskScore: 18,
    nextAudit: "2025-02-21",
    sector: "ロジスティクス",
  },
  {
    id: "cmp-002",
    name: "Aster Foods Plant",
    location: "宮城県 仙台市",
    trainees: 34,
    completion: 66,
    riskScore: 22,
    nextAudit: "2024-12-11",
    sector: "食品加工",
  },
  {
    id: "cmp-003",
    name: "Nova Robotics Works",
    location: "愛知県 名古屋市",
    trainees: 63,
    completion: 59,
    riskScore: 29,
    nextAudit: "2025-01-28",
    sector: "ロボティクス",
  },
  {
    id: "cmp-004",
    name: "Lumen Care Services",
    location: "京都府 京丹後市",
    trainees: 26,
    completion: 81,
    riskScore: 12,
    nextAudit: "2024-10-09",
    sector: "ヘルスケア",
  },
  {
    id: "cmp-005",
    name: "Helio Marine Tech",
    location: "長崎県 佐世保市",
    trainees: 41,
    completion: 62,
    riskScore: 25,
    nextAudit: "2025-03-25",
    sector: "造船",
  },
];

export const sendingAgencies: SendingAgency[] = [
  {
    id: "sa-001",
    name: "SkyBridge HR",
    country: "ベトナム",
    migrants: 92,
    completion: 78,
    riskScore: 15,
    contact: "Ms. Linh",
  },
  {
    id: "sa-002",
    name: "NovaLink Recruitment",
    country: "フィリピン",
    migrants: 71,
    completion: 83,
    riskScore: 17,
    contact: "Mr. Dela Vega",
  },
  {
    id: "sa-003",
    name: "IndoLift Talent",
    country: "インドネシア",
    migrants: 64,
    completion: 72,
    riskScore: 21,
    contact: "Ms. Rani",
  },
  {
    id: "sa-004",
    name: "Steppe Mobility",
    country: "モンゴル",
    migrants: 44,
    completion: 76,
    riskScore: 14,
    contact: "Mr. Naran",
  },
  {
    id: "sa-005",
    name: "Solaris Gate",
    country: "ネパール",
    migrants: 53,
    completion: 69,
    riskScore: 20,
    contact: "Ms. Mira",
  },
];

export const migrants: Migrant[] = [
  {
    id: "mg-101",
    name: "Linh Truong",
    status: "技能実習2号",
    visaExpireDate: "2025-02-04",
    phase: "現場ローテ2",
    company: "Orion Logistics Hub",
    riskScore: 24,
    completion: 74,
  },
  {
    id: "mg-102",
    name: "Amara Singh",
    status: "特定技能1号",
    visaExpireDate: "2024-11-26",
    phase: "監査準備",
    company: "Aster Foods Plant",
    riskScore: 32,
    completion: 63,
  },
  {
    id: "mg-103",
    name: "Rafi Putra",
    status: "技能実習3号",
    visaExpireDate: "2025-05-12",
    phase: "手続更新中",
    company: "Nova Robotics Works",
    riskScore: 21,
    completion: 78,
  },
  {
    id: "mg-104",
    name: "Munkh Bileg",
    status: "技能実習2号",
    visaExpireDate: "2024-09-22",
    phase: "教育計画見直し",
    company: "Lumen Care Services",
    riskScore: 37,
    completion: 57,
  },
  {
    id: "mg-105",
    name: "Safi Rahman",
    status: "特定技能1号",
    visaExpireDate: "2024-12-18",
    phase: "監査フィードバック",
    company: "Helio Marine Tech",
    riskScore: 26,
    completion: 69,
  },
];

export const tasks: Task[] = [
  {
    id: "tsk-201",
    title: "計画認定: Nova Robotics 2025 改訂",
    dueDate: "2024-09-04",
    status: "in_progress",
    relatedEntity: "documents/plan",
    severity: "high",
  },
  {
    id: "tsk-202",
    title: "入国後講習レポート提出 (Orion)",
    dueDate: "2024-08-25",
    status: "open",
    relatedEntity: "companies/cmp-001",
    severity: "medium",
  },
  {
    id: "tsk-203",
    title: "監査報告ドラフトレビュー",
    dueDate: "2024-08-18",
    status: "open",
    relatedEntity: "documents/audit",
    severity: "high",
  },
  {
    id: "tsk-204",
    title: "請求書 前月複製の確認",
    dueDate: "2024-08-12",
    status: "in_progress",
    relatedEntity: "billing",
    severity: "low",
  },
  {
    id: "tsk-205",
    title: "CSV エクスポート仕様レビュー",
    dueDate: "2024-08-07",
    status: "done",
    relatedEntity: "csv",
    severity: "medium",
  },
];

export const documents: Document[] = [
  {
    id: "doc-301",
    name: "計画認定 2025 上期 (Orion)",
    type: "plan",
    status: "レビュー中",
    lastUpdated: "2024-07-31",
    owner: "tenantAdmin",
    completion: 74,
    deadline: "2024-09-15",
    riskScore: 24,
  },
  {
    id: "doc-302",
    name: "手続一括出力 8月分",
    type: "procedures",
    status: "準備中",
    lastUpdated: "2024-07-26",
    owner: "tenantStaff",
    completion: 51,
    deadline: "2024-08-28",
    riskScore: 22,
  },
  {
    id: "doc-303",
    name: "監査チェックリスト 2024-Q3",
    type: "audit",
    status: "差戻し",
    lastUpdated: "2024-07-29",
    owner: "tenantAdmin",
    completion: 58,
    deadline: "2024-08-19",
    riskScore: 33,
  },
  {
    id: "doc-304",
    name: "教育計画 札幌ライン",
    type: "plan",
    status: "確定",
    lastUpdated: "2024-07-18",
    owner: "tenantStaff",
    completion: 93,
    deadline: "2024-08-30",
    riskScore: 12,
  },
  {
    id: "doc-305",
    name: "技能検定アサイン表",
    type: "procedures",
    status: "入力中",
    lastUpdated: "2024-07-22",
    owner: "tenantStaff",
    completion: 57,
    deadline: "2024-09-08",
    riskScore: 20,
  },
  {
    id: "doc-306",
    name: "計画認定 Nova 2024-下期",
    type: "plan",
    status: "レビュー待ち",
    lastUpdated: "2024-07-28",
    owner: "tenantAdmin",
    completion: 68,
    deadline: "2024-09-22",
    riskScore: 28,
  },
  {
    id: "doc-307",
    name: "在留更新パック 2024-09",
    type: "procedures",
    status: "入力中",
    lastUpdated: "2024-08-01",
    owner: "tenantStaff",
    completion: 64,
    deadline: "2024-08-28",
    riskScore: 22,
  },
  {
    id: "doc-308",
    name: "監査報告 Nova Robotics Q3",
    type: "audit",
    status: "ドラフト",
    lastUpdated: "2024-07-30",
    owner: "tenantAdmin",
    completion: 46,
    deadline: "2024-08-21",
    riskScore: 30,
  },
  {
    id: "doc-309",
    name: "技能記録 JITCO 2024-Q3",
    type: "audit",
    status: "レビュー中",
    lastUpdated: "2024-08-02",
    owner: "tenantStaff",
    completion: 72,
    deadline: "2024-09-02",
    riskScore: 19,
  },
];

export const externalLinks = [
  { name: "OTIT", href: "https://www.otit.go.jp/" },
  { name: "JITCO", href: "https://www.jitco.or.jp/" },
  { name: "サポート", href: "https://support.example.com" },
];

export const kpiCards: KPI[] = [
  { title: "実習実施先数", value: 142, change: "+3.2%", trend: "up" },
  { title: "入国者数", value: 905, change: "+2.4%", trend: "up" },
  { title: "計画認定書類", value: 71, change: "-1.1%", trend: "down" },
  { title: "アカウント数", value: 236, change: "+0.9%", trend: "up" },
];

export const templateMonitors = [
  {
    id: "tmpl-401",
    name: "OTIT 技能実習計画 2024",
    url: "https://www.otit.go.jp/plan2024.pdf",
    lastHash: "a9e12b",
    hasDiff: true,
    aiSummary: "第2章の提出書式が更新。技能講習の記載欄が追加。",
    proposal: "計画テンプレの講習セクションに新規フィールドを追加してください。",
  },
  {
    id: "tmpl-402",
    name: "JITCO 監査報告 2024-Q3",
    url: "https://www.jitco.or.jp/audit2024.docx",
    lastHash: "9f3cd1",
    hasDiff: false,
    aiSummary: "差分なし",
    proposal: "現行の監査テンプレを継続利用可。",
  },
  {
    id: "tmpl-403",
    name: "入国後講習レポート",
    url: "https://example.com/orientation.pdf",
    lastHash: "51fb02",
    hasDiff: true,
    aiSummary: "写真貼付欄が必須化、提出期限が+7日延長。",
    proposal: "UIの必須マーク追加、期限ロジックを+7日に更新。",
  },
];

export const ganttSchedule = tasks.map((task, idx) => ({
  id: task.id,
  title: task.title,
  start: task.dueDate,
  end: task.dueDate,
  severity: task.severity,
  lane: idx + 1,
}));

export const aiShortcuts = [
  {
    title: "次にやること",
    prompt: "次にやることは？",
  },
  {
    title: "不足項目を確認",
    prompt: "監査書類の不足項目を教えて",
  },
  {
    title: "期限が近い手続",
    prompt: "期限が近い手続きは？",
  },
];
