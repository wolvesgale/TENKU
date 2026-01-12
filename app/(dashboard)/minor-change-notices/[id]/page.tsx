"use client";
import { useEffect, useState } from "react";

type NoticeDetail = {
  id: string;
  month: string;
  companyId: string;
  supervisorId: string;
  sendingOrgId?: string;
  details: Array<{ foreignerId?: string; personName?: string; overtimeHours?: number; reason?: string; changeMemo?: string }>;
};
type Company = { id: string; name: string };
type Organization = { id: string; displayName: string };

const inputClassName = "w-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-white text-sm rounded";

export default function MinorChangeNoticeDetail({ params }: { params: { id: string } }) {
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [supervisors, setSupervisors] = useState<Organization[]>([]);
  const [sendingOrgs, setSendingOrgs] = useState<Organization[]>([]);

  useEffect(() => {
    fetch(`/api/v1/minor-change-notices`).then((r) => r.json()).then((res) => {
      const target = (res.data ?? []).find((n: NoticeDetail) => n.id === params.id);
      setNotice(target ?? null);
    });
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
    fetch("/api/v1/supervisors").then((r) => r.json()).then((res) => setSupervisors(res.data ?? []));
    fetch("/api/v1/sending-orgs").then((r) => r.json()).then((res) => setSendingOrgs(res.data ?? []));
  }, [params.id]);

  if (!notice) return <div className="p-4">Loading...</div>;

  const updateNotice = async (details: NoticeDetail["details"]) => {
    const res = await fetch("/api/v1/minor-change-notices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...notice, details }),
    });
    const data = await res.json();
    setNotice(data.data ?? notice);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">軽微変更届 詳細</h1>
        <a className="px-3 py-1 bg-blue-600 text-white rounded" href={`/api/v1/minor-change-notices/${notice.id}/pdf`} target="_blank" rel="noreferrer">
          PDF出力
        </a>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-sm text-slate-200">
          対象月
          <input className={inputClassName} value={notice.month?.slice(0, 7)} readOnly />
        </label>
        <label className="text-sm text-slate-200">
          受入企業
          <input className={inputClassName} value={companies.find((c) => c.id === notice.companyId)?.name ?? "-"} readOnly />
        </label>
        <label className="text-sm text-slate-200">
          監理団体
          <input className={inputClassName} value={supervisors.find((s) => s.id === notice.supervisorId)?.displayName ?? "-"} readOnly />
        </label>
        <label className="text-sm text-slate-200">
          送り出し機関
          <input className={inputClassName} value={sendingOrgs.find((s) => s.id === notice.sendingOrgId)?.displayName ?? "-"} readOnly />
        </label>
      </div>
      {notice.details[0]?.changeMemo ? (
        <div className="border border-slate-800 rounded p-3 bg-slate-950/40 text-sm">
          <p className="text-slate-200">変更内容: {notice.details[0].changeMemo}</p>
        </div>
      ) : null}
      <div className="space-y-2">
        {notice.details.map((detail, index) => (
          <div key={`${detail.foreignerId ?? index}`} className="grid gap-2 md:grid-cols-4 border border-slate-800 rounded p-3">
            <input className={inputClassName} value={detail.foreignerId ?? ""} readOnly />
            <input className={inputClassName} value={detail.personName ?? ""} readOnly />
            <input className={inputClassName} value={detail.overtimeHours ?? ""} readOnly />
            <input
              className={inputClassName}
              value={detail.reason ?? ""}
              placeholder="理由を入力"
              onChange={(e) => {
                const updated = [...notice.details];
                updated[index] = { ...updated[index], reason: e.target.value };
                setNotice({ ...notice, details: updated });
              }}
              onBlur={() => updateNotice(notice.details)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
