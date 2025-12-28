import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import NeonCard from "./NeonCard";

export default function KpiCard({ title, value, change, trend }: { title: string; value: number; change: string; trend: "up" | "down" }) {
  return (
    <NeonCard className="p-4 border border-neon-cyan/30">
      <p className="text-sm text-slate-400">{title}</p>
      <div className="flex items-baseline justify-between mt-2">
        <p className="text-3xl font-semibold text-white">{value.toLocaleString()}</p>
        <div
          className={`flex items-center gap-1 text-sm px-2 py-1 rounded-lg border ${
            trend === "up"
              ? "border-emerald-400/60 text-emerald-200 bg-emerald-400/10"
              : "border-rose-400/60 text-rose-200 bg-rose-400/10"
          }`}
        >
          {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
    </NeonCard>
  );
}
