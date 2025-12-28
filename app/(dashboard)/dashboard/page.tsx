import Link from "next/link";
import { ReactNode } from "react";
import KpiCard from "@/components/ui/KpiCard";
import NeonCard from "@/components/ui/NeonCard";
import ProgressBar from "@/components/ui/ProgressBar";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { companies, documents, externalLinks, kpiCards, tasks } from "@/lib/mockData";
import { BellRing, ExternalLink, FileClock, FileOutput, Repeat } from "lucide-react";

export default function DashboardPage() {
  const reminders = tasks
    .filter((t) => t.status !== "done")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);
  const docStatus = documents
    .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
    .slice(0, 4);
  const highRisk = companies
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <SectionHeader title="TENKU ダッシュボード" description="主要指標とリスクをひと目で把握。期限接近や最新更新を集約。" />

      <div className="grid md:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="grid xl:grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-4">
          <NeonCard className="p-4 space-y-3">
            <SectionHeader title="期限が近い案件" description="直近で対応すべきタスク" />
            <div className="space-y-3">
              {reminders.map((item) => (
                <div key={item.id} className="flex items-start justify-between rounded-xl border border-slate-800/80 bg-slate-900/40 px-4 py-3">
                  <div>
                    <p className="text-white font-semibold">{item.title}</p>
                    <p className="text-xs text-slate-400">期限: {item.dueDate} / 関連: {item.relatedEntity}</p>
                  </div>
                  <StatusBadge status={item.severity}>{item.severity}</StatusBadge>
                </div>
              ))}
            </div>
          </NeonCard>

          <NeonCard className="p-4">
            <SectionHeader title="最近更新された書類" description="最新の進捗を確認" />
            <div className="space-y-3">
              {docStatus.map((doc) => (
                <div key={doc.id} className="rounded-xl border border-slate-800/80 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white">{doc.name}</p>
                      <p className="text-xs text-slate-400">最終更新: {doc.lastUpdated}</p>
                    </div>
                    <StatusBadge status={doc.status}>{doc.status}</StatusBadge>
                  </div>
                  <ProgressBar value={doc.completion} />
                </div>
              ))}
            </div>
          </NeonCard>
        </div>

        <div className="space-y-4">
          <NeonCard className="p-4">
            <SectionHeader title="リスクが高い拠点" description="監査・是正対応を優先" />
            <div className="space-y-2">
              {highRisk.map((company) => (
                <div key={company.id} className="rounded-lg border border-slate-800/70 bg-slate-900/50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{company.name}</p>
                      <p className="text-xs text-slate-400">{company.location}</p>
                    </div>
                    <StatusBadge status="high">Risk {company.riskScore}</StatusBadge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">次回監査: {company.nextAudit}</p>
                </div>
              ))}
            </div>
          </NeonCard>

          <NeonCard className="p-4">
            <SectionHeader title="ショートカット" />
            <div className="grid grid-cols-1 gap-3">
              <ActionCard title="前月請求を複製" description="下書きを一括生成" icon={<Repeat className="text-brand-blue" />} href="/billing" />
              <ActionCard title="書類をまとめて出力" description="ドラフトPDFを出力（モック）" icon={<FileOutput className="text-brand-blue" />} href="/documents/procedures" />
              <ActionCard title="監査タスクを確認" description="期限前のTODOをチェック" icon={<BellRing className="text-brand-blue" />} href="/documents/audit" />
              <ActionCard title="テンプレ差分を確認" description="書式変更のAI要約" icon={<FileClock className="text-brand-blue" />} href="/templates/monitor" />
            </div>
          </NeonCard>

          <NeonCard className="p-4">
            <SectionHeader title="外部リンク" description="関連機関やサポート" />
            <div className="space-y-2">
              {externalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-slate-800/70 hover:border-brand-blue/60"
                >
                  <span>{link.name}</span>
                  <ExternalLink size={14} />
                </Link>
              ))}
            </div>
          </NeonCard>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, description, icon, href }: { title: string; description: string; icon: ReactNode; href: string }) {
  return (
    <Link href={href} className="rounded-xl border border-brand-blue/40 bg-brand-blue/5 p-3 hover:bg-brand-blue/10 transition block">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-slate-900/70 border border-brand-blue/30">{icon}</div>
        <p className="text-white font-semibold">{title}</p>
      </div>
      <p className="text-xs text-slate-400">{description}</p>
    </Link>
  );
}
