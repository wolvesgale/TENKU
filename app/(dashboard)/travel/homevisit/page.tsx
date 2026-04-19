"use client";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/ui/print-button";
import { Plus, X, CheckSquare, Square, ChevronDown, ChevronUp } from "lucide-react";
import type { HomeVisitStatus } from "@/lib/demo-store";

type HomeVisit = {
  id: string; personId: string; departureDate: string; returnDate: string;
  status: HomeVisitStatus; flightInfo?: string; busInfo?: string;
  passportExpiry?: string; notes?: string;
  checklist: { label: string; done: boolean }[];
  createdAt: string;
};

const STATUSES: { id: HomeVisitStatus; label: string; color: string }[] = [
  { id: "DRAFT",    label: "草稿",   color: "border-muted text-muted" },
  { id: "PREP",     label: "準備中", color: "border-brand-amber text-brand-amber" },
  { id: "READY",    label: "出発前", color: "border-brand-blue text-brand-blue" },
  { id: "OUTBOUND", label: "出国中", color: "border-purple-400 text-purple-300" },
  { id: "RETURNED", label: "帰国済", color: "border-emerald-400 text-emerald-300" },
];

const NEXT_STATUS: Record<HomeVisitStatus, HomeVisitStatus | null> = {
  DRAFT: "PREP", PREP: "READY", READY: "OUTBOUND", OUTBOUND: "RETURNED", RETURNED: null,
};

type NewForm = { personId: string; departureDate: string; returnDate: string; flightInfo: string; busInfo: string; passportExpiry: string; notes: string };

