"use client";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/ui/print-button";
import { Languages, Plus, X, Copy, Check, Loader2 } from "lucide-react";

type TranslationJob = {
  id: string; title: string; sourceLang: string; targetLang: string;
  sourceText: string; translatedText?: string; status: string;
  createdAt: string; completedAt?: string;
};

const LANG_OPTIONS = [
  { value: "ID", label: "インドネシア語", flag: "🇮🇩" },
  { value: "VI", label: "ベトナム語",     flag: "🇻🇳" },
  { value: "NE", label: "ネパール語",     flag: "🇳🇵" },
  { value: "EN", label: "英語",           flag: "🇬🇧" },
];

const STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: "翻訳中",   color: "border-brand-amber text-brand-amber" },
  done:    { label: "完了",     color: "border-emerald-400 text-emerald-300" },
  error:   { label: "エラー",   color: "border-rose-400 text-rose-300" },
};

export default function TranslationPage() {
  const [jobs, setJobs] = useState<TranslationJob[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", targetLang: "ID", sourceText: "" });
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/v1/translation").then((r) => r.json()).then((res) => setJobs(res.data ?? []));
  }, []);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!form.sourceText || !form.title) return;
    setLoading(true);
    try {
      await fetch("/api/v1/translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowNew(false);
      setForm({ title: "", targetLang: "ID", sourceText: "" });
      load();
    } finally {
      setLoading(false);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const inp = "w-full mt-1 px-3 py-2 rounded-lg border border-border bg-surface/60 text-sm";

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold">翻訳・通訳</h1>
          <p className="text-sm text-muted">日本語テキストを多言語に翻訳します（Claude AI使用）</p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <PrintButton />
          <button onClick={() => setShowNew(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue text-white text-sm hover:opacity-90 transition">
            <Plus size={14} /> 翻訳を依頼
          </button>
        </div>
      </div>

      {/* 対応言語バッジ */}
      <div className="flex gap-2 flex-wrap">
        {LANG_OPTIONS.map((l) => (
          <span key={l.value} className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border text-sm text-muted">
            <span>{l.flag}</span>{l.label}
          </span>
        ))}
      </div>

      {/* 翻訳ジョブ一覧 */}
      <div className="space-y-3">
        {jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted">
            <Languages size={32} className="mb-3 opacity-40" />
            <p className="text-sm">まだ翻訳ジョブがありません</p>
          </div>
        )}
        {jobs.map((job) => {
          const st = STATUS[job.status] ?? { label: job.status, color: "border-muted text-muted" };
          const lang = LANG_OPTIONS.find((l) => l.value === job.targetLang);
          const isExpanded = expanded === job.id;
          return (
            <div key={job.id} className="rounded-xl border border-border bg-surface/60 overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition" onClick={() => setExpanded(isExpanded ? null : job.id)}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-white">{job.title}</p>
                    <Badge className={`${st.color} text-[10px]`}>{st.label}</Badge>
                    {lang && <span className="text-xs text-muted">{lang.flag} {lang.label}</span>}
                  </div>
                  <p className="text-xs text-muted">{new Date(job.createdAt).toLocaleString("ja-JP")}</p>
                </div>
                <span className="text-xs text-muted">{isExpanded ? "▲" : "▼"}</span>
              </div>
              {isExpanded && (
                <div className="border-t border-border p-4 grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted mb-1">原文（日本語）</p>
                    <div className="p-3 rounded-lg bg-black/20 text-sm text-white whitespace-pre-wrap">{job.sourceText}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-muted">翻訳結果 {lang ? `（${lang.label}）` : ""}</p>
                      {job.translatedText && job.status === "done" && (
                        <button onClick={() => copyText(job.id, job.translatedText!)} className="flex items-center gap-1 text-xs text-muted hover:text-white transition">
                          {copied === job.id ? <Check size={12} /> : <Copy size={12} />}
                          {copied === job.id ? "コピー済み" : "コピー"}
                        </button>
                      )}
                    </div>
                    <div className="p-3 rounded-lg bg-black/20 text-sm text-white whitespace-pre-wrap min-h-[60px]">
                      {job.status === "pending" && <span className="flex items-center gap-2 text-muted"><Loader2 size={14} className="animate-spin" /> 翻訳中...</span>}
                      {job.status === "error" && <span className="text-rose-400">{job.translatedText}</span>}
                      {job.status === "done" && job.translatedText}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 新規翻訳モーダル */}
      {showNew && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">翻訳を依頼</h2>
              <button onClick={() => setShowNew(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted">タイトル</label>
                <input className={inp} placeholder="例: 雇用契約書（インドネシア語訳）" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-muted">翻訳先言語</label>
                <select className={inp} value={form.targetLang} onChange={(e) => setForm((f) => ({ ...f, targetLang: e.target.value }))}>
                  {LANG_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.flag} {l.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted">原文（日本語）</label>
                <textarea rows={6} className={inp + " resize-none"} placeholder="翻訳したい日本語テキストを入力してください" value={form.sourceText} onChange={(e) => setForm((f) => ({ ...f, sourceText: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted hover:text-white transition">キャンセル</button>
              <button onClick={submit} disabled={loading || !form.title || !form.sourceText} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white text-sm hover:opacity-90 disabled:opacity-40 transition">
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? "翻訳中..." : "翻訳を実行"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
