import { UnderConstruction } from "@/components/ui/under-construction";

export default function SupportPage() {
  return (
    <UnderConstruction
      title="支援・運用 / 支援計画・面談・記録"
      description="特定技能外国人への支援計画立案、面談実施記録、巡回記録を一元管理するセクションです。既存の監理団体巡回ログとも連携します。"
      plannedFeatures={[
        "1号・2号支援計画の作成・承認フロー",
        "定期面談記録（4ヶ月ごと自動リマインド）",
        "随時面談・相談記録",
        "支援記録レポート出力",
        "外部支援委託管理",
        "巡回記録との統合ビュー（既存MonitoringLogと連携）",
        "支援完了チェックリスト",
        "届出書類との紐付け",
      ]}
    />
  );
}
