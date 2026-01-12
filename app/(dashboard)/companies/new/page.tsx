"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompanyForm, type CompanyFormData } from "@/components/companies/CompanyForm";

export default function NewCompanyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const submit = async (form: CompanyFormData) => {
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
      <CompanyForm onSubmit={submit} submitting={saving} />
    </div>
  );
}
