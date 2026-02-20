import { UnderConstruction } from "@/components/ui/under-construction";

export default function TranslationPage() {
  return (
    <UnderConstruction
      title="翻訳・通訳"
      description="書類・面談・支援記録の多言語翻訳ジョブを管理します。TENKUは翻訳ジョブの管理・追跡を行い、翻訳自体は外部サービスと連携します。"
      plannedFeatures={[
        "翻訳ジョブの登録・ステータス管理",
        "対象言語：ID（インドネシア語）/ VI（ベトナム語）/ NE（ネパール語）/ EN（英語）",
        "書類翻訳（PDF・Word対応予定）",
        "面談・支援記録の多言語化",
        "教育コンテンツ翻訳との連携（教育セクション）",
        "翻訳履歴・バージョン管理",
        "通訳手配記録",
      ]}
    />
  );
}
