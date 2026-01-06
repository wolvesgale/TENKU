"use client";
import { useRouter } from "next/navigation";
import { JobForm, JobFormValues } from "@/components/jobs/JobForm";

export default function NewJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const initialValues: JobFormValues = {
    companyId: params.id,
    title: "",
    description: "",
    workLocation: "",
    salary: "",
    employmentType: "",
    occupation: "",
    requirements: "",
  };

  const submit = async (form: JobFormValues) => {
    await fetch("/api/v1/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push(`/companies/${params.id}/jobs`);
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">求人の追加</h1>
      <JobForm initialValues={initialValues} onSubmit={submit} />
    </div>
  );
}
