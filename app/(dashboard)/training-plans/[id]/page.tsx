"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TrainingPlanForm, TrainingPlanFormValues } from "@/components/training-plans/TrainingPlanForm";

const toDateInput = (value?: string) => (value ? value.slice(0, 10) : "");

export default function TrainingPlanDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [formValues, setFormValues] = useState<TrainingPlanFormValues | null>(null);
  const [persons, setPersons] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/training-plans/${params.id}`)
      .then((r) => r.json())
      .then((res) => {
        setItem(res.data);
        if (res.data) {
          setFormValues({
            planType: res.data.planType ?? "",
            personId: res.data.personId ?? "",
            companyId: res.data.companyId ?? "",
            plannedStart: toDateInput(res.data.plannedStart),
            plannedEnd: toDateInput(res.data.plannedEnd),
            status: res.data.status ?? "DRAFT",
            description: res.data.metadata?.description ?? "",
          });
        }
      });
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
  }, [params.id]);

  const save = async (values: TrainingPlanFormValues) => {
    if (!item) return;
    setIsSubmitting(true);
    try {
      await fetch(`/api/v1/training-plans/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: values.planType,
          personId: values.personId,
          companyId: values.companyId,
          plannedStart: values.plannedStart,
          plannedEnd: values.plannedEnd,
          status: values.status,
          metadata: { ...(item?.metadata ?? {}), description: values.description },
        }),
      });
      router.push("/training-plans");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectOptions = useMemo(
    () => ({
      personId: persons.map((p) => ({ value: p.id, label: p.fullName })),
      companyId: companies.map((c) => ({ value: c.id, label: c.name })),
    }),
    [persons, companies],
  );

  if (!formValues) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">実習計画詳細</h1>
      <TrainingPlanForm
        initialValues={formValues}
        onSubmit={save}
        isSubmitting={isSubmitting}
        selectOptions={selectOptions}
        onCancel={() => router.back()}
      />
    </div>
  );
}
