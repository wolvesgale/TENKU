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
  jobCode2: "",
  jobName2: "",
  workName2: "",
  trainingStartDate: "",
  trainingEndDate: "",
  trainingDurationYears: "",
  trainingDurationMonths: "",
  trainingDurationDays: "",
  trainingHoursTotal: "",
  trainingHoursLecture: "",
  trainingHoursPractice: "",
  prevCertNumber: "",
  entryTrainingRequired: "",
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
          jobCode2: res.data.jobCode2 ?? "",
          jobName2: res.data.jobName2 ?? "",
          workName2: res.data.workName2 ?? "",
          trainingStartDate: res.data.trainingStartDate ?? "",
          trainingEndDate: res.data.trainingEndDate ?? "",
          trainingDurationYears: res.data.trainingDurationYears ?? "",
          trainingDurationMonths: res.data.trainingDurationMonths ?? "",
          trainingDurationDays: res.data.trainingDurationDays ?? "",
          trainingHoursTotal: res.data.trainingHoursTotal ?? "",
          trainingHoursLecture: res.data.trainingHoursLecture ?? "",
          trainingHoursPractice: res.data.trainingHoursPractice ?? "",
          prevCertNumber: res.data.prevCertNumber ?? "",
          entryTrainingRequired: res.data.entryTrainingRequired ?? "",
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
        jobCode2: values.jobCode2,
        jobName2: values.jobName2,
        workName2: values.workName2,
        trainingStartDate: values.trainingStartDate,
        trainingEndDate: values.trainingEndDate,
        trainingDurationYears: values.trainingDurationYears,
        trainingDurationMonths: values.trainingDurationMonths,
        trainingDurationDays: values.trainingDurationDays,
        trainingHoursTotal: values.trainingHoursTotal,
        trainingHoursLecture: values.trainingHoursLecture,
        trainingHoursPractice: values.trainingHoursPractice,
        prevCertNumber: values.prevCertNumber,
        entryTrainingRequired: values.entryTrainingRequired,
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
