import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/components/providers/app-state-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "TENKU_CLOUD 管理者画面",
  description: "SF-themed TENKU_CLOUD operations demo with mock data and AI assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="bg-background font-sans">
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
