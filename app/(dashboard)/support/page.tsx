"use client";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/ui/print-button";
import { Plus, X, CheckCircle2, Clock, FileText, CalendarDays } from "lucide-react";

type SupportPlan = {
  id: string; personId: string; planType: "1" | "2"; status: string;
  startDate: string; endDate?: string; content?: string; createdAt: string;
};
type Interview = {
  id: string; personId: string; interviewDate: string; interviewType: string;
  status: string; notes?: string; nextDate?: string; createdAt: string;
};

const PLAN_STATUSES: Record<string, { label: string; color: string }> = {
  draft:       { label: "草稿",   color: "border-muted text-muted" },
  approved:    { label: "承認済", color: "border-brand-blue text-brand-blue" },
  in_progress: { label: "実施中", color: "border-brand-teal text-brand-teal" },
  completed:   { label: "完了",   color: "border-emerald-400 text-emerald-300" },
};
const INT_STATUSES: Record<string, { label: string; color: string }> = {
  scheduled:  { label: "予定",   color: "border-brand-amber text-brand-amber" },
  completed:  { label: "実施済", color: "border-emerald-400 text-emerald-300" },
  cancelled:  { label: "キャンセル", color: "border-rose-400 text-rose-300" },
};

export default function SupportPage() {
  const [tab, setTab] = useState<"plans" | "interviews">("plans");
  const [plans, setPlans] = useState<SupportPlan[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [persons, setPersons] = useState<{ id: string; name: string }[]>([]);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [showAddInt, setShowAddInt] = useState(false);
  const [planForm, setPlanForm] = useState({ personId: "", planType: "1" as "1" | "2", startDate: "", content: "" });
  const [intForm, setIntForm] = useState({ personId: "", interviewDate: "", interviewType: "定期面談", notes: "", nextDate: "" });

  const load = useCallback(() => {
    fetch("/api/v1/ssw/support-plans").then((r) => r.json()).then((res) => setPlans(res.data ?? []));
    fetch("/api/v1/ssw/interviews").then((r) => r.json()).then((res) => setInterviews(res.data ?? []));
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => {
      setPersons((res.data ?? []).map((p: any) => ({ id: p.id, name: p.nameKanji || p.nameRomaji || p.fullName || p.id })));
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const addPlan = async () => {
    if (!planForm.personId) return;
    await fetch("/api/v1/ssw/support-plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...planForm, status: "draft" }) });
    setShowAddPlan(false); setPlanForm({ personId: "", planType: "1", startDate: "", content: "" }); load();
  };
  const addInt = async () => {
    if (!intForm.personId) return;
    await fetch("/api/v1/ssw/interviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...intForm, status: "scheduled" }) });
    setShowAddInt(false); setIntForm({ personId: "", interviewDate: "", interviewType: "定期面談", notes: "", nextDate: "" }); load();
  };

  const personName = (id: string) => persons.find((p) => p.id === id)?.name ?? id;

  const inp = "w-full mt-1 px-3 py-2 rounded-lg border border-border bg-surface/60 text-sm";
  const sel = inp;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold">支援計画・面談・記録</h1>
          <p className="text-sm text-muted">特定技能外国人への支援計画と面談記録を一元管理します</p>
        </div>
        <PrintButton />
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: FileText, label: "支援計画（実施中）", value: plans.filter((p) => p.status === "in_progress").length, color: "text-brand-teal" },
          { icon: CheckCircle2, label: "支援計画（完了）", value: plans.filter((p) => p.status === "completed").length, color: "text-emerald-400" },
          { icon: CalendarDays, label: "面談（予定）", value: interviews.filter((i) => i.status === "scheduled").length, color: "text-brand-amber" },
          { icon: Clock, label: "面談（今月実施）", value: interviews.filter((i) => i.status === "completed" && i.interviewDate?.startsWith(new Date().toISOString().slice(0, 7))).length, color: "text-brand-blue" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-surface/60 p-4 space-y-1">
            <card.icon size={18} className={card.color} />
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      {/* タブ */}
      <div className="flex gap-2 border-b border-border pb-0">
        {(["plans", "interviews"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition -mb-px ${tab === t ? "border-brand-blue text-white" : "border-transparent text-muted hover:text-white"}`}>
            {t === "plans" ? `支援計画 (${plans.length})` : `面談記録 (${interviews.length})`}
          </button>
        ))}
      </div>

      {/* 支援計画タブ */}
      {tab === "plans" && (
        <div className="space-y-3">
          <div className="flex justify-end print:hidden">
            <button onClick={() => setShowAddPlan(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue text-white text-sm hover:opacity-90 transition">
              <Plus size={14} /> 支援計画を追加
            </button>
          </div>
          {plans.length === 0 && <p className="text-sm text-muted p-4">支援計画がありません</p>}
          <div className="space-y-2">
            {plans.map((plan) => {
              const st = PLAN_STATUSES[plan.status] ?? { label: plan.status, color: "border-muted text-muted" };
              return (
                <div key={plan.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface/60 gap-4 flex-wrap">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{personName(plan.personId)}</p>
                      <Badge className="border-brand-teal text-brand-teal text-[10px]">{plan.planType}号支援計画</Badge>
                    </div>
                    <p className="text-xs text-muted">開始: {plan.startDate || "―"}{plan.endDate ? `　終了: ${plan.endDate}` : ""}</p>
                    {plan.content && <p className="text-xs text-muted">{plan.content}</p>}
                  </div>
                  <Badge className={`${st.color} text-xs`}>{st.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 面談記録タブ */}
      {tab === "interviews" && (
        <div className="space-y-3">
          <div className="flex justify-end print:hidden">
            <button onClick={() => setShowAddInt(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue text-white text-sm hover:opacity-90 transition">
              <Plus size={14} /> 面談を登録
            </button>
          </div>
          {interviews.length === 0 && <p className="text-sm text-muted p-4">面談記録がありません</p>}
          <div className="space-y-2">
            {interviews.map((iv) => {
              const st = INT_STATUSES[iv.status] ?? { label: iv.status, color: "border-muted text-muted" };
              return (
                <div key={iv.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface/60 gap-4 flex-wrap">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{personName(iv.personId)}</p>
                      <span className="text-xs text-muted">{iv.interviewType}</span>
                    </div>
                    <p className="text-xs text-muted">実施日: {iv.interviewDate}</p>
                    {iv.notes && <p className="text-xs text-muted">{iv.notes}</p>}
                    {iv.nextDate && <p className="text-xs text-brand-amber">次回: {iv.nextDate}</p>}
                  </div>
                  <Badge className={`${st.color} text-xs`}>{st.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 支援計画追加モーダル */}
      {showAddPlan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">支援計画を追加</h2>
              <button onClick={() => setShowAddPlan(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="text-sm text-muted">対象者</label>
                <select className={sel} value={planForm.personId} onChange={(e) => setPlanForm((f) => ({ ...f, personId: e.target.value }))}>
                  <option value="">-- 選択 --</option>
                  {persons.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div><label className="text-sm text-muted">計画種別</label>
                <select className={sel} value={planForm.planType} onChange={(e) => setPlanForm((f) => ({ ...f, planType: e.target.value as any }))}>
                  <option value="1">1号支援計画</option>
                  <option value="2">2号支援計画</option>
                </select>
              </div>
              <div><label className="text-sm text-muted">開始日</label>
                <input type="date" className={inp} value={planForm.startDate} onChange={(e) => setPlanForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div><label className="text-sm text-muted">内容・メモ</label>
                <textarea rows={3} className={inp + " resize-none"} value={planForm.content} onChange={(e) => setPlanForm((f) => ({ ...f, content: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAddPlan(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted hover:text-white transition">キャンセル</button>
              <button onClick={addPlan} disabled={!planForm.personId} className="px-4 py-2 rounded-lg bg-brand-blue text-white text-sm hover:opacity-90 disabled:opacity-40 transition">追加</button>
            </div>
          </div>
        </div>
      )}

      {/* 面談追加モーダル */}
      {showAddInt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">面談を登録</h2>
              <button onClick={() => setShowAddInt(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="text-sm text-muted">対象者</label>
                <select className={sel} value={intForm.personId} onChange={(e) => setIntForm((f) => ({ ...f, personId: e.target.value }))}>
                  <option value="">-- 選択 --</option>
                  {persons.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div><label className="text-sm text-muted">面談種別</label>
                <select className={sel} value={intForm.interviewType} onChange={(e) => setIntForm((f) => ({ ...f, interviewType: e.target.value }))}>
                  {["定期面談", "随時面談", "相談記録", "巡回記録"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="text-sm text-muted">実施日</label>
                <input type="date" className={inp} value={intForm.interviewDate} onChange={(e) => setIntForm((f) => ({ ...f, interviewDate: e.target.value }))} />
              </div>
              <div><label className="text-sm text-muted">次回予定日</label>
                <input type="date" className={inp} value={intForm.nextDate} onChange={(e) => setIntForm((f) => ({ ...f, nextDate: e.target.value }))} />
              </div>
              <div><label className="text-sm text-muted">内容・メモ</label>
                <textarea rows={3} className={inp + " resize-none"} value={intForm.notes} onChange={(e) => setIntForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAddInt(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted hover:text-white transition">キャンセル</button>
              <button onClick={addInt} disabled={!intForm.personId} className="px-4 py-2 rounded-lg bg-brand-blue text-white text-sm hover:opacity-90 disabled:opacity-40 transition">登録</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
