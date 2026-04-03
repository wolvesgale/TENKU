"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type Person = {
  id: string;
  nameRomaji?: string;
  nameRoma?: string;
  nameKanji?: string;
  nationality?: string;
  birthdate?: string;
  currentProgram?: string;
  currentCompanyId?: string;
  residenceCardExpiry?: string;
  handlerName?: string;
  nextProcedure?: string;
};

type Company = { id: string; name: string };

function daysUntil(iso?: string) {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ iso }: { iso?: string }) {
  const d = daysUntil(iso);
  if (d === null) return <span className="text-xs text-muted">-</span>;
  const dateStr = iso ? new Date(iso).toLocaleDateString("ja-JP") : "-";
  if (d < 0)  return <Badge className="border-red-500 text-red-400 text-[10px]">期限切れ</Badge>;
  if (d <= 30) return <Badge className="border-red-500 text-red-400 text-[10px]">{dateStr}（残{d}日）</Badge>;
  if (d <= 60) return <Badge className="border-brand-amber text-brand-amber text-[10px]">{dateStr}（残{d}日）</Badge>;
  return <span className="text-xs text-gray-300">{dateStr}</span>;
}

const TABS = [
  { id: "TITP",   label: "実習生（技能実習）" },
  { id: "SSW",    label: "特定技能" },
  { id: "IKUSEI", label: "育成就労" },
  { id: "ALL",    label: "全員" },
];

const PROGRAM_LABEL: Record<string, string> = {
  TITP: "技能実習",
  SSW: "特定技能",
  TA: "特定活動",
  IKUSEI: "育成就労",
};

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tab, setTab] = useState("TITP");

  useEffect(() => {
    fetch("/api/v1/persons").then((r) => r.json()).then((res) => setPersons(res.data ?? []));
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
  }, []);

  const companyName = (id?: string) => companies.find((c) => c.id === id)?.name ?? "-";

  const filtered = tab === "ALL"
    ? persons
    : persons.filter((p) => p.currentProgram === tab);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">外国人（統合）</h1>
          <p className="text-xs text-muted mt-0.5">技能実習 / 特定技能 / 育成就労 の在籍者を一元管理</p>
        </div>
        <Link className="px-3 py-1.5 rounded bg-brand-blue text-white text-sm hover:opacity-90" href="/persons/new">
          ＋ 新規登録
        </Link>
      </div>

      {/* サマリ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: "TITP",   label: "技能実習",   color: "text-brand-blue" },
          { key: "SSW",    label: "特定技能",   color: "text-brand-teal" },
          { key: "IKUSEI", label: "育成就労",   color: "text-green-400" },
          { key: "ALL",    label: "在籍合計",   color: "text-white" },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`p-3 rounded-lg border text-left transition ${tab === key ? "border-brand-blue bg-surface" : "border-border bg-surface/60 hover:bg-white/5"}`}
          >
            <p className="text-xs text-muted">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>
              {key === "ALL" ? persons.length : persons.filter((p) => p.currentProgram === key).length}
            </p>
            <p className="text-[10px] text-muted">人</p>
          </button>
        ))}
      </div>

      <Tabs tabs={TABS} defaultTab="TITP" onChange={setTab} />

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-surface/80 border-b border-border">
              <th className="px-3 py-2 text-left text-xs text-muted">氏名</th>
              <th className="px-3 py-2 text-left text-xs text-muted">国籍</th>
              <th className="px-3 py-2 text-left text-xs text-muted">制度</th>
              <th className="px-3 py-2 text-left text-xs text-muted">所属先</th>
              <th className="px-3 py-2 text-left text-xs text-muted">生年月日</th>
              <th className="px-3 py-2 text-left text-xs text-muted">在留期限</th>
              <th className="px-3 py-2 text-left text-xs text-muted">担当</th>
              <th className="px-3 py-2 text-left text-xs text-muted">次回手続</th>
              <th className="px-3 py-2 text-xs text-muted">詳細</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-muted text-xs">
                  {tab === "IKUSEI" ? "育成就労の在籍者はまだ登録されていません" : "データなし"}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-white/5">
                  <td className="px-3 py-2">
                    <p className="text-white">{p.nameKanji ?? "-"}</p>
                    <p className="text-[10px] text-muted">{p.nameRomaji}</p>
                  </td>
                  <td className="px-3 py-2 text-gray-300 text-xs">{p.nationality ?? "-"}</td>
                  <td className="px-3 py-2">
                    <Badge className="border-border text-gray-300 text-[10px]">
                      {PROGRAM_LABEL[p.currentProgram ?? ""] ?? p.currentProgram ?? "-"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-gray-300 text-xs">{companyName(p.currentCompanyId)}</td>
                  <td className="px-3 py-2 text-gray-300 text-xs">{p.birthdate ?? "-"}</td>
                  <td className="px-3 py-2"><ExpiryBadge iso={p.residenceCardExpiry} /></td>
                  <td className="px-3 py-2 text-gray-300 text-xs">{p.handlerName ?? "-"}</td>
                  <td className="px-3 py-2 text-gray-300 text-xs max-w-[160px] truncate">{p.nextProcedure ?? "-"}</td>
                  <td className="px-3 py-2 text-center">
                    <Link className="text-brand-blue text-xs hover:underline" href={`/persons/${p.id}`}>詳細</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
