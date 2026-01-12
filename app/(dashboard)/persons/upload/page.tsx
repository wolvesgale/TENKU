"use client";
import { useState } from "react";

export default function PersonUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const submit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/v1/upload-csv/persons", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResult(`${data.data?.length ?? 0} 件の外国人データを登録しました。`);
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">外国人CSVアップロード</h1>
      <p className="text-sm text-muted">サンプルCSVのヘッダ: 外国人ID,氏名,国籍,氏名（漢字）,氏名（カナ）,氏名（ローマ字）,性別,表示言語,在留カード番号,在留開始日,寮住所,来日日,配属日,雇用契約期間,実習実施者届出受理番号,担当者,次の手続き,メモ,制度</p>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit}>
        アップロード
      </button>
      {result ? <p className="text-sm text-green-300">{result}</p> : null}
    </div>
  );
}
