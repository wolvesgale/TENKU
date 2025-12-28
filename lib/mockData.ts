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
    name: "北極技研ホールディングス",
    location: "北海道 札幌市",
    trainees: 42,
    completion: 82,
    riskScore: 12,
    nextAudit: "2025-02-14",
    sector: "製造・DXライン",
  },
  {
    id: "cmp-002",
    name: "彩雲メディカルラボ",
    location: "宮城県 仙台市",
    trainees: 28,
    completion: 76,
    riskScore: 18,
    nextAudit: "2024-12-04",
    sector: "医療・介護",
  },
  {
    id: "cmp-003",
    name: "銀河オートメーション",
    location: "愛知県 名古屋市",
    trainees: 57,
    completion: 68,
    riskScore: 24,
    nextAudit: "2025-01-20",
    sector: "自動車・ロボティクス",
  },
  {
    id: "cmp-004",
    name: "ブルームフーズファーム",
    location: "京都府 京丹後市",
    trainees: 19,
    completion: 71,
    riskScore: 9,
    nextAudit: "2024-10-02",
    sector: "農業・食品",
  },
  {
    id: "cmp-005",
    name: "ネオマリンシップ",
    location: "長崎県 佐世保市",
    trainees: 33,
    completion: 64,
    riskScore: 21,
    nextAudit: "2025-03-18",
    sector: "造船・海運",
  },
];

export const sendingAgencies: SendingAgency[] = [
  {
    id: "sa-001",
    name: "Hanoi Future Bridge",
    country: "ベトナム",
    migrants: 85,
    completion: 74,
    riskScore: 16,
    contact: "Ms. Trang",
  },
  {
    id: "sa-002",
    name: "Manila Aurora Links",
    country: "フィリピン",
    migrants: 64,
    completion: 80,
    riskScore: 14,
    contact: "Mr. Diaz",
  },
  {
    id: "sa-003",
    name: "Jakarta Nexus",
    country: "インドネシア",
    migrants: 71,
    completion: 69,
    riskScore: 22,
    contact: "Ms. Rani",
  },
  {
    id: "sa-004",
    name: "Ulaanbaatar Orbit",
    country: "モンゴル",
    migrants: 38,
    completion: 77,
    riskScore: 11,
    contact: "Mr. Batsaikhan",
  },
  {
    id: "sa-005",
    name: "Bangkok Horizon",
    country: "タイ",
    migrants: 59,
    completion: 73,
    riskScore: 19,
    contact: "Ms. Supatra",
  },
];

export const migrants: Migrant[] = [
  {
    id: "mg-101",
    name: "Nguyen Thanh Hoa",
    status: "技能実習2号",
    visaExpireDate: "2025-01-12",
    phase: "実務ローテ2",
    company: "北極技研ホールディングス",
    riskScore: 28,
    completion: 72,
  },
  {
    id: "mg-102",
    name: "Srey Pov",
    status: "特定技能1号",
    visaExpireDate: "2024-11-03",
    phase: "監査準備",
    company: "彩雲メディカルラボ",
    riskScore: 34,
    completion: 66,
  },
  {
    id: "mg-103",
    name: "Mohammad Fajar",
    status: "技能実習3号",
    visaExpireDate: "2025-04-27",
    phase: "手続更新中",
    company: "銀河オートメーション",
    riskScore: 19,
    completion: 81,
  },
  {
    id: "mg-104",
    name: "Batsaikhan Enkh",
    status: "技能実習2号",
    visaExpireDate: "2024-09-15",
    phase: "教育計画見直し",
    company: "ブルームフーズファーム",
    riskScore: 41,
    completion: 59,
  },
  {
    id: "mg-105",
    name: "Supatra Kittima",
    status: "特定技能1号",
    visaExpireDate: "2024-12-30",
    phase: "監査フィードバック",
    company: "ネオマリンシップ",
    riskScore: 23,
    completion: 77,
  },
];

export const tasks: Task[] = [
  {
    id: "tsk-201",
    title: "計画認定：銀河オートメーション 2025改訂版",
    dueDate: "2024-09-01",
    status: "in_progress",
    relatedEntity: "documents/plan",
    severity: "high",
  },
  {
    id: "tsk-202",
    title: "入国後講習レポート提出 (北極技研)",
    dueDate: "2024-08-22",
    status: "open",
    relatedEntity: "companies/cmp-001",
    severity: "medium",
  },
  {
    id: "tsk-203",
    title: "監査報告ドラフトレビュー",
    dueDate: "2024-08-15",
    status: "open",
    relatedEntity: "documents/audit",
    severity: "high",
  },
  {
    id: "tsk-204",
    title: "請求書 前月複製の確認",
    dueDate: "2024-08-10",
    status: "in_progress",
    relatedEntity: "billing",
    severity: "low",
  },
  {
    id: "tsk-205",
    title: "CSV エクスポート仕様レビュー",
    dueDate: "2024-08-05",
    status: "done",
    relatedEntity: "csv",
    severity: "medium",
  },
];

export const documents: Document[] = [
  {
    id: "doc-301",
    name: "計画認定 2025 上期 (北極技研)",
    type: "plan",
    status: "レビュー中",
    lastUpdated: "2024-07-30",
    owner: "tenantAdmin",
    completion: 78,
  },
  {
    id: "doc-302",
    name: "手続一括出力 8月分",
    type: "procedures",
    status: "準備中",
    lastUpdated: "2024-07-25",
    owner: "tenantStaff",
    completion: 44,
  },
  {
    id: "doc-303",
    name: "監査チェックリスト 2024-Q3",
    type: "audit",
    status: "差戻し",
    lastUpdated: "2024-07-28",
    owner: "tenantAdmin",
    completion: 62,
  },
  {
    id: "doc-304",
    name: "教育計画 札幌ライン",
    type: "plan",
    status: "確定",
    lastUpdated: "2024-07-15",
    owner: "tenantStaff",
    completion: 95,
  },
  {
    id: "doc-305",
    name: "技能検定アサイン表",
    type: "procedures",
    status: "入力中",
    lastUpdated: "2024-07-20",
    owner: "tenantStaff",
    completion: 53,
  },
];

export const externalLinks = [
  { name: "OTIT", href: "https://www.otit.go.jp/" },
  { name: "JITCO", href: "https://www.jitco.or.jp/" },
  { name: "サポート", href: "https://support.example.com" },
];

export const kpiCards: KPI[] = [
  { title: "実習実施先数", value: 128, change: "+4.1%", trend: "up" },
  { title: "入国者数", value: 842, change: "+1.8%", trend: "up" },
  { title: "計画認定書類", value: 63, change: "-0.8%", trend: "down" },
  { title: "アカウント数", value: 214, change: "+0.5%", trend: "up" },
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
