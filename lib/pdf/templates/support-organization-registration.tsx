import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const baseText = { fontFamily: "NotoSansJP" };

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 10, ...baseText },
  title: { fontSize: 16, marginBottom: 12, ...baseText },
  grid: { flexDirection: "row", gap: 8 },
  section: { borderWidth: 1, borderColor: "#ddd", padding: 10, marginBottom: 10, flex: 1 },
  sectionTitle: { fontSize: 12, marginBottom: 6, ...baseText },
  row: { flexDirection: "row", marginBottom: 6 },
  label: { width: 160, color: "#333", ...baseText },
  value: { flex: 1, ...baseText },
  note: { fontSize: 9, color: "#555", ...baseText },
});

export type SupportOrganizationRegistrationPdfData = {
  registrationNumber: string;
  organizationName: string;
  representative: string;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  serviceArea?: string;
  supportMenu?: string;
  trackRecord?: string;
  contactPerson?: string;
};

export function SupportOrganizationRegistrationPdf({ data }: { data: SupportOrganizationRegistrationPdfData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>登録支援機関登録申請書（簡易レイアウト）</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本情報</Text>
          <View style={styles.row}>
            <Text style={styles.label}>受付番号</Text>
            <Text style={styles.value}>{data.registrationNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>機関名</Text>
            <Text style={styles.value}>{data.organizationName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>代表者氏名</Text>
            <Text style={styles.value}>{data.representative}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>所在地</Text>
            <Text style={styles.value}>{data.address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>担当者</Text>
            <Text style={styles.value}>{data.contactPerson ?? ""}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>連絡先</Text>
            <View style={styles.row}>
              <Text style={styles.label}>電話番号</Text>
              <Text style={styles.value}>{data.contactPhone ?? ""}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>メールアドレス</Text>
              <Text style={styles.value}>{data.contactEmail ?? ""}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>対応エリア</Text>
              <Text style={styles.value}>{data.serviceArea ?? ""}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>支援メニュー</Text>
            <View style={styles.row}>
              <Text style={styles.label}>提供内容</Text>
              <Text style={styles.value}>{data.supportMenu ?? ""}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>実績・人数</Text>
              <Text style={styles.value}>{data.trackRecord ?? ""}</Text>
            </View>
            <Text style={styles.note}>※ 支援計画添付欄を別紙扱いで示す想定</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
