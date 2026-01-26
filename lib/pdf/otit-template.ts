import { promises as fs } from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import type { Company, DemoOrganizationProfile, Person, TrainingPlan } from "@/lib/demo-store";

const LOCAL_TEMPLATE_PATH = path.join(process.cwd(), "240819-200-1.pdf");
const TEMPLATE_REMOTE_URL = "https://raw.githubusercontent.com/wolvesgale/TENKU/main/240819-200-1.pdf";
const FONT_URL = "https://github.com/googlefonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansJP-Regular.otf";
const CACHE_ROOT = path.join(process.cwd(), ".cache");
const FONT_PATH = path.join(CACHE_ROOT, "fonts", "NotoSansJP-Regular.otf");
const FIELD_MAP_PATH = path.join(process.cwd(), "data", "pdf", "otit", "240819-200-1.fields.json");

type FieldMapEntry = {
  key: string;
  page: number;
  x: number;
  y: number;
  fontSize: number;
};

const ensureCachedFont = async (url: string, targetPath: string) => {
  try {
    await fs.access(targetPath);
    return;
  } catch {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    await fs.writeFile(targetPath, Buffer.from(arrayBuffer));
  }
};

const getTemplateBytes = async (): Promise<Buffer> => {
  try {
    return await fs.readFile(LOCAL_TEMPLATE_PATH);
  } catch {
    // fallback to remote
  }
  const res = await fetch(TEMPLATE_REMOTE_URL);
  if (!res.ok) {
    throw new Error(`テンプレPDFの取得に失敗しました: ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const loadFieldMap = async (): Promise<FieldMapEntry[]> => {
  const raw = await fs.readFile(FIELD_MAP_PATH, "utf-8");
  return JSON.parse(raw) as FieldMapEntry[];
};

const formatDate = (value?: string) => {
  if (!value) return "";
  return value.slice(0, 10);
};

const calculateAge = (birthdate?: string) => {
  if (!birthdate) return "";
  const birth = new Date(birthdate);
  if (Number.isNaN(birth.getTime())) return "";
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)).toString();
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
  const baseValues: Record<string, string> = {
    "org.permitNumber": organization.permitNumber ?? "",
    "org.permitType": organization.permitType ?? "",
    "org.name": organization.name ?? "",
    "org.address": organization.address ?? "",
    "org.phone": organization.phone ?? "",
    "org.representativeName": organization.representativeName ?? "",
    "org.supervisorResponsibleName": organization.supervisorResponsibleName ?? "",
    "org.supervisingOfficeName": organization.supervisingOfficeName ?? "",
    "org.supervisingOfficeAddress": organization.supervisingOfficeAddress ?? "",
    "org.supervisingOfficePhone": organization.supervisingOfficePhone ?? "",
    "org.planInstructorName": organization.planInstructorName ?? "",
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
    "company.traineeResponsibleRole": company?.traineeResponsibleRole ?? "",
    "company.traineeInstructorName": company?.traineeInstructorName ?? "",
    "company.traineeInstructorRole": company?.traineeInstructorRole ?? "",
    "company.lifeInstructorName": company?.lifeInstructorName ?? "",
    "company.lifeInstructorRole": company?.lifeInstructorRole ?? "",

    "person.nameRomaji": person?.nameRomaji ?? person?.nameRoma ?? "",
    "person.nameKanji": person?.nameKanji ?? "",
    "person.nationality": person?.nationality ?? "",
    "person.birthdate": formatDate(person?.birthdate ?? person?.birthDate),
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

export async function generateTrainingPlanPdf({
  organization,
  company,
  person,
  trainingPlan,
}: {
  organization: DemoOrganizationProfile;
  company?: Company;
  person?: Person;
  trainingPlan: TrainingPlan;
}) {
  const templateBytes = await getTemplateBytes();

  await ensureCachedFont(FONT_URL, FONT_PATH);
  const [fontBytes, fieldMap] = await Promise.all([fs.readFile(FONT_PATH), loadFieldMap()]);

  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes, { subset: true });

  const values = buildFieldValues({ organization, company, person, trainingPlan });

  fieldMap.forEach((entry) => {
    const value = values[entry.key];
    if (!value) return;
    const pageIndex = Math.max(entry.page - 1, 0);
    const page = pdfDoc.getPage(pageIndex);
    page.drawText(value, {
      x: entry.x,
      y: entry.y,
      size: entry.fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  });

  return pdfDoc.save();
}
