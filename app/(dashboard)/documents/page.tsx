"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";

type StoredDocument = {
  id: string;
  personId?: string;
  companyId?: string;
  applicationId?: string;
  category: string;
  filename: string;
  mimeType: string;
  sizeBytes?: number;
  dataUrl?: string;
  uploadedAt: string;
  uploadedBy?: string;
  memo?: string;
};

type Person = { id: string; nameKanji?: string; nameRomaji?: string };

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  passport:        { label: "パスポート",   color: "border-brand-blue text-brand-blue" },
  residence_card:  { label: "在留カード",   color: "border-brand-teal text-brand-teal" },
  contract:        { label: "雇用契約書",   color: "border-green-500 text-green-400" },
  support_plan:    { label: "支援計画書",   color: "border-purple-400 text-purple-300" },
  application_pdf: { label: "申請書PDF",   color: "border-brand-amber text-brand-amber" },
  approval_notice: { label: "許可通知書",   color: "border-green-600 text-green-400" },
  other:           { label: "その他",       color: "border-gray-500 text-gray-400" },
};

const CATEGORY_OPTIONS = [
  { value: "passport",        label: "パスポートコピー" },
  { value: "residence_card",  label: "在留カードコピー" },
  { value: "contract",        label: "雇用契約書" },
  { value: "support_plan",    label: "支援計画書" },
  { value: "application_pdf", label: "申請書PDF" },
  { value: "approval_notice", label: "許可通知書" },
  { value: "other",           label: "その他" },
];

