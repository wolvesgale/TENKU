"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrainingPlanEditor, type TrainingPlanEditorValues } from "@/components/training-plans/TrainingPlanEditor";

const emptyValues: TrainingPlanEditorValues = {
  companyId: "",
  personId: "",
  category: "",
  jobCode: "",
  jobName: "",
  workName: "",
  freeEditOverrides: {},
};

export default function TrainingPlanDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<TrainingPlanEditorValues | null>(null);
  const [persons, setPersons] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [organization, setOrganization] = useState<any | null>(null);

  useEffect(() => {
    fetch(`/api/v1/training-plans/${params.id}`)
      .then((r) => r.json())
      .then((res) => {
        if (!res.data) {
          setFormValues(emptyValues);
          return;
        }
        setFormValues({
          companyId: res.data.companyId ?? "",
          personId: res.data.personId ?? "",
          category: res.data.category ?? "",
          jobCode: res.data.jobCode ?? "",
          jobName: res.data.jobName ?? "",
          workName: res.data.workName ?? "",
          freeEditOverrides: res.data.freeEditOverrides ?? {},
        });
      });
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
    fetch("/api/v1/organization").then((r) => r.json()).then((res) => setOrganization(res.data));
  }, [params.id]);

  const save = async (values: TrainingPlanEditorValues) => {
    await fetch(`/api/v1/training-plans/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId: values.companyId,
        personId: values.personId,
        category: values.category,
        jobCode: values.jobCode,
        jobName: values.jobName,
        workName: values.workName,
        freeEditOverrides: values.freeEditOverrides,
      }),
    });
    setFormValues(values);
  };

  if (!formValues || !organization) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">実習計画の編集</h1>
        <button
          className="px-3 py-1 rounded bg-slate-800 text-white"
          onClick={() => window.open(`/api/v1/training-plans/${params.id}/pdf`, "_blank")}
        >
          PDF出力
        </button>
      </div>
      <TrainingPlanEditor
        initialValues={formValues}
        onSubmit={save}
        onCancel={() => router.back()}
        companies={companies}
        persons={persons}
        organization={organization}
      />
    </div>
  );
}
