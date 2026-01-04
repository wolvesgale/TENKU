import { cookies } from "next/headers";
import { ProgramFilter } from "@/lib/data";

export function readProgramFromCookie(): ProgramFilter {
  const value = cookies().get("tenku-program")?.value as ProgramFilter | undefined;
  return value || "ALL";
}
