"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SSW_APP_TYPES, SSW_SECTORS, filterDocChecklist } from "@/lib/field-map";

// ─── 型定義 ────────────────────────────────────────────────────────────────────

type AppType = "COE" | "COS" | "EXT";
type EmployerType = "corporate" | "individual";

type PersonData = {
  id: string;
  fullName: string;
  nameKanji?: string;
  nameKana?: string;
  nameRoma?: string;
  nameRomaji?: string;
  nationality?: string;
  birthDate?: string;
  birthdate?: string;
  gender?: string;
  passportNumber?: string;
  passportNo?: string;
  passportExpiry?: string;
  birthPlace?: string;
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
  currentProgram?: string;
  currentCompanyId?: string;
  foreignerId?: string;
};

type CompanyData = {
  id: string;
  name: string;
  nameKana?: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  fax?: string;
  corporateNumber?: string;
  representativeName?: string;
  representativeKana?: string;
  representativeTitle?: string;
  contactName?: string;
  contactTel?: string;
  contactPersonTitle?: string;
  laborInsuranceNo?: string;
  employmentInsuranceNo?: string;
  socialInsuranceStatus?: string;
  sswReceiptNo?: string;
  notifAcceptanceNo?: string;
};

type ApplicationDetail = {
  id: string;
  personId: string;
  companyId?: string;
  appType: AppType;
  status: "DRAFT" | "REVIEW" | "SUBMITTED" | "APPROVED" | "REJECTED" | "CANCELLED";
  sectorCode?: string;
  sectorLabel?: string;
  occupationType?: string;
  employerType?: EmployerType;
  japaneseTestExempt?: boolean;
  skillTestPassed?: boolean;
  japaneseTestPassed?: boolean;
  contractStartDate?: string;
  contractEndDate?: string;
  monthlySalary?: number;
  workLocation?: string;
  workContent?: string;
  employmentType?: string;
  isDelegated?: boolean;
  supportOrgName?: string;
  supportOrgRegNo?: string;
  targetSubmitDate?: string;
  submittedDate?: string;
  approvedDate?: string;
  rejectedDate?: string;
  docChecklist?: Record<string, boolean>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// ─── 必須フィールド定義 ───────────────────────────────────────────────────────

const REQUIRED_PERSON_FIELDS: Record<AppType, string[]> = {
  COE: ["nationality", "birthDate", "nameRoma", "gender", "passportNumber", "passportExpiry", "birthPlace"],
  COS: ["nationality", "birthDate", "nameRoma", "gender", "passportNumber", "passportExpiry", "residenceCardNumber", "residenceCardExpiry", "dormAddress"],
  EXT: ["nationality", "birthDate", "nameRoma", "gender", "passportNumber", "passportExpiry", "residenceCardNumber", "residenceCardExpiry", "dormAddress"],
};

const PERSON_FIELD_LABELS: Record<string, string> = {
  nationality: "国籍・地域",
  birthDate: "生年月日",
  birthdate: "生年月日",
  nameRoma: "氏名（ローマ字）",
  gender: "性別",
  passportNumber: "パスポート番号",
  passportExpiry: "パスポート有効期限",
  birthPlace: "出生地",
  residenceCardNumber: "在留カード番号",
  residenceCardExpiry: "在留カード期限",
  dormAddress: "住居地（日本）",
  phoneNumber: "電話番号",
  emailAddress: "メールアドレス",
  lastEducation: "最終学歴",
  sswSector: "特定産業分野",
  occupationType: "業務区分",
  japaneseTestType: "日本語試験種別",
  japaneseTestLevel: "日本語試験レベル",
  japaneseTestDate: "日本語試験合格日",
  japaneseTestCertNo: "日本語試験証書番号",
  skillTestType: "特定技能評価試験種別",
  skillTestDate: "特定技能評価試験合格日",
  skillTestCertNo: "特定技能評価試験証書番号",
  titp2Completed: "技能実習2号修了",
  titp2CertNumber: "技能実習2号修了証明書番号",
};

const REQUIRED_COMPANY_FIELDS = ["name", "address", "phone", "corporateNumber", "representativeName"];
const COMPANY_FIELD_LABELS: Record<string, string> = {
  name: "機関名",
  address: "所在地",
  phone: "電話番号",
  corporateNumber: "法人番号",
  representativeName: "代表者氏名",
  representativeTitle: "代表者役職",
  fax: "FAX番号",
  laborInsuranceNo: "労働保険番号",
  employmentInsuranceNo: "雇用保険番号",
  socialInsuranceStatus: "社会保険加入状況",
  sswReceiptNo: "届出受理番号（SSW）",
  contactName: "連絡担当者氏名",
  contactTel: "連絡担当者電話番号",
  contactPersonTitle: "連絡担当者役職",
};

const TABS = ["申請人情報", "所属機関情報", "試験・資格", "雇用・支援", "書類確認", "申請管理"] as const;
type TabKey = typeof TABS[number];

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "下書き",
  REVIEW: "確認中",
  SUBMITTED: "申請済",
  APPROVED: "許可",
  REJECTED: "不許可",
  CANCELLED: "取下げ",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "border-zinc-500 text-zinc-400",
  REVIEW: "border-yellow-500 text-yellow-400",
  SUBMITTED: "border-blue-500 text-blue-400",
  APPROVED: "border-green-500 text-green-400",
  REJECTED: "border-red-500 text-red-400",
  CANCELLED: "border-zinc-600 text-zinc-500",
};

