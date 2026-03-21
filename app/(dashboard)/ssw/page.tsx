"use client";
import { useState, useEffect, useCallback } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// ─── 型定義 ────────────────────────────────────────────────────────────────────

type Person = {
  id: string;
  nameKanji?: string;
  nameRomaji?: string;
  nationality?: string;
  residenceCardExpiry?: string;
  currentCompanyId?: string;
  nextProcedure?: string;
  handlerName?: string;
};
type Company = { id: string; name: string };

type SswInterview = {
  id: string;
  personId: string;
  companyId?: string;
  interviewNo: number;
  scheduledDate: string;
  conductedDate?: string;
  status: "scheduled" | "completed" | "cancelled";
  conductorName?: string;
  location?: string;
  memo?: string;
};

type SswNotification = {
  id: string;
  personId: string;
  notifType: "regular" | "adhoc";
  category: string;
  dueDate: string;
  submittedDate?: string;
  status: "pending" | "submitted" | "overdue";
  memo?: string;
};

type SswSupportPlan = {
  id: string;
  personId: string;
  planType: "1" | "2";
  status: "draft" | "approved" | "in_progress" | "completed";
  startDate?: string;
  endDate?: string;
  isDelegated: boolean;
  memo?: string;
};

type SswApplication = {
  id: string;
  personId: string;
  companyId?: string;
  appType: "COE" | "COS" | "EXT";
  sector: string;
  employerType: "corporate" | "individual";
  nationality?: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  submittedAt?: string;
  targetDate?: string;
  notes?: string;
};

type SswRecord = {
  id: string;
  personId: string;
  recordDate: string;
  recordType: string;
  content: string;
  staffName?: string;
  memo?: string;
};

type SswJobChange = {
  id: string;
  personId: string;
  fromCompanyId: string;
  toCompanyId?: string;
  status: "planning" | "notified" | "completed" | "cancelled";
  changeDate?: string;
  reason?: string;
  notes?: string;
};

// ─── ユーティリティ ───────────────────────────────────────────────────────────

function fmt(iso?: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function daysUntil(iso?: string) {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ iso }: { iso?: string }) {
  const days = daysUntil(iso);
  if (days === null) return <span className="text-muted text-xs">-</span>;
  if (days < 0) return <Badge className="border-red-500 text-red-400 text-[10px]">期限切れ</Badge>;
  if (days <= 30) return <Badge className="border-red-500 text-red-400 text-[10px]">{days}日</Badge>;
  if (days <= 60) return <Badge className="border-brand-amber text-brand-amber text-[10px]">{days}日</Badge>;
  return <span className="text-xs text-gray-300">{fmt(iso)}</span>;
}

const INTERVIEW_STATUS_MAP: Record<SswInterview["status"], { label: string; color: string }> = {
  scheduled: { label: "予定", color: "border-brand-blue text-brand-blue" },
  completed: { label: "完了", color: "border-green-500 text-green-400" },
  cancelled: { label: "キャンセル", color: "border-gray-500 text-gray-400" },
};

const NOTIF_STATUS_MAP: Record<SswNotification["status"], { label: string; color: string }> = {
  pending: { label: "未提出", color: "border-brand-amber text-brand-amber" },
  submitted: { label: "提出済", color: "border-green-500 text-green-400" },
  overdue: { label: "期限超過", color: "border-red-500 text-red-400" },
};

const PLAN_STATUS_MAP: Record<SswSupportPlan["status"], { label: string; color: string }> = {
  draft: { label: "ドラフト", color: "border-gray-500 text-gray-400" },
  approved: { label: "承認済", color: "border-brand-blue text-brand-blue" },
  in_progress: { label: "進行中", color: "border-brand-amber text-brand-amber" },
  completed: { label: "完了", color: "border-green-500 text-green-400" },
};

