import { ReactNode } from "react";

const colors: Record<string, string> = {
  open: "border-brand-blue/70 text-brand-blue bg-brand-blue/10",
  in_progress: "border-brand-amber/70 text-brand-amber bg-brand-amber/10",
  done: "border-brand-teal/70 text-brand-teal bg-brand-teal/10",
  high: "border-rose-400/70 text-rose-200 bg-rose-400/10",
  medium: "border-brand-amber/70 text-brand-amber bg-brand-amber/10",
  low: "border-brand-teal/70 text-brand-teal bg-brand-teal/10",
};

export default function StatusBadge({ status, children }: { status: string; children?: ReactNode }) {
  const style = colors[status] || "border-slate-600 text-slate-300 bg-slate-700/30";
  return <span className={`badge ${style}`}>{children || status}</span>;
}
