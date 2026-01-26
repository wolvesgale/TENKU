"use client";

import { useEffect, useState } from "react";
import { OrganizationForm, type OrganizationFormData } from "@/components/organization/OrganizationForm";

export default function OrganizationPage() {
  const [data, setData] = useState<OrganizationFormData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/v1/organization")
      .then((r) => r.json())
      .then((res) => setData(res.data));
  }, []);

  const submit = async (form: OrganizationFormData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/v1/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      setData(json.data);
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold">監理団体情報</h1>
        <p className="text-sm text-muted">テンプレPDFに反映する監理団体の情報を編集します。</p>
      </div>
      <OrganizationForm initialData={data} onSubmit={submit} submitting={saving} />
    </div>
  );
}
