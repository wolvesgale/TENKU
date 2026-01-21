"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type OptionPerson = { id: string; fullName: string; foreignerId?: string; currentCompanyId?: string };
type OptionCompany = { id: string; name: string };
type OptionSupervisor = { id: string; displayName: string };
type OptionLog = { id: string; date: string; personId?: string; companyId?: string; supervisorId?: string; overtimeHours?: number; memo?: string };

type DetailRow = {
  personId: string;
  foreignerId?: string;
  personName?: string;
  overtimeHours?: number;
  reason: string;
};

const inputClassName = "w-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-white text-sm rounded";

export default function MinorChangeNoticeNewPage() {
  const router = useRouter();
  const [options, setOptions] = useState<{
    persons: OptionPerson[];
    companies: OptionCompany[];
    supervisors: OptionSupervisor[];
    monitoringLogs: OptionLog[];
  }>({ persons: [], companies: [], supervisors: [], monitoringLogs: [] });
  const [month, setMonth] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [supervisorId, setSupervisorId] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [details, setDetails] = useState<DetailRow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    fetch(`/api/v1/minor-change-notices/options?${params.toString()}`)
      .then((r) => r.json())
      .then((res) => setOptions(res));
  }, [month]);

  const logsForMonth = useMemo(() => {
    if (!month) return options.monitoringLogs;
    return options.monitoringLogs.filter((log) => log.date?.slice(0, 7) === month);
  }, [month, options.monitoringLogs]);

  const addPersonDetail = (personId: string) => {
    if (!personId) return;
    const person = options.persons.find((p) => p.id === personId);
    if (!person) return;
    const latestLog = logsForMonth
      .filter((log) => log.personId === person.id)
      .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""))
      .at(-1);
    setDetails((prev) => [
      ...prev,
      {
        personId: person.id,
        foreignerId: person.foreignerId,
        personName: person.fullName,
        overtimeHours: latestLog?.overtimeHours,
        reason: latestLog?.memo ?? "",
      },
    ]);
    if (!companyId && person.currentCompanyId) setCompanyId(person.currentCompanyId);
  };

  const updateDetail = (index: number, patch: Partial<DetailRow>) => {
    setDetails((prev) => prev.map((row, idx) => (idx === index ? { ...row, ...patch } : row)));
  };

  const parseError = async (res: Response) => {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return res.json();
    }
    const text = await res.text();
    return { message: text || "リクエストに失敗しました。" };
  };

  const saveAndGenerate = async () => {
    if (!month || !companyId || !supervisorId || details.length === 0) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/v1/minor-change-notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: `${month}-01`,
          companyId,
          supervisorId,
          details: details.map((detail) => ({
            foreignerId: detail.foreignerId,
            personName: detail.personName,
            overtimeHours: detail.overtimeHours,
            reason: detail.reason,
          })),
        }),
      });
      if (!res.ok) {
        const data = await parseError(res);
        console.error("[minor-change-notice] Save failed", data);
        setErrorMessage(`保存に失敗しました。${data.message ?? ""}`.trim());
        return;
      }
      const data = await res.json();
      if (!data?.data?.id) {
        setErrorMessage("保存に失敗しました。");
        return;
      }
      const pdfRes = await fetch(`/api/v1/minor-change-notices/${data.data.id}/pdf`);
      if (!pdfRes.ok) {
        const data = await parseError(pdfRes);
        console.error("[minor-change-notice] PDF failed", data);
        setErrorMessage(`PDF生成に失敗しました。${data.message ?? ""}`.trim());
        return;
      }
      const contentType = pdfRes.headers.get("content-type") ?? "";
      if (contentType.includes("application/pdf")) {
        const blob = await pdfRes.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        window.URL.revokeObjectURL(url);
      } else {
        const data = await pdfRes.json();
        console.error("[minor-change-notice] PDF unexpected response", data);
        setErrorMessage("PDF生成に失敗しました。");
        return;
      }
      router.push("/minor-change-notices");
    } catch (error) {
      console.error("[minor-change-notice] Unexpected error", error);
      setErrorMessage("PDF生成に失敗しました。入力内容を確認してください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">軽微変更届 新規作成</h1>
        <button className="px-3 py-1 bg-slate-700 text-white rounded" onClick={() => router.push("/minor-change-notices")}>
          一覧へ戻る
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-sm text-slate-200">
          対象月
          <input type="month" className={inputClassName} value={month} onChange={(e) => setMonth(e.target.value)} />
        </label>
        <label className="text-sm text-slate-200">
          受入企業
          <select className={inputClassName} value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
            <option value="">選択</option>
            {options.companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-200">
          監理団体/支援機関
          <select className={inputClassName} value={supervisorId} onChange={(e) => setSupervisorId(e.target.value)}>
            <option value="">選択</option>
            {options.supervisors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.displayName}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-sm text-slate-200">
          対象外国人
          <select
            className={inputClassName}
            value={selectedPersonId}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedPersonId(value);
              addPersonDetail(value);
            }}
          >
            <option value="">選択</option>
            {options.persons.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="space-y-2">
        {details.map((detail, index) => (
          <div key={`${detail.personId}-${index}`} className="grid gap-2 md:grid-cols-4 border border-slate-800 rounded p-3">
            <input className={inputClassName} value={detail.foreignerId ?? ""} readOnly />
            <input className={inputClassName} value={detail.personName ?? ""} readOnly />
            <input
              className={inputClassName}
              value={detail.overtimeHours ?? ""}
              onChange={(e) => updateDetail(index, { overtimeHours: Number(e.target.value) })}
              placeholder="残業時間"
            />
            <input className={inputClassName} value={detail.reason} onChange={(e) => updateDetail(index, { reason: e.target.value })} placeholder="理由" />
          </div>
        ))}
      </div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        onClick={saveAndGenerate}
        disabled={submitting || !month || !companyId || !supervisorId || details.length === 0}
      >
        {submitting ? "保存中..." : "保存してPDF生成"}
      </button>
      {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
    </div>
  );
}
