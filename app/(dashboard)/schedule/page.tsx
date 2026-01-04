import NeonCard from "@/components/ui/NeonCard";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { ganttSchedule } from "@/lib/mockData";

const palette = {
  high: "from-rose-400/70 to-rose-500/40",
  medium: "from-brand-amber/70 to-brand-amber/30",
  low: "from-brand-teal/70 to-brand-blue/40",
};

export default function SchedulePage() {
  return (
    <div className="space-y-4">
      <SectionHeader title="スケジュール" description="タイムラインビューで期限を俯瞰" />
      <NeonCard className="p-4 space-y-3">
        <div className="grid grid-cols-[200px_1fr_100px] gap-3 text-xs text-slate-400 border-b border-slate-800/80 pb-2">
          <span>タスク</span>
          <span>タイムライン</span>
          <span className="text-right">期限</span>
        </div>
        {ganttSchedule.map((item) => (
          <div key={item.id} className="grid grid-cols-[200px_1fr_100px] gap-3 items-center text-sm py-2 rounded-lg hover:bg-slate-900/60 transition">
            <div className="flex flex-col">
              <span className="text-white font-semibold">{item.title}</span>
              <span className="text-[11px] text-slate-500">レーン {item.lane}</span>
            </div>
            <div className="h-4 rounded-full bg-slate-900/80 border border-slate-800/80 relative overflow-hidden">
              <div className={`absolute left-0 top-0 h-full w-2/5 bg-gradient-to-r ${palette[item.severity as keyof typeof palette] || palette.medium}`}></div>
            </div>
            <div className="flex justify-end">
              <StatusBadge status={item.severity}>{item.end}</StatusBadge>
            </div>
          </div>
        ))}
      </NeonCard>
    </div>
  );
}
