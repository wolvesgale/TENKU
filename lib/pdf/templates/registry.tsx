import React from "react";
import { ResidencePeriodExtensionPdf, type ResidencePeriodExtensionPdfData } from "./residence-period-extension";
import { ResidenceStatusChangePdf, type ResidenceStatusChangePdfData } from "./residence-status-change";
import { SupportOrganizationRegistrationPdf, type SupportOrganizationRegistrationPdfData } from "./support-organization-registration";

export type PdfTemplateDefinition<TData> = {
  id: string;
  title: string;
  description: string;
  category: string;
  sampleData: TData;
  render: (data: TData) => React.ReactElement;
};

export const pdfTemplates: Array<
  | PdfTemplateDefinition<ResidenceStatusChangePdfData>
  | PdfTemplateDefinition<ResidencePeriodExtensionPdfData>
  | PdfTemplateDefinition<SupportOrganizationRegistrationPdfData>
> = [
  {
    id: "residence-status-change",
    title: "在留資格変更許可申請書",
    description: "必須項目と申請者情報のみの簡易レイアウト。現状の資格から変更後資格への切替用。",
    category: "入管手続",
    sampleData: {
      applicationNumber: "CHG-2024-001",
      applicantName: "Linh Truong",
      nationality: "ベトナム",
      birthDate: "1998-04-12",
      passportNumber: "TR1234567",
      address: "北海道札幌市中央区1-2-3",
      contactPhone: "080-1234-5678",
      currentResidenceStatus: "技能実習2号",
      desiredResidenceStatus: "特定技能1号（外食）",
      intendedActivity: "飲食店での調理補助・接客",
      reasonSummary: "技能実習修了後、受入企業での継続就労希望。",
      employerName: "Orion Logistics Hub",
      employerAddress: "北海道札幌市北区5-6-7",
    },
    render: (data) => <ResidenceStatusChangePdf data={data} />,
  },
  {
    id: "residence-period-extension",
    title: "在留期間更新許可申請書",
    description: "在留資格を維持したまま期間延長する想定の最小構成テンプレート。",
    category: "入管手続",
    sampleData: {
      applicationNumber: "EXT-2024-002",
      applicantName: "Amara Singh",
      nationality: "フィリピン",
      birthDate: "1996-09-30",
      passportNumber: "SG9876543",
      currentResidenceStatus: "特定技能1号（介護）",
      currentExpiryDate: "2025-01-15",
      requestedPeriod: "1年",
      reasonSummary: "現行雇用契約の継続および介護職での技能向上のため。",
      employerName: "Aster Foods Plant",
      workplace: "宮城県仙台市青葉区2-8-1",
      contactPhone: "080-9876-5432",
    },
    render: (data) => <ResidencePeriodExtensionPdf data={data} />,
  },
  {
    id: "support-organization-registration",
    title: "登録支援機関登録申請書",
    description: "支援体制・実績欄を個別フォーマットで配置した登録支援機関向けテンプレート。",
    category: "登録申請",
    sampleData: {
      registrationNumber: "RSO-2024-003",
      organizationName: "TENKU支援機構",
      representative: "Shun Aoki",
      address: "東京都千代田区丸の内1-1-1",
      contactPhone: "03-1234-5678",
      contactEmail: "contact@tenku.example.com",
      contactPerson: "Mina Kobayashi",
      serviceArea: "全国（リモート含む）",
      supportMenu: "生活オリエンテーション / 日本語学習支援 / 住居確保 / 行政手続き同行",
      trackRecord: "受入実績 120名 / 直近1年 35名",
    },
    render: (data) => <SupportOrganizationRegistrationPdf data={data} />,
  },
];

export type PdfTemplateId = (typeof pdfTemplates)[number]["id"];

export function getPdfTemplateById(id: PdfTemplateId) {
  return pdfTemplates.find((tpl) => tpl.id === id);
}
