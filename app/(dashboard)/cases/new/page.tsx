"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCasePage() {
  const router = useRouter();
  const [persons, setPersons] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [form, setForm] = useState({ program: "TITP", caseType: "titp_plan_application", status: "OPEN", personId: "", companyId: "", dueDate: "" });

  useEffect(() => {
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
  }, []);

  const submit = async () => {
    await fetch("/api/v1/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/cases");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">案件作成</h1>
      <div className="space-y-2 max-w-xl">
        <label className="block">
          制度
          <select className="w-full border px-2 py-1" value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })}>
            <option value="TITP">TITP</option>
            <option value="SSW">SSW</option>
            <option value="TA">TA</option>
          </select>
        </label>
        <label className="block">
          case_type
          <input className="w-full border px-2 py-1" value={form.caseType} onChange={(e) => setForm({ ...form, caseType: e.target.value })} />
        </label>
        <label className="block">
          担当者(Person)
          <select className="w-full border px-2 py-1" value={form.personId} onChange={(e) => setForm({ ...form, personId: e.target.value })}>
            <option value="">選択してください</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          企業
          <select className="w-full border px-2 py-1" value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
            <option value="">選択してください</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          期限
          <input className="w-full border px-2 py-1" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </label>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit}>
          作成
        </button>
      </div>
    </div>
  );
}
