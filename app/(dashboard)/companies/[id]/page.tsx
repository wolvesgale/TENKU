"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CompanyForm, type CompanyFormData } from "@/components/companies/CompanyForm";

export default function CompanyDetail({ params }: { params: { id: string } }) {
  const [company, setCompany] = useState<CompanyFormData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/companies/${params.id}`)
      .then((r) => r.json())
      .then((res) => setCompany(res.data));
  }, [params.id]);

  const submit = async (form: CompanyFormData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/companies/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      setCompany(json.data);
    } finally {
      setSaving(false);
    }
  };

  if (!company) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{company.name}</h1>
          <p className="text-sm text-gray-600">{company.address ?? "-"}</p>
        </div>
        <Link className="text-blue-600" href="/companies">
          一覧へ戻る
        </Link>
      </div>
      <CompanyForm initialData={company} onSubmit={submit} submitting={saving} />
    </div>
  );
}
