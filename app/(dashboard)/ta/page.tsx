import { UnderConstruction } from "@/components/ui/under-construction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const PIPELINE_STAGES = [
  { id: "TA0", label: "準備", description: "書類準備・確認" },
  { id: "TA1", label: "提出", description: "申請書類提出" },
  { id: "TA2", label: "追加", description: "追加資料対応" },
  { id: "TA3", label: "許可", description: "許可通知受領" },
  { id: "TA4", label: "切替完了", description: "在留資格切替完了" },
];

export default function TaPage() {
  return (
    <div className="space-y-4">
      <UnderConstruction
        title="特定活動（移行）"
        description="技能実習・特定技能から特定活動への移行管理パイプラインです。移行対象者のステータスをカンバン方式で可視化します。"
        plannedFeatures={[
          "移行パイプライン（カンバンボード）：準備→提出→追加→許可→切替完了",
          "在留期限と移行スケジュールの整合確認",
          "必要書類チェックリスト",
          "入管申請連携",
          "移行完了後の制度切替処理",
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            移行パイプライン概要
            <Link href="/ta/pipeline" className="text-xs text-brand-blue hover:underline">
              カンバンボードを開く →
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {PIPELINE_STAGES.map((stage) => (
              <div
                key={stage.id}
                className="min-w-[120px] p-3 rounded-lg border border-border bg-surface/60 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted font-mono">{stage.id}</span>
                  <Badge className="border-brand-amber text-brand-amber text-[10px]">工事中</Badge>
                </div>
                <p className="text-sm font-semibold text-white">{stage.label}</p>
                <p className="text-xs text-muted">{stage.description}</p>
                <div className="mt-2 h-1 rounded bg-surface" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="p-4 rounded-lg border border-border bg-surface/60 text-xs text-muted">
        <p className="font-semibold text-white mb-1">UI呼称ルール（特定活動）</p>
        <p>Person → <span className="text-brand-blue">特定活動（移行中）</span>　/　Company → <span className="text-brand-blue">所属予定機関</span>　/　Organization → <span className="text-brand-blue">支援機関</span></p>
      </div>
    </div>
  );
}
