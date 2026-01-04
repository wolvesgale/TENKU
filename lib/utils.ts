import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const programLabels: Record<string, string> = {
  ALL: "All",
  TITP: "TITP",
  SSW: "SSW",
  TA: "TA",
};
