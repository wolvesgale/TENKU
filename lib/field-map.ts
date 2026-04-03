/**
 * field-map.ts
 * 制度横断フィールド対照表
 *
 * 同じ Core Data（Person / Company / Organization）が
 * 制度・書式によって異なる呼称で参照されるため、
 * この対照表をPDF生成・フォームレンダリングで共有する。
 */

export type Program = "TITP" | "SSW" | "IKUSEI" | "TA";

// ─── 外国人本人の呼称 ────────────────────────────────────────────────────────
export const PERSON_LABEL: Record<Program, string> = {
  TITP:   "技能実習生",
  SSW:    "特定技能外国人",
  IKUSEI: "育成就労外国人",
  TA:     "特定活動外国人",
};

// ─── 受入企業の呼称 ──────────────────────────────────────────────────────────
export const COMPANY_LABEL: Record<Program, string> = {
  TITP:   "実習実施者",
  SSW:    "特定技能所属機関",
  IKUSEI: "育成就労実施機関",
  TA:     "所属機関",
};

// ─── 管理団体の呼称 ──────────────────────────────────────────────────────────
export const ORG_LABEL: Record<Program, string> = {
  TITP:   "監理団体",
  SSW:    "登録支援機関",
  IKUSEI: "監理支援機関",
  TA:     "支援機関",
};

// ─── 在留資格の名称 ──────────────────────────────────────────────────────────
export const RESIDENCE_STATUS_LABEL: Record<Program, string> = {
  TITP:   "技能実習",
  SSW:    "特定技能（１号）",
  IKUSEI: "育成就労",
  TA:     "特定活動",
};

// ─── Core Data → 書式フィールド マッピング定義 ──────────────────────────────
// key: coreField（データモデルのフィールドパス）
// value: 各制度での表示ラベル
export type FieldMapping = {
  coreField: string;        // e.g. "person.nameKanji"
  dbTable: string;          // e.g. "Person"
  dbColumn: string;         // e.g. "nameKanji"
  labels: Partial<Record<Program | "ALL", string>>;
  formNotes?: Partial<Record<Program, string>>;
};

export const FIELD_MAPPINGS: FieldMapping[] = [
  // ─── Person ─────────────────────────────────────────────────────────────
  {
    coreField: "person.nameKanji",
    dbTable: "Person",
    dbColumn: "nameKanji",
    labels: { ALL: "氏名（漢字）", TITP: "実習生 氏名（漢字）", SSW: "申請人 氏名（漢字）" },
  },
  {
    coreField: "person.nameRomaji",
    dbTable: "Person",
    dbColumn: "nameRomaji",
    labels: { ALL: "氏名（ローマ字）" },
    formNotes: { SSW: "パスポート記載通り" },
  },
  {
    coreField: "person.birthdate",
    dbTable: "Person",
    dbColumn: "birthdate",
    labels: { ALL: "生年月日" },
  },
  {
    coreField: "person.nationality",
    dbTable: "Person",
    dbColumn: "nationality",
    labels: { ALL: "国籍" },
  },
  {
    coreField: "person.gender",
    dbTable: "Person",
    dbColumn: "gender",
    labels: { ALL: "性別" },
  },
  {
    coreField: "person.residenceCardNumber",
    dbTable: "Person",
    dbColumn: "residenceCardNumber",
    labels: { ALL: "在留カード番号", TITP: "在留カード番号", SSW: "在留カード番号" },
  },
  {
    coreField: "person.residenceCardExpiry",
    dbTable: "Person",
    dbColumn: "residenceCardExpiry",
    labels: { ALL: "在留期限" },
  },
  {
    coreField: "person.passportExpiry",
    dbTable: "Person",
    dbColumn: "passportExpiry",
    labels: { ALL: "パスポート有効期限" },
  },
  {
    coreField: "person.dormAddress",
    dbTable: "Person",
    dbColumn: "dormAddress",
    labels: { ALL: "住居地", TITP: "住居地（寮）", SSW: "住居地" },
  },

  // ─── Company ─────────────────────────────────────────────────────────────
  {
    coreField: "company.name",
    dbTable: "Company",
    dbColumn: "name",
    labels: { TITP: "実習実施者 名称", SSW: "所属機関 名称", IKUSEI: "育成就労実施機関 名称" },
  },
  {
    coreField: "company.address",
    dbTable: "Company",
    dbColumn: "address",
    labels: { ALL: "所在地" },
  },
  {
    coreField: "company.representativeName",
    dbTable: "Company",
    dbColumn: "representativeName",
    labels: { ALL: "代表者氏名" },
  },
  {
    coreField: "company.corporateNumber",
    dbTable: "Company",
    dbColumn: "corporateNumber",
    labels: { ALL: "法人番号" },
  },
  {
    coreField: "company.phone",
    dbTable: "Company",
    dbColumn: "phone",
    labels: { ALL: "電話番号" },
  },
  {
    coreField: "company.notifAcceptanceNo",
    dbTable: "Company",
    dbColumn: "notifAcceptanceNo",
    labels: { TITP: "実習実施届出受理番号", SSW: "届出受理番号" },
  },

  // ─── Organization ────────────────────────────────────────────────────────
  {
    coreField: "organization.name",
    dbTable: "DemoOrganizationProfile",
    dbColumn: "name",
    labels: { TITP: "監理団体 名称", SSW: "登録支援機関 名称", IKUSEI: "監理支援機関 名称" },
  },
  {
    coreField: "organization.permitNumber",
    dbTable: "DemoOrganizationProfile",
    dbColumn: "permitNumber",
    labels: { TITP: "許可番号", SSW: "登録番号" },
  },
  {
    coreField: "organization.representativeName",
    dbTable: "DemoOrganizationProfile",
    dbColumn: "representativeName",
    labels: { ALL: "代表者氏名" },
  },
];

