import { NextResponse } from "next/server";
import { store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sswPersons = store.persons.filter((p) => p.currentProgram === "SSW" || p.currentProgram === "TA");
  const companyIds = [...new Set(sswPersons.map((p) => p.currentCompanyId).filter(Boolean))] as string[];

  const companies = companyIds
    .map((companyId) => {
      const company = store.companies.find((c) => c.id === companyId);
      if (!company) return null;
      const persons = sswPersons
        .filter((p) => p.currentCompanyId === companyId)
        .map((p) => ({
          id: p.id,
          name: p.nameKanji ?? p.nameRomaji ?? p.nameRoma ?? p.fullName,
          nationality: p.nationality,
          residenceCardExpiry: p.residenceCardExpiry,
          currentProgram: p.currentProgram,
          nextProcedure: p.nextProcedure,
        }));
      return { id: company.id, name: company.name, persons };
    })
    .filter(Boolean);

  return NextResponse.json({ companies });
}
