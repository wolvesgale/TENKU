import { UnderConstruction } from "@/components/ui/under-construction";

export default function ChatStaffPage() {
  return (
    <UnderConstruction
      title="職員向けAIアシスタント"
      description="監理団体・支援機関職員の業務をサポートするAIアシスタントです。書類確認・手続きガイド・法令Q&Aなどを提供します。"
      plannedFeatures={[
        "入管法・技能実習法・特定技能規定Q&A",
        "書類作成サポート（様式チェック・記入ガイド）",
        "手続き期限の確認・アドバイス",
        "AIタスクルール設定のサポート",
        "対話履歴の保存",
        "ロール別アクセス制御（管理者/担当者）",
      ]}
    />
  );
}
