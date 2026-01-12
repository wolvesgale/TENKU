import React from "react";
import { pdfTemplateSummaryMap, type PdfTemplateId } from "./manifest";
import { ResidencePeriodExtensionPdf, type ResidencePeriodExtensionPdfData } from "./residence-period-extension";
import { ResidenceStatusChangePdf, type ResidenceStatusChangePdfData } from "./residence-status-change";
import { SupportOrganizationRegistrationPdf, type SupportOrganizationRegistrationPdfData } from "./support-organization-registration";
import { PersonPdf, type PersonPdfData } from "./person";
import { MonitoringLogPdf, type MonitoringLogPdfData } from "./monitoring-log";
import { MinorChangeNoticePdf, type MinorChangeNoticePdfData } from "./minor-change-notice";

export type PdfTemplateDefinition<TData> = {
  id: string;
  title: string;
  description: string;
  category: string;
  sampleData: TData;
  render: (data: TData) => React.ReactElement;
};

export type AnyPdfTemplateDefinition = PdfTemplateDefinition<any>;

export const pdfTemplates: Array<
  | PdfTemplateDefinition<ResidenceStatusChangePdfData>
  | PdfTemplateDefinition<ResidencePeriodExtensionPdfData>
  | PdfTemplateDefinition<SupportOrganizationRegistrationPdfData>
  | PdfTemplateDefinition<PersonPdfData>
  | PdfTemplateDefinition<MonitoringLogPdfData>
  | PdfTemplateDefinition<MinorChangeNoticePdfData>
> = [
  {
    ...pdfTemplateSummaryMap["residence-status-change"],
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
    render: (data: ResidenceStatusChangePdfData) => <ResidenceStatusChangePdf data={data} />,
  },
  {
    ...pdfTemplateSummaryMap["residence-period-extension"],
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
    render: (data: ResidencePeriodExtensionPdfData) => <ResidencePeriodExtensionPdf data={data} />,
  },
  {
    ...pdfTemplateSummaryMap["support-organization-registration"],
    sampleData: {
      registrationNumber: "RSO-2024-003",
      organizationName: "TENKU_Cloud支援機構",
      representative: "Shun Aoki",
      address: "東京都千代田区丸の内1-1-1",
      contactPhone: "03-1234-5678",
      contactEmail: "contact@tenku.example.com",
      contactPerson: "Mina Kobayashi",
      serviceArea: "全国（リモート含む）",
      supportMenu: "生活オリエンテーション / 日本語学習支援 / 住居確保 / 行政手続き同行",
      trackRecord: "受入実績 120名 / 直近1年 35名",
    },
    render: (data: SupportOrganizationRegistrationPdfData) => <SupportOrganizationRegistrationPdf data={data} />,
  },
  {
    ...pdfTemplateSummaryMap["person"],
    sampleData: {
      personId: "prs-001",
      fullName: "Linh Truong",
      nationality: "ベトナム",
      foreignerId: "FR-0001",
      residenceCardNumber: "VN1234567",
      residenceCardExpiry: "2025-03-20",
      passportNumber: "TR1234567",
      assignmentCompany: "Orion Logistics",
      specialty: "物流・倉庫管理",
      address: "北海道札幌市中央区1-2-3",
      memo: "特記事項なし。",
    },
    render: (data: PersonPdfData) => <PersonPdf data={data} />,
  },
  {
    ...pdfTemplateSummaryMap["monitoring-log"],
    sampleData: {
      logId: "mlog-001",
      date: "2024-10-10",
      logType: "巡回",
      personName: "Linh Truong",
      companyName: "Orion Logistics",
      supervisorName: "TENKU_Cloud 監理団体",
      overtimeHours: 30,
      memo: "生活状況・勤務環境に問題なし。",
    },
    render: (data: MonitoringLogPdfData) => <MonitoringLogPdf data={data} />,
  },
  {
    ...pdfTemplateSummaryMap["minor-change-notice"],
    sampleData: {
      noticeId: "mcn-001",
      month: "2024-10",
      companyName: "Aster Foods",
      supervisorName: "TENKU_Cloud 監理団体",
      details: [
        { foreignerId: "FR-0002", personName: "Amara Singh", overtimeHours: 48, reason: "繁忙期のため" },
      ],
    },
    render: (data: MinorChangeNoticePdfData) => <MinorChangeNoticePdf data={data} />,
  },
];

export const pdfTemplateRegistry = Object.fromEntries(pdfTemplates.map((tpl) => [tpl.id, tpl])) as Record<
  PdfTemplateId,
  AnyPdfTemplateDefinition
>;

export type { PdfTemplateId } from "./manifest";

export function getPdfTemplateById(id: PdfTemplateId): AnyPdfTemplateDefinition | undefined {
  return pdfTemplates.find((tpl) => tpl.id === id);
}
