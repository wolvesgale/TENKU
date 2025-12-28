import { ReactNode } from "react";

const colors: Record<string, string> = {
  open: "border-amber-400/70 text-amber-200 bg-amber-400/10",
  in_progress: "border-neon-cyan/70 text-neon-cyan bg-neon-cyan/10",
  done: "border-emerald-400/70 text-emerald-200 bg-emerald-400/10",
  high: "border-rose-400/70 text-rose-200 bg-rose-400/10",
  medium: "border-amber-400/70 text-amber-200 bg-amber-400/10",
  low: "border-emerald-400/70 text-emerald-200 bg-emerald-400/10",
};

export default function StatusBadge({ status, children }: { status: string; children?: ReactNode }) {
  const style = colors[status] || "border-slate-600 text-slate-300 bg-slate-700/30";
  return <span className={`badge ${style}`}>{children || status}</span>;
}
