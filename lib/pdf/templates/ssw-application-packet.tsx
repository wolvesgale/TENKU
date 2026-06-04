import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { getPdfFontFamily } from "@/lib/pdf/setup";
import { SSW_APP_TYPES } from "@/lib/field-map";

// ─── データ型定義 ──────────────────────────────────────────────────────────────

export type SswPacketData = {
  // 申請情報
  appType: "COE" | "COS" | "EXT";
  status: string;
  generatedAt: string;
  // 申請人
  person: {
    fullName: string;
    nameKanji?: string;
    nameKana?: string;
    nameRoma?: string;
    nationality?: string;
    birthdate?: string;
    gender?: string;
    birthPlace?: string;
    passportNumber?: string;
    passportExpiry?: string;
    residenceCardNumber?: string;
    residenceCardExpiry?: string;
    dormAddress?: string;
    phoneNumber?: string;
    emailAddress?: string;
    lastEducation?: string;
    sswSector?: string;
    occupationType?: string;
    japaneseTestType?: string;
    japaneseTestLevel?: string;
    japaneseTestDate?: string;
    japaneseTestCertNo?: string;
    skillTestType?: string;
    skillTestDate?: string;
    skillTestCertNo?: string;
    titp2Completed?: boolean;
    titp2CertNumber?: string;
  };
  // 所属機関
  company: {
    name: string;
    address?: string;
    phone?: string;
    fax?: string;
    corporateNumber?: string;
    representativeName?: string;
    representativeTitle?: string;
    industry?: string;
    laborInsuranceNo?: string;
    employmentInsuranceNo?: string;
    socialInsuranceStatus?: string;
    sswReceiptNo?: string;
    contactName?: string;
    contactTel?: string;
    contactPersonTitle?: string;
  };
  // 雇用・支援
  employment: {
    employerType?: string;
    employmentType?: string;
    contractStartDate?: string;
    contractEndDate?: string;
    monthlySalary?: number;
    workLocation?: string;
    workContent?: string;
    isDelegated?: boolean;
    supportOrgName?: string;
    supportOrgRegNo?: string;
  };
  // 申請日程
  schedule: {
    targetSubmitDate?: string;
    submittedDate?: string;
    approvedDate?: string;
    notes?: string;
  };
  // 書類チェック
  docChecklist?: Record<string, boolean>;
};

// ─── スタイル ──────────────────────────────────────────────────────────────────

