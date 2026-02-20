import { UnderConstruction } from "@/components/ui/under-construction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const KPI_DEFINITIONS = [
  { label: "出席率", formula: "期限内提出 ÷ 対象課題数", alert: "< 70%" },
  { label: "提出率", formula: "提出済 ÷ 期限到来課題数", alert: "< 60%" },
  { label: "正解率", formula: "得点 ÷ 満点", alert: "< 60%" },
];

export default function EducationPage() {
  return (
    <div className="space-y-4">
      <UnderConstruction
        title="教育（Google Classroom連携）"
        description="Google Classroomの授業・課題データをTENKUに同期し、外国人の学習進捗を可視化・管理するセクションです。"
        plannedFeatures={[
          "Google Classroom API連携（日次同期 02:00 JST）",
          "コース・名簿・課題・提出・成績の自動取込",
          "手動同期（コース単位・個人単位）",
          "出席率・提出率・正解率のKPIダッシュボード",
          "AI音声解説（日本語→多言語翻訳・音声生成）：ID/VI/NE/EN",
          "未提出アラート自動タスク生成",
          "弱点設問の音声コンテンツ自動作成",
          "Google Driveへの音声ファイル保存・リンク登録",
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">教育KPI定義（確定）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {KPI_DEFINITIONS.map((kpi) => (
              <div
                key={kpi.label}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface/60"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{kpi.label}</p>
                  <p className="text-xs text-muted">{kpi.formula}</p>
                </div>
                <Badge className="border-rose-400 text-rose-300 text-[10px]">
                  アラート {kpi.alert}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">AI音声解説フロー（予定）</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {[
              "日本語原稿の自動生成",
              "多言語翻訳（ID / VI / NE / EN）",
              "音声ファイル生成",
              "Google Drive保存 → /Education/{Course}/{Lesson}/audio/",
              "TENKUにDocumentとして登録",
              "Google ClassroomにリンクURL貼付",
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="shrink-0 w-5 h-5 rounded-full bg-brand-blue/20 border border-brand-blue text-brand-blue text-[10px] flex items-center justify-center">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
