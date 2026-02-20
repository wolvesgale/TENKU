import { UnderConstruction } from "@/components/ui/under-construction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Bus } from "lucide-react";

export default function TravelBusPage() {
  return (
    <div className="space-y-4">
      <UnderConstruction
        title="国内移動（高速バス）"
        description="発車オーライネットへのリンク誘導による高速バス検索・予約URLの保存管理です。API連携・予約・決済は行わず、URLをTENKUに保存して旅程管理します。"
        plannedFeatures={[
          "発車オーライネット誘導ボタン",
          "検索後URLのTENKUへの貼付・保存",
          "TravelPlan（travel_type=bus）への登録",
          "一時帰国管理との連携（trip_group_id）",
          "person_id必須での紐付け管理",
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Bus size={16} className="text-brand-blue" />
            高速バス検索導線（実装予定）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border border-border bg-surface/60 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">発車オーライネットで検索</p>
              <p className="text-xs text-muted">高速バス予約サイトへ移動します</p>
            </div>
            <a
              href="https://www.j-bus.co.jp/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-blue text-brand-blue text-sm hover:bg-brand-blue/10 transition"
            >
              <ExternalLink size={14} />
              検索サイトへ
            </a>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[10px] uppercase tracking-wide text-muted">保存データ構造</p>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border border-border bg-surface/60">
              <div>
                <p className="text-[10px] uppercase tracking-wide mb-1 text-muted">travel_type</p>
                <p className="text-white font-mono">bus</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide mb-1 text-muted">provider</p>
                <p className="text-white font-mono">jbus_hassyaro</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase tracking-wide mb-1 text-muted">booking_url</p>
                <p className="text-brand-blue font-mono">（発車オーライ検索後URL貼付）</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
