export type PdfTemplateId =
  | "residence-status-change"
  | "residence-period-extension"
  | "support-organization-registration"
  | "person"
  | "monitoring-log"
  | "minor-change-notice";

export type PdfTemplateSummary = {
  id: PdfTemplateId;
  title: string;
  description: string;
  category: string;
};

export const pdfTemplateManifest: PdfTemplateSummary[] = [
  {
    id: "residence-status-change",
    title: "在留資格変更許可申請書",
    description: "必須項目と申請者情報のみの簡易レイアウト。現状の資格から変更後資格への切替用。",
    category: "入管手続",
  },
  {
    id: "residence-period-extension",
    title: "在留期間更新許可申請書",
    description: "在留資格を維持したまま期間延長する想定の最小構成テンプレート。",
    category: "入管手続",
  },
  {
    id: "support-organization-registration",
    title: "登録支援機関登録申請書",
    description: "支援体制・実績欄を個別フォーマットで配置した登録支援機関向けテンプレート。",
    category: "登録申請",
  },
  {
    id: "person",
    title: "外国人管理票",
    description: "外国人の基本情報と配属情報をまとめた管理票テンプレート。",
    category: "外国人管理",
  },
  {
    id: "monitoring-log",
    title: "巡回・監査ログ",
    description: "巡回監査ログの内容を一覧化するテンプレート。",
    category: "監査",
  },
  {
    id: "minor-change-notice",
    title: "残業時間軽微変更届",
    description: "月間残業時間の超過者一覧を提出用に整理したテンプレート。",
    category: "監査",
  },
];

export const pdfTemplateSummaryMap = Object.fromEntries(pdfTemplateManifest.map((tpl) => [tpl.id, tpl])) as Record<
  PdfTemplateId,
  PdfTemplateSummary
>;

export function getPdfTemplateSummary(id: PdfTemplateId) {
  return pdfTemplateSummaryMap[id];
}
