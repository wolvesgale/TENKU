"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PersonForm, type PersonFormData } from "@/components/persons/PersonForm";

export default function NewPersonPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const submit = async (form: PersonFormData) => {
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
      <PersonForm onSubmit={submit} submitting={saving} />
    </div>
  );
}
