import { promises as fs } from "fs";
import path from "path";
import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFOptionList,
  PDFRadioGroup,
  PDFTextField,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import type { Company, DemoOrganizationProfile, Person, TrainingPlan } from "@/lib/demo-store";

const LOCAL_TEMPLATE_PATH = path.join(process.cwd(), "public", "pdf", "otit", "240819-200-1.pdf");
const LOCAL_ACRO_TEMPLATE_PATH = path.join(
  process.cwd(),
  "public",
  "pdf",
  "otit",
  "240819-200-1-acro.pdf"
);
const TEMPLATE_REMOTE_URL =
  "https://raw.githubusercontent.com/wolvesgale/TENKU/main/public/pdf/otit/240819-200-1.pdf";
const TEMPLATE_ACRO_REMOTE_URL =
  "https://raw.githubusercontent.com/wolvesgale/TENKU/main/public/pdf/otit/240819-200-1-acro.pdf";
const FONT_PATH = path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.ttf");

const MAPPING_PATH = path.join(
  process.cwd(),
  "data",
  "pdf",
  "otit",
  "240819-200-1-mapping.json"
);

type MappingEntry = {
  fields?: string[];
  splitName?: {
    familyField: string;
    givenField: string;
  };
  splitDate?: {
    yearField: string;
    monthField: string;
    dayField: string;
  };
  normalize?: "postal" | "address" | "gender" | "permitType";
};

type MappingData = Record<string, MappingEntry>;

let cachedMapping: MappingData | null = null;

const loadMapping = async (): Promise<MappingData> => {
  if (cachedMapping) return cachedMapping;
  const raw = await fs.readFile(MAPPING_PATH, "utf-8");
  cachedMapping = JSON.parse(raw) as MappingData;
  return cachedMapping;
};

const buildFieldNameToKeys = (mapping: MappingData) => {
  return Object.entries(mapping).reduce<Record<string, string[]>>((acc, [key, entry]) => {
    (entry.fields ?? []).forEach((fieldName) => {
      if (!acc[fieldName]) acc[fieldName] = [];
      acc[fieldName].push(key);
    });
    if (entry.splitName) {
      const { familyField, givenField } = entry.splitName;
      [familyField, givenField].forEach((fieldName) => {
        if (!acc[fieldName]) acc[fieldName] = [];
        acc[fieldName].push(key);
      });
    }
    if (entry.splitDate) {
      const { yearField, monthField, dayField } = entry.splitDate;
      [yearField, monthField, dayField].forEach((fieldName) => {
        if (!acc[fieldName]) acc[fieldName] = [];
        acc[fieldName].push(key);
      });
    }
    return acc;
  }, {});
};

