import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { getPdfFontFamily } from "@/lib/pdf/setup";

const createStyles = (fontFamily: string) =>
  StyleSheet.create({
    page: { padding: 28, fontSize: 10, fontFamily },
    title: { fontSize: 16, marginBottom: 12, fontFamily },
    section: { borderWidth: 1, borderColor: "#e5e7eb", padding: 10, marginBottom: 10 },
    row: { flexDirection: "row", marginBottom: 6 },
    label: { width: 140, color: "#334155", fontFamily },
    value: { flex: 1, fontFamily },
  });

export type MonitoringLogPdfData = {
  logId: string;
  date?: string;
  logType?: string;
  personName?: string;
  companyName?: string;
  supervisorName?: string;
  overtimeHours?: number;
  workingTimeSystem?: string;
  changeMemo?: string;
  memo?: string;
};

export function MonitoringLogPdf({ data }: { data: MonitoringLogPdfData }) {
  const styles = createStyles(getPdfFontFamily());
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>巡回・監査ログ</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>ログID</Text>
            <Text style={styles.value}>{data.logId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>日付</Text>
            <Text style={styles.value}>{data.date ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>種別</Text>
            <Text style={styles.value}>{data.logType ?? ""}</Text>
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
            <Text style={styles.label}>監理団体</Text>
            <Text style={styles.value}>{data.supervisorName ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>残業時間</Text>
            <Text style={styles.value}>{data.overtimeHours ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>労働時間制度</Text>
            <Text style={styles.value}>{data.workingTimeSystem ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>変更内容メモ</Text>
            <Text style={styles.value}>{data.changeMemo ?? ""}</Text>
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
