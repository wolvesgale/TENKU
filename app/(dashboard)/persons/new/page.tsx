"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPersonPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", nationality: "", currentProgram: "TITP" });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    await fetch("/api/v1/persons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/persons");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">外国人登録</h1>
      <div className="space-y-2 max-w-lg">
        <label className="block">
          氏名
          <input
            className="w-full border px-2 py-1"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </label>
        <label className="block">
          国籍
          <input className="w-full border px-2 py-1" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
        </label>
        <label className="block">
          制度
          <select
            className="w-full border px-2 py-1"
            value={form.currentProgram}
            onChange={(e) => setForm({ ...form, currentProgram: e.target.value })}
          >
            <option value="TITP">TITP</option>
            <option value="SSW">SSW</option>
            <option value="TA">TA</option>
          </select>
        </label>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit} disabled={saving}>
            {saving ? "保存中" : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}
