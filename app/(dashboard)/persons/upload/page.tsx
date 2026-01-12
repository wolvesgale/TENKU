"use client";
import { useState } from "react";

export default function PersonUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ createdCount: number; failedCount: number; failures: string[] } | null>(null);

  const submit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/v1/upload-csv/persons", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResult({
      createdCount: data.createdCount ?? 0,
      failedCount: data.failedCount ?? 0,
      failures: data.failures ?? [],
    });
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">外国人CSVアップロード</h1>
      <p className="text-sm text-muted">
        サンプルCSVのヘッダ: program,full_name,nationality,residence_expiry,passport_expiry,company_name,supervisor_name,sending_org_name
      </p>
      <a className="text-sm text-blue-400 underline" href="/sample/masterdata_import_sample.csv" download>
        サンプルCSVをダウンロード
      </a>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit}>
        アップロード
      </button>
      {result ? (
        <div className="space-y-2 text-sm">
          <p className="text-green-300">成功: {result.createdCount} 件 / 失敗: {result.failedCount} 件</p>
          {result.failures.length > 0 ? (
            <ul className="text-amber-200 list-disc list-inside">
              {result.failures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
