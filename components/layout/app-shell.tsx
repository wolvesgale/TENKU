import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[auto_1fr] bg-background text-gray-100">
      <Sidebar />
      <div className="flex flex-col">
        <Topbar />
        <main className="p-4 space-y-4">{children}</main>
      </div>
    </div>
  );
}
