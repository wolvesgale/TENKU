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

export const dashboardExternalLinks: ExternalLink[] = [
  { name: "OTIT", href: "https://www.otit.go.jp/" },
  { name: "JITCO", href: "https://www.jitco.or.jp/" },
  { name: "サポート", href: "https://support.example.com" },
];

export const dashboardKpiCards: DashboardKpi[] = [
  { title: "実習実施先数", value: 142, change: "+3.2%", trend: "up" },
  { title: "入国者数", value: 905, change: "+2.4%", trend: "up" },
  { title: "計画認定書類", value: 71, change: "-1.1%", trend: "down" },
  { title: "アカウント数", value: 236, change: "+0.9%", trend: "up" },
];
