"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AiWidget from "../ai/AiWidget";

export default function Chrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <Sidebar />
      <div className="relative flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 px-6 pb-16 pt-4 overflow-y-auto scrollbar-thin">
          {children}
        </main>
        <AiWidget />
      </div>
    </div>
  );
}
