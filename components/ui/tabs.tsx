"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type Tab = { id: string; label: string };

export function Tabs({ tabs, defaultTab, onChange }: { tabs: Tab[]; defaultTab: string; onChange?: (id: string) => void }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActive(tab.id);
            onChange?.(tab.id);
          }}
          className={cn("px-3 py-1.5 rounded-lg border text-sm transition", active === tab.id ? "border-brand-blue text-white" : "border-border text-gray-300")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