const DOC_TABS = [
  { id: "all",     label: "全書類" },
  { id: "person",  label: "外国人別" },
  { id: "upload",  label: "アップロード" },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP");
}
function fmtSize(bytes?: number) {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<StoredDocument[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [tab, setTab] = useState("all");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    personId: "",
    category: "other",
    memo: "",
    uploadedBy: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchDocs = () => {
    const q = selectedPerson ? `?personId=${selectedPerson}` : "";
    fetch(`/api/v1/documents${q}`).then((r) => r.json()).then((res) => setDocs(res.data ?? []));
  };

  useEffect(() => {
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
  }, []);

  useEffect(() => { fetchDocs(); }, [selectedPerson]);

  const personName = (id?: string) => {
    const p = persons.find((p) => p.id === id);
    return p?.nameKanji ?? p?.nameRomaji ?? id ?? "-";
  };

  const filteredDocs = categoryFilter === "all"
    ? docs
    : docs.filter((d) => d.category === categoryFilter);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) { setUploadMsg("ファイルを選択してください"); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const payload = {
        personId: uploadForm.personId || undefined,
        category: uploadForm.category,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        dataUrl,
        uploadedAt: new Date().toISOString(),
        uploadedBy: uploadForm.uploadedBy || undefined,
        memo: uploadForm.memo || undefined,
      };
      await fetch("/api/v1/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setUploadMsg(`「${file.name}」をアップロードしました`);
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      fetchDocs();
      setTimeout(() => setUploadMsg(""), 3000);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">書類管理</h1>
        <p className="text-xs text-muted mt-0.5">パスポート・在留カード・申請書類・許可通知書などを一元管理</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(CATEGORY_LABELS).slice(0, 4).map(([key, val]) => (
          <div key={key} className="p-3 rounded-lg border border-border bg-surface/60">
            <p className="text-xs text-muted">{val.label}</p>
            <p className="text-2xl font-bold text-white">{docs.filter((d) => d.category === key).length}</p>
            <p className="text-[10px] text-muted">件</p>
          </div>
        ))}
      </div>

      <Tabs tabs={DOC_TABS} defaultTab="all" onChange={setTab} />

      {/* ─── 全書類 ─── */}
      {tab === "all" && (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-sm">書類一覧</CardTitle>
              <div className="flex gap-1 flex-wrap ml-auto">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`px-2 py-0.5 rounded text-xs border transition ${categoryFilter === "all" ? "border-brand-blue text-white" : "border-border text-muted"}`}
                >
                  全て
                </button>
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategoryFilter(c.value)}
                    className={`px-2 py-0.5 rounded text-xs border transition ${categoryFilter === c.value ? "border-brand-blue text-white" : "border-border text-muted"}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface/80 border-b border-border">
                  <th className="px-3 py-2 text-left text-xs text-muted">ファイル名</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">種別</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">対象者</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">サイズ</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">アップロード日</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">担当者</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">メモ</th>
                  <th className="px-3 py-2 text-xs text-muted">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length === 0 ? (
                  <tr><td colSpan={8} className="px-3 py-8 text-center text-muted text-xs">書類なし</td></tr>
                ) : (
                  filteredDocs.map((doc) => {
                    const cat = CATEGORY_LABELS[doc.category] ?? { label: doc.category, color: "border-gray-500 text-gray-400" };
                    return (
                      <tr key={doc.id} className="border-b border-border/50 hover:bg-white/5">
                        <td className="px-3 py-2 text-white text-xs font-mono">{doc.filename}</td>
                        <td className="px-3 py-2">
                          <Badge className={`${cat.color} text-[10px]`}>{cat.label}</Badge>
                        </td>
                        <td className="px-3 py-2 text-gray-300 text-xs">{personName(doc.personId)}</td>
                        <td className="px-3 py-2 text-gray-300 text-xs">{fmtSize(doc.sizeBytes)}</td>
                        <td className="px-3 py-2 text-gray-300 text-xs">{fmtDate(doc.uploadedAt)}</td>
                        <td className="px-3 py-2 text-gray-300 text-xs">{doc.uploadedBy ?? "-"}</td>
                        <td className="px-3 py-2 text-muted text-xs max-w-[160px] truncate">{doc.memo ?? "-"}</td>
                        <td className="px-3 py-2 text-center">
                          {doc.dataUrl ? (
                            <a
                              href={doc.dataUrl}
                              download={doc.filename}
                              className="text-brand-blue text-xs hover:underline"
                            >
                              DL
                            </a>
                          ) : (
                            <span className="text-xs text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ─── 外国人別 ─── */}
      {tab === "person" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted block mb-1">外国人を選択</label>
            <select
              className="bg-black/30 border border-border rounded px-3 py-2 text-sm text-white w-full max-w-xs"
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
            >
              <option value="">全員</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>{p.nameKanji ?? p.nameRomaji}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            {docs.length === 0 ? (
              <p className="text-xs text-muted p-4">書類なし</p>
            ) : (
              docs.map((doc) => {
                const cat = CATEGORY_LABELS[doc.category] ?? { label: doc.category, color: "border-gray-500 text-gray-400" };
                return (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface/60">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {doc.mimeType.includes("image") ? "🖼" : doc.mimeType.includes("pdf") ? "📄" : "📁"}
                      </div>
                      <div>
                        <p className="text-sm text-white font-mono">{doc.filename}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge className={`${cat.color} text-[10px]`}>{cat.label}</Badge>
                          <span className="text-[10px] text-muted">{fmtSize(doc.sizeBytes)} · {fmtDate(doc.uploadedAt)}</span>
                        </div>
                        {doc.memo && <p className="text-xs text-muted mt-0.5">{doc.memo}</p>}
                      </div>
                    </div>
                    {doc.dataUrl && (
                      <a href={doc.dataUrl} download={doc.filename} className="text-brand-blue text-xs hover:underline ml-4">
                        ダウンロード
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── アップロード ─── */}
      {tab === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">書類アップロード</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted block mb-1">対象者（任意）</label>
                <select
                  className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={uploadForm.personId}
                  onChange={(e) => setUploadForm((f) => ({ ...f, personId: e.target.value }))}
                >
                  <option value="">選択しない</option>
                  {persons.map((p) => (
                    <option key={p.id} value={p.id}>{p.nameKanji ?? p.nameRomaji}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">書類種別</label>
                <select
                  className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">担当者名</label>
                <input
                  className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={uploadForm.uploadedBy}
                  onChange={(e) => setUploadForm((f) => ({ ...f, uploadedBy: e.target.value }))}
                  placeholder="担当者名"
                />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">メモ</label>
                <input
                  className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={uploadForm.memo}
                  onChange={(e) => setUploadForm((f) => ({ ...f, memo: e.target.value }))}
                  placeholder="書類に関するメモ"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted block mb-1">ファイル選択</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  id="doc-upload"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx"
                />
                <label htmlFor="doc-upload" className="cursor-pointer">
                  <p className="text-4xl mb-2">📎</p>
                  <p className="text-sm text-gray-300">クリックしてファイルを選択</p>
                  <p className="text-xs text-muted mt-1">PDF / 画像（JPG・PNG）/ Word / Excel</p>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 rounded bg-brand-blue text-white text-sm hover:opacity-90 disabled:opacity-50"
              >
                {uploading ? "アップロード中..." : "アップロード"}
              </button>
              {uploadMsg && <p className="text-xs text-green-400">{uploadMsg}</p>}
            </div>

            <div className="p-3 rounded-lg border border-border bg-surface/60 text-xs text-muted">
              <p className="font-semibold text-white mb-1">対応する保存先</p>
              <p>現在：インメモリ（デモ環境） / 本番予定：Google Drive / AWS S3</p>
              <p className="mt-1">ファイルはブラウザ内で base64 変換されてアップロードされます（デモ用）。</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
