"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Program = "ALL" | "TITP" | "SSW" | "TA";

type ProgramContextValue = {
  program: Program;
  setProgram: (p: Program) => void;
};

const ProgramContext = createContext<ProgramContextValue | undefined>(undefined);

export function ProgramProvider({ children }: { children: ReactNode }) {
  const [program, setProgramState] = useState<Program>("ALL");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("tenku:program") as Program | null;
      const cookieMatch = document.cookie.match(/tenku-program=([^;]+)/);
      const cookieValue = (cookieMatch?.[1] as Program | undefined) || null;
      const next = stored || cookieValue;
      if (next) setProgramState(next);
    }
  }, []);

  const setProgram = (p: Program) => {
    setProgramState(p);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("tenku:program", p);
      document.cookie = `tenku-program=${p}; path=/`;
    }
  };

  return <ProgramContext.Provider value={{ program, setProgram }}>{children}</ProgramContext.Provider>;
}

export function useProgram() {
  const ctx = useContext(ProgramContext);
  if (!ctx) throw new Error("useProgram must be used within ProgramProvider");
  return ctx;
}