const APP_STATUS_MAP: Record<SswApplication["status"], { label: string; color: string }> = {
  draft: { label: "下書き", color: "border-gray-500 text-gray-400" },
  submitted: { label: "提出済", color: "border-brand-blue text-brand-blue" },
  approved: { label: "許可", color: "border-green-500 text-green-400" },
  rejected: { label: "不許可", color: "border-red-500 text-red-400" },
};

const JOB_CHANGE_STATUS_MAP: Record<SswJobChange["status"], { label: string; color: string }> = {
  planning: { label: "計画中", color: "border-brand-amber text-brand-amber" },
  notified: { label: "届出済", color: "border-brand-blue text-brand-blue" },
  completed: { label: "完了", color: "border-green-500 text-green-400" },
  cancelled: { label: "取消", color: "border-gray-500 text-gray-400" },
};

const APP_TYPE_LABELS = { COE: "在留資格認定証明書（COE）", COS: "在留資格変更（COS）", EXT: "在留期間更新（EXT）" };
const SSW_SECTORS = ["介護", "ビルクリーニング", "素形材・産業機械・電気電子情報関連製造業", "建設", "造船・舶用工業", "自動車整備", "航空", "宿泊", "農業", "漁業", "飲食料品製造業", "外食業"];

// ─── 新規申請モーダル ─────────────────────────────────────────────────────────

