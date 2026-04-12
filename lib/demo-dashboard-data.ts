export type DashboardDocument = {
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

export type DashboardKpi = {
  title: string;
  value: number;
  change: string;
  trend: "up" | "down";
};

export type ExternalLink = {
  name: string;
  href: string;
};

export const dashboardDocuments: DashboardDocument[] = [
  {
    id: "doc-301",
    name: "計画認定 2025 上期 (丹波FC)",
    type: "plan",
    status: "レビュー中",
    lastUpdated: "2026-03-20",
    owner: "tenantAdmin",
    completion: 74,
    deadline: "2026-04-30",
    riskScore: 24,
  },
  {
    id: "doc-302",
    name: "手続一括出力 2026-03月分",
    type: "procedures",
    status: "準備中",
    lastUpdated: "2026-03-15",
    owner: "tenantStaff",
    completion: 51,
    deadline: "2026-04-15",
    riskScore: 22,
  },
  {
    id: "doc-303",
    name: "監査チェックリスト 2024-Q3",
    type: "audit",
    status: "差戻し",
    lastUpdated: "2026-03-22",
    owner: "tenantAdmin",
    completion: 58,
    deadline: "2026-04-10",
    riskScore: 33,
  },
  {
    id: "doc-304",
    name: "教育計画 札幌ライン",
    type: "plan",
    status: "確定",
    lastUpdated: "2026-03-05",
    owner: "tenantStaff",
    completion: 93,
    deadline: "2026-05-01",
    riskScore: 12,
  },
  {
    id: "doc-305",
    name: "技能検定アサイン表",
    type: "procedures",
    status: "入力中",
    lastUpdated: "2026-03-10",
    owner: "tenantStaff",
    completion: 57,
    deadline: "2026-04-25",
    riskScore: 20,
  },
  {
    id: "doc-306",
    name: "計画認定 紀洋会 2025-上期",
    type: "plan",
    status: "レビュー待ち",
    lastUpdated: "2026-03-18",
    owner: "tenantAdmin",
    completion: 68,
    deadline: "2026-05-15",
    riskScore: 28,
  },
  {
    id: "doc-307",
    name: "在留更新パック 2026-04",
    type: "procedures",
    status: "入力中",
    lastUpdated: "2026-03-25",
    owner: "tenantStaff",
    completion: 64,
    deadline: "2026-04-15",
    riskScore: 22,
  },
  {
    id: "doc-308",
    name: "監査報告 丹波フレッシュチキン Q1",
    type: "audit",
    status: "ドラフト",
    lastUpdated: "2026-03-23",
    owner: "tenantAdmin",
    completion: 46,
    deadline: "2026-04-12",
    riskScore: 30,
  },
  {
    id: "doc-309",
    name: "技能記録 JITCO 2024-Q3",
    type: "audit",
    status: "レビュー中",
    lastUpdated: "2026-03-27",
    owner: "tenantStaff",
    completion: 72,
    deadline: "2026-04-20",
    riskScore: 19,
  },
];

export const dashboardExternalLinks: ExternalLink[] = [
  { name: "OTIT", href: "https://www.otit.go.jp/" },
  { name: "JITCO", href: "https://www.jitco.or.jp/" },
  { name: "サポート", href: "https://support.example.com" },
];

export const dashboardKpiCards: DashboardKpi[] = [
  { title: "実習実施先数", value: 10, change: "+1", trend: "up" },
  { title: "在留管理人数", value: 49, change: "+11", trend: "up" },
  { title: "申請管理件数", value: 33, change: "+5", trend: "up" },
  { title: "登録済みアカウント", value: 4, change: "+1", trend: "up" },
];