const createStyles = (fontFamily: string) =>
  StyleSheet.create({
    page: { padding: 30, fontSize: 9, fontFamily, color: "#111" },
    coverPage: { padding: 30, fontSize: 9, fontFamily, color: "#111", backgroundColor: "#f8f9fa" },
    // タイトル
    coverTitle: { fontSize: 20, fontFamily, textAlign: "center", marginTop: 60, marginBottom: 8 },
    coverSubtitle: { fontSize: 13, fontFamily, textAlign: "center", color: "#555", marginBottom: 40 },
    coverBox: { borderWidth: 1, borderColor: "#ccc", padding: 16, marginTop: 10, marginBottom: 10, backgroundColor: "#fff" },
    coverRow: { flexDirection: "row", marginBottom: 8, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: "#eee" },
    coverLabel: { width: 120, fontFamily, color: "#555" },
    coverValue: { flex: 1, fontFamily },
    coverNote: { fontSize: 8, color: "#888", marginTop: 30, textAlign: "center" },
    // セクション
    sectionTitle: { fontSize: 12, fontFamily, backgroundColor: "#1a3a5c", color: "#fff", padding: "5 10", marginTop: 14, marginBottom: 0 },
    sectionSubTitle: { fontSize: 10, fontFamily, backgroundColor: "#e8f0fe", color: "#1a3a5c", padding: "4 10", marginTop: 8, marginBottom: 0 },
    table: { borderWidth: 1, borderColor: "#ccc", marginTop: 0 },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ddd" },
    tableRowLast: { flexDirection: "row" },
    tableHeader: { backgroundColor: "#f5f5f5", fontFamily, padding: "5 8", width: "35%" },
    tableValue: { padding: "5 8", width: "65%" },
    tableHeaderWide: { backgroundColor: "#f5f5f5", fontFamily, padding: "5 8", width: "40%" },
    tableValueWide: { padding: "5 8", width: "60%" },
    // 2カラム
    twoCol: { flexDirection: "row", gap: 10, marginTop: 8 },
    col: { flex: 1, borderWidth: 1, borderColor: "#ccc" },
    // チェックリスト
    checkRow: { flexDirection: "row", padding: "4 8", borderBottomWidth: 1, borderBottomColor: "#eee", alignItems: "center" },
    checkBox: { width: 14, height: 14, borderWidth: 1, borderColor: "#666", marginRight: 6, alignItems: "center", justifyContent: "center" },
    checkmark: { fontSize: 10, color: "#1a73e8" },
    checkLabel: { flex: 1 },
    checkForm: { width: 80, color: "#888", textAlign: "right" },
    required: { color: "#c00", marginLeft: 4 },
    // フッター
    footer: { position: "absolute", bottom: 20, left: 30, right: 30, flexDirection: "row", justifyContent: "space-between" },
    footerText: { fontSize: 7, color: "#aaa" },
    // 警告
    warningBox: { backgroundColor: "#fff8e1", borderWidth: 1, borderColor: "#f6b800", padding: 8, marginTop: 8 },
    warningText: { color: "#856404", fontSize: 8 },
    // 参照枠
    refBox: { backgroundColor: "#e8f0fe", borderWidth: 1, borderColor: "#3c7dc4", padding: 8, marginTop: 8 },
    refText: { color: "#1a3a5c", fontSize: 8 },
  });

// ─── ヘルパー ─────────────────────────────────────────────────────────────────

function fmtDate(s?: string) {
  if (!s) return "　　　　年　　月　　日";
  try {
    const d = new Date(s);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  } catch { return s; }
}

function val(v?: string | number | boolean | null, fallback = "（未入力）") {
  if (v === undefined || v === null || v === "") return fallback;
  if (typeof v === "boolean") return v ? "はい" : "いいえ";
  return String(v);
}

// ─── コンポーネント: 行 ────────────────────────────────────────────────────────

function Row({ label, value, styles, last = false, wide = false }: {
  label: string; value?: string | number | boolean | null;
  styles: ReturnType<typeof createStyles>; last?: boolean; wide?: boolean;
}) {
  return (
    <View style={last ? styles.tableRowLast : styles.tableRow}>
      <Text style={wide ? styles.tableHeaderWide : styles.tableHeader}>{label}</Text>
      <Text style={wide ? styles.tableValueWide : styles.tableValue}>{val(value)}</Text>
    </View>
  );
}

// ─── メインPDF ────────────────────────────────────────────────────────────────

