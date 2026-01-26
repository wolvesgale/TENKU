"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PersonForm, type PersonFormData } from "@/components/persons/PersonForm";

export default function PersonDetail({ params }: { params: { id: string } }) {
  const [person, setPerson] = useState<PersonFormData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/persons/${params.id}`)
      .then((r) => r.json())
      .then((res) => setPerson(res.data));
  }, [params.id]);

  const submit = async (form: PersonFormData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/persons/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      setPerson(json.data);
    } finally {
      setSaving(false);
    }
  };

  if (!person) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{person.nameKanji || person.nameRomaji}</h1>
        </div>
        <Link className="text-blue-400" href="/persons">
          一覧へ戻る
        </Link>
      </div>
      <PersonForm initialData={person} onSubmit={submit} submitting={saving} />
    </div>
  );
}
