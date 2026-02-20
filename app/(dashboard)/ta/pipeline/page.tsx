import { UnderConstruction } from "@/components/ui/under-construction";

export default function TaPipelinePage() {
  return (
    <UnderConstruction
      title="特定活動 移行パイプライン"
      description="移行対象者のステータスをカンバン方式で管理します。ドラッグ&ドロップによるステージ移動と自動タスク生成を実装予定です。"
      plannedFeatures={[
        "TA0 準備：対象者選定・書類チェックリスト生成",
        "TA1 提出：申請書類一括出力・提出記録",
        "TA2 追加資料：不備通知対応・追加書類管理",
        "TA3 許可：許可通知管理・在留期限更新",
        "TA4 切替完了：制度切替処理・次回手続きスケジューリング",
        "在留期限リスク自動検知（CRITICAL アラート）",
        "カンバンボード（ドラッグ&ドロップ）",
      ]}
    />
  );
}