export function SswApplicationPacketPdf({ data }: { data: SswPacketData }) {
  const fontFamily = getPdfFontFamily();
  const S = createStyles(fontFamily);
  const appTypeMeta = SSW_APP_TYPES[data.appType] ?? SSW_APP_TYPES.EXT;

  const STATUS_LABELS: Record<string, string> = {
    DRAFT: "下書き", REVIEW: "確認中", SUBMITTED: "提出済",
    APPROVED: "許可", REJECTED: "不許可", CANCELLED: "取消",
  };

  return (
    <Document>
      {/* ─────────── 表紙 ─────────── */}
      <Page size="A4" style={S.coverPage}>
        <Text style={S.coverTitle}>特定技能 入管申請パッケージ</Text>
        <Text style={S.coverSubtitle}>{appTypeMeta.label}</Text>
        <Text style={{ textAlign: "center", fontSize: 10, fontFamily, color: "#333", marginBottom: 20 }}>
          {appTypeMeta.formNumber}
        </Text>

        <View style={S.coverBox}>
          <View style={S.coverRow}>
            <Text style={S.coverLabel}>申請人氏名</Text>
            <Text style={S.coverValue}>{val(data.person.nameKanji ?? data.person.nameRoma ?? data.person.fullName)}</Text>
          </View>
          <View style={S.coverRow}>
            <Text style={S.coverLabel}>所属機関名</Text>
            <Text style={S.coverValue}>{val(data.company.name)}</Text>
          </View>
          <View style={S.coverRow}>
            <Text style={S.coverLabel}>国籍・地域</Text>
            <Text style={S.coverValue}>{val(data.person.nationality)}</Text>
          </View>
          <View style={S.coverRow}>
            <Text style={S.coverLabel}>特定産業分野</Text>
            <Text style={S.coverValue}>{val(data.person.sswSector)}</Text>
          </View>
          <View style={S.coverRow}>
            <Text style={S.coverLabel}>申請状態</Text>
            <Text style={S.coverValue}>{STATUS_LABELS[data.status] ?? data.status}</Text>
          </View>
          {data.schedule.targetSubmitDate && (
            <View style={S.coverRow}>
              <Text style={S.coverLabel}>申請予定日</Text>
              <Text style={S.coverValue}>{fmtDate(data.schedule.targetSubmitDate)}</Text>
            </View>
          )}
        </View>

        <View style={S.refBox}>
          <Text style={S.refText}>
            本書類は TENKU_Cloud システムにより生成された申請管理用資料です。{"\n"}
            実際の申請には法務省入国管理局の所定様式（{appTypeMeta.formNumber}）を使用してください。{"\n"}
            最新書式：https://www.moj.go.jp/isa/applications/ssw/10_00020.html
          </Text>
        </View>

        <Text style={S.coverNote}>生成日時：{data.generatedAt}</Text>

        <View style={S.footer}>
          <Text style={S.footerText}>TENKU_Cloud 特定技能申請パッケージ</Text>
          <Text style={S.footerText}>{data.appType} / 1 of {data.appType === "COE" ? "6" : "5"}</Text>
        </View>
      </Page>

      {/* ─────────── 申請人情報（別記様式本体 相当） ─────────── */}
      <Page size="A4" style={S.page}>
        <Text style={S.sectionTitle}>第1部：申請人（特定技能外国人）情報</Text>
        <Text style={{ fontSize: 8, color: "#666", marginTop: 4, fontFamily }}>
          ※ {appTypeMeta.formNumber} 申請書 相当項目
        </Text>

        <Text style={S.sectionSubTitle}>1-1. 基本情報</Text>
        <View style={S.table}>
          <Row label="氏名（ローマ字）" value={data.person.nameRoma ?? data.person.fullName} styles={S} />
          <Row label="氏名（漢字）" value={data.person.nameKanji} styles={S} />
          <Row label="氏名（カナ）" value={data.person.nameKana} styles={S} />
          <Row label="国籍・地域" value={data.person.nationality} styles={S} />
          <Row label="生年月日" value={fmtDate(data.person.birthdate)} styles={S} />
          <Row label="性別" value={data.person.gender} styles={S} />
          <Row label="出生地" value={data.person.birthPlace} styles={S} />
          <Row label="最終学歴" value={data.person.lastEducation} styles={S} last />
        </View>

        <Text style={S.sectionSubTitle}>1-2. 旅券・在留カード情報</Text>
        <View style={S.table}>
          <Row label="旅券番号" value={data.person.passportNumber} styles={S} />
          <Row label="旅券有効期限" value={fmtDate(data.person.passportExpiry)} styles={S} />
          {(data.appType === "COS" || data.appType === "EXT") && (
            <>
              <Row label="在留カード番号" value={data.person.residenceCardNumber} styles={S} />
              <Row label="在留カード有効期限" value={fmtDate(data.person.residenceCardExpiry)} styles={S} />
            </>
          )}
          <Row label="住居地（日本）" value={data.person.dormAddress} styles={S} />
          <Row label="連絡先電話番号" value={data.person.phoneNumber} styles={S} />
          <Row label="メールアドレス" value={data.person.emailAddress} styles={S} last />
        </View>

        <Text style={S.sectionSubTitle}>1-3. 就労情報</Text>
        <View style={S.table}>
          <Row label="特定産業分野" value={data.person.sswSector} styles={S} />
          <Row label="業務区分" value={data.person.occupationType} styles={S} last />
        </View>

        <View style={S.footer}>
          <Text style={S.footerText}>TENKU_Cloud 特定技能申請パッケージ</Text>
          <Text style={S.footerText}>{data.appType} — 申請人情報</Text>
        </View>
      </Page>

      {/* ─────────── 試験・資格（試験要件確認） ─────────── */}
      <Page size="A4" style={S.page}>
        <Text style={S.sectionTitle}>第2部：試験・資格情報（特定技能要件確認）</Text>

        <Text style={S.sectionSubTitle}>2-1. 試験免除の確認</Text>
        <View style={S.table}>
          <Row label="技能実習2号修了による試験免除"
            value={data.person.titp2Completed ? "はい（免除対象）" : "いいえ（試験受験要）"}
            styles={S} />
          {data.person.titp2Completed && (
            <Row label="技能実習2号修了証明書番号" value={data.person.titp2CertNumber} styles={S} />
          )}
          <Row label="　" value="　" styles={S} last />
        </View>

        {!data.person.titp2Completed && (
          <>
            <Text style={S.sectionSubTitle}>2-2. 特定技能評価試験</Text>
            <View style={S.table}>
              <Row label="試験種別" value={data.person.skillTestType} styles={S} />
              <Row label="合格日" value={fmtDate(data.person.skillTestDate)} styles={S} />
              <Row label="合格証書番号" value={data.person.skillTestCertNo} styles={S} last />
            </View>

            <Text style={S.sectionSubTitle}>2-3. 日本語能力試験（N4以上相当）</Text>
            <View style={S.table}>
              <Row label="試験種別" value={data.person.japaneseTestType} styles={S} />
              <Row label="合格レベル" value={data.person.japaneseTestLevel} styles={S} />
              <Row label="合格日" value={fmtDate(data.person.japaneseTestDate)} styles={S} />
              <Row label="合格証書番号" value={data.person.japaneseTestCertNo} styles={S} last />
            </View>
          </>
        )}

        <View style={S.warningBox}>
          <Text style={S.warningText}>
            ⚠ 重要：上記情報は参考様式第１号系書類（試験合格証等）の原本確認が必要です。{"\n"}
            技能実習2号修了による免除の場合は技能実習計画認定通知書の写し等を添付してください。
          </Text>
        </View>

        <View style={S.footer}>
          <Text style={S.footerText}>TENKU_Cloud 特定技能申請パッケージ</Text>
          <Text style={S.footerText}>{data.appType} — 試験・資格情報</Text>
        </View>
      </Page>

      {/* ─────────── 所属機関情報（参考様式第１－０号相当） ─────────── */}
      <Page size="A4" style={S.page}>
        <Text style={S.sectionTitle}>第3部：特定技能所属機関情報</Text>
        <Text style={{ fontSize: 8, color: "#666", marginTop: 4, fontFamily }}>
          ※ 参考様式第１－０号「特定技能所属機関概要書」相当
        </Text>

        <Text style={S.sectionSubTitle}>3-1. 機関の基本情報</Text>
        <View style={S.table}>
          <Row label="機関名称" value={data.company.name} styles={S} />
          <Row label="法人番号" value={data.company.corporateNumber} styles={S} />
          <Row label="代表者氏名" value={data.company.representativeName} styles={S} />
          <Row label="代表者役職" value={data.company.representativeTitle} styles={S} />
          <Row label="所在地" value={data.company.address} styles={S} />
          <Row label="電話番号" value={data.company.phone} styles={S} />
          <Row label="FAX番号" value={data.company.fax} styles={S} />
          <Row label="業種" value={data.company.industry} styles={S} />
          <Row label="届出受理番号（SSW）" value={data.company.sswReceiptNo} styles={S} last />
        </View>

        <Text style={S.sectionSubTitle}>3-2. 社会保険・労働保険</Text>
        <View style={S.table}>
          <Row label="社会保険加入状況" value={data.company.socialInsuranceStatus} styles={S} />
          <Row label="雇用保険適用番号" value={data.company.employmentInsuranceNo} styles={S} />
          <Row label="労働保険番号" value={data.company.laborInsuranceNo} styles={S} last />
        </View>

        <Text style={S.sectionSubTitle}>3-3. 連絡担当者</Text>
        <View style={S.table}>
          <Row label="連絡担当者氏名" value={data.company.contactName} styles={S} />
          <Row label="連絡担当者役職" value={data.company.contactPersonTitle} styles={S} />
          <Row label="連絡担当者電話" value={data.company.contactTel} styles={S} last />
        </View>

        <View style={S.footer}>
          <Text style={S.footerText}>TENKU_Cloud 特定技能申請パッケージ</Text>
          <Text style={S.footerText}>{data.appType} — 所属機関情報（参考様式第１－０号相当）</Text>
        </View>
      </Page>

      {/* ─────────── 雇用契約・支援（参考様式第１－４号/第２－３号相当） ─────────── */}
      <Page size="A4" style={S.page}>
        <Text style={S.sectionTitle}>第4部：雇用契約・支援体制</Text>

        <Text style={S.sectionSubTitle}>4-1. 特定技能雇用契約（参考様式第１－４号相当）</Text>
        <View style={S.table}>
          <Row label="雇用主区分" value={data.employment.employerType === "corporate" ? "法人" : "個人事業主"} styles={S} />
          <Row label="雇用形態" value={data.employment.employmentType} styles={S} />
          <Row label="雇用契約開始日" value={fmtDate(data.employment.contractStartDate)} styles={S} />
          <Row label="雇用契約終了日" value={fmtDate(data.employment.contractEndDate)} styles={S} />
          <Row label="月額報酬" value={data.employment.monthlySalary ? `${data.employment.monthlySalary.toLocaleString()}円` : undefined} styles={S} />
          <Row label="就労場所" value={data.employment.workLocation} styles={S} />
          <Row label="従事する業務の内容" value={data.employment.workContent} styles={S} last />
        </View>

        <Text style={S.sectionSubTitle}>4-2. 支援体制（参考様式第２－３号相当）</Text>
        <View style={S.table}>
          <Row label="支援委託の有無"
            value={data.employment.isDelegated ? "あり（登録支援機関へ委託）" : "なし（自社で支援実施）"}
            styles={S} />
          {data.employment.isDelegated && (
            <>
              <Row label="登録支援機関名" value={data.employment.supportOrgName} styles={S} />
              <Row label="登録支援機関 登録番号" value={data.employment.supportOrgRegNo} styles={S} />
            </>
          )}
          <Row label="　" value="　" styles={S} last />
        </View>

        {!data.employment.isDelegated && (
          <View style={S.warningBox}>
            <Text style={S.warningText}>
              ⚠ 自社支援の場合：支援責任者・支援担当者の選任、各支援計画11項目の実施体制を確認してください。
            </Text>
          </View>
        )}

        <View style={S.footer}>
          <Text style={S.footerText}>TENKU_Cloud 特定技能申請パッケージ</Text>
          <Text style={S.footerText}>{data.appType} — 雇用契約・支援（参考様式第１－４号/第２－３号相当）</Text>
        </View>
      </Page>

      {/* ─────────── 書類チェックリスト ─────────── */}
      <Page size="A4" style={S.page}>
        <Text style={S.sectionTitle}>第5部：必要書類チェックリスト</Text>
        <Text style={{ fontSize: 8, color: "#666", marginTop: 4, fontFamily }}>
          ※ {data.appType} / {data.employment.employerType === "corporate" ? "法人" : "個人事業主"} /
          {data.employment.isDelegated ? " 登録支援機関委託あり" : " 自社支援"} の場合の必要書類
        </Text>

        {[
          { party: "申請人", color: "#1a3a5c" },
          { party: "所属機関", color: "#1a6644" },
          { party: "登録支援機関", color: "#5b1a80" },
        ].map(({ party, color }) => {
          const docItems: Array<{ key: string; label: string; required: boolean; referenceForm?: string; note?: string }> = [];

          // 申請人共通
          if (party === "申請人") {
            docItems.push(
              { key: "app_form", label: "申請書（所定様式）", required: true, note: "入管庁指定様式（窓口/オンライン）" },
              { key: "photo", label: "写真（縦4cm×横3cm）", required: true, note: "申請前3ヶ月以内・正面・無帽" },
              { key: "passport_copy", label: "パスポートコピー", required: true, note: "顔写真ページ・査証ページ全て" },
              { key: "skill_test_cert", label: "特定技能評価試験合格証等", required: true, note: "技能試験+日本語試験（免除の場合は修了証）" },
            );
            if (data.appType === "COE") {
              docItems.push({ key: "return_envelope", label: "返信用封筒（簡易書留）", required: true, note: "382円切手貼付済み" });
            }
            if (data.appType === "COS" || data.appType === "EXT") {
              docItems.push({ key: "residence_card", label: "在留カード（両面コピー）", required: true, note: "現在の在留カード" });
            }
            if (data.appType === "EXT") {
              docItems.push({ key: "residence_certificate", label: "住民票", required: true, note: "発行後3ヶ月以内" });
            }
          }

          // 所属機関
          if (party === "所属機関") {
            docItems.push(
              { key: "employment_contract", label: "特定技能雇用契約書の写し", required: true, referenceForm: "参考様式第１－４号" },
              { key: "employer_overview", label: "特定技能所属機関概要書", required: true, referenceForm: "参考様式第１－０号" },
              { key: "cost_explanation", label: "徴収費用の説明書", required: true, referenceForm: "参考様式第１－６号" },
              { key: "support_plan", label: "1号特定技能外国人支援計画書", required: true, referenceForm: "参考様式第２－３号" },
              { key: "sector_docs", label: "特定産業分野に係る書類", required: true, note: "分野別協議会加入証明等" },
            );
            if (data.employment.employerType === "corporate") {
              docItems.push(
                { key: "registration_cert", label: "登記事項証明書", required: true, note: "発行後3ヶ月以内" },
                { key: "tax_return_corp", label: "法人税確定申告書（直近1年）", required: true },
                { key: "officer_list", label: "役員リスト", required: true, referenceForm: "参考様式第１－２号" },
                { key: "insurance_docs", label: "社会保険・雇用保険関係書類", required: true },
              );
            } else {
              docItems.push(
                { key: "residence_doc_individual", label: "代表者住民票の写し", required: true, note: "発行後3ヶ月以内" },
                { key: "income_tax_return", label: "確定申告書の写し（直近1年）", required: true },
              );
            }
          }

          // 登録支援機関
          if (party === "登録支援機関" && data.employment.isDelegated) {
            docItems.push(
              { key: "support_delegation_contract", label: "支援委託契約書の写し", required: true, referenceForm: "参考様式第４－１号" },
              { key: "support_org_overview", label: "登録支援機関概要書", required: true, referenceForm: "参考様式第４－２号" },
            );
          }

          if (!docItems.length) return null;

          return (
            <View key={party} style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 9, fontFamily, backgroundColor: color, color: "#fff", padding: "4 8", marginBottom: 0 }}>
                {party} が準備する書類
              </Text>
              <View style={{ borderWidth: 1, borderColor: "#ccc" }}>
                {docItems.map((item, idx) => {
                  const checked = data.docChecklist?.[item.key] ?? false;
                  return (
                    <View key={item.key} style={idx < docItems.length - 1 ? S.checkRow : { ...S.checkRow, borderBottomWidth: 0 }}>
                      <View style={S.checkBox}>
                        {checked && <Text style={S.checkmark}>✓</Text>}
                      </View>
                      <View style={S.checkLabel}>
                        <Text style={{ fontFamily, textDecoration: checked ? "line-through" : "none", color: checked ? "#888" : "#111" }}>
                          {item.label}
                          {item.required && <Text style={S.required}>*</Text>}
                        </Text>
                        {item.note && <Text style={{ fontSize: 7, color: "#888" }}>{item.note}</Text>}
                      </View>
                      <Text style={S.checkForm}>{item.referenceForm ?? ""}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 7, color: "#888", fontFamily }}>
            * 印は必須書類です。必ず原本または所定の写しを準備してください。✓ は確認済み。
          </Text>
        </View>

        <View style={S.footer}>
          <Text style={S.footerText}>TENKU_Cloud 特定技能申請パッケージ</Text>
          <Text style={S.footerText}>{data.appType} — 書類チェックリスト</Text>
        </View>
      </Page>

      {/* ─────────── 申請管理サマリー ─────────── */}
      <Page size="A4" style={S.page}>
        <Text style={S.sectionTitle}>第6部：申請日程・管理情報</Text>

        <Text style={S.sectionSubTitle}>6-1. 申請スケジュール</Text>
        <View style={S.table}>
          <Row label="申請状態" value={STATUS_LABELS[data.status] ?? data.status} styles={S} />
          <Row label="申請予定日" value={fmtDate(data.schedule.targetSubmitDate)} styles={S} />
          <Row label="申請提出日" value={fmtDate(data.schedule.submittedDate)} styles={S} />
          <Row label="許可日" value={fmtDate(data.schedule.approvedDate)} styles={S} last />
        </View>

        {data.schedule.notes && (
          <>
            <Text style={S.sectionSubTitle}>6-2. 備考・メモ</Text>
            <View style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginTop: 0, minHeight: 60 }}>
              <Text style={{ fontFamily }}>{data.schedule.notes}</Text>
            </View>
          </>
        )}

        <Text style={S.sectionSubTitle}>6-3. 関連参考様式（法務省）</Text>
        <View style={{ borderWidth: 1, borderColor: "#ccc" }}>
          {[
            ["参考様式第１－０号", "特定技能所属機関概要書"],
            ["参考様式第１－２号", "役員リスト"],
            ["参考様式第１－４号", "特定技能雇用契約書"],
            ["参考様式第１－６号", "徴収費用の説明書"],
            ["参考様式第２－３号", "1号特定技能外国人支援計画書"],
            ["参考様式第４－１号", "支援委託契約書（委託時）"],
            ["参考様式第４－２号", "登録支援機関概要書（委託時）"],
            ["参考様式第５－８号", "生活オリエンテーションの確認書"],
            ["参考様式第５－９号", "事前ガイダンスの確認書"],
          ].map(([form, title], i, arr) => (
            <View key={form} style={i < arr.length - 1 ? S.tableRow : S.tableRowLast}>
              <Text style={{ ...S.tableHeader, width: "30%" }}>{form}</Text>
              <Text style={{ ...S.tableValue, width: "70%" }}>{title}</Text>
            </View>
          ))}
        </View>

        <View style={S.refBox}>
          <Text style={S.refText}>
            法務省 特定技能申請書類ダウンロード：https://www.moj.go.jp/isa/applications/ssw/10_00020.html{"\n"}
            各書式はExcel/Word形式で提供されています。申請前に最新版をご確認ください。
          </Text>
        </View>

        <View style={S.footer}>
          <Text style={S.footerText}>TENKU_Cloud 特定技能申請パッケージ — 生成：{data.generatedAt}</Text>
          <Text style={S.footerText}>{data.appType} — 申請管理サマリー</Text>
        </View>
      </Page>
    </Document>
  );
}
