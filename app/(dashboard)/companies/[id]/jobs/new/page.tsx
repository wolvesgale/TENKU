"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState({
    companyId: params.id,
    title: "",
    description: "",
    workLocation: "",
    salary: "",
    employmentType: "full_time",
    occupation: "",
    requirements: "",
  });

  const submit = async () => {
    await fetch("/api/v1/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push(`/companies/${params.id}/jobs`);
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">求人の追加</h1>
      <div className="space-y-3">
        <label className="block text-sm">求人タイトル
          <input className="w-full border px-2 py-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="block text-sm">職種・仕事内容
          <textarea className="w-full border px-2 py-1" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <label className="block text-sm">勤務地
          <input className="w-full border px-2 py-1" value={form.workLocation} onChange={(e) => setForm({ ...form, workLocation: e.target.value })} />
        </label>
        <label className="block text-sm">給与
          <input className="w-full border px-2 py-1" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
        </label>
        <label className="block text-sm">雇用形態
          <input className="w-full border px-2 py-1" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} />
        </label>
        <label className="block text-sm">必要スキル/人数など (任意)
          <textarea className="w-full border px-2 py-1" rows={2} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
        </label>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit}>保存</button>
      </div>
    </div>
  );
}
