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

export type CoePdfData = {
  applicationId: string;
  applicationType: string;
  personName?: string;
  companyName?: string;
  status?: string;
  submittedAt?: string;
  dueDate?: string;
  memo?: string;
};

export function CoeApplicationPdf({ data }: { data: CoePdfData }) {
  const styles = createStyles(getPdfFontFamily());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>在留資格認定証明書交付申請（簡易版）</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>申請ID</Text>
            <Text style={styles.value}>{data.applicationId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>申請タイプ</Text>
            <Text style={styles.value}>{data.applicationType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>申請者</Text>
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
            <Text style={styles.label}>提出日</Text>
            <Text style={styles.value}>{data.submittedAt ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>期限</Text>
            <Text style={styles.value}>{data.dueDate ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>メモ</Text>
            <Text style={styles.value}>{data.memo ?? ""}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