export default function TravelHomevisitPage() {
  const [visits, setVisits] = useState<HomeVisit[]>([]);
  const [persons, setPersons] = useState<{ id: string; name: string }[]>([]);
  const [personMap, setPersonMap] = useState<Record<string, string>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState<NewForm>({ personId: "", departureDate: "", returnDate: "", flightInfo: "", busInfo: "", passportExpiry: "", notes: "" });

  const load = useCallback(() => {
    fetch("/api/v1/homevisit").then((r) => r.json()).then((res) => setVisits(res.data ?? []));
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => {
      const list = res.data ?? [];
      const map: Record<string, string> = {};
      list.forEach((p: any) => { map[p.id] = p.nameKanji || p.nameRomaji || p.fullName || p.id; });
      setPersonMap(map);
      setPersons(list.map((p: any) => ({ id: p.id, name: map[p.id] })));
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const addVisit = async () => {
    if (!form.personId || !form.departureDate) return;
    await fetch("/api/v1/homevisit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, status: "DRAFT" }) });
    setShowAdd(false); setForm({ personId: "", departureDate: "", returnDate: "", flightInfo: "", busInfo: "", passportExpiry: "", notes: "" }); load();
  };

  const advanceStatus = async (visit: HomeVisit) => {
    const next = NEXT_STATUS[visit.status];
    if (!next) return;
    await fetch(`/api/v1/homevisit/${visit.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    load();
  };

  const toggleChecklist = async (visit: HomeVisit, idx: number) => {
    const updated = visit.checklist.map((c, i) => i === idx ? { ...c, done: !c.done } : c);
    await fetch(`/api/v1/homevisit/${visit.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ checklist: updated }) });
    load();
  };

  const inp = "w-full mt-1 px-3 py-2 rounded-lg border border-border bg-surface/60 text-sm";
  const sel = inp;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold">一時帰国管理</h1>
          <p className="text-sm text-muted">一時帰国の旅程・チェックリストを管理します</p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <PrintButton />
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue text-white text-sm hover:opacity-90 transition">
            <Plus size={14} /> 旅程を追加
          </button>
        </div>
      </div>

      {/* ステータスサマリ */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => {
          const count = visits.filter((v) => v.status === s.id).length;
          return (
            <div key={s.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${s.color}`}>
              <span className="font-mono">{s.id}</span>
              <span>{s.label}</span>
              <span className="font-bold">{count}</span>
            </div>
          );
        })}
      </div>

      {/* 旅程一覧 */}
      <div className="space-y-3">
        {visits.length === 0 && <p className="text-sm text-muted p-4">一時帰国記録がありません</p>}
        {visits.map((visit) => {
          const st = STATUSES.find((s) => s.id === visit.status)!;
          const nextSt = NEXT_STATUS[visit.status] ? STATUSES.find((s) => s.id === NEXT_STATUS[visit.status]) : null;
          const isExpanded = expanded === visit.id;
          const doneCount = visit.checklist.filter((c) => c.done).length;
          return (
            <div key={visit.id} className="rounded-xl border border-border bg-surface/60 overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition" onClick={() => setExpanded(isExpanded ? null : visit.id)}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-white">{personMap[visit.personId] ?? visit.personId}</p>
                    <Badge className={`${st.color} text-[10px]`}>{st.label}</Badge>
                    <span className="text-xs text-muted">{visit.departureDate} → {visit.returnDate || "―"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">チェック: {doneCount}/{visit.checklist.length}</span>
                    {doneCount === visit.checklist.length && <span className="text-xs text-emerald-400">✓ 完了</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {nextSt && (
                    <button onClick={(e) => { e.stopPropagation(); advanceStatus(visit); }} className={`px-2 py-1 rounded text-[11px] border ${nextSt.color} hover:opacity-80 transition`}>
                      → {nextSt.label}
                    </button>
                  )}
                  {isExpanded ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
                </div>
              </div>
              {isExpanded && (
                <div className="border-t border-border p-4 grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    {[
                      { label: "航空券", value: visit.flightInfo },
                      { label: "国内移動", value: visit.busInfo },
                      { label: "パスポート期限", value: visit.passportExpiry },
                      { label: "メモ", value: visit.notes },
                    ].map(({ label, value }) => value ? (
                      <div key={label}><p className="text-[10px] text-muted uppercase">{label}</p><p className="text-sm text-white">{value}</p></div>
                    ) : null)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted mb-2">チェックリスト</p>
                    <div className="space-y-2">
                      {visit.checklist.map((c, i) => (
                        <button key={i} onClick={() => toggleChecklist(visit, i)} className="flex items-center gap-2 w-full text-left hover:opacity-80 transition">
                          {c.done ? <CheckSquare size={14} className="text-emerald-400 shrink-0" /> : <Square size={14} className="text-muted shrink-0" />}
                          <span className={`text-xs ${c.done ? "text-emerald-400 line-through" : "text-white"}`}>{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 追加モーダル */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">旅程を追加</h2>
              <button onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="text-sm text-muted">対象者</label>
                <select className={sel} value={form.personId} onChange={(e) => setForm((f) => ({ ...f, personId: e.target.value }))}>
                  <option value="">-- 選択 --</option>
                  {persons.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-sm text-muted">出発日</label><input type="date" className={inp} value={form.departureDate} onChange={(e) => setForm((f) => ({ ...f, departureDate: e.target.value }))} /></div>
                <div><label className="text-sm text-muted">帰国日</label><input type="date" className={inp} value={form.returnDate} onChange={(e) => setForm((f) => ({ ...f, returnDate: e.target.value }))} /></div>
              </div>
              <div><label className="text-sm text-muted">航空券情報</label><input className={inp} placeholder="例: KIX→HAN ANA6869 2026-03-10" value={form.flightInfo} onChange={(e) => setForm((f) => ({ ...f, flightInfo: e.target.value }))} /></div>
              <div><label className="text-sm text-muted">国内移動情報</label><input className={inp} placeholder="例: 丹波市 → 大阪（高速バス予約済み）" value={form.busInfo} onChange={(e) => setForm((f) => ({ ...f, busInfo: e.target.value }))} /></div>
              <div><label className="text-sm text-muted">パスポート有効期限</label><input type="date" className={inp} value={form.passportExpiry} onChange={(e) => setForm((f) => ({ ...f, passportExpiry: e.target.value }))} /></div>
              <div><label className="text-sm text-muted">メモ</label><textarea rows={2} className={inp + " resize-none"} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} /></div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted hover:text-white transition">キャンセル</button>
              <button onClick={addVisit} disabled={!form.personId || !form.departureDate} className="px-4 py-2 rounded-lg bg-brand-blue text-white text-sm hover:opacity-90 disabled:opacity-40 transition">追加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
