"use client";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/ui/print-button";
import { ArrowRight, Plus, X } from "lucide-react";
import type { TaRecord, TaStage } from "@/lib/demo-store";

const STAGES: { id: TaStage; label: string; description: string; color: string }[] = [
  { id: "TA0", label: "対象確認", description: "移行対象者の確認・選定", color: "border-muted text-muted" },
  { id: "TA1", label: "書類準備", description: "申請書類の準備・作成", color: "border-brand-amber text-brand-amber" },
  { id: "TA2", label: "申請", description: "入管申請書類提出", color: "border-brand-blue text-brand-blue" },
  { id: "TA3", label: "許可待ち", description: "許可通知受領待ち", color: "border-purple-400 text-purple-300" },
  { id: "TA4", label: "完了", description: "在留資格切替完了", color: "border-emerald-400 text-emerald-300" },
];

const TARGET_LABELS: Record<string, string> = { SSW: "特定技能", IKUSEI: "育成就労", OTHER: "その他" };

type NewForm = { personId: string; targetProgram: "SSW" | "IKUSEI" | "OTHER"; notes: string; dueDate: string };

export default function TaPage() {
  const [records, setRecords] = useState<TaRecord[]>([]);
  const [personMap, setPersonMap] = useState<Record<string, string>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<NewForm>({ personId: "", targetProgram: "SSW", notes: "", dueDate: "" });
  const [persons, setPersons] = useState<{ id: string; name: string }[]>([]);

  const load = useCallback(() => {
    fetch("/api/v1/ta").then((r) => r.json()).then((res) => setRecords(res.data));
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => {
      const list = res.data ?? [];
      setPersons(list.map((p: any) => ({ id: p.id, name: p.nameKanji || p.nameRomaji || p.fullName || p.id })));
      const map: Record<string, string> = {};
      list.forEach((p: any) => { map[p.id] = p.nameKanji || p.nameRomaji || p.fullName || p.id; });
      setPersonMap(map);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const moveStage = async (id: string, stage: TaStage) => {
    await fetch(`/api/v1/ta/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentStage: stage }) });
    load();
  };

  const addRecord = async () => {
    if (!form.personId) return;
    await fetch("/api/v1/ta", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, currentStage: "TA0" }) });
    setShowAdd(false);
    setForm({ personId: "", targetProgram: "SSW", notes: "", dueDate: "" });
    load();
  };

  const byStage = (stage: TaStage) => records.filter((r) => r.currentStage === stage);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold">特定活動46号 移行パイプライン</h1>
          <p className="text-sm text-muted">技能実習・育成就労からの在留資格切替を管理します</p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <PrintButton />
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue text-white text-sm hover:opacity-90 transition">
            <Plus size={14} /> 新規追加
          </button>
        </div>
      </div>

      {/* カンバンボード */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 overflow-x-auto">
        {STAGES.map((stage, stageIdx) => (
          <div key={stage.id} className="min-w-[200px] space-y-2">
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-[10px] font-mono text-muted">{stage.id}</span>
                <h2 className="text-sm font-semibold text-white">{stage.label}</h2>
                <p className="text-[10px] text-muted">{stage.description}</p>
              </div>
              <Badge className={`${stage.color} text-xs`}>{byStage(stage.id).length}</Badge>
            </div>
            <div className="space-y-2 min-h-[120px]">
              {byStage(stage.id).map((rec) => (
                <div key={rec.id} className="p-3 rounded-lg border border-border bg-surface/60 space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-sm font-medium text-white leading-tight">{personMap[rec.personId] ?? rec.personId}</p>
                    <Badge className="border-brand-teal text-brand-teal text-[10px] shrink-0">{TARGET_LABELS[rec.targetProgram]}</Badge>
                  </div>
                  {rec.notes && <p className="text-[11px] text-muted line-clamp-2">{rec.notes}</p>}
                  {rec.dueDate && <p className="text-[10px] text-brand-amber">期限: {rec.dueDate}</p>}
                  <div className="flex gap-1 flex-wrap">
                    {stageIdx > 0 && (
                      <button onClick={() => moveStage(rec.id, STAGES[stageIdx - 1].id)} className="text-[10px] px-1.5 py-0.5 rounded border border-muted text-muted hover:border-white hover:text-white transition">
                        ← 戻す
                      </button>
                    )}
                    {stageIdx < STAGES.length - 1 && (
                      <button onClick={() => moveStage(rec.id, STAGES[stageIdx + 1].id)} className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded border border-brand-blue text-brand-blue hover:bg-brand-blue/10 transition">
                        次へ <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {byStage(stage.id).length === 0 && (
                <div className="h-16 rounded-lg border border-dashed border-border flex items-center justify-center">
                  <p className="text-xs text-muted">なし</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 新規追加モーダル */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">移行対象者を追加</h2>
              <button onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted">対象者</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-surface/60 text-sm" value={form.personId} onChange={(e) => setForm((f) => ({ ...f, personId: e.target.value }))}>
                  <option value="">-- 選択 --</option>
                  {persons.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted">移行先制度</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-surface/60 text-sm" value={form.targetProgram} onChange={(e) => setForm((f) => ({ ...f, targetProgram: e.target.value as any }))}>
                  <option value="SSW">特定技能</option>
                  <option value="IKUSEI">育成就労</option>
                  <option value="OTHER">その他</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted">期限</label>
                <input type="date" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-surface/60 text-sm" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-muted">メモ</label>
                <textarea rows={3} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-surface/60 text-sm resize-none" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted hover:text-white transition">キャンセル</button>
              <button onClick={addRecord} disabled={!form.personId} className="px-4 py-2 rounded-lg bg-brand-blue text-white text-sm hover:opacity-90 transition disabled:opacity-40">追加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
