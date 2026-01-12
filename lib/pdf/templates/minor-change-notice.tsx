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
    tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#cbd5f5", paddingBottom: 4, marginBottom: 6 },
    tableRow: { flexDirection: "row", marginBottom: 4 },
    cell: { flex: 1, fontFamily },
    cellWide: { flex: 2, fontFamily },
  });

export type MinorChangeNoticePdfData = {
  noticeId: string;
  month?: string;
  companyName?: string;
  supervisorName?: string;
  details: Array<{ foreignerId?: string; personName?: string; overtimeHours?: number; reason?: string }>;
};

export function MinorChangeNoticePdf({ data }: { data: MinorChangeNoticePdfData }) {
  const styles = createStyles(getPdfFontFamily());
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>残業時間軽微変更届</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>届出ID</Text>
            <Text style={styles.value}>{data.noticeId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>対象月</Text>
            <Text style={styles.value}>{data.month ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>受入企業</Text>
            <Text style={styles.value}>{data.companyName ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>監理団体</Text>
            <Text style={styles.value}>{data.supervisorName ?? ""}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.cell}>外国人ID</Text>
            <Text style={styles.cell}>氏名</Text>
            <Text style={styles.cell}>超過時間</Text>
            <Text style={styles.cellWide}>理由</Text>
          </View>
          {data.details.map((detail, idx) => (
            <View key={`${detail.foreignerId ?? idx}`} style={styles.tableRow}>
              <Text style={styles.cell}>{detail.foreignerId ?? ""}</Text>
              <Text style={styles.cell}>{detail.personName ?? ""}</Text>
              <Text style={styles.cell}>{detail.overtimeHours ?? ""}</Text>
              <Text style={styles.cellWide}>{detail.reason ?? ""}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
