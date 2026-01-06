import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { getPdfFontFamily } from "@/lib/pdf/setup";

const createStyles = (fontFamily: string) => {
  const baseText = { fontFamily };
  return StyleSheet.create({
    page: { padding: 28, fontSize: 10, ...baseText },
    title: { fontSize: 16, marginBottom: 12, ...baseText },
    section: { borderWidth: 1, borderColor: "#ddd", padding: 10, marginBottom: 10 },
    sectionTitle: { fontSize: 12, marginBottom: 6, ...baseText },
    row: { flexDirection: "row", marginBottom: 6 },
    label: { width: 160, color: "#333", ...baseText },
    value: { flex: 1, ...baseText },
  });
};

export type ResidencePeriodExtensionPdfData = {
  applicationNumber: string;
  applicantName: string;
  nationality: string;
  birthDate?: string;
  passportNumber?: string;
  currentResidenceStatus: string;
  currentExpiryDate: string;
  requestedPeriod: string;
  reasonSummary?: string;
  employerName?: string;
  workplace?: string;
  contactPhone?: string;
};

export function ResidencePeriodExtensionPdf({ data }: { data: ResidencePeriodExtensionPdfData }) {
  const styles = createStyles(getPdfFontFamily());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>在留期間更新許可申請書（簡易テンプレート）</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>申請者情報（必須）</Text>
          <View style={styles.row}>
            <Text style={styles.label}>受付番号</Text>
            <Text style={styles.value}>{data.applicationNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>氏名</Text>
            <Text style={styles.value}>{data.applicantName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>国籍・地域</Text>
            <Text style={styles.value}>{data.nationality}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>生年月日</Text>
            <Text style={styles.value}>{data.birthDate ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>旅券番号</Text>
            <Text style={styles.value}>{data.passportNumber ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>連絡先</Text>
            <Text style={styles.value}>{data.contactPhone ?? ""}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>更新内容（必須）</Text>
          <View style={styles.row}>
            <Text style={styles.label}>現在の在留資格</Text>
            <Text style={styles.value}>{data.currentResidenceStatus}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>現有効期限</Text>
            <Text style={styles.value}>{data.currentExpiryDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>希望する期間</Text>
            <Text style={styles.value}>{data.requestedPeriod}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>更新理由概要</Text>
            <Text style={styles.value}>{data.reasonSummary ?? ""}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>活動先・就労情報</Text>
          <View style={styles.row}>
            <Text style={styles.label}>所属機関／雇用主</Text>
            <Text style={styles.value}>{data.employerName ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>勤務地・活動場所</Text>
            <Text style={styles.value}>{data.workplace ?? ""}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
