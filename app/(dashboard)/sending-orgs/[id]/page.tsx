"use client";
import { useEffect, useState } from "react";

type Organization = {
  id: string;
  displayName: string;
  country?: string;
  address?: string;
  contactName?: string;
  contactTel?: string;
  contactEmail?: string;
  notes?: string;
};

const inputClassName = "w-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-white text-sm rounded";

export default function SendingOrgDetailPage({ params }: { params: { id: string } }) {
  const [org, setOrg] = useState<Organization | null>(null);

  useEffect(() => {
    fetch("/api/v1/sending-orgs").then((r) => r.json()).then((res) => {
      const found = (res.data ?? []).find((o: Organization) => o.id === params.id);
      setOrg(found ?? null);
    });
  }, [params.id]);

  if (!org) return <div className="p-4">Loading...</div>;

  const save = async () => {
    const res = await fetch("/api/v1/sending-orgs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(org),
    });
    const data = await res.json();
    setOrg(data.data ?? org);
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">送り出し機関 詳細</h1>
      <label className="text-sm text-slate-200 block">
        機関名
        <input className={inputClassName} value={org.displayName} onChange={(e) => setOrg({ ...org, displayName: e.target.value })} />
      </label>
      <label className="text-sm text-slate-200 block">
        国
        <input className={inputClassName} value={org.country ?? ""} onChange={(e) => setOrg({ ...org, country: e.target.value })} />
      </label>
      <label className="text-sm text-slate-200 block">
        所在地
        <input className={inputClassName} value={org.address ?? ""} onChange={(e) => setOrg({ ...org, address: e.target.value })} />
      </label>
      <label className="text-sm text-slate-200 block">
        担当者
        <input className={inputClassName} value={org.contactName ?? ""} onChange={(e) => setOrg({ ...org, contactName: e.target.value })} />
      </label>
      <label className="text-sm text-slate-200 block">
        連絡先
        <input className={inputClassName} value={org.contactTel ?? ""} onChange={(e) => setOrg({ ...org, contactTel: e.target.value })} />
      </label>
      <label className="text-sm text-slate-200 block">
        メール
        <input className={inputClassName} value={org.contactEmail ?? ""} onChange={(e) => setOrg({ ...org, contactEmail: e.target.value })} />
      </label>
      <label className="text-sm text-slate-200 block">
        備考
        <textarea className={`${inputClassName} min-h-[80px]`} value={org.notes ?? ""} onChange={(e) => setOrg({ ...org, notes: e.target.value })} />
      </label>
      <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={save}>
        保存
      </button>
    </div>
  );
}