// ─── SSW 特定産業分野リスト（出入国在留管理庁）──────────────────────────────
export const SSW_SECTORS = [
  { code: "01", label: "介護" },
  { code: "02", label: "ビルクリーニング" },
  { code: "03", label: "素形材・産業機械・電気電子情報関連製造業" },
  { code: "04", label: "建設" },
  { code: "05", label: "造船・舶用工業" },
  { code: "06", label: "自動車整備" },
  { code: "07", label: "航空" },
  { code: "08", label: "宿泊" },
  { code: "09", label: "農業" },
  { code: "10", label: "漁業" },
  { code: "11", label: "飲食料品製造業" },
  { code: "12", label: "外食業" },
] as const;

// ─── 申請種別 ────────────────────────────────────────────────────────────────
export const SSW_APP_TYPES = {
  COE: {
    code: "COE",
    label: "在留資格認定証明書交付申請",
    shortLabel: "COE（海外招聘）",
    description: "海外に居住する外国人を特定技能として招聘する場合",
    formNumber: "別記第六号の五様式",
  },
  COS: {
    code: "COS",
    label: "在留資格変更許可申請",
    shortLabel: "COS（国内変更）",
    description: "国内で他の在留資格から特定技能へ変更する場合",
    formNumber: "別記第二十二号の四様式",
  },
  EXT: {
    code: "EXT",
    label: "在留期間更新許可申請",
    shortLabel: "EXT（期間更新）",
    description: "特定技能の在留期間を更新する場合（最長1年）",
    formNumber: "別記第二十八号の三様式",
  },
} as const;

// ─── 書類チェックリスト定義 ─────────────────────────────────────────────────
export type DocCheckItem = {
  key: string;
  label: string;
  party: "申請人" | "所属機関" | "登録支援機関";
  required: boolean;
  note: string;
  referenceForm?: string;    // 様式番号
  appliesTo: {
    appTypes?: ("COE" | "COS" | "EXT")[];  // undefined = 全種別
    employerTypes?: ("corporate" | "individual")[];
    onlyIfDelegated?: boolean;
  };
};

