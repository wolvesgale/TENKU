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

const BASE_TO_FIELD_NAMES: Record<string, string[]> = {
  "company.name": ["Top[0].Page2[0].txtJISSHISHAMEI[0]"],
  "company.nameKana": ["Top[0].Page2[0].txtJISSHISHAMEI_KANA[0]"],
  "company.postalCode": ["Top[0].Page2[0].txtJISSHISHA_YUBINBANGO[0]"],
  "company.address": ["Top[0].Page2[0].txtJISSHISHA_TATEMONO[0]"],
  "company.phone": ["Top[0].Page2[0].txtJISSHISHA_DENWA[0]"],
  "company.corporateNumber": ["Top[0].Page2[0].txtHOJIN_BANGO[0]"],
  "company.notifAcceptanceNo": ["Top[0].Page2[0].txtJISSHISHA_BANGO[0]"],
  "company.industryMajor": ["Top[0].Page2[0].txtHOJIN_GYOSHU_DAI[0]"],
  "company.industryMinor": ["Top[0].Page2[0].txtHOJIN_GYOSHU_SHO[0]"],
  "company.workplaceName": ["Top[0].Page2[0].txtJIGYOSHO_MEI[0]"],
  "company.workplaceNameKana": ["Top[0].Page2[0].txtJIGYOSHO_MEI_KANA[0]"],
  "company.workplacePostalCode": ["Top[0].Page2[0].txtJIGYOSHO_YUBINBANGO[0]"],
  "company.workplaceAddress": ["Top[0].Page2[0].txtJIGYOSHO_TATEMONO[0]"],
  "company.workplacePhone": ["Top[0].Page2[0].txtJIGYOSHO_DENWA[0]"],
  "company.traineeResponsibleName": [
    "Top[0].Page2[0].txtSEKININSHA_SEI[0]",
    "Top[0].Page2[0].txtSEKININSHA_MEI[0]",
  ],
  "company.traineeResponsibleKana": [
    "Top[0].Page2[0].txtSEKININSHA_KANA_SEI[0]",
    "Top[0].Page2[0].txtSEKININSHA_KANA_MEI[0]",
  ],
  "company.traineeResponsibleRole": ["Top[0].Page2[0].txtSEKININSHA_YAKUSHOKU[0]"],
  "company.traineeInstructorName": [
    "Top[0].Page3[0].txtJISSHUSHIDOIN_SEI[0]",
    "Top[0].Page3[0].txtJISSHUSHIDOIN_MEI[0]",
  ],
  "company.traineeInstructorKana": [
    "Top[0].Page3[0].txtJISSHUSHIDOIN_KANA_SEI[0]",
    "Top[0].Page3[0].txtJISSHUSHIDOIN_KANA_MEI[0]",
  ],
  "company.traineeInstructorRole": ["Top[0].Page3[0].txtJISSHUSHIDOIN_YAKUSHOKU[0]"],
  "company.lifeInstructorName": [
    "Top[0].Page3[0].txtSEIKATSUSHIDOIN_SEI[0]",
    "Top[0].Page3[0].txtSEIKATSUSHIDOIN_MEI[0]",
  ],
  "company.lifeInstructorKana": [
    "Top[0].Page3[0].txtSEIKATSUSHIDOIN_KANA_SEI[0]",
    "Top[0].Page3[0].txtSEIKATSUSHIDOIN_KANA_MEI[0]",
  ],
  "company.lifeInstructorRole": ["Top[0].Page3[0].txtSEIKATSUSHIDOIN_YAKUSHOKU[0]"],

  "person.nameRomaji": ["Top[0].Page3[0].txtJISSHUSEI_ROMAJI[0]"],
  "person.nameKanji": ["Top[0].Page3[0].txtJISSHUSEI_KANJI[0]"],
  "person.nationality": ["Top[0].Page3[0].cmbJISSHUSEI_KOKUSEKI[0]"],
  "person.age": ["Top[0].Page3[0].txtNENREI[0]"],

  "training.jobCode": ["Top[0].Page3[0].cmbSHOKUSHUSAGYO_1[0]"],
  "training.jobName": ["Top[0].Page3[0].txtSHOKUSHUSAGYO_1_SHOKUSHU[0]"],
  "training.workName": ["Top[0].Page3[0].txtSHOKUSHUSAGYO_1_SAGYO[0]"],
  "training.category": ["Top[0].Page3[0].rbtJISSHUKUBUN[0]"],

  "org.permitNumber": ["Top[0].Page4[0].txtKANRI_KYOKABANGO[0]"],
  "org.permitType": ["Top[0].Page4[0].rbtKANRI_KYOKA[0]"],
  "org.nameKana": ["Top[0].Page4[0].txtKANRI_MEISHO_KANA[0]"],
  "org.postalCode": ["Top[0].Page4[0].txtKANRI_YUBINBANGO[0]"],
  "org.name": ["Top[0].Page4[0].txtKANRI_MEISHO[0]"],
  "org.address": ["Top[0].Page4[0].txtKANRI_TATEMONO[0]"],
  "org.phone": ["Top[0].Page4[0].txtKANRI_DENWA[0]"],
  "org.representativeName": [
    "Top[0].Page4[0].txtKANRI_DAIHYO_SEI[0]",
    "Top[0].Page4[0].txtKANRI_DAIHYO_MEI[0]",
  ],
  "org.supervisorResponsibleName": [
    "Top[0].Page4[0].txtKANRI_SEKININ_SEI[0]",
    "Top[0].Page4[0].txtKANRI_SEKININ_MEI[0]",
  ],
  "org.supervisingOfficeName": ["Top[0].Page4[0].txtTANTOJIGYOSHO[0]"],
  "org.supervisingOfficeNameKana": ["Top[0].Page4[0].txtTANTOJIGYOSHO_KANA[0]"],
  "org.supervisingOfficePostalCode": ["Top[0].Page4[0].txtTANTOJIGYOSHO_YUBINBANGO[0]"],
  "org.supervisingOfficeAddress": ["Top[0].Page4[0].txtTANTOJIGYOSHO_TATEMONO[0]"],
  "org.supervisingOfficePhone": ["Top[0].Page4[0].txtTANTOJIGYOSHO_DENWA[0]"],
  "org.planInstructorName": [
    "Top[0].Page4[0].txtKEIKAKUSHIDOTANTO_SEI[0]",
    "Top[0].Page4[0].txtKEIKAKUSHIDOTANTO_MEI[0]",
  ],
  "org.planInstructorKana": [
    "Top[0].Page4[0].txtKEIKAKUSHIDOTANTO_KANA_SEI[0]",
    "Top[0].Page4[0].txtKEIKAKUSHIDOTANTO_KANA_MEI[0]",
  ],
  "org.sendingOrgNumberCountry": ["Top[0].Page4[0].txtOKURIDASHIKIKANBANGO_KUNI[0]"],
  "org.sendingOrgName": ["Top[0].Page4[0].cmbOKURIDASHIKIKAN[0]"],
  "org.sendingOrgNumber": ["Top[0].Page4[0].txtOKURIDASHIKIKANBANGO_BANGO[0]"],
  "org.sendingOrgRefNumber": ["Top[0].Page4[0].txtSEIRIBANGO[0]"],
};