const getTemplateBytes = async (): Promise<{
  bytes: Buffer;
  source: "local" | "remote";
  template: "acro" | "standard";
}> => {
  try {
    const bytes = await fs.readFile(LOCAL_ACRO_TEMPLATE_PATH);
    return { bytes, source: "local", template: "acro" };
  } catch {
    // ignore and fall back
  }
  try {
    const bytes = await fs.readFile(LOCAL_TEMPLATE_PATH);
    return { bytes, source: "local", template: "standard" };
  } catch (error) {
    console.warn("テンプレPDFのローカル読み込みに失敗しました。リモート取得にフォールバックします。", error);
  }
  const acroRes = await fetch(TEMPLATE_ACRO_REMOTE_URL);
  if (acroRes.ok) {
    const arrayBuffer = await acroRes.arrayBuffer();
    return { bytes: Buffer.from(arrayBuffer), source: "remote", template: "acro" };
  }
  const res = await fetch(TEMPLATE_REMOTE_URL);
  if (!res.ok) {
    throw new Error(`テンプレPDFの取得に失敗しました: ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return { bytes: Buffer.from(arrayBuffer), source: "remote", template: "standard" };
};

const formatDate = (value?: string) => {
  if (!value) return "";
  return value.slice(0, 10);
};

const formatDateDisplay = (value?: string) => {
  const date = formatDate(value);
  if (!date) return "";
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return "";
  return `${year}年${Number(month)}月${Number(day)}日`;
};

const calculateAge = (birthdate?: string) => {
  if (!birthdate) return "";
  const birth = new Date(birthdate);
  if (Number.isNaN(birth.getTime())) return "";
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)).toString();
};

const splitName = (value?: string) => {
  if (!value) return { family: "", given: "" };
  const [family, given] = value.split(/\s+/, 2);
  return { family: family ?? "", given: given ?? "" };
};

const splitPostalCode = (value?: string) => {
  if (!value) return "";
  return value.replace(/[^\d-]/g, "");
};

const normalizeAddress = (value?: string) => {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim();
};

const splitDateParts = (value?: string) => {
  const date = formatDate(value);
  if (!date) return { year: "", month: "", day: "" };
  const [year, month, day] = date.split("-");
  return {
    year: year ?? "",
    month: month ? String(Number(month)) : "",
    day: day ? String(Number(day)) : "",
  };
};

const normalizeGender = (value?: string) => {
  if (!value) return "";
  const normalized = value.trim().toLowerCase();
  if (normalized.includes("男") || normalized === "male") return "1";
  if (normalized.includes("女") || normalized === "female") return "2";
  return value;
};

const normalizePermitType = (value?: string) => {
  if (!value) return "";
  const normalized = value.trim();
  if (normalized.includes("一般")) return "1";
  if (normalized.includes("特定")) return "2";
  return value;
};

const buildFieldValues = ({
  organization,
  company,
  person,
  trainingPlan,
}: {
  organization: DemoOrganizationProfile;
  company?: Company;
  person?: Person;
  trainingPlan: TrainingPlan;
}) => {
  const organizationExtras = organization as DemoOrganizationProfile & {
    nameKana?: string;
    postalCode?: string;
    supervisingOfficeNameKana?: string;
    supervisingOfficePostalCode?: string;
    planInstructorKana?: string;
    sendingOrgNumberCountry?: string;
  };
  const companyExtras = company as Company & {
    traineeResponsibleKana?: string;
    traineeInstructorKana?: string;
    lifeInstructorKana?: string;
  };
  const baseValues: Record<string, string> = {
    "org.permitNumber": organization.permitNumber ?? "",
    "org.permitType": organization.permitType ?? "",
    "org.name": organization.name ?? "",
    "org.nameKana": organizationExtras?.nameKana ?? "",
    "org.postalCode": organizationExtras?.postalCode ?? "",
    "org.address": organization.address ?? "",
    "org.phone": organization.phone ?? "",
    "org.representativeName": organization.representativeName ?? "",
    "org.supervisorResponsibleName": organization.supervisorResponsibleName ?? "",
    "org.supervisingOfficeName": organization.supervisingOfficeName ?? "",
    "org.supervisingOfficeNameKana": organizationExtras?.supervisingOfficeNameKana ?? "",
    "org.supervisingOfficePostalCode": organizationExtras?.supervisingOfficePostalCode ?? "",
    "org.supervisingOfficeAddress": organization.supervisingOfficeAddress ?? "",
    "org.supervisingOfficePhone": organization.supervisingOfficePhone ?? "",
    "org.planInstructorName": organization.planInstructorName ?? "",
    "org.planInstructorKana": organizationExtras?.planInstructorKana ?? "",
    "org.sendingOrgNumberCountry": organizationExtras?.sendingOrgNumberCountry ?? "",
    "org.sendingOrgName": organization.sendingOrgName ?? "",
    "org.sendingOrgNumber": organization.sendingOrgNumber ?? "",
    "org.sendingOrgRefNumber": organization.sendingOrgRefNumber ?? "",

    "company.name": company?.name ?? "",
    "company.nameKana": company?.nameKana ?? "",
    "company.postalCode": company?.postalCode ?? "",
    "company.address": company?.address ?? "",
    "company.phone": company?.phone ?? "",
    "company.representativeName": company?.representativeName ?? "",
    "company.representativeKana": company?.representativeKana ?? "",
    "company.corporateNumber": company?.corporateNumber ?? "",
    "company.notifAcceptanceNo": company?.notifAcceptanceNo ?? "",
    "company.industryMajor": company?.industryMajor ?? "",
    "company.industryMinor": company?.industryMinor ?? "",
    "company.workplaceName": company?.workplaceName ?? "",
    "company.workplaceNameKana": company?.workplaceNameKana ?? "",
    "company.workplacePostalCode": company?.workplacePostalCode ?? "",
    "company.workplaceAddress": company?.workplaceAddress ?? "",
    "company.workplacePhone": company?.workplacePhone ?? "",
    "company.traineeResponsibleName": company?.traineeResponsibleName ?? "",
    "company.traineeResponsibleKana": companyExtras?.traineeResponsibleKana ?? "",
    "company.traineeResponsibleRole": company?.traineeResponsibleRole ?? "",
    "company.traineeInstructorName": company?.traineeInstructorName ?? "",
    "company.traineeInstructorKana": companyExtras?.traineeInstructorKana ?? "",
    "company.traineeInstructorRole": company?.traineeInstructorRole ?? "",
    "company.lifeInstructorName": company?.lifeInstructorName ?? "",
    "company.lifeInstructorKana": companyExtras?.lifeInstructorKana ?? "",
    "company.lifeInstructorRole": company?.lifeInstructorRole ?? "",

    "person.nameRomaji": person?.nameRomaji ?? person?.nameRoma ?? "",
    "person.nameKanji": person?.nameKanji ?? "",
    "person.nameKana": person?.nameKana ?? "",
    "person.nationality": person?.nationality ?? "",
    "person.birthdate": formatDate(person?.birthdate ?? person?.birthDate),
    "person.birthdateDisplay": formatDateDisplay(person?.birthdate ?? person?.birthDate),
    "person.gender": person?.gender ?? "",
    "person.age": person?.age?.toString() ?? calculateAge(person?.birthdate ?? person?.birthDate),
    "person.returnPeriodFrom": formatDate(person?.returnPeriodFrom),
    "person.returnPeriodTo": formatDate(person?.returnPeriodTo),

    "training.category": trainingPlan.category ?? "",
    "training.jobCode": trainingPlan.jobCode ?? "",
    "training.jobName": trainingPlan.jobName ?? "",
    "training.workName": trainingPlan.workName ?? "",
  };

  const overrides = trainingPlan.freeEditOverrides ?? {};
  const merged = { ...baseValues };
  Object.entries(overrides).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      merged[key] = String(value);
    }
  });
  return merged;
};

const logTemplateFieldNames = (
  fieldNames: {
    name: string;
    type: string;
    options?: string[];
  }[]
) => {
  console.log("OTITテンプレPDFのフィールド一覧:", fieldNames);
};

const setFieldValue = (form: ReturnType<PDFDocument["getForm"]>, name: string, value: string) => {
  try {
    const field = form.getField(name);
    if (field instanceof PDFTextField) {
      const maxLength = field.getMaxLength();
      const trimmedValue =
        typeof maxLength === "number" && maxLength > 0 ? value.slice(0, maxLength) : value;
      field.setText(trimmedValue);
      return;
    }
    if (field instanceof PDFDropdown || field instanceof PDFOptionList) {
      field.select(value);
      return;
    }
    if (field instanceof PDFCheckBox) {
      if (value) {
        field.check();
      } else {
        field.uncheck();
      }
      return;
    }
    if (field instanceof PDFRadioGroup) {
      field.select(value);
    }
  } catch (error) {
    console.warn(`フィールド設定に失敗しました: ${name}`, error);
  }
};

const normalizeValue = (value: string, normalize?: MappingEntry["normalize"]) => {
  if (!normalize) return value;
  if (normalize === "postal") return splitPostalCode(value);
  if (normalize === "address") return normalizeAddress(value);
  if (normalize === "gender") return normalizeGender(value);
  if (normalize === "permitType") return normalizePermitType(value);
  return value;
};

const applyMappingEntry = (
  fieldValueMap: Record<string, string>,
  baseKey: string,
  value: string,
  entry: MappingEntry
) => {
  const normalizedValue = normalizeValue(value, entry.normalize);
  (entry.fields ?? []).forEach((fieldName) => {
    fieldValueMap[fieldName] = normalizedValue;
  });
  if (entry.splitName) {
    const parts = splitName(value);
    fieldValueMap[entry.splitName.familyField] = parts.family;
    fieldValueMap[entry.splitName.givenField] = parts.given;
  }
  if (entry.splitDate) {
    const parts = splitDateParts(value);
    fieldValueMap[entry.splitDate.yearField] = parts.year;
    fieldValueMap[entry.splitDate.monthField] = parts.month;
    fieldValueMap[entry.splitDate.dayField] = parts.day;
  }
  if (!entry.fields && !entry.splitName && !entry.splitDate) {
    console.warn(`マッピング定義にフィールドがありません: ${baseKey}`);
  }
};

const applyOverrides = (
  fieldValueMap: Record<string, string>,
  overrides: Record<string, string>,
  fieldNames: string[],
  mapping: MappingData
) => {
  Object.entries(overrides).forEach(([key, value]) => {
    const entry = mapping[key];
    if (entry) {
      applyMappingEntry(fieldValueMap, key, String(value), entry);
      return;
    }
    if (fieldNames.includes(key)) {
      fieldValueMap[key] = String(value);
    }
  });
};

const buildFieldValueMap = (values: Record<string, string>, mapping: MappingData) => {
  const fieldValueMap: Record<string, string> = {};
  Object.entries(mapping).forEach(([key, entry]) => {
    const value = values[key] ?? "";
    applyMappingEntry(fieldValueMap, key, value, entry);
  });
  return fieldValueMap;
};

export async function generateTrainingPlanPdf({
  organization,
  company,
  person,
  trainingPlan,
  debug = false,
}: {
  organization: DemoOrganizationProfile;
  company?: Company;
  person?: Person;
  trainingPlan: TrainingPlan;
  debug?: boolean;
}): Promise<{
  pdfBytes: Uint8Array;
  diagnostics: {
    templateKind: "acro" | "standard" | "unknown";
    templateSource: "local" | "remote" | "unknown";
    hasXfa: boolean;
    fieldCount: number;
    fields: { name: string; type: string; options?: string[] }[];
    unmappedFields: string[];
    emptyFields: { name: string; keys: string[] }[];
    mappedFields: { name: string; value: string; keys: string[] }[];
    values: Record<string, string>;
  };
}> {
  let templateSource: "local" | "remote" | "unknown" = "unknown";
  let templateKind: "acro" | "standard" | "unknown" = "unknown";
  try {
    const { bytes: templateBytes, source, template } = await getTemplateBytes();
    templateSource = source;
    templateKind = template;
    const fontBytes = await fs.readFile(FONT_PATH);

    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit);
    const font = await pdfDoc.embedFont(fontBytes, { subset: true });

    const form = pdfDoc.getForm();
    const hasXfa = form.hasXFA();
    const fields = form.getFields();
    const fieldNameList = fields.map((field) => field.getName());
    const fieldDetails = fields.map((field) => {
      const name = field.getName();
      if (field instanceof PDFTextField) {
        return { name, type: "text" };
      }
      if (field instanceof PDFDropdown) {
        return { name, type: "dropdown", options: field.getOptions() };
      }
      if (field instanceof PDFOptionList) {
        return { name, type: "optionList", options: field.getOptions() };
      }
      if (field instanceof PDFCheckBox) {
        return { name, type: "checkbox" };
      }
      if (field instanceof PDFRadioGroup) {
        return { name, type: "radio", options: field.getOptions() };
      }
      return { name, type: "unknown" };
    });
    const mapping = await loadMapping();
    const fieldNameToKeys = buildFieldNameToKeys(mapping);
    if (debug) {
      logTemplateFieldNames(fieldDetails);
      console.log("テンプレ情報:", {
        templateKind,
        templateSource,
        hasXfa,
        fieldCount: fields.length,
      });
      if (hasXfa && templateKind !== "acro") {
        console.warn(
          "XFAフォームが検出されました。AcroForm版テンプレ(240819-200-1-acro.pdf)の利用を推奨します。"
        );
      }
    }

    const values = buildFieldValues({ organization, company, person, trainingPlan });
    const mappedFieldNames = new Set([
      ...Object.keys(fieldNameToKeys),
      ...Object.keys(trainingPlan.freeEditOverrides ?? {}),
    ]);
    const unmappedFieldNames = fieldNameList.filter((name) => !mappedFieldNames.has(name));
    if (debug && unmappedFieldNames.length) {
      console.warn("未マッピングのテンプレPDFフィールド:", unmappedFieldNames);
    }

    const fieldValueMap: Record<string, string> = buildFieldValueMap(values, mapping);

    if (trainingPlan.freeEditOverrides) {
      applyOverrides(fieldValueMap, trainingPlan.freeEditOverrides, fieldNameList, mapping);
    }

    const emptyValueFields = fieldNameList.filter((name) => {
      if (!mappedFieldNames.has(name)) return false;
      const value = fieldValueMap[name];
      return !value || value.toString().trim() === "";
    });
    if (debug && emptyValueFields.length) {
      const emptyFieldDetails = emptyValueFields.map((name) => ({
        name,
        keys: fieldNameToKeys[name] ?? [],
      }));
      console.warn("値が空のテンプレPDFフィールド:", emptyFieldDetails);
    }
    const mappedFieldDetails = Object.entries(fieldValueMap).map(([name, value]) => ({
      name,
      value,
      keys: fieldNameToKeys[name] ?? [],
    }));
    if (debug) {
      console.log("投入予定フィールド:", fieldValueMap);
      console.log("投入値(正規化済み):", values);
      console.log("マッピング詳細:", mappedFieldDetails);
    }

    Object.entries(fieldValueMap).forEach(([name, value]) => {
      if (!value) return;
      if (!fieldNameList.includes(name)) {
        console.warn(`テンプレPDFにフィールドが見つかりません: ${name}`);
        return;
      }
      setFieldValue(form, name, value);
    });

    form.updateFieldAppearances(font);
    form.flatten();

    const pdfBytes = await pdfDoc.save();
    return {
      pdfBytes,
      diagnostics: {
        templateKind,
        templateSource,
        hasXfa,
        fieldCount: fields.length,
        fields: fieldDetails,
        unmappedFields: unmappedFieldNames,
        emptyFields: emptyValueFields.map((name) => ({
          name,
          keys: fieldNameToKeys[name] ?? [],
        })),
        mappedFields: mappedFieldDetails,
        values,
      },
    };
  } catch (error) {
    console.error("OTITテンプレPDF生成中にエラーが発生しました。", {
      error,
      trainingPlanId: trainingPlan.id,
      templateSource,
      templateKind,
    });
    throw error;
  }
}
