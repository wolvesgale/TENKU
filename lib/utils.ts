import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const programLabels: Record<string, string> = {
  ALL: "全て",
  TITP: "TITP",
  SSW: "SSW",
  TA: "TA",
};
