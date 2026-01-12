"use client";
import { useEffect, useState } from "react";

type Person = { id: string; fullName: string };
type Company = { id: string; name: string };
type Organization = { id: string; displayName: string };
type MonitoringLog = {
  id: string;
  date: string;
  personId?: string;
  companyId?: string;
  supervisorId?: string;
  logType: string;
  overtimeHours?: number;
  memo?: string;
};

const inputClassName = "w-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-white text-sm rounded";

export default function MonitoringLogsPage() {
  const [logs, setLogs] = useState<MonitoringLog[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [supervisors, setSupervisors] = useState<Organization[]>([]);
  const [form, setForm] = useState({
    date: "",
    personId: "",
    companyId: "",
    supervisorId: "",
    logType: "巡回",
    overtimeHours: "",
    memo: "",
  });
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const load = () => {
    fetch("/api/v1/monitoring-logs").then((r) => r.json()).then((res) => setLogs(res.data ?? []));
  };

  useEffect(() => {
    load();
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
    fetch("/api/v1/supervisors").then((r) => r.json()).then((res) => setSupervisors(res.data ?? []));
  }, []);

  const submit = async () => {
    const overtime = form.overtimeHours ? Number(form.overtimeHours) : undefined;
    await fetch("/api/v1/monitoring-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        overtimeHours: overtime,
      }),
    });
    const threshold = form.memo.includes("変形") ? 42 : 45;
    if (overtime && overtime >= threshold) {
      setNoticeMessage("軽微変更届を作成しました。内容をご確認ください。");
    } else {
      setNoticeMessage(null);
    }
    setForm({ date: "", personId: "", companyId: "", supervisorId: "", logType: "巡回", overtimeHours: "", memo: "" });
    load();
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">巡回・監査ログ</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-sm text-slate-200">
          日付
          <input type="date" className={inputClassName} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </label>
        <label className="text-sm text-slate-200">
          対象者
          <select className={inputClassName} value={form.personId} onChange={(e) => setForm({ ...form, personId: e.target.value })}>
            <option value="">選択</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-200">
          受入企業
          <select className={inputClassName} value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
            <option value="">選択</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-200">
          監理団体
          <select className={inputClassName} value={form.supervisorId} onChange={(e) => setForm({ ...form, supervisorId: e.target.value })}>
            <option value="">選択</option>
            {supervisors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.displayName}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-200">
          種別
          <select className={inputClassName} value={form.logType} onChange={(e) => setForm({ ...form, logType: e.target.value })}>
            <option value="巡回">巡回</option>
            <option value="監査">監査</option>
          </select>
        </label>
        <label className="text-sm text-slate-200">
          残業時間（月間）
          <input
            className={inputClassName}
            value={form.overtimeHours}
            onChange={(e) => setForm({ ...form, overtimeHours: e.target.value })}
            placeholder="例: 45"
          />
        </label>
      </div>
      <label className="text-sm text-slate-200 block">
        メモ（変形労働制の場合は「変形」と記載）
        <textarea className={`${inputClassName} min-h-[80px]`} value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} />
      </label>
      <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit}>
        登録
      </button>
      {noticeMessage ? <div className="p-3 rounded bg-amber-500/10 border border-amber-400 text-amber-100">{noticeMessage}</div> : null}
      <table className="min-w-full border border-slate-800 text-sm">
        <thead>
          <tr className="bg-slate-900">
            <th className="border border-slate-800 px-2 py-1 text-left">日付</th>
            <th className="border border-slate-800 px-2 py-1">種別</th>
            <th className="border border-slate-800 px-2 py-1">残業時間</th>
            <th className="border border-slate-800 px-2 py-1">PDF</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="border border-slate-800 px-2 py-1">{log.date?.slice(0, 10)}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{log.logType}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{log.overtimeHours ?? "-"}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">
                <a className="text-blue-400" href={`/api/v1/monitoring-logs/${log.id}/pdf`} target="_blank" rel="noreferrer">
                  PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
