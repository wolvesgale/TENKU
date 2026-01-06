"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TrainingPlanForm, TrainingPlanFormValues } from "@/components/training-plans/TrainingPlanForm";

const DEFAULT_FORM_VALUES: TrainingPlanFormValues = {
  planType: "skill_practice_plan",
  personId: "",
  companyId: "",
  plannedStart: "",
  plannedEnd: "",
  status: "DRAFT",
  description: "",
};

export default function NewTrainingPlanPage() {
  const router = useRouter();
  const [persons, setPersons] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues] = useState<TrainingPlanFormValues>(DEFAULT_FORM_VALUES);

  useEffect(() => {
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
  }, []);

  const submit = async (values: TrainingPlanFormValues) => {
    setIsSubmitting(true);
    try {
      await fetch("/api/v1/training-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: values.planType,
          personId: values.personId,
          companyId: values.companyId,
          plannedStart: values.plannedStart,
          plannedEnd: values.plannedEnd,
          status: values.status,
          metadata: { description: values.description },
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

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">実習計画の作成</h1>
      <TrainingPlanForm
        initialValues={initialValues}
        onSubmit={submit}
        isSubmitting={isSubmitting}
        selectOptions={selectOptions}
      />
    </div>
  );
}
