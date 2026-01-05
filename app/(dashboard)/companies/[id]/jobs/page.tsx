"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function CompanyJobsPage({ params }: { params: { id: string } }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/v1/jobs")
      .then((r) => r.json())
      .then((res) => setJobs((res.data ?? []).filter((j: any) => j.companyId === params.id)));
  }, [params.id]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">求人管理</h1>
        <Link className="px-3 py-1 bg-blue-600 text-white rounded" href={`${pathname}/new`}>
          求人を追加
        </Link>
      </div>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-2 py-1 text-left">求人タイトル</th>
            <th className="border px-2 py-1">職種</th>
            <th className="border px-2 py-1">勤務地</th>
            <th className="border px-2 py-1">給与</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} className="hover:bg-gray-50">
              <td className="border px-2 py-1">{j.title}</td>
              <td className="border px-2 py-1 text-center">{j.occupation ?? "-"}</td>
              <td className="border px-2 py-1 text-center">{j.workLocation ?? "-"}</td>
              <td className="border px-2 py-1 text-center">{j.salary ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
