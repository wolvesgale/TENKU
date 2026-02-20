import { UnderConstruction } from "@/components/ui/under-construction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SSW_STAGES = [
  { label: "特定技能外国人一覧", status: "工事中" },
  { label: "定期面談", status: "工事中" },
  { label: "随時届出", status: "工事中" },
  { label: "定期届出", status: "工事中" },
  { label: "支援計画", status: "工事中" },
  { label: "入管申請", status: "工事中" },
  { label: "支援記録", status: "工事中" },
  { label: "国内転職", status: "工事中" },
  { label: "特定活動移行", status: "工事中" },
];

export default function SswPage() {
  return (
    <div className="space-y-4">
      <UnderConstruction
        title="特定技能"
        description="特定技能外国人の管理・支援・届出・申請を一元管理するセクションです。既存の外国人マスター・企業マスターと連携します。"
        plannedFeatures={[
          "特定技能外国人一覧（外国人マスター共通）",
          "定期面談記録（4ヶ月ごと）",
          "随時届出・定期届出の管理と期限アラート",
          "1号・2号支援計画の作成・管理",
          "入管申請（在留資格変更・更新）",
          "支援記録の蓄積",
          "国内転職処理フロー",
          "特定活動（移行）へのパイプライン連携",
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">機能マップ（特定技能）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SSW_STAGES.map((stage) => (
              <div
                key={stage.label}
                className="p-3 rounded-lg border border-border bg-surface/60 flex items-center justify-between"
              >
                <span className="text-sm text-gray-300">{stage.label}</span>
                <Badge className="border-brand-amber text-brand-amber text-[10px]">
                  {stage.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="p-4 rounded-lg border border-border bg-surface/60 text-xs text-muted">
        <p className="font-semibold text-white mb-1">UI呼称ルール（特定技能）</p>
        <p>Person → <span className="text-brand-blue">特定技能外国人</span>　/　Company → <span className="text-brand-blue">所属機関</span>　/　Organization → <span className="text-brand-blue">支援機関</span></p>
      </div>
    </div>
  );
}
