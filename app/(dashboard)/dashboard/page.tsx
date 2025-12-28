import Link from "next/link";
import { ReactNode } from "react";
import KpiCard from "@/components/ui/KpiCard";
import NeonCard from "@/components/ui/NeonCard";
import ProgressBar from "@/components/ui/ProgressBar";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { documents, externalLinks, kpiCards, tasks } from "@/lib/mockData";
import { BellRing, ExternalLink, FileOutput, Repeat } from "lucide-react";

export default function DashboardPage() {
  const reminders = tasks.filter((t) => t.status !== "done").slice(0, 4);
  const docStatus = documents.slice(0, 4);

  return (
    <div className="space-y-6">
      <SectionHeader title="ダッシュボード" description="KIZUNA相当の主要機能をTENKUでスナップショット" />

      <div className="grid md:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <NeonCard className="p-4 space-y-3 xl:col-span-2">
          <SectionHeader title="リマインダー" description="期限が近い作業をピックアップ" />
          <div className="space-y-3">
            {reminders.map((item) => (
              <div key={item.id} className="flex items-start justify-between rounded-lg border border-slate-800/80 bg-slate-900/40 px-4 py-3">
                <div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-xs text-slate-400">期限: {item.dueDate} / 関連: {item.relatedEntity}</p>
                </div>
                <StatusBadge status={item.severity}>{item.severity}</StatusBadge>
              </div>
            ))}
          </div>
        </NeonCard>

        <div className="space-y-4">
          <NeonCard className="p-4">
            <SectionHeader title="お知らせ" description="監理組織内のお知らせ" />
            <p className="text-sm text-slate-400">現在お知らせはありません。AIが重要タスクのみハイライトします。</p>
          </NeonCard>
          <NeonCard className="p-4">
            <SectionHeader title="外部リンク" description="OTIT / JITCO / サポート" />
            <div className="space-y-2">
              {externalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-slate-800/70 hover:border-neon-cyan/60"
                >
                  <span>{link.name}</span>
                  <ExternalLink size={14} />
                </Link>
              ))}
            </div>
          </NeonCard>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <NeonCard className="p-4">
          <SectionHeader title="書類ステータス" description="計画・手続・監査の進捗" />
          <div className="space-y-3">
            {docStatus.map((doc) => (
              <div key={doc.id} className="rounded-lg border border-slate-800/70 p-3">
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

        <NeonCard className="p-4">
          <SectionHeader title="操作ショートカット" />
          <div className="grid grid-cols-2 gap-3">
            <ActionCard title="前月複製" description="請求ドラフトを即作成" icon={<Repeat className="text-neon-cyan" />} href="/billing" />
            <ActionCard title="書類出力" description="モックPDF出力" icon={<FileOutput className="text-neon-cyan" />} href="/documents/procedures" />
            <ActionCard title="監査タスク" description="期限前のTODOを確認" icon={<BellRing className="text-neon-cyan" />} href="/documents/audit" />
            <ActionCard title="CSVエクスポート" description="連携データを吐き出し" icon={<ExternalLink className="text-neon-cyan" />} href="/csv" />
          </div>
        </NeonCard>
      </div>
    </div>
  );
}

function ActionCard({ title, description, icon, href }: { title: string; description: string; icon: ReactNode; href: string }) {
  return (
    <Link href={href} className="rounded-xl border border-neon-cyan/40 bg-neon-cyan/5 p-3 hover:bg-neon-cyan/10 transition block">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-slate-900/70 border border-neon-cyan/30">{icon}</div>
        <p className="text-white font-semibold">{title}</p>
      </div>
      <p className="text-xs text-slate-400">{description}</p>
    </Link>
  );
}
