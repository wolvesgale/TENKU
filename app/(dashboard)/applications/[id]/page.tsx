"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApplicationForm, ApplicationFormValues } from "@/components/applications/ApplicationForm";
import { APPLICATION_TYPES, STATUS_OPTIONS } from "@/lib/applications/options";

type Person = { id: string; fullName: string };
type Company = { id: string; name: string };

export default function ApplicationDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<ApplicationFormValues | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [applicationRes, personRes, companyRes] = await Promise.all([
        fetch(`/api/v1/applications/${params.id}`),
        fetch("/api/v1/persons"),
        fetch("/api/v1/companies"),
      ]);
      const application = await applicationRes.json();
      const personsData = await personRes.json();
      const companiesData = await companyRes.json();

      const item = application.data;
      setInitialValues({
        applicationType: item.applicationType,
        personId: item.personId ?? "",
        companyId: item.companyId ?? "",
        status: item.status,
        submittedAt: item.submittedAt?.slice?.(0, 10) ?? "",
        dueDate: item.metadata?.dueDate?.slice?.(0, 10) ?? "",
        memo: item.metadata?.memo ?? "",
      });
      setPersons(personsData.data ?? []);
      setCompanies(companiesData.data ?? []);
    };

    fetchData();
  }, [params.id]);

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

    await fetch(`/api/v1/applications/${params.id}`, {
      method: "PATCH",
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

  if (!initialValues) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">申請詳細</h1>
      <ApplicationForm initialValues={initialValues} selectOptions={selectOptions} onSubmit={handleSubmit} />
      <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => router.back()}>戻る</button>
    </div>
  );
}
