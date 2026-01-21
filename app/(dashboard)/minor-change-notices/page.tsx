"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Notice = { id: string; month: string; companyId: string; supervisorId: string };
type Company = { id: string; name: string };
type Organization = { id: string; displayName: string };
type Person = { id: string; fullName: string; foreignerId?: string; sendingOrgId?: string; supervisorId?: string; currentCompanyId?: string };
type MonitoringLog = {
  id: string;
  date: string;
  personId?: string;
  companyId?: string;
  supervisorId?: string;
  overtimeHours?: number;
  workingTimeSystem?: "NORMAL" | "ANNUAL_FLEX";
  changeMemo?: string;
};

const inputClassName = "w-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-white text-sm rounded";

export default function MinorChangeNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [supervisors, setSupervisors] = useState<Organization[]>([]);
  const [sendingOrgs, setSendingOrgs] = useState<Organization[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [logs, setLogs] = useState<MonitoringLog[]>([]);
  const [form, setForm] = useState({
    personId: "",
    companyId: "",
    supervisorId: "",
    sendingOrgId: "",
    logId: "",
    reason: "繁忙期の受注増加により残業が増加。",
  });
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/minor-change-notices").then((r) => r.json()).then((res) => setNotices(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
    fetch("/api/v1/supervisors").then((r) => r.json()).then((res) => setSupervisors(res.data ?? []));
    fetch("/api/v1/sending-orgs").then((r) => r.json()).then((res) => setSendingOrgs(res.data ?? []));
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/monitoring-logs").then((r) => r.json()).then((res) => setLogs(res.data ?? []));
  }, []);

  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? "-";
  const supervisorName = (id: string) => supervisors.find((s) => s.id === id)?.displayName ?? "-";
  const sendingOrgName = (id: string) => sendingOrgs.find((s) => s.id === id)?.displayName ?? "-";

  const selectedLog = useMemo(() => logs.find((l) => l.id === form.logId), [form.logId, logs]);
  const selectedPerson = useMemo(() => persons.find((p) => p.id === form.personId), [form.personId, persons]);
  const overtimeThreshold = selectedLog?.workingTimeSystem === "ANNUAL_FLEX" ? 42 : 45;
  const isOverThreshold = typeof selectedLog?.overtimeHours === "number" && selectedLog.overtimeHours >= overtimeThreshold;

  const applyLogSelection = (logId: string) => {
    const log = logs.find((l) => l.id === logId);
    if (!log) {
      setForm((prev) => ({ ...prev, logId }));
      return;
    }
    const person = persons.find((p) => p.id === log.personId);
    setForm((prev) => ({
      ...prev,
      logId,
      personId: log.personId ?? "",
      companyId: log.companyId ?? "",
      supervisorId: log.supervisorId ?? person?.supervisorId ?? "",
      sendingOrgId: person?.sendingOrgId ?? "",
    }));
  };

  const generatePdf = async () => {
    if (!form.personId || !form.companyId || !form.supervisorId) return;
    const person = persons.find((p) => p.id === form.personId);
    const log = logs.find((l) => l.id === form.logId);
    setErrorMessage(null);
    try {
      const createdRes = await fetch("/api/v1/minor-change-notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: log?.date ?? new Date().toISOString(),
          companyId: form.companyId,
          supervisorId: form.supervisorId,
          sendingOrgId: form.sendingOrgId,
          details: [
            {
              foreignerId: person?.foreignerId,
              personName: person?.fullName,
              overtimeHours: log?.overtimeHours,
              reason: form.reason,
              changeMemo: log?.changeMemo,
            },
          ],
        }),
      });
      if (!createdRes.ok) {
        const message = await createdRes.text();
        console.error("[minor-change-notice] Save failed", message);
        setErrorMessage("保存に失敗しました。");
        return;
      }
      const created = await createdRes.json();
      const pdfRes = await fetch(`/api/v1/minor-change-notices/${created.data.id}/pdf`);
      if (!pdfRes.ok) {
        const message = await pdfRes.text();
        console.error("[minor-change-notice] PDF failed", message);
        setErrorMessage("PDF生成に失敗しました。");
        return;
      }
      const contentType = pdfRes.headers.get("content-type") ?? "";
      if (contentType.includes("application/pdf")) {
        const blob = await pdfRes.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        const data = await pdfRes.json();
        console.error("[minor-change-notice] PDF unexpected response", data);
        setErrorMessage("PDF生成に失敗しました。");
        return;
      }
      fetch("/api/v1/minor-change-notices").then((r) => r.json()).then((res) => setNotices(res.data ?? []));
    } catch (error) {
      console.error("[minor-change-notice] Unexpected error", error);
      setErrorMessage("PDF生成に失敗しました。入力内容を確認してください。");
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">軽微変更届一覧</h1>
        <Link className="px-3 py-1 bg-blue-600 text-white rounded" href="/minor-change-notices/new">
          新規作成
        </Link>
      </div>
      <div className="border border-slate-800 rounded p-4 space-y-3 bg-slate-950/40">
        <h2 className="text-lg font-semibold">軽微変更届（残業超過）PDF生成</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-sm text-slate-200">
            外国人
            <select
              className={inputClassName}
              value={form.personId}
              onChange={(e) => setForm({ ...form, personId: e.target.value })}
            >
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
            <select
              className={inputClassName}
              value={form.companyId}
              onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            >
              <option value="">選択</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-200">
            監理団体/支援機関
            <select
              className={inputClassName}
              value={form.supervisorId}
              onChange={(e) => setForm({ ...form, supervisorId: e.target.value })}
            >
              <option value="">選択</option>
              {supervisors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-200">
            送り出し機関
            <select
              className={inputClassName}
              value={form.sendingOrgId}
              onChange={(e) => setForm({ ...form, sendingOrgId: e.target.value })}
            >
              <option value="">選択</option>
              {sendingOrgs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-200 md:col-span-2">
            巡回・監査ログ
            <select className={inputClassName} value={form.logId} onChange={(e) => applyLogSelection(e.target.value)}>
              <option value="">選択</option>
              {logs.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.date?.slice(0, 10)} / {companyName(l.companyId ?? "")} / {l.overtimeHours ?? "-"}h
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-200 md:col-span-3">
            超過理由
            <textarea className={`${inputClassName} min-h-[80px]`} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={generatePdf} disabled={!form.personId || !form.companyId || !form.supervisorId}>
            PDF生成
          </button>
          {!isOverThreshold && selectedLog ? (
            <span className="text-xs text-amber-200">残業超過（{overtimeThreshold}h）未満のため参考表示として生成されます。</span>
          ) : null}
          {pdfUrl ? (
            <a className="text-blue-400 text-sm" href={pdfUrl} target="_blank" rel="noreferrer">
              直近のPDFを開く
            </a>
          ) : null}
          {selectedPerson ? (
            <span className="text-xs text-muted">
              選択: {selectedPerson.fullName} / {companyName(form.companyId)} / {supervisorName(form.supervisorId)} / {sendingOrgName(form.sendingOrgId)}
            </span>
          ) : null}
          {errorMessage ? <span className="text-xs text-rose-300">{errorMessage}</span> : null}
        </div>
      </div>
      <table className="min-w-full border border-slate-800 text-sm">
        <thead>
          <tr className="bg-slate-900">
            <th className="border border-slate-800 px-2 py-1 text-left">対象月</th>
            <th className="border border-slate-800 px-2 py-1">受入企業</th>
            <th className="border border-slate-800 px-2 py-1">監理団体</th>
            <th className="border border-slate-800 px-2 py-1">詳細</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice) => (
            <tr key={notice.id}>
              <td className="border border-slate-800 px-2 py-1">{notice.month?.slice(0, 7)}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{companyName(notice.companyId)}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">{supervisorName(notice.supervisorId)}</td>
              <td className="border border-slate-800 px-2 py-1 text-center">
                <Link className="text-blue-400" href={`/minor-change-notices/${notice.id}`}>
                  詳細
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
