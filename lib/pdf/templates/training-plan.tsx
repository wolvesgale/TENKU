import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { getPdfFontFamily } from "@/lib/pdf/setup";

const createStyles = (fontFamily: string) => {
  const baseText = { fontFamily };
  return StyleSheet.create({
    page: { padding: 28, fontSize: 10, ...baseText },
    title: { fontSize: 16, marginBottom: 12, ...baseText },
    section: { borderWidth: 1, borderColor: "#ddd", padding: 10, marginBottom: 10 },
    row: { flexDirection: "row", marginBottom: 6 },
    label: { width: 140, color: "#333", ...baseText },
    value: { flex: 1, ...baseText },
  });
};

export type TrainingPlanPdfData = {
  planId: string;
  planType: string;
  personName?: string;
  companyName?: string;
  status?: string;
  period?: string;
  description?: string;
};

export function TrainingPlanPdf({ data }: { data: TrainingPlanPdfData }) {
  const styles = createStyles(getPdfFontFamily());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>技能実習計画認定申請書（簡易版）</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>計画ID</Text>
            <Text style={styles.value}>{data.planId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>プラン種別</Text>
            <Text style={styles.value}>{data.planType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>対象者</Text>
            <Text style={styles.value}>{data.personName ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>受入企業</Text>
            <Text style={styles.value}>{data.companyName ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ステータス</Text>
            <Text style={styles.value}>{data.status ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>期間</Text>
            <Text style={styles.value}>{data.period ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>職種/作業</Text>
            <Text style={styles.value}>{data.description ?? ""}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
