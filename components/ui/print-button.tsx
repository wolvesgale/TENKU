"use client";
import { Printer } from "lucide-react";

export function PrintButton({ label = "印刷" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-muted hover:text-white hover:border-brand-blue transition print:hidden"
    >
      <Printer size={14} />
      {label}
    </button>
  );
}
