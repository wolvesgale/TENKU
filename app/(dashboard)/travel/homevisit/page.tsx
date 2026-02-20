import { UnderConstruction } from "@/components/ui/under-construction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TRIP_STATUSES = [
  { status: "DRAFT", label: "草稿", color: "border-muted text-muted" },
  { status: "PREP", label: "準備中", color: "border-brand-amber text-brand-amber" },
  { status: "READY", label: "出発前", color: "border-brand-blue text-brand-blue" },
  { status: "OUTBOUND", label: "出国中", color: "border-brand-teal text-brand-teal" },
  { status: "RETURNED", label: "帰国済", color: "border-emerald-400 text-emerald-300" },
];

const CHECKLIST_ITEMS = [
  "在留期限と帰国日の整合確認",
  "緊急連絡先の共有",
  "航空券URL（TRP）",
  "国内移動URL（高速バス）",
  "パスポート有効期限確認",
];

export default function TravelHomevisitPage() {
  return (
    <div className="space-y-4">
      <UnderConstruction
        title="一時帰国管理"
        description="一時帰国を航空券・国内移動をまとめた旅程セットとして管理します。trip_group_idで複数TravelPlanを束ねてライフサイクル管理します。"
        plannedFeatures={[
          "一時帰国旅程の作成（trip_group_id付与）",
          "航空券（TRP）+ 高速バスのセット管理",
          "ステータス管理：DRAFT→PREP→READY→OUTBOUND→RETURNED",
          "チェックリスト（在留期限整合・連絡先・URL確認）",
          "AIタスク：出国7日前リマインド",
          "AIタスク：帰国2日前確認",
          "在留期限リスク検知（CRITICAL）",
          "一時帰国記録・履歴管理",
        ]}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">旅程ステータス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {TRIP_STATUSES.map((s) => (
                <Badge key={s.status} className={`${s.color} flex items-center gap-1`}>
                  <span className="font-mono text-[10px]">{s.status}</span>
                  <span>{s.label}</span>
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">DRAFT → PREP → READY → OUTBOUND → RETURNED</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">必須チェックリスト</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {CHECKLIST_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-4 h-4 rounded border border-border bg-surface/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">自動タスク（AIタスクルール）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { trigger: "出国7日前", task: "出国前確認リマインド", severity: "medium" },
              { trigger: "帰国2日前", task: "帰国確認・連絡先確認", severity: "medium" },
              { trigger: "在留期限超過リスク", task: "在留期限リスクアラート", severity: "critical" },
            ].map((rule) => (
              <div key={rule.trigger} className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface/60">
                <div>
                  <p className="text-sm text-white">{rule.trigger}</p>
                  <p className="text-xs text-muted">→ {rule.task}</p>
                </div>
                <Badge
                  className={
                    rule.severity === "critical"
                      ? "border-rose-400 text-rose-300"
                      : "border-brand-amber text-brand-amber"
                  }
                >
                  {rule.severity.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
