import NeonCard from "@/components/ui/NeonCard";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { ganttSchedule } from "@/lib/mockData";

const palette = {
  high: "bg-rose-400/70",
  medium: "bg-amber-400/70",
  low: "bg-emerald-400/70",
};

export default function SchedulePage() {
  return (
    <div className="space-y-4">
      <SectionHeader title="スケジュール" description="ガントチャート風表示" />
      <NeonCard className="p-4 space-y-3">
        <div className="grid grid-cols-[140px_1fr] gap-2 text-sm text-slate-300">
          <div className="text-xs text-slate-500">タスク</div>
          <div className="text-xs text-slate-500">期限帯 (疑似タイムライン)</div>
        </div>
        {ganttSchedule.map((item) => (
          <div key={item.id} className="grid grid-cols-[140px_1fr] gap-2 items-center text-sm">
            <div className="flex items-center justify-between pr-2">
              <span className="text-white">{item.title}</span>
              <StatusBadge status={item.severity}>{item.end}</StatusBadge>
            </div>
            <div className="h-3 rounded-full bg-slate-900/70 border border-slate-800/80 relative overflow-hidden">
              <div className={`${palette[item.severity as keyof typeof palette] || palette.medium} absolute left-0 top-0 h-full w-1/3 blur-sm`} />
              <div className={`${palette[item.severity as keyof typeof palette] || palette.medium} absolute left-0 top-0 h-full w-1/3 opacity-80`} />
            </div>
          </div>
        ))}
      </NeonCard>
    </div>
  );
}