export const SSW_DOC_CHECKLIST: DocCheckItem[] = [
  // ─ 全種別共通 ─
  {
    key: "app_form",
    label: "申請書（所定様式）",
    party: "申請人",
    required: true,
    note: "出入国在留管理庁の指定様式。窓口またはオンライン申請",
    appliesTo: {},
  },
  {
    key: "photo",
    label: "写真（縦4cm×横3cm）",
    party: "申請人",
    required: true,
    note: "申請前3ヶ月以内に撮影・鮮明・正面・無帽・無背景",
    appliesTo: {},
  },
  {
    key: "passport_copy",
    label: "パスポートコピー",
    party: "申請人",
    required: true,
    note: "有効なパスポートの顔写真ページ・全査証ページのコピー",
    appliesTo: {},
  },
  {
    key: "skill_test_cert",
    label: "特定技能評価試験合格証等",
    party: "申請人",
    required: true,
    note: "分野別技能試験＋日本語試験（N4以上）の合格証。技能実習2号修了者は免除",
    appliesTo: {},
  },
  {
    key: "employment_contract",
    label: "特定技能雇用契約書の写し",
    party: "所属機関",
    required: true,
    note: "参考様式第１－４号 相当。日本語版＋外国語版",
    referenceForm: "参考様式第１－４号",
    appliesTo: {},
  },
  {
    key: "employer_overview",
    label: "特定技能所属機関概要書",
    party: "所属機関",
    required: true,
    note: "参考様式第１－０号",
    referenceForm: "参考様式第１－０号",
    appliesTo: {},
  },
  {
    key: "cost_explanation",
    label: "徴収費用の説明書",
    party: "所属機関",
    required: true,
    note: "参考様式第１－６号。本人から徴収する費用の明細",
    referenceForm: "参考様式第１－６号",
    appliesTo: {},
  },
  {
    key: "support_plan",
    label: "1号特定技能外国人支援計画書",
    party: "所属機関",
    required: true,
    note: "参考様式第２－３号。11項目の支援内容を記載",
    referenceForm: "参考様式第２－３号",
    appliesTo: {},
  },
  {
    key: "sector_docs",
    label: "特定産業分野に係る書類",
    party: "所属機関",
    required: true,
    note: "分野ごとに関係省庁が定める書類（試験合格証・協議会加入証明等）",
    appliesTo: {},
  },

  // ─ COE のみ ─
  {
    key: "return_envelope",
    label: "返信用封筒（簡易書留）",
    party: "申請人",
    required: true,
    note: "宛名記載・382円切手貼付済み（簡易書留料金）",
    appliesTo: { appTypes: ["COE"] },
  },
  {
    key: "bilateral_docs",
    label: "二国間取決めに基づく書類",
    party: "申請人",
    required: false,
    note: "ベトナム・フィリピン・インドネシア・カンボジア・タイ等の協定国の場合に必要",
    appliesTo: { appTypes: ["COE"] },
  },

  // ─ COS のみ ─
  {
    key: "residence_card_cos",
    label: "在留カード（両面コピー）",
    party: "申請人",
    required: true,
    note: "現在の在留資格が確認できるもの",
    appliesTo: { appTypes: ["COS"] },
  },
  {
    key: "previous_status_docs",
    label: "現在の在留資格に係る書類",
    party: "申請人",
    required: false,
    note: "技能実習からの変更の場合：技能実習評価試験合格証・技能実習計画認定通知書等",
    appliesTo: { appTypes: ["COS"] },
  },

  // ─ EXT のみ ─
  {
    key: "residence_card_ext",
    label: "在留カード（両面コピー）",
    party: "申請人",
    required: true,
    note: "現在の特定技能（１号）在留カード",
    appliesTo: { appTypes: ["EXT"] },
  },
  {
    key: "residence_certificate",
    label: "住民票",
    party: "申請人",
    required: true,
    note: "発行後3ヶ月以内・マイナンバー省略可",
    appliesTo: { appTypes: ["EXT"] },
  },
  {
    key: "tax_certificate",
    label: "税関係書類",
    party: "申請人",
    required: false,
    note: "源泉徴収票または住民税課税証明書（前年度分）",
    appliesTo: { appTypes: ["EXT"] },
  },

  // ─ 登録支援機関への委託がある場合 ─
  {
    key: "support_delegation_contract",
    label: "支援委託契約書の写し",
    party: "登録支援機関",
    required: true,
    note: "参考様式第４－１号 相当",
    referenceForm: "参考様式第４－１号",
    appliesTo: { onlyIfDelegated: true },
  },
  {
    key: "support_org_overview",
    label: "登録支援機関概要書",
    party: "登録支援機関",
    required: true,
    note: "参考様式第４－２号",
    referenceForm: "参考様式第４－２号",
    appliesTo: { onlyIfDelegated: true },
  },

  // ─ 法人のみ ─
  {
    key: "registration_cert",
    label: "登記事項証明書",
    party: "所属機関",
    required: true,
    note: "発行後3ヶ月以内",
    appliesTo: { employerTypes: ["corporate"] },
  },
  {
    key: "tax_return_corp",
    label: "直近1年分の法人税確定申告書",
    party: "所属機関",
    required: true,
    note: "税務署受付印または電子申告のメール詳細添付",
    appliesTo: { employerTypes: ["corporate"] },
  },
  {
    key: "officer_list",
    label: "役員リスト",
    party: "所属機関",
    required: true,
    note: "参考様式第１－２号",
    referenceForm: "参考様式第１－２号",
    appliesTo: { employerTypes: ["corporate"] },
  },
  {
    key: "insurance_docs",
    label: "社会保険・雇用保険関係書類",
    party: "所属機関",
    required: true,
    note: "社会保険料納付証明書・労働保険概算確定申告書の写し等",
    appliesTo: { employerTypes: ["corporate"] },
  },

  // ─ 個人事業主のみ ─
  {
    key: "residence_doc_individual",
    label: "代表者住民票の写し",
    party: "所属機関",
    required: true,
    note: "発行後3ヶ月以内",
    appliesTo: { employerTypes: ["individual"] },
  },
  {
    key: "income_tax_return",
    label: "確定申告書の写し",
    party: "所属機関",
    required: true,
    note: "直近1年分（所得税）",
    appliesTo: { employerTypes: ["individual"] },
  },
];

/**
 * 申請条件に基づいて表示する書類リストを絞り込む
 */
export function filterDocChecklist(opts: {
  appType: "COE" | "COS" | "EXT";
  employerType: "corporate" | "individual";
  isDelegated: boolean;
}): DocCheckItem[] {
  return SSW_DOC_CHECKLIST.filter((item) => {
    const { appTypes, employerTypes, onlyIfDelegated } = item.appliesTo;
    if (appTypes && !appTypes.includes(opts.appType)) return false;
    if (employerTypes && !employerTypes.includes(opts.employerType)) return false;
    if (onlyIfDelegated && !opts.isDelegated) return false;
    return true;
  });
}
