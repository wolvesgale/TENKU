import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { ProgramProvider } from "@/components/providers/program-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "TENKU AI Agent Demo",
  description: "Modern TENKU operations console with AI-driven workflows",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="bg-background font-sans">
        <AuthSessionProvider>
          <ProgramProvider>{children}</ProgramProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