function NewApplicationModal({ persons, companies, onSave, onClose }: {
  persons: Person[];
  companies: Company[];
  onSave: (data: Partial<SswApplication>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<SswApplication>>({
    appType: "EXT",
    sector: SSW_SECTORS[0],
    employerType: "corporate",
    status: "draft",
  });

  const set = (k: keyof SswApplication, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-lg space-y-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-base font-semibold text-white">入管申請　新規作成</h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted block mb-1">特定技能外国人</label>
            <select className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
              value={form.personId ?? ""}
              onChange={(e) => set("personId", e.target.value)}>
              <option value="">選択してください</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>{p.nameKanji ?? p.nameRomaji ?? p.id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">申請種別</label>
            <select className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
              value={form.appType ?? "EXT"}
              onChange={(e) => set("appType", e.target.value)}>
              <option value="COE">COE（在留資格認定証明書）</option>
              <option value="COS">COS（在留資格変更）</option>
              <option value="EXT">EXT（在留期間更新）</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">特定産業分野</label>
            <select className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
              value={form.sector ?? ""}
              onChange={(e) => set("sector", e.target.value)}>
              {SSW_SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">雇用主区分</label>
            <select className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
              value={form.employerType ?? "corporate"}
              onChange={(e) => set("employerType", e.target.value)}>
              <option value="corporate">法人</option>
              <option value="individual">個人事業主</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">国籍</label>
            <input className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
              value={form.nationality ?? ""}
              onChange={(e) => set("nationality", e.target.value)}
              placeholder="例：ベトナム" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">申請予定日</label>
            <input type="date" className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
              value={form.targetDate ? form.targetDate.slice(0, 10) : ""}
              onChange={(e) => set("targetDate", e.target.value)} />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted block mb-1">備考</label>
          <textarea className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white h-20 resize-none"
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)} />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1.5 rounded border border-border text-sm text-gray-300 hover:bg-white/5">
            キャンセル
          </button>
          <button
            onClick={() => { if (form.personId) { onSave(form); onClose(); } }}
            className="px-4 py-1.5 rounded bg-brand-blue text-white text-sm hover:opacity-90"
          >
            作成
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 新規面談モーダル ─────────────────────────────────────────────────────────

function NewInterviewModal({ persons, companies, onSave, onClose }: {
  persons: Person[];
  companies: Company[];
  onSave: (data: Partial<SswInterview>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<SswInterview>>({ interviewNo: 1, status: "scheduled" });
  const set = (k: keyof SswInterview, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-base font-semibold text-white">定期面談　新規登録</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted block mb-1">対象者</label>
            <select className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
              value={form.personId ?? ""}
              onChange={(e) => set("personId", e.target.value)}>
              <option value="">選択</option>
              {persons.map((p) => <option key={p.id} value={p.id}>{p.nameKanji ?? p.nameRomaji}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">回数</label>
            <input type="number" min={1} className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
              value={form.interviewNo ?? 1}
              onChange={(e) => set("interviewNo", parseInt(e.target.value))} />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">予定日</label>
            <input type="date" className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
              value={form.scheduledDate ? form.scheduledDate.slice(0, 10) : ""}
              onChange={(e) => set("scheduledDate", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">担当者</label>
            <input className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
              value={form.conductorName ?? ""}
              onChange={(e) => set("conductorName", e.target.value)}
              placeholder="担当者名" />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-muted block mb-1">場所</label>
            <input className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
              value={form.location ?? ""}
              onChange={(e) => set("location", e.target.value)}
              placeholder="会議室・オンライン等" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1.5 rounded border border-border text-sm text-gray-300 hover:bg-white/5">キャンセル</button>
          <button
            onClick={() => { if (form.personId && form.scheduledDate) { onSave(form); onClose(); } }}
            className="px-4 py-1.5 rounded bg-brand-blue text-white text-sm hover:opacity-90"
          >
            登録
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── メインページ ─────────────────────────────────────────────────────────────

const SSW_TABS = [
  { id: "workers", label: "外国人一覧" },
  { id: "interviews", label: "定期面談" },
  { id: "notifications", label: "届出管理" },
  { id: "support-plans", label: "支援計画" },
  { id: "applications", label: "入管申請" },
  { id: "records", label: "支援記録" },
  { id: "job-change", label: "国内転職" },
];

export default function SswPage() {
  const [tab, setTab] = useState("workers");
  const [persons, setPersons] = useState<Person[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [interviews, setInterviews] = useState<SswInterview[]>([]);
  const [notifications, setNotifications] = useState<SswNotification[]>([]);
  const [supportPlans, setSupportPlans] = useState<SswSupportPlan[]>([]);
  const [sswApps, setSswApps] = useState<SswApplication[]>([]);
  const [records, setRecords] = useState<SswRecord[]>([]);
  const [jobChanges, setJobChanges] = useState<SswJobChange[]>([]);
  const [showNewApp, setShowNewApp] = useState(false);
  const [showNewInterview, setShowNewInterview] = useState(false);

  const fetchAll = useCallback(() => {
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => {
      setPersons((res.data ?? []).filter((p: Person & { currentProgram?: string }) => p.currentProgram === "SSW"));
    });
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
    fetch("/api/v1/ssw/interviews").then((r) => r.json()).then((res) => setInterviews(res.data ?? []));
    fetch("/api/v1/ssw/notifications").then((r) => r.json()).then((res) => setNotifications(res.data ?? []));
    fetch("/api/v1/ssw/support-plans").then((r) => r.json()).then((res) => setSupportPlans(res.data ?? []));
    fetch("/api/v1/ssw/applications").then((r) => r.json()).then((res) => setSswApps(res.data ?? []));
    fetch("/api/v1/ssw/records").then((r) => r.json()).then((res) => setRecords(res.data ?? []));
    fetch("/api/v1/ssw/job-changes").then((r) => r.json()).then((res) => setJobChanges(res.data ?? []));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const personName = (id: string) => {
    const p = persons.find((p) => p.id === id);
    return p?.nameKanji ?? p?.nameRomaji ?? id;
  };
  const companyName = (id?: string) => companies.find((c) => c.id === id)?.name ?? "-";

  // KPI counts
  const pendingInterviews = interviews.filter((i) => i.status === "scheduled").length;
  const pendingNotifs = notifications.filter((n) => n.status === "pending").length;
  const overdueNotifs = notifications.filter((n) => n.status === "overdue").length;
  const draftApps = sswApps.filter((a) => a.status === "draft").length;

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">特定技能</h1>
          <p className="text-xs text-muted mt-0.5">特定技能外国人の管理・支援・届出・入管申請を一元管理</p>
        </div>
        <div className="flex items-center gap-2">
          {tab === "applications" && (
            <button onClick={() => setShowNewApp(true)} className="px-3 py-1.5 rounded bg-brand-blue text-white text-sm hover:opacity-90">
              ＋ 新規申請
            </button>
          )}
          {tab === "interviews" && (
            <button onClick={() => setShowNewInterview(true)} className="px-3 py-1.5 rounded bg-brand-blue text-white text-sm hover:opacity-90">
              ＋ 面談登録
            </button>
          )}
        </div>
      </div>

      {/* KPI サマリ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg border border-border bg-surface/60">
          <p className="text-xs text-muted">SSW在籍者</p>
          <p className="text-2xl font-bold text-white">{persons.length}</p>
          <p className="text-[10px] text-muted">人</p>
        </div>
        <div className="p-3 rounded-lg border border-border bg-surface/60">
          <p className="text-xs text-muted">面談予定</p>
          <p className={`text-2xl font-bold ${pendingInterviews > 0 ? "text-brand-amber" : "text-white"}`}>{pendingInterviews}</p>
          <p className="text-[10px] text-muted">件</p>
        </div>
        <div className="p-3 rounded-lg border border-border bg-surface/60">
          <p className="text-xs text-muted">届出未提出 / 超過</p>
          <p className={`text-2xl font-bold ${overdueNotifs > 0 ? "text-red-400" : pendingNotifs > 0 ? "text-brand-amber" : "text-white"}`}>
            {pendingNotifs} / {overdueNotifs}
          </p>
          <p className="text-[10px] text-muted">件</p>
        </div>
        <div className="p-3 rounded-lg border border-border bg-surface/60">
          <p className="text-xs text-muted">申請下書き</p>
          <p className={`text-2xl font-bold ${draftApps > 0 ? "text-brand-amber" : "text-white"}`}>{draftApps}</p>
          <p className="text-[10px] text-muted">件</p>
        </div>
      </div>

      {/* タブ */}
      <Tabs tabs={SSW_TABS} defaultTab="workers" onChange={setTab} />

      {/* ─── 外国人一覧 ─── */}
      {tab === "workers" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">特定技能外国人一覧</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface/80 border-b border-border">
                  <th className="px-3 py-2 text-left text-xs text-muted">氏名</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">国籍</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">所属機関</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">在留期限</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">担当者</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">次回手続</th>
                  <th className="px-3 py-2 text-xs text-muted">詳細</th>
                </tr>
              </thead>
              <tbody>
                {persons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-muted text-xs">データなし</td>
                  </tr>
                ) : (
                  persons.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-white/5">
                      <td className="px-3 py-2 text-white">{p.nameKanji ?? "-"}<br /><span className="text-[10px] text-muted">{p.nameRomaji}</span></td>
                      <td className="px-3 py-2 text-gray-300">{p.nationality ?? "-"}</td>
                      <td className="px-3 py-2 text-gray-300">{companyName(p.currentCompanyId)}</td>
                      <td className="px-3 py-2"><ExpiryBadge iso={p.residenceCardExpiry} /></td>
                      <td className="px-3 py-2 text-gray-300 text-xs">{p.handlerName ?? "-"}</td>
                      <td className="px-3 py-2 text-gray-300 text-xs">{p.nextProcedure ?? "-"}</td>
                      <td className="px-3 py-2 text-center">
                        <Link href={`/persons/${p.id}`} className="text-brand-blue text-xs hover:underline">詳細</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ─── 定期面談 ─── */}
      {tab === "interviews" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">定期面談記録（4ヶ月ごと）</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface/80 border-b border-border">
                  <th className="px-3 py-2 text-left text-xs text-muted">対象者</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">第N回</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">予定日</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">実施日</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">担当</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">場所</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">状態</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">メモ</th>
                </tr>
              </thead>
              <tbody>
                {interviews.length === 0 ? (
                  <tr><td colSpan={8} className="px-3 py-6 text-center text-muted text-xs">データなし</td></tr>
                ) : (
                  interviews.map((iv) => {
                    const st = INTERVIEW_STATUS_MAP[iv.status];
                    return (
                      <tr key={iv.id} className="border-b border-border/50 hover:bg-white/5">
                        <td className="px-3 py-2 text-white">{personName(iv.personId)}</td>
                        <td className="px-3 py-2 text-gray-300">第{iv.interviewNo}回</td>
                        <td className="px-3 py-2 text-gray-300">{fmt(iv.scheduledDate)}</td>
                        <td className="px-3 py-2 text-gray-300">{fmt(iv.conductedDate)}</td>
                        <td className="px-3 py-2 text-gray-300 text-xs">{iv.conductorName ?? "-"}</td>
                        <td className="px-3 py-2 text-gray-300 text-xs">{iv.location ?? "-"}</td>
                        <td className="px-3 py-2">
                          <Badge className={`${st.color} text-[10px]`}>{st.label}</Badge>
                        </td>
                        <td className="px-3 py-2 text-muted text-xs max-w-[200px] truncate">{iv.memo ?? "-"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ─── 届出管理 ─── */}
      {tab === "notifications" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Badge className="border-brand-blue text-brand-blue text-xs">定期届出</Badge>
            <Badge className="border-brand-amber text-brand-amber text-xs">随時届出</Badge>
            <p className="text-xs text-muted self-center">· 届出義務：受入れ・活動状況、受入れ困難、支援計画変更 など</p>
          </div>
          <Card>
            <CardContent className="p-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-surface/80 border-b border-border">
                    <th className="px-3 py-2 text-left text-xs text-muted">対象者</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">種別</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">届出内容</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">期限</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">提出日</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">状態</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">メモ</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.length === 0 ? (
                    <tr><td colSpan={7} className="px-3 py-6 text-center text-muted text-xs">データなし</td></tr>
                  ) : (
                    notifications.map((n) => {
                      const st = NOTIF_STATUS_MAP[n.status];
                      return (
                        <tr key={n.id} className="border-b border-border/50 hover:bg-white/5">
                          <td className="px-3 py-2 text-white">{personName(n.personId)}</td>
                          <td className="px-3 py-2">
                            <Badge className={n.notifType === "regular" ? "border-brand-blue text-brand-blue text-[10px]" : "border-brand-amber text-brand-amber text-[10px]"}>
                              {n.notifType === "regular" ? "定期" : "随時"}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-gray-300 text-xs">{n.category}</td>
                          <td className="px-3 py-2"><ExpiryBadge iso={n.dueDate} /></td>
                          <td className="px-3 py-2 text-gray-300 text-xs">{fmt(n.submittedDate)}</td>
                          <td className="px-3 py-2"><Badge className={`${st.color} text-[10px]`}>{st.label}</Badge></td>
                          <td className="px-3 py-2 text-muted text-xs max-w-[180px] truncate">{n.memo ?? "-"}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── 支援計画 ─── */}
      {tab === "support-plans" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">支援計画（1号・2号）</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface/80 border-b border-border">
                  <th className="px-3 py-2 text-left text-xs text-muted">対象者</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">号</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">状態</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">支援委託</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">開始日</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">終了日</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">メモ</th>
                </tr>
              </thead>
              <tbody>
                {supportPlans.length === 0 ? (
                  <tr><td colSpan={7} className="px-3 py-6 text-center text-muted text-xs">データなし</td></tr>
                ) : (
                  supportPlans.map((sp) => {
                    const st = PLAN_STATUS_MAP[sp.status];
                    return (
                      <tr key={sp.id} className="border-b border-border/50 hover:bg-white/5">
                        <td className="px-3 py-2 text-white">{personName(sp.personId)}</td>
                        <td className="px-3 py-2 text-gray-300">{sp.planType}号</td>
                        <td className="px-3 py-2"><Badge className={`${st.color} text-[10px]`}>{st.label}</Badge></td>
                        <td className="px-3 py-2">
                          {sp.isDelegated
                            ? <Badge className="border-brand-blue text-brand-blue text-[10px]">委託あり</Badge>
                            : <span className="text-xs text-muted">自社対応</span>}
                        </td>
                        <td className="px-3 py-2 text-gray-300 text-xs">{fmt(sp.startDate)}</td>
                        <td className="px-3 py-2"><ExpiryBadge iso={sp.endDate} /></td>
                        <td className="px-3 py-2 text-muted text-xs max-w-[200px] truncate">{sp.memo ?? "-"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ─── 入管申請 ─── */}
      {tab === "applications" && (
        <div className="space-y-3">
          {/* 申請種別ガイド */}
          <div className="grid grid-cols-3 gap-3">
            {(["COE", "COS", "EXT"] as const).map((type) => (
              <div key={type} className="p-3 rounded-lg border border-border bg-surface/60">
                <p className="text-xs font-semibold text-brand-blue">{type}</p>
                <p className="text-[11px] text-gray-300 mt-1">{APP_TYPE_LABELS[type]}</p>
                <p className="text-[10px] text-muted mt-1">
                  {type === "COE" && "海外から招聘する場合"}
                  {type === "COS" && "国内で在留資格を変更する場合"}
                  {type === "EXT" && "在留期間を更新する場合"}
                </p>
              </div>
            ))}
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-surface/80 border-b border-border">
                    <th className="px-3 py-2 text-left text-xs text-muted">対象者</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">申請種別</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">産業分野</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">雇用主</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">国籍</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">状態</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">申請予定</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">提出日</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">備考</th>
                  </tr>
                </thead>
                <tbody>
                  {sswApps.length === 0 ? (
                    <tr><td colSpan={9} className="px-3 py-6 text-center text-muted text-xs">データなし</td></tr>
                  ) : (
                    sswApps.map((app) => {
                      const st = APP_STATUS_MAP[app.status];
                      return (
                        <tr key={app.id} className="border-b border-border/50 hover:bg-white/5">
                          <td className="px-3 py-2 text-white">{personName(app.personId)}</td>
                          <td className="px-3 py-2">
                            <Badge className="border-brand-blue text-brand-blue text-[10px]">{app.appType}</Badge>
                          </td>
                          <td className="px-3 py-2 text-gray-300 text-xs">{app.sector}</td>
                          <td className="px-3 py-2 text-gray-300 text-xs">{app.employerType === "corporate" ? "法人" : "個人"}</td>
                          <td className="px-3 py-2 text-gray-300 text-xs">{app.nationality ?? "-"}</td>
                          <td className="px-3 py-2"><Badge className={`${st.color} text-[10px]`}>{st.label}</Badge></td>
                          <td className="px-3 py-2"><ExpiryBadge iso={app.targetDate} /></td>
                          <td className="px-3 py-2 text-gray-300 text-xs">{fmt(app.submittedAt)}</td>
                          <td className="px-3 py-2 text-muted text-xs max-w-[160px] truncate">{app.notes ?? "-"}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── 支援記録 ─── */}
      {tab === "records" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">支援記録</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface/80 border-b border-border">
                  <th className="px-3 py-2 text-left text-xs text-muted">対象者</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">日付</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">支援種別</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">内容</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">担当</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">メモ</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan={6} className="px-3 py-6 text-center text-muted text-xs">データなし</td></tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-white/5">
                      <td className="px-3 py-2 text-white">{personName(r.personId)}</td>
                      <td className="px-3 py-2 text-gray-300 text-xs">{fmt(r.recordDate)}</td>
                      <td className="px-3 py-2">
                        <Badge className="border-border text-gray-300 text-[10px]">{r.recordType}</Badge>
                      </td>
                      <td className="px-3 py-2 text-gray-300 text-xs max-w-[240px] truncate">{r.content}</td>
                      <td className="px-3 py-2 text-gray-300 text-xs">{r.staffName ?? "-"}</td>
                      <td className="px-3 py-2 text-muted text-xs max-w-[160px] truncate">{r.memo ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ─── 国内転職 ─── */}
      {tab === "job-change" && (
        <div className="space-y-3">
          <div className="p-3 rounded-lg border border-brand-amber/40 bg-brand-amber/5 text-xs text-gray-300">
            <p className="font-semibold text-brand-amber mb-1">国内転職フロー</p>
            <ol className="list-decimal list-inside space-y-0.5 text-muted">
              <li>転職先確定（雇用条件・特定産業分野の適合確認）</li>
              <li>現所属機関への離職届出（随時届出）</li>
              <li>在留資格変更申請（COS）または期間更新申請（EXT）</li>
              <li>新所属機関への受入届出（受入れ開始）</li>
              <li>支援計画更新・引継ぎ</li>
            </ol>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                転職処理一覧
                <button
                  onClick={() => {
                    fetch("/api/v1/ssw/job-changes").then((r) => r.json()).then((res) => setJobChanges(res.data ?? []));
                  }}
                  className="text-xs text-brand-blue hover:underline"
                >
                  更新
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-surface/80 border-b border-border">
                    <th className="px-3 py-2 text-left text-xs text-muted">対象者</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">前所属機関</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">転職先</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">状態</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">転職日</th>
                    <th className="px-3 py-2 text-left text-xs text-muted">理由</th>
                  </tr>
                </thead>
                <tbody>
                  {jobChanges.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-muted text-xs">
                        現在、転職処理中の特定技能外国人はいません
                      </td>
                    </tr>
                  ) : (
                    jobChanges.map((jc) => {
                      const st = JOB_CHANGE_STATUS_MAP[jc.status];
                      return (
                        <tr key={jc.id} className="border-b border-border/50 hover:bg-white/5">
                          <td className="px-3 py-2 text-white">{personName(jc.personId)}</td>
                          <td className="px-3 py-2 text-gray-300 text-xs">{companyName(jc.fromCompanyId)}</td>
                          <td className="px-3 py-2 text-gray-300 text-xs">{jc.toCompanyId ? companyName(jc.toCompanyId) : "未確定"}</td>
                          <td className="px-3 py-2"><Badge className={`${st.color} text-[10px]`}>{st.label}</Badge></td>
                          <td className="px-3 py-2 text-gray-300 text-xs">{fmt(jc.changeDate)}</td>
                          <td className="px-3 py-2 text-muted text-xs max-w-[160px] truncate">{jc.reason ?? "-"}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── モーダル ─── */}
      {showNewApp && (
        <NewApplicationModal
          persons={persons}
          companies={companies}
          onSave={(data) => {
            fetch("/api/v1/ssw/applications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }).then(() => fetchAll());
          }}
          onClose={() => setShowNewApp(false)}
        />
      )}
      {showNewInterview && (
        <NewInterviewModal
          persons={persons}
          companies={companies}
          onSave={(data) => {
            fetch("/api/v1/ssw/interviews", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }).then(() => fetchAll());
          }}
          onClose={() => setShowNewInterview(false)}
        />
      )}

      {/* UI呼称ルール */}
      <div className="p-3 rounded-lg border border-border bg-surface/60 text-xs text-muted">
        <p className="font-semibold text-white mb-1">UI呼称ルール（特定技能）</p>
        <p>Person → <span className="text-brand-blue">特定技能外国人</span>　/　Company → <span className="text-brand-blue">所属機関</span>　/　Organization → <span className="text-brand-blue">支援機関</span></p>
      </div>
    </div>
  );
}
