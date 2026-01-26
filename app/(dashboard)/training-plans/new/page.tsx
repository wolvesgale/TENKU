"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrainingPlanEditor, type TrainingPlanEditorValues } from "@/components/training-plans/TrainingPlanEditor";

const DEFAULT_FORM_VALUES: TrainingPlanEditorValues = {
  companyId: "",
  personId: "",
  category: "",
  jobCode: "",
  jobName: "",
  workName: "",
  freeEditOverrides: {},
};

export default function NewTrainingPlanPage() {
  const router = useRouter();
  const [persons, setPersons] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [organization, setOrganization] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
    fetch("/api/v1/organization").then((r) => r.json()).then((res) => setOrganization(res.data));
  }, []);

  const submit = async (values: TrainingPlanEditorValues) => {
    try {
      const res = await fetch("/api/v1/training-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: values.personId,
          companyId: values.companyId,
          planType: "otit_demo",
          status: "DRAFT",
          category: values.category,
          jobCode: values.jobCode,
          jobName: values.jobName,
          workName: values.workName,
          freeEditOverrides: values.freeEditOverrides,
        }),
      });
      const json = await res.json();
      if (json?.data?.id) {
        router.push(`/training-plans/${json.data.id}`);
      } else {
        router.push("/training-plans");
      }
    } finally {
    }
  };

  if (!organization) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">実習計画の作成</h1>
      <TrainingPlanEditor
        initialValues={DEFAULT_FORM_VALUES}
        onSubmit={submit}
        submitLabel="保存"
        companies={companies}
        persons={persons}
        organization={organization}
      />
    </div>
  );
}
