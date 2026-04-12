"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SSW_APP_TYPES, SSW_SECTORS, filterDocChecklist, type DocCheckItem } from "@/lib/field-map";

// ─── 型 ──────────────────────────────────────────────────────────────────────

type AppType = "COE" | "COS" | "EXT";
type EmployerType = "corporate" | "individual";

type Person = { id: string; nameKanji?: string; nameRomaji?: string; nationality?: string };
type Company = { id: string; name: string };

type FormState = {
  // Step 1
  appType: AppType;
  // Step 2 - 申請人情報
  personId: string;
  nationality: string;
  sectorCode: string;
  skillTestPassed: boolean;
  japaneseTestPassed: boolean;
  exemptFromTests: boolean; // 技能実習2号修了による免除
  // Step 3 - 所属機関情報
  companyId: string;
  employerType: EmployerType;
  isDelegated: boolean;
  supportOrgName: string;
  contractStartDate: string;
  contractEndDate: string;
  monthlySalary: string;
  workLocation: string;
  // Step 4 - 書類チェック
  checkedDocs: Record<string, boolean>;
  // Step 5
  notes: string;
};

const PARTY_COLORS: Record<string, string> = {
  "申請人":      "border-brand-blue text-brand-blue",
  "所属機関":    "border-brand-teal text-brand-teal",
  "登録支援機関": "border-purple-400 text-purple-300",
};

// ─── ステップ表示 ─────────────────────────────────────────────────────────────

