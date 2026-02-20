import { UnderConstruction } from "@/components/ui/under-construction";

export default function ChatForeignerPage() {
  return (
    <UnderConstruction
      title="外国人向けチャットボット"
      description="在留・生活・手続きに関する外国人からの相談を受け付けるチャットボットです。相談内容はタスク化してTENKU担当者に連携します。"
      plannedFeatures={[
        "多言語対応チャット（ID / VI / NE / EN / JA）",
        "よくある相談テンプレート（在留更新・生活・職場）",
        "相談内容の自動タスク化",
        "担当者への通知・エスカレーション",
        "チャット履歴の保存・参照",
        "緊急相談の優先フラグ",
        "翻訳・通訳セクションとの連携",
      ]}
    />
  );
}
