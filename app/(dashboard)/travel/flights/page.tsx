import { UnderConstruction } from "@/components/ui/under-construction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane } from "lucide-react";

export default function TravelFlightsPage() {
  return (
    <div className="space-y-4">
      <UnderConstruction
        title="航空券検索（TRP）"
        description="TRP（旅行代理店システム）との連携による航空券検索・URL保存機能です。予約・決済はTRP側で行い、TENKUは検索URLと渡航情報を管理します。"
        plannedFeatures={[
          "TRPリンク誘導（外部サイトへの導線）",
          "航空券URL・予約番号の保存",
          "渡航情報（出発/到着/便名）の記録",
          "TravelPlanへの紐付け（person_id必須）",
          "一時帰国管理との連携（trip_group_id）",
          "在留期限との整合確認アラート",
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Plane size={16} className="text-brand-blue" />
            航空券情報の保存イメージ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted">
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border border-border bg-surface/60">
              <div>
                <p className="text-[10px] uppercase tracking-wide mb-1">travel_type</p>
                <p className="text-white font-mono">flight</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide mb-1">provider</p>
                <p className="text-white font-mono">TRP</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide mb-1">booking_url</p>
                <p className="text-brand-blue font-mono">（貼付URL）</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide mb-1">person_id</p>
                <p className="text-white font-mono">必須</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
