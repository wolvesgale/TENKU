import { NextRequest, NextResponse } from "next/server";
import {
  store,
  listSswApplicationDetails,
  addSswApplicationDetail,
  updateSswApplicationDetail,
  updatePerson,
  updateCompany,
} from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { personId: string } }) {
  const { personId } = params;
  const person = store.persons.find((p) => p.id === personId);
  if (!person) return NextResponse.json({ error: "not found" }, { status: 404 });
  const company = person.currentCompanyId
    ? store.companies.find((c) => c.id === person.currentCompanyId) ?? null
    : null;
  const details = listSswApplicationDetails(personId);
  return NextResponse.json({ person, company, applicationDetails: details });
}

export async function POST(req: NextRequest, { params }: { params: { personId: string } }) {
  const { personId } = params;
  const body = await req.json();
  const person = store.persons.find((p) => p.id === personId);
  const created = addSswApplicationDetail({
    personId,
    companyId: person?.currentCompanyId,
    ...body,
    status: body.status ?? "DRAFT",
    appType: body.appType ?? "EXT",
  });
  return NextResponse.json({ data: created }, { status: 201 });
}

export async function PATCH(req: NextRequest, { params }: { params: { personId: string } }) {
  const { personId } = params;
  const body = await req.json();
  const { detailId, personData, companyData, ...detailData } = body;

  if (personData && Object.keys(personData).length > 0) {
    updatePerson(personId, personData);
  }
  const person = store.persons.find((p) => p.id === personId);
  if (companyData && person?.currentCompanyId && Object.keys(companyData).length > 0) {
    updateCompany(person.currentCompanyId, companyData);
  }

  let detail = null;
  if (detailId) {
    detail = updateSswApplicationDetail(detailId, detailData);
  } else if (Object.keys(detailData).length > 0) {
    detail = addSswApplicationDetail({
      personId,
      companyId: person?.currentCompanyId,
      appType: detailData.appType ?? "EXT",
      status: "DRAFT",
      ...detailData,
    });
  }

  const updatedPerson = store.persons.find((p) => p.id === personId);
  const updatedCompany = person?.currentCompanyId
    ? store.companies.find((c) => c.id === person.currentCompanyId) ?? null
    : null;
  return NextResponse.json({ person: updatedPerson, company: updatedCompany, detail });
}
