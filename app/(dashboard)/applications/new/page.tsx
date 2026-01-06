"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApplicationForm, ApplicationFormValues } from "@/components/applications/ApplicationForm";
import { APPLICATION_TYPES, STATUS_OPTIONS } from "@/lib/applications/options";

type Person = { id: string; fullName: string };
type Company = { id: string; name: string };

const initialFormValues: ApplicationFormValues = {
  applicationType: APPLICATION_TYPES[0].value,
  personId: "",
  companyId: "",
  status: STATUS_OPTIONS[0].value,
  submittedAt: "",
  dueDate: "",
  memo: "",
};

export default function NewApplicationPage() {
  const router = useRouter();
  const [persons, setPersons] = useState<Person[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
  }, []);

  const selectOptions = useMemo(
    () => ({
      applicationType: APPLICATION_TYPES,
      personId: persons.map((p) => ({ value: p.id, label: p.fullName })),
      companyId: companies.map((c) => ({ value: c.id, label: c.name })),
      status: STATUS_OPTIONS,
    }),
    [persons, companies],
  );

  const handleSubmit = async (values: ApplicationFormValues) => {
    const metadata = {
      memo: values.memo || undefined,
      dueDate: values.dueDate,
    };

    await fetch("/api/v1/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationType: values.applicationType,
        personId: values.personId,
        companyId: values.companyId,
        status: values.status,
        submittedAt: values.submittedAt || undefined,
        metadata,
      }),
    });

    router.push("/applications");
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">申請の作成</h1>
      <ApplicationForm initialValues={initialFormValues} selectOptions={selectOptions} onSubmit={handleSubmit} />
    </div>
  );
}