// ─── ヘルパーコンポーネント ───────────────────────────────────────────────────

function FieldLabel({ label, required, isMissing }: { label: string; required?: boolean; isMissing?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-xs text-zinc-400">{label}</span>
      {required && <span className="text-red-500 text-xs">*</span>}
      {isMissing && (
        <Badge className="border-red-500 text-red-400 text-[9px] px-1 py-0 h-4 bg-transparent">未入力</Badge>
      )}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  required,
  isMissing,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  isMissing?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} isMissing={isMissing} />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? label}
        className={`w-full bg-black/30 text-white text-sm px-3 py-1.5 rounded border outline-none focus:border-blue-500 transition-colors ${
          isMissing ? "border-red-500" : "border-border"
        }`}
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  required,
  isMissing,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  isMissing?: boolean;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} isMissing={isMissing} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-black/30 text-white text-sm px-3 py-1.5 rounded border outline-none focus:border-blue-500 transition-colors ${
          isMissing ? "border-red-500" : "border-border"
        }`}
      >
        <option value="">── 選択 ──</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxInput({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-blue-500"
      />
      <span className="text-sm text-zinc-300">{label}</span>
    </label>
  );
}

// ─── メインページ ─────────────────────────────────────────────────────────────

export default function SswPersonDetailPage() {
  const params = useParams();
  const personId = params.personId as string;

  const [activeTab, setActiveTab] = useState<TabKey>("申請人情報");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const [person, setPerson] = useState<PersonData | null>(null);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [details, setDetails] = useState<ApplicationDetail[]>([]);
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

  // ローカル編集用state
  const [personForm, setPersonForm] = useState<Partial<PersonData>>({});
  const [companyForm, setCompanyForm] = useState<Partial<CompanyData>>({});
  const [detailForm, setDetailForm] = useState<Partial<ApplicationDetail>>({});
  const [docChecklist, setDocChecklist] = useState<Record<string, boolean>>({});

  // ─── データ読み込み ──────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/ssw/persons/${personId}/application-detail`);
      if (!res.ok) throw new Error("fetch failed");
      const json = await res.json();
      setPerson(json.person ?? null);
      setCompany(json.company ?? null);
      setDetails(json.applicationDetails ?? []);

      if (json.person) {
        setPersonForm({ ...json.person });
      }
      if (json.company) {
        setCompanyForm({ ...json.company });
      }

      const det = (json.applicationDetails ?? []) as ApplicationDetail[];
      if (det.length > 0) {
        const first = det[0];
        setActiveDetailId(first.id);
        setDetailForm({ ...first });
        setDocChecklist(first.docChecklist ?? {});
      } else {
        setDetailForm({ appType: "EXT", status: "DRAFT", employerType: "corporate", isDelegated: true });
        setDocChecklist({});
      }
    } catch {
      // silently fail in demo
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── 保存 ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const payload: Record<string, unknown> = {
        personData: personForm,
        companyData: companyForm,
        ...detailForm,
        docChecklist,
      };
      if (activeDetailId) {
        payload.detailId = activeDetailId;
      }

      const res = await fetch(`/api/v1/ssw/persons/${personId}/application-detail`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("save failed");
      const json = await res.json();
      if (json.person) setPerson(json.person);
      if (json.company) setCompany(json.company);
      if (json.detail) {
        setActiveDetailId(json.detail.id);
        setDetailForm({ ...json.detail });
        setDocChecklist(json.detail.docChecklist ?? {});
        setDetails((prev) => {
          const idx = prev.findIndex((d) => d.id === json.detail.id);
          if (idx === -1) return [...prev, json.detail];
          const updated = [...prev];
          updated[idx] = json.detail;
          return updated;
        });
      }
      setSaveMsg("保存しました");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  // ─── PDF出力 ────────────────────────────────────────────────────────
  const handlePdfDownload = async () => {
    setPdfGenerating(true);
    try {
      const currentAppType = (detailForm.appType as AppType) ?? "EXT";
      const res = await fetch(
        `/api/v1/ssw/persons/${personId}/application-pdf?appType=${currentAppType}`
      );
      if (!res.ok) throw new Error("pdf failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cd = res.headers.get("Content-Disposition") ?? "";
      const match = cd.match(/filename\*?=(?:UTF-8'')?["']?([^"';\r\n]+)/i);
      a.download = match ? decodeURIComponent(match[1]) : `ssw-application-${personId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently ignore in demo
    } finally {
      setPdfGenerating(false);
    }
  };

  // ─── 必須チェック ──────────────────────────────────────────────────────
  const appType: AppType = (detailForm.appType as AppType) ?? "EXT";
  const reqPersonFields = REQUIRED_PERSON_FIELDS[appType] ?? [];

  function isPersonFieldMissing(field: string): boolean {
    if (!reqPersonFields.includes(field)) return false;
    const val = (personForm as Record<string, unknown>)[field];
    // handle alias fields
    if (field === "birthDate") {
      return !personForm.birthDate && !personForm.birthdate;
    }
    if (field === "passportNumber") {
      return !personForm.passportNumber && !personForm.passportNo;
    }
    return !val || val === "";
  }

  function isCompanyFieldMissing(field: string): boolean {
    if (!REQUIRED_COMPANY_FIELDS.includes(field)) return false;
    const val = (companyForm as Record<string, unknown>)[field];
    return !val || val === "";
  }

  const missingPersonCount = reqPersonFields.filter((f) => isPersonFieldMissing(f)).length;
  const missingCompanyCount = REQUIRED_COMPANY_FIELDS.filter((f) => isCompanyFieldMissing(f)).length;
  const totalMissing = missingPersonCount + missingCompanyCount;

  // ─── 書類チェックリスト ──────────────────────────────────────────────
  const filteredDocs = filterDocChecklist({
    appType: appType,
    employerType: detailForm.employerType ?? "corporate",
    isDelegated: detailForm.isDelegated ?? false,
  });

  // ─── 申請人情報タブ ──────────────────────────────────────────────────
  const personNationalities = [
    "フィリピン", "ベトナム", "インドネシア", "タイ", "ミャンマー", "カンボジア",
    "中国", "韓国", "ネパール", "スリランカ", "バングラデシュ", "モンゴル",
    "パキスタン", "インド", "その他",
  ];

  const educationOptions = [
    { value: "大学院", label: "大学院" },
    { value: "大学", label: "大学" },
    { value: "短期大学", label: "短期大学" },
    { value: "専門学校", label: "専門学校・専修学校" },
    { value: "高校", label: "高等学校" },
    { value: "中学校", label: "中学校" },
    { value: "その他", label: "その他" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400 text-sm animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="p-6">
        <div className="text-red-400 text-sm">申請人が見つかりません（ID: {personId}）</div>
        <Link href="/ssw" className="text-blue-400 text-sm underline mt-2 inline-block">
          ← SSW一覧に戻る
        </Link>
      </div>
    );
  }

  const displayName = person.nameKanji ?? person.nameRoma ?? person.fullName;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4">
      {/* ─── ヘッダー ────────────────────────────────────────────────────── */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
          <Link href="/ssw" className="hover:text-zinc-300 transition-colors">
            SSW管理
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{displayName}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">{displayName}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-zinc-400">{person.nationality}</span>
              {person.foreignerId && (
                <span className="text-xs text-zinc-500">ID: {person.foreignerId}</span>
              )}
              {person.currentProgram && (
                <Badge className="border-blue-600 text-blue-400 text-[10px] bg-transparent">
                  {person.currentProgram}
                </Badge>
              )}
              {details.length > 0 && (
                <Badge className={`text-[10px] bg-transparent border ${STATUS_COLORS[details[0].status] ?? "border-zinc-500 text-zinc-400"}`}>
                  {STATUS_LABELS[details[0].status] ?? details[0].status}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {saveMsg && (
              <span className={`text-xs ${saveMsg.includes("失敗") ? "text-red-400" : "text-green-400"}`}>
                {saveMsg}
              </span>
            )}
            <button
              onClick={handlePdfDownload}
              disabled={pdfGenerating}
              className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:opacity-60 text-white text-sm rounded border border-zinc-600 transition-colors"
              title="申請種別に応じた全書式をPDFで出力します"
            >
              {pdfGenerating ? "生成中..." : "PDF出力"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-60 text-white text-sm rounded transition-colors"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── 警告バナー ──────────────────────────────────────────────────── */}
      {totalMissing > 0 && (
        <div className="mb-4 px-4 py-2.5 bg-red-950/40 border border-red-800/50 rounded-lg text-sm text-red-300">
          ⚠ 不足情報があります：<strong>{totalMissing}件</strong>の必須項目が未入力です（赤枠の項目をご確認ください）
        </div>
      )}

      {/* ─── 申請種別選択 ─────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <span className="text-xs text-zinc-500">申請種別：</span>
        {(["COE", "COS", "EXT"] as AppType[]).map((t) => (
          <button
            key={t}
            onClick={() => setDetailForm((prev) => ({ ...prev, appType: t }))}
            className={`px-3 py-1 text-xs rounded border transition-colors ${
              appType === t
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-black/30 border-border text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {SSW_APP_TYPES[t].shortLabel}
          </button>
        ))}
      </div>

      {/* ─── タブ ──────────────────────────────────────────────────────── */}
      <div className="mb-4 flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab) => {
          let badgeCount = 0;
          if (tab === "申請人情報") badgeCount = missingPersonCount;
          if (tab === "所属機関情報") badgeCount = missingCompanyCount;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === tab
                  ? "border-blue-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab}
              {badgeCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-red-600 rounded-full text-white">
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── 申請人情報タブ ──────────────────────────────────────────────── */}
      {activeTab === "申請人情報" && (
        <div className="space-y-4">
          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">基本情報</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextInput
                label={PERSON_FIELD_LABELS.nationality}
                value={personForm.nationality ?? ""}
                onChange={(v) => setPersonForm((p) => ({ ...p, nationality: v }))}
                required
                isMissing={isPersonFieldMissing("nationality")}
              />
              <TextInput
                label={PERSON_FIELD_LABELS.nameRoma}
                value={personForm.nameRoma ?? personForm.nameRomaji ?? ""}
                onChange={(v) => setPersonForm((p) => ({ ...p, nameRoma: v, nameRomaji: v }))}
                required={reqPersonFields.includes("nameRoma")}
                isMissing={isPersonFieldMissing("nameRoma")}
                placeholder="FAMILY GIVEN"
              />
              <TextInput
                label="氏名（漢字）"
                value={personForm.nameKanji ?? ""}
                onChange={(v) => setPersonForm((p) => ({ ...p, nameKanji: v }))}
                placeholder="氏名（漢字）"
              />
              <TextInput
                label="氏名（カナ）"
                value={personForm.nameKana ?? ""}
                onChange={(v) => setPersonForm((p) => ({ ...p, nameKana: v }))}
                placeholder="カナ表記"
              />
              <div>
                <FieldLabel
                  label={PERSON_FIELD_LABELS.gender}
                  required={reqPersonFields.includes("gender")}
                  isMissing={isPersonFieldMissing("gender")}
                />
                <select
                  value={personForm.gender ?? ""}
                  onChange={(e) => setPersonForm((p) => ({ ...p, gender: e.target.value }))}
                  className={`w-full bg-black/30 text-white text-sm px-3 py-1.5 rounded border outline-none focus:border-blue-500 transition-colors ${
                    isPersonFieldMissing("gender") ? "border-red-500" : "border-border"
                  }`}
                >
                  <option value="">── 選択 ──</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="その他">その他</option>
                </select>
              </div>
              <TextInput
                label={PERSON_FIELD_LABELS.birthDate}
                value={personForm.birthDate ?? personForm.birthdate ?? ""}
                onChange={(v) => setPersonForm((p) => ({ ...p, birthDate: v, birthdate: v }))}
                type="date"
                required={reqPersonFields.includes("birthDate")}
                isMissing={isPersonFieldMissing("birthDate")}
              />
              {appType === "COE" && (
                <TextInput
                  label={PERSON_FIELD_LABELS.birthPlace}
                  value={personForm.birthPlace ?? ""}
                  onChange={(v) => setPersonForm((p) => ({ ...p, birthPlace: v }))}
                  required
                  isMissing={isPersonFieldMissing("birthPlace")}
                  placeholder="例: マニラ市"
                />
              )}
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">旅券・在留資格情報</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextInput
                label={PERSON_FIELD_LABELS.passportNumber}
                value={personForm.passportNumber ?? personForm.passportNo ?? ""}
                onChange={(v) => setPersonForm((p) => ({ ...p, passportNumber: v, passportNo: v }))}
                required={reqPersonFields.includes("passportNumber")}
                isMissing={isPersonFieldMissing("passportNumber")}
                placeholder="AA1234567"
              />
              <TextInput
                label={PERSON_FIELD_LABELS.passportExpiry}
                value={personForm.passportExpiry ?? ""}
                onChange={(v) => setPersonForm((p) => ({ ...p, passportExpiry: v }))}
                type="date"
                required={reqPersonFields.includes("passportExpiry")}
                isMissing={isPersonFieldMissing("passportExpiry")}
              />
              {(appType === "COS" || appType === "EXT") && (
                <>
                  <TextInput
                    label={PERSON_FIELD_LABELS.residenceCardNumber}
                    value={personForm.residenceCardNumber ?? ""}
                    onChange={(v) => setPersonForm((p) => ({ ...p, residenceCardNumber: v }))}
                    required
                    isMissing={isPersonFieldMissing("residenceCardNumber")}
                    placeholder="AA12345678AB"
                  />
                  <TextInput
                    label={PERSON_FIELD_LABELS.residenceCardExpiry}
                    value={personForm.residenceCardExpiry ?? ""}
                    onChange={(v) => setPersonForm((p) => ({ ...p, residenceCardExpiry: v }))}
                    type="date"
                    required
                    isMissing={isPersonFieldMissing("residenceCardExpiry")}
                  />
                  <TextInput
                    label={PERSON_FIELD_LABELS.dormAddress}
                    value={personForm.dormAddress ?? ""}
                    onChange={(v) => setPersonForm((p) => ({ ...p, dormAddress: v }))}
                    required
                    isMissing={isPersonFieldMissing("dormAddress")}
                    placeholder="〒000-0000 ..."
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">連絡先・学歴</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextInput
                label={PERSON_FIELD_LABELS.phoneNumber}
                value={personForm.phoneNumber ?? ""}
                onChange={(v) => setPersonForm((p) => ({ ...p, phoneNumber: v }))}
                placeholder="090-0000-0000"
              />
              <TextInput
                label={PERSON_FIELD_LABELS.emailAddress}
                value={personForm.emailAddress ?? ""}
                onChange={(v) => setPersonForm((p) => ({ ...p, emailAddress: v }))}
                placeholder="example@email.com"
              />
              <SelectInput
                label={PERSON_FIELD_LABELS.lastEducation}
                value={personForm.lastEducation ?? ""}
                onChange={(v) => setPersonForm((p) => ({ ...p, lastEducation: v }))}
                options={educationOptions}
              />
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">特定技能分野・業務区分</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectInput
                label={PERSON_FIELD_LABELS.sswSector}
                value={personForm.sswSector ?? detailForm.sectorCode ?? ""}
                onChange={(v) => {
                  const sector = SSW_SECTORS.find((s) => s.code === v);
                  setPersonForm((p) => ({ ...p, sswSector: v }));
                  setDetailForm((d) => ({
                    ...d,
                    sectorCode: v,
                    sectorLabel: sector?.label,
                  }));
                }}
                options={SSW_SECTORS.map((s) => ({ value: s.code, label: `${s.code}. ${s.label}` }))}
              />
              <TextInput
                label={PERSON_FIELD_LABELS.occupationType}
                value={personForm.occupationType ?? detailForm.occupationType ?? ""}
                onChange={(v) => {
                  setPersonForm((p) => ({ ...p, occupationType: v }));
                  setDetailForm((d) => ({ ...d, occupationType: v }));
                }}
                placeholder="例: 介護"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── 所属機関情報タブ ─────────────────────────────────────────────── */}
      {activeTab === "所属機関情報" && (
        <div className="space-y-4">
          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">機関基本情報</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <TextInput
                  label={COMPANY_FIELD_LABELS.name}
                  value={companyForm.name ?? ""}
                  onChange={(v) => setCompanyForm((c) => ({ ...c, name: v }))}
                  required
                  isMissing={isCompanyFieldMissing("name")}
                />
              </div>
              <TextInput
                label="機関名（カナ）"
                value={companyForm.nameKana ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, nameKana: v }))}
                placeholder="機関名カナ"
              />
              <TextInput
                label="郵便番号"
                value={companyForm.postalCode ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, postalCode: v }))}
                placeholder="〒000-0000"
              />
              <div className="sm:col-span-2">
                <TextInput
                  label={COMPANY_FIELD_LABELS.address}
                  value={companyForm.address ?? ""}
                  onChange={(v) => setCompanyForm((c) => ({ ...c, address: v }))}
                  required
                  isMissing={isCompanyFieldMissing("address")}
                />
              </div>
              <TextInput
                label={COMPANY_FIELD_LABELS.phone}
                value={companyForm.phone ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, phone: v }))}
                required
                isMissing={isCompanyFieldMissing("phone")}
                placeholder="000-0000-0000"
              />
              <TextInput
                label={COMPANY_FIELD_LABELS.fax}
                value={companyForm.fax ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, fax: v }))}
                placeholder="000-0000-0000"
              />
              <TextInput
                label={COMPANY_FIELD_LABELS.corporateNumber}
                value={companyForm.corporateNumber ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, corporateNumber: v }))}
                required
                isMissing={isCompanyFieldMissing("corporateNumber")}
                placeholder="13桁の法人番号"
              />
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">代表者・担当者情報</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextInput
                label={COMPANY_FIELD_LABELS.representativeName}
                value={companyForm.representativeName ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, representativeName: v }))}
                required
                isMissing={isCompanyFieldMissing("representativeName")}
              />
              <TextInput
                label="代表者氏名（カナ）"
                value={companyForm.representativeKana ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, representativeKana: v }))}
                placeholder="カナ表記"
              />
              <TextInput
                label={COMPANY_FIELD_LABELS.representativeTitle}
                value={companyForm.representativeTitle ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, representativeTitle: v }))}
                placeholder="例: 代表取締役"
              />
              <TextInput
                label={COMPANY_FIELD_LABELS.contactName}
                value={companyForm.contactName ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, contactName: v }))}
              />
              <TextInput
                label={COMPANY_FIELD_LABELS.contactPersonTitle}
                value={companyForm.contactPersonTitle ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, contactPersonTitle: v }))}
                placeholder="例: 人事部長"
              />
              <TextInput
                label={COMPANY_FIELD_LABELS.contactTel}
                value={companyForm.contactTel ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, contactTel: v }))}
                placeholder="000-0000-0000"
              />
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">保険・届出情報</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextInput
                label={COMPANY_FIELD_LABELS.laborInsuranceNo}
                value={companyForm.laborInsuranceNo ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, laborInsuranceNo: v }))}
                placeholder="000-000000-000-000"
              />
              <TextInput
                label={COMPANY_FIELD_LABELS.employmentInsuranceNo}
                value={companyForm.employmentInsuranceNo ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, employmentInsuranceNo: v }))}
                placeholder="0-000000-0"
              />
              <SelectInput
                label={COMPANY_FIELD_LABELS.socialInsuranceStatus}
                value={companyForm.socialInsuranceStatus ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, socialInsuranceStatus: v }))}
                options={[
                  { value: "適用", label: "適用（健康保険・厚生年金）" },
                  { value: "国民健康保険", label: "国民健康保険・国民年金" },
                  { value: "適用除外", label: "適用除外" },
                ]}
              />
              <TextInput
                label={COMPANY_FIELD_LABELS.sswReceiptNo}
                value={companyForm.sswReceiptNo ?? companyForm.notifAcceptanceNo ?? ""}
                onChange={(v) => setCompanyForm((c) => ({ ...c, sswReceiptNo: v, notifAcceptanceNo: v }))}
                placeholder="届出受理番号"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── 試験・資格タブ ──────────────────────────────────────────────── */}
      {activeTab === "試験・資格" && (
        <div className="space-y-4">
          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">技能実習2号修了（試験免除）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CheckboxInput
                label="技能実習2号を修了している（技能試験・日本語試験免除）"
                checked={personForm.titp2Completed ?? false}
                onChange={(v) => {
                  setPersonForm((p) => ({ ...p, titp2Completed: v }));
                  setDetailForm((d) => ({ ...d, japaneseTestExempt: v }));
                }}
              />
              {personForm.titp2Completed && (
                <TextInput
                  label={PERSON_FIELD_LABELS.titp2CertNumber}
                  value={personForm.titp2CertNumber ?? ""}
                  onChange={(v) => setPersonForm((p) => ({ ...p, titp2CertNumber: v }))}
                  placeholder="技能実習2号修了証明書番号"
                />
              )}
            </CardContent>
          </Card>

          {!personForm.titp2Completed && (
            <>
              <Card className="bg-black/30 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-zinc-300">日本語試験</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SelectInput
                    label={PERSON_FIELD_LABELS.japaneseTestType}
                    value={personForm.japaneseTestType ?? ""}
                    onChange={(v) => {
                      setPersonForm((p) => ({ ...p, japaneseTestType: v }));
                      setDetailForm((d) => ({ ...d, japaneseTestPassed: v !== "" }));
                    }}
                    options={[
                      { value: "JLPT", label: "JLPT（日本語能力試験）" },
                      { value: "JFT-Basic", label: "JFT-Basic（国際交流基金日本語基礎テスト）" },
                      { value: "NAT-TEST", label: "NAT-TEST" },
                      { value: "その他", label: "その他" },
                    ]}
                  />
                  <SelectInput
                    label={PERSON_FIELD_LABELS.japaneseTestLevel}
                    value={personForm.japaneseTestLevel ?? ""}
                    onChange={(v) => setPersonForm((p) => ({ ...p, japaneseTestLevel: v }))}
                    options={[
                      { value: "N1", label: "N1（最上級）" },
                      { value: "N2", label: "N2" },
                      { value: "N3", label: "N3" },
                      { value: "N4", label: "N4（特定技能最低ライン）" },
                      { value: "N5", label: "N5" },
                      { value: "A2", label: "A2（JFT-Basic相当）" },
                    ]}
                  />
                  <TextInput
                    label={PERSON_FIELD_LABELS.japaneseTestDate}
                    value={personForm.japaneseTestDate ?? ""}
                    onChange={(v) => setPersonForm((p) => ({ ...p, japaneseTestDate: v }))}
                    type="date"
                  />
                  <TextInput
                    label={PERSON_FIELD_LABELS.japaneseTestCertNo}
                    value={personForm.japaneseTestCertNo ?? ""}
                    onChange={(v) => setPersonForm((p) => ({ ...p, japaneseTestCertNo: v }))}
                    placeholder="証書番号"
                  />
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-zinc-300">特定技能評価試験（技能試験）</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TextInput
                    label={PERSON_FIELD_LABELS.skillTestType}
                    value={personForm.skillTestType ?? ""}
                    onChange={(v) => {
                      setPersonForm((p) => ({ ...p, skillTestType: v }));
                      setDetailForm((d) => ({ ...d, skillTestPassed: v !== "" }));
                    }}
                    placeholder="例: 介護技能評価試験"
                  />
                  <TextInput
                    label={PERSON_FIELD_LABELS.skillTestDate}
                    value={personForm.skillTestDate ?? ""}
                    onChange={(v) => setPersonForm((p) => ({ ...p, skillTestDate: v }))}
                    type="date"
                  />
                  <TextInput
                    label={PERSON_FIELD_LABELS.skillTestCertNo}
                    value={personForm.skillTestCertNo ?? ""}
                    onChange={(v) => setPersonForm((p) => ({ ...p, skillTestCertNo: v }))}
                    placeholder="合格証書番号"
                  />
                </CardContent>
              </Card>
            </>
          )}

          {/* 試験合格ステータス表示 */}
          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">試験要件チェック</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 w-32">日本語試験：</span>
                {personForm.titp2Completed ? (
                  <Badge className="border-green-600 text-green-400 text-[10px] bg-transparent">免除（技能実習2号修了）</Badge>
                ) : personForm.japaneseTestType ? (
                  <Badge className="border-green-600 text-green-400 text-[10px] bg-transparent">
                    合格（{personForm.japaneseTestType} {personForm.japaneseTestLevel}）
                  </Badge>
                ) : (
                  <Badge className="border-red-600 text-red-400 text-[10px] bg-transparent">未確認</Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 w-32">技能試験：</span>
                {personForm.titp2Completed ? (
                  <Badge className="border-green-600 text-green-400 text-[10px] bg-transparent">免除（技能実習2号修了）</Badge>
                ) : personForm.skillTestType ? (
                  <Badge className="border-green-600 text-green-400 text-[10px] bg-transparent">
                    合格（{personForm.skillTestType}）
                  </Badge>
                ) : (
                  <Badge className="border-red-600 text-red-400 text-[10px] bg-transparent">未確認</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── 雇用・支援タブ ──────────────────────────────────────────────── */}
      {activeTab === "雇用・支援" && (
        <div className="space-y-4">
          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">雇用契約情報</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <FieldLabel label="雇用形態" />
                <select
                  value={detailForm.employerType ?? "corporate"}
                  onChange={(e) => setDetailForm((d) => ({ ...d, employerType: e.target.value as EmployerType }))}
                  className="w-full bg-black/30 text-white text-sm px-3 py-1.5 rounded border border-border outline-none focus:border-blue-500"
                >
                  <option value="corporate">法人</option>
                  <option value="individual">個人事業主</option>
                </select>
              </div>
              <div>
                <FieldLabel label="雇用契約の種類" />
                <select
                  value={detailForm.employmentType ?? ""}
                  onChange={(e) => setDetailForm((d) => ({ ...d, employmentType: e.target.value }))}
                  className="w-full bg-black/30 text-white text-sm px-3 py-1.5 rounded border border-border outline-none focus:border-blue-500"
                >
                  <option value="">── 選択 ──</option>
                  <option value="期間の定めあり">期間の定めあり</option>
                  <option value="期間の定めなし">期間の定めなし</option>
                </select>
              </div>
              <TextInput
                label="契約開始日"
                value={detailForm.contractStartDate ?? ""}
                onChange={(v) => setDetailForm((d) => ({ ...d, contractStartDate: v }))}
                type="date"
              />
              <TextInput
                label="契約終了日"
                value={detailForm.contractEndDate ?? ""}
                onChange={(v) => setDetailForm((d) => ({ ...d, contractEndDate: v }))}
                type="date"
              />
              <div>
                <FieldLabel label="月額給与（円）" />
                <input
                  type="number"
                  value={detailForm.monthlySalary ?? ""}
                  onChange={(e) => setDetailForm((d) => ({ ...d, monthlySalary: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="200000"
                  className="w-full bg-black/30 text-white text-sm px-3 py-1.5 rounded border border-border outline-none focus:border-blue-500"
                />
              </div>
              <TextInput
                label="就労場所"
                value={detailForm.workLocation ?? ""}
                onChange={(v) => setDetailForm((d) => ({ ...d, workLocation: v }))}
                placeholder="就労場所の住所"
              />
              <div className="sm:col-span-2">
                <FieldLabel label="業務内容" />
                <textarea
                  value={detailForm.workContent ?? ""}
                  onChange={(e) => setDetailForm((d) => ({ ...d, workContent: e.target.value }))}
                  placeholder="従事する業務の内容"
                  rows={3}
                  className="w-full bg-black/30 text-white text-sm px-3 py-1.5 rounded border border-border outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">支援体制</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CheckboxInput
                label="支援を登録支援機関に委託する"
                checked={detailForm.isDelegated ?? false}
                onChange={(v) => setDetailForm((d) => ({ ...d, isDelegated: v }))}
              />
              {detailForm.isDelegated && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 pl-6 border-l-2 border-blue-800">
                  <TextInput
                    label="登録支援機関名"
                    value={detailForm.supportOrgName ?? ""}
                    onChange={(v) => setDetailForm((d) => ({ ...d, supportOrgName: v }))}
                    placeholder="機関名"
                  />
                  <TextInput
                    label="登録支援機関 登録番号"
                    value={detailForm.supportOrgRegNo ?? ""}
                    onChange={(v) => setDetailForm((d) => ({ ...d, supportOrgRegNo: v }))}
                    placeholder="登録番号"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">申請スケジュール</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextInput
                label="申請予定日"
                value={detailForm.targetSubmitDate ?? ""}
                onChange={(v) => setDetailForm((d) => ({ ...d, targetSubmitDate: v }))}
                type="date"
              />
              <TextInput
                label="申請日"
                value={detailForm.submittedDate ?? ""}
                onChange={(v) => setDetailForm((d) => ({ ...d, submittedDate: v }))}
                type="date"
              />
              <TextInput
                label="許可日"
                value={detailForm.approvedDate ?? ""}
                onChange={(v) => setDetailForm((d) => ({ ...d, approvedDate: v }))}
                type="date"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── 書類確認タブ ──────────────────────────────────────────────────── */}
      {activeTab === "書類確認" && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-500 mb-2">
            申請種別 <span className="text-zinc-300 font-medium">{SSW_APP_TYPES[appType]?.shortLabel}</span> /
            雇用形態 <span className="text-zinc-300 font-medium">{detailForm.employerType === "individual" ? "個人事業主" : "法人"}</span> /
            支援委託 <span className="text-zinc-300 font-medium">{detailForm.isDelegated ? "あり" : "なし"}</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {["申請人", "所属機関", "登録支援機関"].map((party) => {
              const partyDocs = filteredDocs.filter((d) => d.party === party);
              if (partyDocs.length === 0) return null;
              return (
                <Card key={party} className="bg-black/30 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-zinc-300">{party}提出書類</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {partyDocs.map((doc) => (
                      <div
                        key={doc.key}
                        className={`flex items-start gap-3 p-2 rounded border transition-colors ${
                          docChecklist[doc.key]
                            ? "border-green-800/50 bg-green-950/20"
                            : doc.required
                            ? "border-red-800/50 bg-red-950/10"
                            : "border-border bg-black/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={docChecklist[doc.key] ?? false}
                          onChange={(e) =>
                            setDocChecklist((prev) => ({ ...prev, [doc.key]: e.target.checked }))
                          }
                          className="mt-0.5 w-4 h-4 accent-green-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-white">{doc.label}</span>
                            {doc.required ? (
                              <Badge className="border-red-600 text-red-400 text-[9px] bg-transparent px-1 py-0 h-4">必須</Badge>
                            ) : (
                              <Badge className="border-zinc-600 text-zinc-400 text-[9px] bg-transparent px-1 py-0 h-4">任意</Badge>
                            )}
                            {doc.referenceForm && (
                              <span className="text-[10px] text-zinc-500">{doc.referenceForm}</span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5">{doc.note}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* 書類完備率 */}
          <Card className="bg-black/30 border-border">
            <CardContent className="pt-4">
              {(() => {
                const requiredDocs = filteredDocs.filter((d) => d.required);
                const completedRequired = requiredDocs.filter((d) => docChecklist[d.key]).length;
                const pct = requiredDocs.length > 0 ? Math.round((completedRequired / requiredDocs.length) * 100) : 0;
                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-zinc-400">必須書類完備率</span>
                      <span className={`text-sm font-bold ${pct === 100 ? "text-green-400" : pct >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                        {completedRequired} / {requiredDocs.length} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${pct === 100 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── 申請管理タブ ─────────────────────────────────────────────────── */}
      {activeTab === "申請管理" && (
        <div className="space-y-4">
          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">申請ステータス管理</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <FieldLabel label="申請ステータス" />
                <div className="flex flex-wrap gap-2">
                  {(["DRAFT", "REVIEW", "SUBMITTED", "APPROVED", "REJECTED", "CANCELLED"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setDetailForm((d) => ({ ...d, status: s }))}
                      className={`px-3 py-1 text-xs rounded border transition-colors ${
                        detailForm.status === s
                          ? "bg-blue-700 border-blue-500 text-white"
                          : "bg-black/30 border-border text-zinc-400 hover:border-zinc-500"
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel label="メモ・備考" />
                <textarea
                  value={detailForm.notes ?? ""}
                  onChange={(e) => setDetailForm((d) => ({ ...d, notes: e.target.value }))}
                  placeholder="申請に関するメモ、担当者引継ぎ事項など"
                  rows={5}
                  className="w-full bg-black/30 text-white text-sm px-3 py-1.5 rounded border border-border outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* 申請履歴一覧 */}
          {details.length > 1 && (
            <Card className="bg-black/30 border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-300">申請履歴</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {details.map((det) => (
                    <div
                      key={det.id}
                      onClick={() => {
                        setActiveDetailId(det.id);
                        setDetailForm({ ...det });
                        setDocChecklist(det.docChecklist ?? {});
                      }}
                      className={`flex items-center gap-3 p-2 rounded border cursor-pointer transition-colors ${
                        activeDetailId === det.id
                          ? "border-blue-600 bg-blue-950/30"
                          : "border-border hover:border-zinc-600"
                      }`}
                    >
                      <Badge className={`text-[10px] bg-transparent border ${STATUS_COLORS[det.status] ?? "border-zinc-500 text-zinc-400"}`}>
                        {STATUS_LABELS[det.status] ?? det.status}
                      </Badge>
                      <span className="text-xs text-zinc-300">{(SSW_APP_TYPES as Record<string, { shortLabel: string }>)[det.appType]?.shortLabel ?? det.appType}</span>
                      {det.sectorLabel && <span className="text-xs text-zinc-500">{det.sectorLabel}</span>}
                      <span className="text-xs text-zinc-600 ml-auto">
                        {new Date(det.updatedAt).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 申請サマリー */}
          <Card className="bg-black/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-300">申請サマリー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {[
                  { label: "申請種別", value: SSW_APP_TYPES[appType]?.label },
                  { label: "特定産業分野", value: detailForm.sectorLabel ?? personForm.sswSector },
                  { label: "申請人", value: displayName },
                  { label: "国籍", value: personForm.nationality },
                  { label: "在留カード期限", value: personForm.residenceCardExpiry },
                  { label: "所属機関", value: companyForm.name },
                  { label: "契約期間", value: detailForm.contractStartDate && detailForm.contractEndDate ? `${detailForm.contractStartDate} ～ ${detailForm.contractEndDate}` : undefined },
                  { label: "月額給与", value: detailForm.monthlySalary ? `¥${detailForm.monthlySalary.toLocaleString()}` : undefined },
                  { label: "支援委託", value: detailForm.isDelegated ? detailForm.supportOrgName ?? "あり" : "なし（自社支援）" },
                  { label: "申請予定日", value: detailForm.targetSubmitDate },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-2">
                    <span className="text-zinc-500 w-24 flex-shrink-0">{label}：</span>
                    <span className={value ? "text-zinc-200" : "text-zinc-600"}>
                      {value ?? "―"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── フッター 保存ボタン ──────────────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-between">
        <Link href="/ssw" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          ← SSW管理に戻る
        </Link>
        <div className="flex items-center gap-3">
          {saveMsg && (
            <span className={`text-xs ${saveMsg.includes("失敗") ? "text-red-400" : "text-green-400"}`}>
              {saveMsg}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-60 text-white text-sm rounded transition-colors"
          >
            {saving ? "保存中..." : "変更を保存"}
          </button>
        </div>
      </div>
    </div>
  );
}