function StepBar({ current, total }: { current: number; total: number }) {
  const LABELS = ["申請種別", "申請人情報", "所属機関情報", "書類確認", "確認・登録"];
  return (
    <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
      {LABELS.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={idx} className="flex items-center gap-1 shrink-0">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border transition
              ${active  ? "bg-brand-blue border-brand-blue text-white" :
                done    ? "bg-green-700 border-green-600 text-white" :
                          "bg-surface border-border text-muted"}`}>
              {done ? "✓" : idx}
            </div>
            <span className={`text-xs hidden md:block ${active ? "text-white" : "text-muted"}`}>{label}</span>
            {i < total - 1 && <div className="w-6 h-px bg-border mx-1" />}
          </div>
        );
      })}
    </div>
  );
}

// ─── メインページ ─────────────────────────────────────────────────────────────

export default function SswApplicationNewPage() {
  const [step, setStep] = useState(1);
  const [persons, setPersons] = useState<Person[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [form, setForm] = useState<FormState>({
    appType: "EXT",
    personId: "",
    nationality: "",
    sectorCode: "11",
    skillTestPassed: false,
    japaneseTestPassed: false,
    exemptFromTests: false,
    companyId: "",
    employerType: "corporate",
    isDelegated: true,
    supportOrgName: "",
    contractStartDate: "",
    contractEndDate: "",
    monthlySalary: "",
    workLocation: "",
    checkedDocs: {},
    notes: "",
  });

  useEffect(() => {
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // 書類リスト（条件に応じてフィルタ）
  const docList: DocCheckItem[] = filterDocChecklist({
    appType: form.appType,
    employerType: form.employerType,
    isDelegated: form.isDelegated,
  });
  const checkedCount = docList.filter((d) => form.checkedDocs[d.key]).length;
  const requiredDocs = docList.filter((d) => d.required);
  const requiredChecked = requiredDocs.filter((d) => form.checkedDocs[d.key]).length;

  const appTypeMeta = SSW_APP_TYPES[form.appType];
  const selectedSector = SSW_SECTORS.find((s) => s.code === form.sectorCode);
  const selectedPerson = persons.find((p) => p.id === form.personId);
  const selectedCompany = companies.find((c) => c.id === form.companyId);

  // 申請種別→PDFテンプレートID対応
  const PDF_TEMPLATE: Record<AppType, string> = {
    EXT: "residence-period-extension",
    COS: "residence-status-change",
    COE: "residence-period-extension", // COEはデモ用にEXTと同じテンプレートで代替
  };

  async function handleSubmit() {
    if (!form.personId || !form.companyId) { setErrMsg("申請人と所属機関は必須です"); return; }
    setSubmitting(true);
    const res = await fetch("/api/v1/ssw/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personId: form.personId,
        companyId: form.companyId,
        appType: form.appType,
        sector: selectedSector?.label ?? "",
        employerType: form.employerType,
        nationality: form.nationality,
        status: "draft",
        notes: form.notes,
      }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      setErrMsg("登録に失敗しました");
    }
    setSubmitting(false);
  }

  function printSummary() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>特定技能申請サマリ</title>
      <style>
        body { font-family: sans-serif; padding: 32px; color: #111; }
        h1 { font-size: 18px; border-bottom: 2px solid #333; padding-bottom: 8px; }
        h2 { font-size: 14px; margin-top: 20px; border-bottom: 1px solid #aaa; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px; }
        td { padding: 6px 8px; border: 1px solid #ddd; }
        td:first-child { background: #f5f5f5; font-weight: bold; width: 40%; }
        .badge { display: inline-block; border: 1px solid #333; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
      </style></head><body>
      <h1>特定技能申請サマリ</h1>
      <p style="font-size:12px;color:#666">出力日: ${new Date().toLocaleDateString("ja-JP")}</p>
      <h2>申請概要</h2>
      <table>
        <tr><td>申請種別</td><td><span class="badge">${form.appType}</span> ${appTypeMeta.label}</td></tr>
        <tr><td>様式番号</td><td>${appTypeMeta.formNumber}</td></tr>
        <tr><td>申請人</td><td>${selectedPerson?.nameKanji ?? selectedPerson?.nameRomaji ?? "-"} (${form.nationality})</td></tr>
        <tr><td>所属機関</td><td>${selectedCompany?.name ?? "-"} (${form.employerType === "corporate" ? "法人" : "個人事業主"})</td></tr>
        <tr><td>特定産業分野</td><td>${selectedSector?.label ?? "-"}</td></tr>
        <tr><td>雇用期間</td><td>${form.contractStartDate || "-"} 〜 ${form.contractEndDate || "-"}</td></tr>
        <tr><td>月額報酬</td><td>${form.monthlySalary ? `¥${Number(form.monthlySalary).toLocaleString()}` : "-"}</td></tr>
        <tr><td>就労場所</td><td>${form.workLocation || "-"}</td></tr>
        <tr><td>登録支援機関委託</td><td>${form.isDelegated ? `あり（${form.supportOrgName || "未入力"}）` : "なし（自社対応）"}</td></tr>
        <tr><td>試験免除</td><td>${form.exemptFromTests ? "技能実習2号修了・育成就労修了により免除" : "-"}</td></tr>
      </table>
      <h2>書類確認状況</h2>
      <table>
        <tr><td>確認済</td><td>${checkedCount} / ${docList.length} 件</td></tr>
        <tr><td>必須書類</td><td>${requiredChecked} / ${requiredDocs.length} 件確認済</td></tr>
      </table>
      ${form.notes ? `<h2>備考</h2><p style="font-size:13px">${form.notes}</p>` : ""}
      </body></html>
    `);
    w.document.close();
    w.print();
  }

  if (submitted) {
    const tplId = PDF_TEMPLATE[form.appType];
    return (
      <div className="max-w-xl mx-auto text-center space-y-4 pt-12">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold text-white">申請書類を登録しました</h2>
        <p className="text-sm text-muted">特定技能申請（{appTypeMeta.shortLabel}）を下書き登録しました。</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={printSummary}
            className="flex items-center gap-1.5 px-4 py-2 rounded border border-border text-sm text-gray-300 hover:bg-white/5"
          >
            🖨 申請サマリを印刷
          </button>
          <a
            href={`/api/v1/pdf/preview?templateId=${tplId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded border border-brand-blue text-sm text-brand-blue hover:bg-brand-blue/10"
          >
            📄 申請書PDF（テンプレート）
          </a>
          <Link href="/ssw" className="px-4 py-2 rounded border border-border text-sm text-gray-300 hover:bg-white/5">
            特定技能トップへ
          </Link>
          <button onClick={() => { setSubmitted(false); setStep(1); setForm((f) => ({ ...f, personId: "", companyId: "", checkedDocs: {} })); }}
            className="px-4 py-2 rounded bg-brand-blue text-white text-sm">
            新規申請を作成
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center gap-3">
        <Link href="/ssw" className="text-brand-blue text-sm hover:underline">← 特定技能</Link>
        <span className="text-muted">/</span>
        <h1 className="text-lg font-semibold text-white">入管申請　新規作成</h1>
      </div>

      <StepBar current={step} total={5} />

      {/* ─── Step 1: 申請種別選択 ─── */}
      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm text-muted">申請の種別を選択してください</p>
          <div className="grid gap-3">
            {(Object.values(SSW_APP_TYPES) as typeof SSW_APP_TYPES[keyof typeof SSW_APP_TYPES][]).map((type) => (
              <button
                key={type.code}
                onClick={() => set("appType", type.code as AppType)}
                className={`p-4 rounded-xl border text-left transition ${form.appType === type.code ? "border-brand-blue bg-brand-blue/10" : "border-border bg-surface/60 hover:bg-white/5"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="border-brand-blue text-brand-blue text-xs">{type.code}</Badge>
                  <span className="text-sm font-semibold text-white">{type.label}</span>
                </div>
                <p className="text-xs text-muted">{type.description}</p>
                <p className="text-[10px] text-gray-500 mt-1">様式：{type.formNumber}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Step 2: 申請人情報 ─── */}
      {step === 2 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">申請人（特定技能外国人）情報</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs text-muted block mb-1">外国人を選択 *</label>
                <select
                  className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={form.personId}
                  onChange={(e) => {
                    const p = persons.find((p) => p.id === e.target.value);
                    set("personId", e.target.value);
                    if (p?.nationality) set("nationality", p.nationality);
                  }}
                >
                  <option value="">選択してください</option>
                  {persons.map((p) => (
                    <option key={p.id} value={p.id}>{p.nameKanji ?? p.nameRomaji} ({p.nationality})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">国籍 *</label>
                <input className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={form.nationality}
                  onChange={(e) => set("nationality", e.target.value)}
                  placeholder="例：ベトナム" />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">特定産業分野 *</label>
                <select className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={form.sectorCode}
                  onChange={(e) => set("sectorCode", e.target.value)}>
                  {SSW_SECTORS.map((s) => (
                    <option key={s.code} value={s.code}>{s.code}. {s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border bg-surface/60 space-y-2">
              <p className="text-xs font-semibold text-white">試験要件の確認</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-brand-blue"
                  checked={form.exemptFromTests}
                  onChange={(e) => set("exemptFromTests", e.target.checked)} />
                <span className="text-xs text-gray-300">技能実習2号修了・育成就労修了により試験免除</span>
              </label>
              {!form.exemptFromTests && (
                <>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-brand-blue"
                      checked={form.skillTestPassed}
                      onChange={(e) => set("skillTestPassed", e.target.checked)} />
                    <span className="text-xs text-gray-300">特定技能評価試験（分野別）合格済み</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-brand-blue"
                      checked={form.japaneseTestPassed}
                      onChange={(e) => set("japaneseTestPassed", e.target.checked)} />
                    <span className="text-xs text-gray-300">日本語試験（N4以上または国際交流基金テスト等）合格済み</span>
                  </label>
                </>
              )}
            </div>

            {!form.exemptFromTests && !form.skillTestPassed && (
              <div className="p-2 rounded border border-brand-amber/40 bg-brand-amber/10 text-xs text-brand-amber">
                ⚠ 特定技能評価試験（分野別）の合格が必要です
              </div>
            )}
            {!form.exemptFromTests && !form.japaneseTestPassed && (
              <div className="p-2 rounded border border-brand-amber/40 bg-brand-amber/10 text-xs text-brand-amber">
                ⚠ 日本語試験の合格が必要です（N4以上）
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ─── Step 3: 所属機関情報 ─── */}
      {step === 3 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">所属機関（雇用主）情報</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs text-muted block mb-1">所属機関 *</label>
                <select className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={form.companyId}
                  onChange={(e) => set("companyId", e.target.value)}>
                  <option value="">選択してください</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">雇用主区分 *</label>
                <div className="flex gap-3">
                  {(["corporate", "individual"] as EmployerType[]).map((t) => (
                    <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="employerType" className="accent-brand-blue"
                        checked={form.employerType === t}
                        onChange={() => set("employerType", t)} />
                      <span className="text-sm text-gray-300">{t === "corporate" ? "法人" : "個人事業主"}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">登録支援機関への支援委託</label>
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input type="checkbox" className="accent-brand-blue"
                    checked={form.isDelegated}
                    onChange={(e) => set("isDelegated", e.target.checked)} />
                  <span className="text-sm text-gray-300">登録支援機関へ委託あり</span>
                </label>
              </div>

              {form.isDelegated && (
                <div className="md:col-span-2">
                  <label className="text-xs text-muted block mb-1">登録支援機関名</label>
                  <input className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                    value={form.supportOrgName}
                    onChange={(e) => set("supportOrgName", e.target.value)}
                    placeholder="登録支援機関の名称" />
                </div>
              )}

              <div>
                <label className="text-xs text-muted block mb-1">雇用契約開始日</label>
                <input type="date" className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={form.contractStartDate}
                  onChange={(e) => set("contractStartDate", e.target.value)} />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">雇用契約終了日</label>
                <input type="date" className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={form.contractEndDate}
                  onChange={(e) => set("contractEndDate", e.target.value)} />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">月額報酬（円）</label>
                <input type="number" className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={form.monthlySalary}
                  onChange={(e) => set("monthlySalary", e.target.value)}
                  placeholder="例: 200000" />
                <p className="text-[10px] text-muted mt-0.5">日本人同等以上の報酬であること</p>
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">就労場所</label>
                <input className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={form.workLocation}
                  onChange={(e) => set("workLocation", e.target.value)}
                  placeholder="例：東京都港区" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Step 4: 書類チェックリスト ─── */}
      {step === 4 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              {form.appType} / {form.employerType === "corporate" ? "法人" : "個人事業主"} /
              {form.isDelegated ? " 支援委託あり" : " 自社支援"}
            </p>
            <div className="text-xs text-muted">
              確認済 {checkedCount}/{docList.length}件 (必須 {requiredChecked}/{requiredDocs.length})
            </div>
          </div>

          <div className="w-full bg-surface/60 rounded h-2 border border-border">
            <div className="bg-brand-blue h-full rounded transition-all" style={{ width: `${docList.length ? (checkedCount / docList.length) * 100 : 0}%` }} />
          </div>

          {/* 申請人書類 */}
          {["申請人", "所属機関", "登録支援機関"].map((party) => {
            const items = docList.filter((d) => d.party === party);
            if (!items.length) return null;
            return (
              <Card key={party}>
                <CardHeader>
                  <CardTitle className="text-xs flex items-center gap-2">
                    <Badge className={`${PARTY_COLORS[party] ?? "border-gray-500 text-gray-400"} text-[10px]`}>{party}</Badge>
                    が準備する書類
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <tbody>
                      {items.map((doc) => (
                        <tr key={doc.key} className="border-b border-border/40 hover:bg-white/5">
                          <td className="px-3 py-2 w-8">
                            <input
                              type="checkbox"
                              className="accent-brand-blue cursor-pointer"
                              checked={!!form.checkedDocs[doc.key]}
                              onChange={(e) => set("checkedDocs", { ...form.checkedDocs, [doc.key]: e.target.checked })}
                            />
                          </td>
                          <td className="px-2 py-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${form.checkedDocs[doc.key] ? "line-through text-muted" : "text-white"}`}>
                                {doc.label}
                              </span>
                              {doc.required
                                ? <Badge className="border-red-500 text-red-400 text-[9px]">必須</Badge>
                                : <Badge className="border-gray-500 text-gray-400 text-[9px]">任意</Badge>}
                              {doc.referenceForm && (
                                <span className="text-[10px] text-muted font-mono">{doc.referenceForm}</span>
                              )}
                            </div>
                            <p className="text-xs text-muted mt-0.5">{doc.note}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            );
          })}

          {requiredChecked < requiredDocs.length && (
            <div className="p-3 rounded border border-brand-amber/40 bg-brand-amber/10 text-xs text-brand-amber">
              ⚠ 必須書類がまだ未確認です（残り {requiredDocs.length - requiredChecked} 件）
            </div>
          )}
        </div>
      )}

      {/* ─── Step 5: 確認・登録 ─── */}
      {step === 5 && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">申請内容の確認</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg border border-border bg-surface/60">
                  <p className="text-xs text-muted mb-1">申請種別</p>
                  <Badge className="border-brand-blue text-brand-blue">{form.appType}</Badge>
                  <p className="text-white text-xs mt-1">{appTypeMeta.label}</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-surface/60">
                  <p className="text-xs text-muted mb-1">申請人</p>
                  <p className="text-white text-sm">{selectedPerson?.nameKanji ?? selectedPerson?.nameRomaji ?? "-"}</p>
                  <p className="text-xs text-muted">{form.nationality}</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-surface/60">
                  <p className="text-xs text-muted mb-1">所属機関</p>
                  <p className="text-white text-sm">{selectedCompany?.name ?? "-"}</p>
                  <p className="text-xs text-muted">{form.employerType === "corporate" ? "法人" : "個人事業主"}</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-surface/60">
                  <p className="text-xs text-muted mb-1">特定産業分野</p>
                  <p className="text-white text-sm">{selectedSector?.label ?? "-"}</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-surface/60">
                  <p className="text-xs text-muted mb-1">支援委託</p>
                  <p className="text-white text-sm">{form.isDelegated ? `あり（${form.supportOrgName || "未入力"}）` : "なし（自社対応）"}</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-surface/60">
                  <p className="text-xs text-muted mb-1">書類確認</p>
                  <p className={`text-sm font-semibold ${requiredChecked >= requiredDocs.length ? "text-green-400" : "text-brand-amber"}`}>
                    {checkedCount}/{docList.length} 件確認済
                  </p>
                  <p className="text-xs text-muted">必須 {requiredChecked}/{requiredDocs.length}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">備考</label>
                <textarea
                  className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white h-20 resize-none"
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="申請に関する特記事項・メモ" />
              </div>

              {errMsg && <p className="text-xs text-red-400">{errMsg}</p>}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── ナビゲーション ─── */}
      <div className="flex justify-between pt-2">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
          className="px-4 py-2 rounded border border-border text-sm text-gray-300 hover:bg-white/5 disabled:opacity-30"
        >
          ← 前へ
        </button>

        {step < 5 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="px-5 py-2 rounded bg-brand-blue text-white text-sm font-semibold hover:opacity-90"
          >
            次へ →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !form.personId || !form.companyId}
            className="px-5 py-2 rounded bg-green-700 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "登録中..." : "申請を下書き登録する"}
          </button>
        )}
      </div>
    </div>
  );
}
