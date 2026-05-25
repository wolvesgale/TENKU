import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { store, listSswApplicationDetails } from "@/lib/demo-store";
import { renderPdfToBuffer } from "@/lib/pdf/render";
import {
  SswApplicationPacketPdf,
  type SswPacketData,
} from "@/lib/pdf/templates/ssw-application-packet";
import { SSW_APP_TYPES, filterDocChecklist } from "@/lib/field-map";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { personId: string } }) {
  const { personId } = params;
  const { searchParams } = new URL(req.url);
  const appType = (searchParams.get("appType") ?? "EXT") as "COE" | "COS" | "EXT";

  const person = store.persons.find((p) => p.id === personId);
  if (!person) {
    return NextResponse.json({ error: "person not found" }, { status: 404 });
  }

  const company = person.currentCompanyId
    ? store.companies.find((c) => c.id === person.currentCompanyId) ?? null
    : null;

  const details = listSswApplicationDetails(personId);
  const detail = details.find((d) => d.appType === appType) ?? details[0] ?? null;

  // Build doc checklist
  const docChecklist = filterDocChecklist({
    appType,
    employerType: (detail?.employerType as "corporate" | "individual" | undefined) ?? "corporate",
    isDelegated: detail?.isDelegated ?? false,
  });
  const checklistRecord: Record<string, boolean> = {};
  docChecklist.forEach((d) => {
    checklistRecord[d.label] = detail?.docChecklist?.[d.label] ?? false;
  });

  const appTypeConfig = SSW_APP_TYPES[appType];

  const data: SswPacketData = {
    appType,
    status: detail?.status ?? "DRAFT",
    generatedAt: new Date().toISOString(),
    person: {
      fullName: person.fullName ?? "",
      nameKanji: person.nameKanji,
      nameKana: person.nameKana,
      nameRoma: person.nameRomaji ?? (person as Record<string, unknown>).nameRoma as string | undefined,
      nationality: person.nationality,
      birthdate: person.birthDate ?? person.birthdate,
      gender: person.gender,
      birthPlace: (person as Record<string, unknown>).birthPlace as string | undefined,
      passportNumber: (person as Record<string, unknown>).passportNumber as string | undefined
        ?? person.passportNo,
      passportExpiry: person.passportExpiry,
      residenceCardNumber: person.residenceCardNumber,
      residenceCardExpiry: person.residenceCardExpiry,
      dormAddress: person.dormAddress,
      phoneNumber: (person as Record<string, unknown>).phoneNumber as string | undefined,
      emailAddress: (person as Record<string, unknown>).emailAddress as string | undefined,
      lastEducation: (person as Record<string, unknown>).lastEducation as string | undefined,
      sswSector: (person as Record<string, unknown>).sswSector as string | undefined,
      occupationType: (person as Record<string, unknown>).occupationType as string | undefined,
      japaneseTestType: (person as Record<string, unknown>).japaneseTestType as string | undefined,
      japaneseTestLevel: (person as Record<string, unknown>).japaneseTestLevel as string | undefined,
      japaneseTestDate: (person as Record<string, unknown>).japaneseTestDate as string | undefined,
      japaneseTestCertNo: (person as Record<string, unknown>).japaneseTestCertNo as string | undefined,
      skillTestType: (person as Record<string, unknown>).skillTestType as string | undefined,
      skillTestDate: (person as Record<string, unknown>).skillTestDate as string | undefined,
      skillTestCertNo: (person as Record<string, unknown>).skillTestCertNo as string | undefined,
      titp2Completed: (person as Record<string, unknown>).titp2Completed as boolean | undefined,
      titp2CertNumber: (person as Record<string, unknown>).titp2CertNumber as string | undefined,
    },
    company: {
      name: company?.name ?? "",
      address: company?.address,
      phone: company?.phone,
      fax: (company as Record<string, unknown> | null)?.fax as string | undefined,
      corporateNumber: company?.corporateNumber,
      representativeName: company?.representativeName,
      representativeTitle: (company as Record<string, unknown> | null)?.representativeTitle as string | undefined,
      industry: company?.industryMajor,
      laborInsuranceNo: (company as Record<string, unknown> | null)?.laborInsuranceNo as string | undefined,
      employmentInsuranceNo: (company as Record<string, unknown> | null)?.employmentInsuranceNo as string | undefined,
      socialInsuranceStatus: (company as Record<string, unknown> | null)?.socialInsuranceStatus as string | undefined,
      sswReceiptNo: (company as Record<string, unknown> | null)?.sswReceiptNo as string | undefined,
      contactName: company?.contactName,
      contactTel: company?.contactTel,
      contactPersonTitle: (company as Record<string, unknown> | null)?.contactPersonTitle as string | undefined,
    },
    employment: {
      employerType: detail?.employerType,
      employmentType: detail?.employmentType,
      contractStartDate: detail?.contractStartDate,
      contractEndDate: detail?.contractEndDate,
      monthlySalary: detail?.monthlySalary,
      workLocation: detail?.workLocation,
      workContent: detail?.workContent,
      isDelegated: detail?.isDelegated,
      supportOrgName: detail?.supportOrgName,
      supportOrgRegNo: detail?.supportOrgRegNo,
    },
    schedule: {
      targetSubmitDate: detail?.targetSubmitDate,
      submittedDate: detail?.submittedDate,
      approvedDate: detail?.approvedDate,
      notes: detail?.notes,
    },
    docChecklist: checklistRecord,
  };

  try {
    const buffer = await renderPdfToBuffer(
      React.createElement(SswApplicationPacketPdf, { data })
    );

    const safeName = (person.nameRomaji ?? person.nameKanji ?? person.fullName ?? personId)
      .replace(/[^a-zA-Z0-9぀-鿿゠-ヿ_-]/g, "_")
      .slice(0, 40);
    const filename = `ssw-${appTypeConfig?.shortLabel ?? appType}-${safeName}.pdf`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "PDF generation failed", detail: String(err) },
      { status: 500 }
    );
  }
}
