import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const baseText = { fontFamily: "NotoSansJP" };

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 10, ...baseText },
  title: { fontSize: 16, marginBottom: 12, ...baseText },
  section: { borderWidth: 1, borderColor: "#ddd", padding: 10, marginBottom: 10 },
  sectionTitle: { fontSize: 12, marginBottom: 6, ...baseText },
  row: { flexDirection: "row", marginBottom: 6 },
  label: { width: 160, color: "#333", ...baseText },
  value: { flex: 1, ...baseText },
});

export type ResidenceStatusChangePdfData = {
  applicationNumber: string;
  applicantName: string;
  nationality: string;
  birthDate?: string;
  passportNumber?: string;
  address?: string;
  contactPhone?: string;
  currentResidenceStatus: string;
  desiredResidenceStatus: string;
  intendedActivity?: string;
  reasonSummary?: string;
  employerName?: string;
  employerAddress?: string;
};

export function ResidenceStatusChangePdf({ data }: { data: ResidenceStatusChangePdfData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>在留資格変更許可申請書（簡易テンプレート）</Text>

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
            <Text style={styles.label}>現住所</Text>
            <Text style={styles.value}>{data.address ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>連絡先</Text>
            <Text style={styles.value}>{data.contactPhone ?? ""}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>変更内容（必須）</Text>
          <View style={styles.row}>
            <Text style={styles.label}>現在の在留資格</Text>
            <Text style={styles.value}>{data.currentResidenceStatus}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>変更後の希望資格</Text>
            <Text style={styles.value}>{data.desiredResidenceStatus}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>予定活動・所属先</Text>
            <Text style={styles.value}>{data.intendedActivity ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>変更理由概要</Text>
            <Text style={styles.value}>{data.reasonSummary ?? ""}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>受入機関情報</Text>
          <View style={styles.row}>
            <Text style={styles.label}>受入機関名</Text>
            <Text style={styles.value}>{data.employerName ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>所在地</Text>
            <Text style={styles.value}>{data.employerAddress ?? ""}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
