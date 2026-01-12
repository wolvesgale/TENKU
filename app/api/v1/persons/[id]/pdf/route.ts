import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { put } from "@vercel/blob";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import { PersonPdf } from "@/lib/pdf/templates/person";
import { store } from "@/lib/demo-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const person = store.persons.find((p) => p.id === params.id);
  if (!person) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const company = store.companies.find((c) => c.id === person.currentCompanyId);

  const pdfBuffer = await renderPdfToBuffer(
    React.createElement(PersonPdf, {
      data: {
        personId: person.id,
        fullName: person.fullName,
        nationality: person.nationality,
        foreignerId: person.foreignerId,
        residenceCardNumber: person.residenceCardNumber,
        residenceCardExpiry: person.residenceCardExpiry?.slice(0, 10),
        passportNumber: person.metaJson?.passportNumber,
        assignmentCompany: company?.name,
        specialty: person.occupationField ?? person.metaJson?.specialty,
        address: person.dormAddress,
        memo: person.notes,
      },
    }),
  );

  const filename = `tenku/persons/${person.id}.pdf`;
  const blob = await put(filename, pdfBuffer, { access: "public", contentType: "application/pdf", token: process.env.BLOB_READ_WRITE_TOKEN });
  return NextResponse.json({ url: blob.url });
}
