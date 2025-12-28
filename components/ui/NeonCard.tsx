import { ReactNode } from "react";

export default function NeonCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass-panel card-highlight ${className}`}>{children}</div>;
}
