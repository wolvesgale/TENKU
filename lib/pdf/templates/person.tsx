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

export type PersonPdfData = {
  personId: string;
  fullName?: string;
  nationality?: string;
  foreignerId?: string;
  residenceCardNumber?: string;
  residenceCardExpiry?: string;
  passportNumber?: string;
  assignmentCompany?: string;
  specialty?: string;
  address?: string;
  memo?: string;
};

export function PersonPdf({ data }: { data: PersonPdfData }) {
  const styles = createStyles(getPdfFontFamily());
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>外国人管理票</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>外国人ID</Text>
            <Text style={styles.value}>{data.foreignerId ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>氏名</Text>
            <Text style={styles.value}>{data.fullName ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>国籍</Text>
            <Text style={styles.value}>{data.nationality ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>在留カード番号</Text>
            <Text style={styles.value}>{data.residenceCardNumber ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>在留期限</Text>
            <Text style={styles.value}>{data.residenceCardExpiry ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>パスポート番号</Text>
            <Text style={styles.value}>{data.passportNumber ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>配属企業</Text>
            <Text style={styles.value}>{data.assignmentCompany ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>職種/分野</Text>
            <Text style={styles.value}>{data.specialty ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>住所</Text>
            <Text style={styles.value}>{data.address ?? ""}</Text>
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
