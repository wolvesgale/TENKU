"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCompanyPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", address: "" });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    await fetch("/api/v1/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/companies");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">企業登録</h1>
      <div className="space-y-2 max-w-lg">
        <label className="block">
          企業名
          <input className="w-full border px-2 py-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="block">
          所在地
          <input className="w-full border px-2 py-1" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </label>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit} disabled={saving}>
          {saving ? "保存中" : "保存"}
        </button>
      </div>
    </div>
  );
}
