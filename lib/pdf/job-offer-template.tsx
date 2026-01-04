import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// 日本語フォント登録（必要に応じて）
// Font.register({ family: "NotoSansJP", src: "/fonts/NotoSansJP-Regular.ttf" });
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 10 },
  title: { fontSize: 16, marginBottom: 12 },
  row: { flexDirection: "row", marginBottom: 6 },
  label: { width: 120, color: "#333" },
  value: { flex: 1 },
  box: { borderWidth: 1, borderColor: "#ddd", padding: 10, marginTop: 10 },
});

export type JobOfferPdfData = {
  jobTitle: string;
  companyName: string;
  companyAddress?: string;
  contactName?: string;
  contactTel?: string;
  workLocation?: string;
  salary?: string;
  notes?: string;
  version: number;
};

export function JobOfferPdf({ data }: { data: JobOfferPdfData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>求人票（TENKU） v{data.version}</Text>

        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.label}>求人タイトル</Text>
            <Text style={styles.value}>{data.jobTitle}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>企業名</Text>
            <Text style={styles.value}>{data.companyName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>所在地</Text>
            <Text style={styles.value}>{data.companyAddress ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>担当者</Text>
            <Text style={styles.value}>{data.contactName ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>電話</Text>
            <Text style={styles.value}>{data.contactTel ?? ""}</Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.label}>勤務地</Text>
            <Text style={styles.value}>{data.workLocation ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>給与</Text>
            <Text style={styles.value}>{data.salary ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>備考</Text>
            <Text style={styles.value}>{data.notes ?? ""}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
