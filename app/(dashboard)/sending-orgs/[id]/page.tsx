"use client";
import { useEffect, useState } from "react";

type Organization = { id: string; displayName: string };

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
      <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={save}>
        保存
      </button>
    </div>
  );
}
