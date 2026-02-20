import { UnderConstruction } from "@/components/ui/under-construction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PLANNED_INTEGRATIONS = [
  { name: "Google Classroom API", category: "教育", status: "工事中" },
  { name: "Google Drive API", category: "教育・書類", status: "工事中" },
  { name: "TRP（旅行代理店）", category: "航空券", status: "工事中" },
  { name: "発車オーライネット", category: "高速バス", status: "リンク誘導のみ" },
  { name: "OTIT（外国人技能実習機構）", category: "申請", status: "部分実装" },
  { name: "入管（Immigration API）", category: "申請", status: "工事中" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <UnderConstruction
        title="設定・連携"
        description="API連携、ロール/権限管理、AIタスクルール設定などのシステム管理機能です。"
        plannedFeatures={[
          "API連携管理（Google / TRP / OTIT）",
          "ロール・権限設定（管理者 / 担当者 / 閲覧者）",
          "AIタスクルール設定（重複防止キー管理）",
          "テナント設定",
          "通知設定（アラート閾値）",
          "監査ログ",
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">外部連携一覧（予定）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {PLANNED_INTEGRATIONS.map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface/60"
              >
                <div>
                  <p className="text-sm text-white">{integration.name}</p>
                  <p className="text-xs text-muted">{integration.category}</p>
                </div>
                <Badge
                  className={
                    integration.status === "部分実装"
                      ? "border-brand-blue text-brand-blue"
                      : integration.status === "リンク誘導のみ"
                        ? "border-emerald-400 text-emerald-300"
                        : "border-brand-amber text-brand-amber"
                  }
                >
                  {integration.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
