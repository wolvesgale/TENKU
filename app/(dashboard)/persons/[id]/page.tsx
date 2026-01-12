"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PersonDetail({ params }: { params: { id: string } }) {
  const [person, setPerson] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [sendingOrgs, setSendingOrgs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/v1/persons/${params.id}`).then((r) => r.json()).then((res) => setPerson(res.data));
    fetch(`/api/v1/persons/${params.id}/status-history`).then((r) => r.json()).then((res) => setHistory(res.data ?? []));
    fetch(`/api/v1/cases?person_id=${params.id}`)
      .then((r) => r.json())
      .then((res) => setCases((res.data ?? []).filter((c: any) => c.personId === params.id)));
    fetch(`/api/v1/companies`).then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
    fetch(`/api/v1/supervisors`).then((r) => r.json()).then((res) => setSupervisors(res.data ?? []));
    fetch(`/api/v1/sending-orgs`).then((r) => r.json()).then((res) => setSendingOrgs(res.data ?? []));
  }, [params.id]);

  if (!person) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{person.fullName}</h1>
          <p className="text-sm text-muted">制度: {person.currentProgram}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={async () => {
              const res = await fetch(`/api/v1/persons/${params.id}/pdf`);
              const data = await res.json();
              if (data.url) setPdfUrl(data.url);
            }}
          >
            PDF出力
          </button>
          {pdfUrl ? (
            <a className="text-blue-400 underline" href={pdfUrl} target="_blank" rel="noreferrer">
              PDFを開く
            </a>
          ) : null}
          <Link className="text-blue-400" href="/persons">
            一覧へ戻る
          </Link>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-slate-800 p-3 rounded bg-slate-950/40">
          <h2 className="font-semibold mb-2">基本情報</h2>
          <p>外国人ID: {person.foreignerId ?? "-"}</p>
          <p>氏名（漢字）: {person.nameKanji ?? "-"}</p>
          <p>氏名（カナ）: {person.nameKana ?? "-"}</p>
          <p>性別: {person.gender ?? "-"}</p>
          <p>国籍: {person.nationality ?? "-"}</p>
          <p>表示言語: {person.displayLanguage ?? "-"}</p>
          <p>配属企業: {companies.find((c: any) => c.id === person.currentCompanyId)?.name ?? "-"}</p>
          <p>監理団体: {supervisors.find((o: any) => o.id === person.supervisorId)?.displayName ?? "-"}</p>
          <p>送り出し機関: {sendingOrgs.find((o: any) => o.id === person.sendingOrgId)?.displayName ?? "-"}</p>
          <p>職種/分野: {person.occupationField ?? "-"}</p>
        </div>
        <div className="border border-slate-800 p-3 rounded bg-slate-950/40">
          <h2 className="font-semibold mb-2">在留・契約情報</h2>
          <p>在留カード番号: {person.residenceCardNumber ?? "-"}</p>
          <p>在留開始日: {person.residenceStart?.slice(0, 10) ?? "-"}</p>
          <p>在留期限: {person.residenceCardExpiry?.slice(0, 10) ?? "-"}</p>
          <p>パスポート期限: {person.passportExpiry?.slice(0, 10) ?? "-"}</p>
          <p>雇用契約期間: {person.employmentContractPeriod ?? "-"}</p>
          <p>寮住所: {person.dormAddress ?? "-"}</p>
        </div>
        <div className="border border-slate-800 p-3 rounded bg-slate-950/40">
          <h2 className="font-semibold mb-2">ステータス履歴</h2>
          <ul className="space-y-1">
            {history.map((h) => (
              <li key={h.id} className="text-sm">
                {h.program} / {h.residenceStatus ?? "-"} ({h.startDate?.slice(0, 10)} - {h.endDate?.slice(0, 10) ?? "継続"})
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-slate-800 p-3 rounded bg-slate-950/40">
          <h2 className="font-semibold mb-2">資格・届出</h2>
          <p>認定番号1: {person.certNumber1 ?? "-"}</p>
          <p>認定日1: {person.certDate1?.slice(0, 10) ?? "-"}</p>
          <p>認定番号2: {person.certNumber2 ?? "-"}</p>
          <p>認定日2: {person.certDate2?.slice(0, 10) ?? "-"}</p>
          <p>認定番号3: {person.certNumber3 ?? "-"}</p>
          <p>認定日3: {person.certDate3?.slice(0, 10) ?? "-"}</p>
          <p>変更認定番号: {person.changeCertNumber ?? "-"}</p>
          <p>変更認定日: {person.changeCertDate?.slice(0, 10) ?? "-"}</p>
          <p>実習実施者届出受理番号: {person.traineeNoticeNumber ?? "-"}</p>
          <p>実習実施者届出受理日: {person.traineeNoticeDate?.slice(0, 10) ?? "-"}</p>
          <p>担当者: {person.handlerName ?? "-"}</p>
          <p>次の手続き: {person.nextProcedure ?? "-"}</p>
          <p>メモ: {person.notes ?? "-"}</p>
        </div>
      </div>
      <div className="border border-slate-800 p-3 rounded bg-slate-950/40">
        <h2 className="font-semibold mb-2">案件</h2>
        <ul className="space-y-1 text-sm">
          {cases.map((c) => (
            <li key={c.id}>
              <Link className="text-blue-600" href={`/cases/${c.id}`}>
                {c.caseType} / 期限 {c.dueDate?.slice(0, 10) ?? "-"}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