const FIELD_NAME_TO_KEYS = Object.entries(BASE_TO_FIELD_NAMES).reduce<Record<string, string[]>>(
  (acc, [key, fieldNames]) => {
    fieldNames.forEach((fieldName) => {
      if (!acc[fieldName]) {
        acc[fieldName] = [];
      }
      acc[fieldName].push(key);
    });
    return acc;
  },
  {}
);

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

const applyOverrides = (
  fieldValueMap: Record<string, string>,
  overrides: Record<string, string>,
  fieldNames: string[]
) => {
  Object.entries(overrides).forEach(([key, value]) => {
    if (BASE_TO_FIELD_NAMES[key]) {
      BASE_TO_FIELD_NAMES[key].forEach((fieldName) => {
        fieldValueMap[fieldName] = String(value);
      });
    }
    if (fieldNames.includes(key)) {
      fieldValueMap[key] = String(value);
    }
  });
};

const buildFieldValueMap = (values: Record<string, string>) => {
  return Object.fromEntries(
    Object.entries(BASE_TO_FIELD_NAMES).flatMap(([key, fieldNamesList]) => {
      const value = values[key] ?? "";
      return fieldNamesList.map((fieldName) => [fieldName, value]);
    })
  );
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
}) {
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
    const representativeKana = splitName(values["company.representativeKana"]);
    const representativeName = splitName(values["company.representativeName"]);
    const traineeResponsibleName = splitName(values["company.traineeResponsibleName"]);
    const traineeResponsibleKana = splitName(values["company.traineeResponsibleKana"]);
    const traineeInstructorName = splitName(values["company.traineeInstructorName"]);
    const traineeInstructorKana = splitName(values["company.traineeInstructorKana"]);
    const lifeInstructorName = splitName(values["company.lifeInstructorName"]);
    const lifeInstructorKana = splitName(values["company.lifeInstructorKana"]);
    const orgRepresentativeName = splitName(values["org.representativeName"]);
    const supervisorResponsibleName = splitName(values["org.supervisorResponsibleName"]);
    const planInstructorName = splitName(values["org.planInstructorName"]);
    const planInstructorKana = splitName(values["org.planInstructorKana"]);
    const birthdateParts = splitDateParts(values["person.birthdate"]);
    const returnFromParts = splitDateParts(values["person.returnPeriodFrom"]);
    const returnToParts = splitDateParts(values["person.returnPeriodTo"]);
    const genderValue = normalizeGender(values["person.gender"]);
    const permitTypeValue = normalizePermitType(values["org.permitType"]);
    const derivedFieldNames = [
      "Top[0].Page2[0].txtDAIHYO_KANA_SEI[0]",
      "Top[0].Page2[0].txtDAIHYO_KANA_MEI[0]",
      "Top[0].Page2[0].txtDAIHYO_SHIMEI_SEI[0]",
      "Top[0].Page2[0].txtDAIHYO_SHIMEI_MEI[0]",
      "Top[0].Page2[0].txtSEKININSHA_SEI[0]",
      "Top[0].Page2[0].txtSEKININSHA_MEI[0]",
      "Top[0].Page3[0].txtJISSHUSHIDOIN_SEI[0]",
      "Top[0].Page3[0].txtJISSHUSHIDOIN_MEI[0]",
      "Top[0].Page3[0].txtSEIKATSUSHIDOIN_SEI[0]",
      "Top[0].Page3[0].txtSEIKATSUSHIDOIN_MEI[0]",
      "Top[0].Page4[0].txtKANRI_DAIHYO_SEI[0]",
      "Top[0].Page4[0].txtKANRI_DAIHYO_MEI[0]",
      "Top[0].Page4[0].txtKANRI_SEKININ_SEI[0]",
      "Top[0].Page4[0].txtKANRI_SEKININ_MEI[0]",
      "Top[0].Page4[0].txtKEIKAKUSHIDOTANTO_SEI[0]",
      "Top[0].Page4[0].txtKEIKAKUSHIDOTANTO_MEI[0]",
      "Top[0].Page3[0].txtSEINENGAPPI_NEN[0]",
      "Top[0].Page3[0].cmbSEINENGAPPI_TSUKI[0]",
      "Top[0].Page3[0].cmbSEINENGAPPI_HI[0]",
      "Top[0].Page3[0].rbtSEIBETSU[0]",
      "Top[0].Page3[0].txtSHUKKOKUNENGAPPI_NEN[0]",
      "Top[0].Page3[0].cmbSHUKKOKUNENGAPPI_TSUKI[0]",
      "Top[0].Page3[0].cmbSHUKKOKUNENGAPPI_HI[0]",
      "Top[0].Page3[0].txtNYUKOKUNENGAPPI_NEN[0]",
      "Top[0].Page3[0].cmbNYUKOKUNENGAPPI_TSUKI[0]",
      "Top[0].Page3[0].cmbNYUKOKUNENGAPPI_HI[0]",
    ];
    const mappedFieldNames = new Set([
      ...Object.values(BASE_TO_FIELD_NAMES).flat(),
      ...derivedFieldNames,
      ...Object.keys(trainingPlan.freeEditOverrides ?? {}),
    ]);
    const unmappedFieldNames = fieldNameList.filter((name) => !mappedFieldNames.has(name));
    if (debug && unmappedFieldNames.length) {
      console.warn("未マッピングのテンプレPDFフィールド:", unmappedFieldNames);
    }

    const fieldValueMap: Record<string, string> = buildFieldValueMap(values);
    fieldValueMap["Top[0].Page2[0].txtJISSHISHA_YUBINBANGO[0]"] = splitPostalCode(
      values["company.postalCode"]
    );
    fieldValueMap["Top[0].Page2[0].txtJISSHISHA_TATEMONO[0]"] = normalizeAddress(
      values["company.address"]
    );
    fieldValueMap["Top[0].Page2[0].txtJIGYOSHO_YUBINBANGO[0]"] = splitPostalCode(
      values["company.workplacePostalCode"]
    );
    fieldValueMap["Top[0].Page2[0].txtJIGYOSHO_TATEMONO[0]"] = normalizeAddress(
      values["company.workplaceAddress"]
    );
    fieldValueMap["Top[0].Page4[0].txtKANRI_YUBINBANGO[0]"] = splitPostalCode(
      values["org.postalCode"]
    );
    fieldValueMap["Top[0].Page4[0].txtKANRI_TATEMONO[0]"] = normalizeAddress(values["org.address"]);
    fieldValueMap["Top[0].Page4[0].txtTANTOJIGYOSHO_YUBINBANGO[0]"] = splitPostalCode(
      values["org.supervisingOfficePostalCode"]
    );
    fieldValueMap["Top[0].Page4[0].txtTANTOJIGYOSHO_TATEMONO[0]"] = normalizeAddress(
      values["org.supervisingOfficeAddress"]
    );

    fieldValueMap["Top[0].Page2[0].txtDAIHYO_KANA_SEI[0]"] = representativeKana.family;
    fieldValueMap["Top[0].Page2[0].txtDAIHYO_KANA_MEI[0]"] = representativeKana.given;
    fieldValueMap["Top[0].Page2[0].txtDAIHYO_SHIMEI_SEI[0]"] = representativeName.family;
    fieldValueMap["Top[0].Page2[0].txtDAIHYO_SHIMEI_MEI[0]"] = representativeName.given;
    fieldValueMap["Top[0].Page2[0].txtSEKININSHA_SEI[0]"] = traineeResponsibleName.family;
    fieldValueMap["Top[0].Page2[0].txtSEKININSHA_MEI[0]"] = traineeResponsibleName.given;
    fieldValueMap["Top[0].Page2[0].txtSEKININSHA_KANA_SEI[0]"] = traineeResponsibleKana.family;
    fieldValueMap["Top[0].Page2[0].txtSEKININSHA_KANA_MEI[0]"] = traineeResponsibleKana.given;
    fieldValueMap["Top[0].Page3[0].txtJISSHUSHIDOIN_SEI[0]"] = traineeInstructorName.family;
    fieldValueMap["Top[0].Page3[0].txtJISSHUSHIDOIN_MEI[0]"] = traineeInstructorName.given;
    fieldValueMap["Top[0].Page3[0].txtJISSHUSHIDOIN_KANA_SEI[0]"] = traineeInstructorKana.family;
    fieldValueMap["Top[0].Page3[0].txtJISSHUSHIDOIN_KANA_MEI[0]"] = traineeInstructorKana.given;
    fieldValueMap["Top[0].Page3[0].txtSEIKATSUSHIDOIN_SEI[0]"] = lifeInstructorName.family;
    fieldValueMap["Top[0].Page3[0].txtSEIKATSUSHIDOIN_MEI[0]"] = lifeInstructorName.given;
    fieldValueMap["Top[0].Page3[0].txtSEIKATSUSHIDOIN_KANA_SEI[0]"] = lifeInstructorKana.family;
    fieldValueMap["Top[0].Page3[0].txtSEIKATSUSHIDOIN_KANA_MEI[0]"] = lifeInstructorKana.given;
    fieldValueMap["Top[0].Page4[0].txtKANRI_DAIHYO_SEI[0]"] = orgRepresentativeName.family;
    fieldValueMap["Top[0].Page4[0].txtKANRI_DAIHYO_MEI[0]"] = orgRepresentativeName.given;
    fieldValueMap["Top[0].Page4[0].txtKANRI_SEKININ_SEI[0]"] = supervisorResponsibleName.family;
    fieldValueMap["Top[0].Page4[0].txtKANRI_SEKININ_MEI[0]"] = supervisorResponsibleName.given;
    fieldValueMap["Top[0].Page4[0].txtKEIKAKUSHIDOTANTO_SEI[0]"] = planInstructorName.family;
    fieldValueMap["Top[0].Page4[0].txtKEIKAKUSHIDOTANTO_MEI[0]"] = planInstructorName.given;
    fieldValueMap["Top[0].Page4[0].txtKEIKAKUSHIDOTANTO_KANA_SEI[0]"] = planInstructorKana.family;
    fieldValueMap["Top[0].Page4[0].txtKEIKAKUSHIDOTANTO_KANA_MEI[0]"] = planInstructorKana.given;
    fieldValueMap["Top[0].Page3[0].txtSEINENGAPPI_NEN[0]"] = birthdateParts.year;
    fieldValueMap["Top[0].Page3[0].cmbSEINENGAPPI_TSUKI[0]"] = birthdateParts.month;
    fieldValueMap["Top[0].Page3[0].cmbSEINENGAPPI_HI[0]"] = birthdateParts.day;
    fieldValueMap["Top[0].Page3[0].rbtSEIBETSU[0]"] = genderValue;
    fieldValueMap["Top[0].Page3[0].txtSHUKKOKUNENGAPPI_NEN[0]"] = returnFromParts.year;
    fieldValueMap["Top[0].Page3[0].cmbSHUKKOKUNENGAPPI_TSUKI[0]"] = returnFromParts.month;
    fieldValueMap["Top[0].Page3[0].cmbSHUKKOKUNENGAPPI_HI[0]"] = returnFromParts.day;
    fieldValueMap["Top[0].Page3[0].txtNYUKOKUNENGAPPI_NEN[0]"] = returnToParts.year;
    fieldValueMap["Top[0].Page3[0].cmbNYUKOKUNENGAPPI_TSUKI[0]"] = returnToParts.month;
    fieldValueMap["Top[0].Page3[0].cmbNYUKOKUNENGAPPI_HI[0]"] = returnToParts.day;
    fieldValueMap["Top[0].Page4[0].rbtKANRI_KYOKA[0]"] = permitTypeValue;

    if (trainingPlan.freeEditOverrides) {
      applyOverrides(fieldValueMap, trainingPlan.freeEditOverrides, fieldNameList);
    }

    const emptyValueFields = fieldNameList.filter((name) => {
      if (!mappedFieldNames.has(name)) return false;
      const value = fieldValueMap[name];
      return !value || value.toString().trim() === "";
    });
    if (debug && emptyValueFields.length) {
      const emptyFieldDetails = emptyValueFields.map((name) => ({
        name,
        keys: FIELD_NAME_TO_KEYS[name] ?? [],
      }));
      console.warn("値が空のテンプレPDFフィールド:", emptyFieldDetails);
    }
    if (debug) {
      console.log("投入予定フィールド:", fieldValueMap);
      console.log("投入値(正規化済み):", values);
      const mappedFieldDetails = Object.entries(fieldValueMap).map(([name, value]) => ({
        name,
        value,
        keys: FIELD_NAME_TO_KEYS[name] ?? [],
      }));
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

    return pdfDoc.save();
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
