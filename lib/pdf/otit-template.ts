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
const TEMPLATE_REMOTE_URL =
  "https://raw.githubusercontent.com/wolvesgale/TENKU/main/public/pdf/otit/240819-200-1.pdf";
const FONT_URL = "https://github.com/googlefonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansJP-Regular.otf";
const CACHE_ROOT = path.join(process.cwd(), ".cache");
const FONT_PATH = path.join(CACHE_ROOT, "fonts", "NotoSansJP-Regular.otf");

const FIELD_NAME_MAP: Record<string, string[]> = {
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
  "company.traineeResponsibleRole": ["Top[0].Page2[0].txtSEKININSHA_YAKUSHOKU[0]"],
  "company.traineeInstructorRole": ["Top[0].Page3[0].txtJISSHUSHIDOIN_YAKUSHOKU[0]"],
  "company.lifeInstructorRole": ["Top[0].Page3[0].txtSEIKATSUSHIDOIN_YAKUSHOKU[0]"],

  "person.nameRomaji": ["Top[0].Page3[0].txtJISSHUSEI_ROMAJI[0]"],
  "person.nameKanji": ["Top[0].Page3[0].txtJISSHUSEI_KANJI[0]"],
  "person.nationality": ["Top[0].Page3[0].cmbJISSHUSEI_KOKUSEKI[0]"],
  "person.age": ["Top[0].Page3[0].txtNENREI[0]"],

  "training.jobCode": ["Top[0].Page3[0].cmbSHOKUSHUSAGYO_1[0]"],
  "training.jobName": ["Top[0].Page3[0].txtSHOKUSHUSAGYO_1_SHOKUSHU[0]"],
  "training.workName": ["Top[0].Page3[0].txtSHOKUSHUSAGYO_1_SAGYO[0]"],

  "org.permitNumber": ["Top[0].Page4[0].txtKANRI_KYOKABANGO[0]"],
  "org.name": ["Top[0].Page4[0].txtKANRI_MEISHO[0]"],
  "org.address": ["Top[0].Page4[0].txtKANRI_TATEMONO[0]"],
  "org.phone": ["Top[0].Page4[0].txtKANRI_DENWA[0]"],
  "org.supervisingOfficeName": ["Top[0].Page4[0].txtTANTOJIGYOSHO[0]"],
  "org.supervisingOfficeAddress": ["Top[0].Page4[0].txtTANTOJIGYOSHO_TATEMONO[0]"],
  "org.supervisingOfficePhone": ["Top[0].Page4[0].txtTANTOJIGYOSHO_DENWA[0]"],
  "org.sendingOrgName": ["Top[0].Page4[0].cmbOKURIDASHIKIKAN[0]"],
  "org.sendingOrgNumber": ["Top[0].Page4[0].txtOKURIDASHIKIKANBANGO_BANGO[0]"],
  "org.sendingOrgRefNumber": ["Top[0].Page4[0].txtOKURIDASHIKIKANBANGO_KUNI[0]"],
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
  } catch (error) {
    console.warn("テンプレPDFのローカル読み込みに失敗しました。リモート取得にフォールバックします。", error);
  }
  const res = await fetch(TEMPLATE_REMOTE_URL);
  if (!res.ok) {
    throw new Error(`テンプレPDFの取得に失敗しました: ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
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

const splitName = (value?: string) => {
  if (!value) return { family: "", given: "" };
  const [family, given] = value.split(/\s+/, 2);
  return { family: family ?? "", given: given ?? "" };
};

const splitDateParts = (value?: string) => {
  const date = formatDate(value);
  if (!date) return { year: "", month: "", day: "" };
  const [year, month, day] = date.split("-");
  return { year: year ?? "", month: month ?? "", day: day ?? "" };
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

const logTemplateFieldNames = (fieldNames: string[]) => {
  console.info("OTITテンプレPDFのフィールド一覧:", fieldNames);
};

const setFieldValue = (form: ReturnType<PDFDocument["getForm"]>, name: string, value: string) => {
  try {
    const field = form.getField(name);
    if (field instanceof PDFTextField) {
      field.setText(value);
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
  try {
    const templateBytes = await getTemplateBytes();

    await ensureCachedFont(FONT_URL, FONT_PATH);
    const fontBytes = await fs.readFile(FONT_PATH);

    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit);
    const font = await pdfDoc.embedFont(fontBytes, { subset: true });

    const form = pdfDoc.getForm();
    const fieldNames = form.getFields().map((field) => field.getName());
    logTemplateFieldNames(fieldNames);

    const values = buildFieldValues({ organization, company, person, trainingPlan });
    const representativeKana = splitName(values["company.representativeKana"]);
    const representativeName = splitName(values["company.representativeName"]);
    const traineeResponsibleName = splitName(values["company.traineeResponsibleName"]);
    const traineeInstructorName = splitName(values["company.traineeInstructorName"]);
    const lifeInstructorName = splitName(values["company.lifeInstructorName"]);
    const orgRepresentativeName = splitName(values["org.representativeName"]);
    const supervisorResponsibleName = splitName(values["org.supervisorResponsibleName"]);
    const planInstructorName = splitName(values["org.planInstructorName"]);
    const birthdateParts = splitDateParts(values["person.birthdate"]);

    const fieldValueMap: Record<string, string> = {
      ...Object.fromEntries(
        Object.entries(FIELD_NAME_MAP).flatMap(([key, fieldNamesList]) => {
          const value = values[key];
          if (!value) return [];
          return fieldNamesList.map((fieldName) => [fieldName, value]);
        })
      ),
      "Top[0].Page2[0].txtDAIHYO_KANA_SEI[0]": representativeKana.family,
      "Top[0].Page2[0].txtDAIHYO_KANA_MEI[0]": representativeKana.given,
      "Top[0].Page2[0].txtDAIHYO_SHIMEI_SEI[0]": representativeName.family,
      "Top[0].Page2[0].txtDAIHYO_SHIMEI_MEI[0]": representativeName.given,
      "Top[0].Page2[0].txtSEKININSHA_SEI[0]": traineeResponsibleName.family,
      "Top[0].Page2[0].txtSEKININSHA_MEI[0]": traineeResponsibleName.given,
      "Top[0].Page3[0].txtJISSHUSHIDOIN_SEI[0]": traineeInstructorName.family,
      "Top[0].Page3[0].txtJISSHUSHIDOIN_MEI[0]": traineeInstructorName.given,
      "Top[0].Page3[0].txtSEIKATSUSHIDOIN_SEI[0]": lifeInstructorName.family,
      "Top[0].Page3[0].txtSEIKATSUSHIDOIN_MEI[0]": lifeInstructorName.given,
      "Top[0].Page4[0].txtKANRI_DAIHYO_SEI[0]": orgRepresentativeName.family,
      "Top[0].Page4[0].txtKANRI_DAIHYO_MEI[0]": orgRepresentativeName.given,
      "Top[0].Page4[0].txtKANRI_SEKININ_SEI[0]": supervisorResponsibleName.family,
      "Top[0].Page4[0].txtKANRI_SEKININ_MEI[0]": supervisorResponsibleName.given,
      "Top[0].Page4[0].txtKEIKAKUSHIDOTANTO_SEI[0]": planInstructorName.family,
      "Top[0].Page4[0].txtKEIKAKUSHIDOTANTO_MEI[0]": planInstructorName.given,
      "Top[0].Page3[0].txtSEINENGAPPI_NEN[0]": birthdateParts.year,
      "Top[0].Page3[0].cmbSEINENGAPPI_TSUKI[0]": birthdateParts.month,
      "Top[0].Page3[0].cmbSEINENGAPPI_HI[0]": birthdateParts.day,
    };

    Object.entries(fieldValueMap).forEach(([name, value]) => {
      if (!value) return;
      if (!fieldNames.includes(name)) {
        console.warn(`テンプレPDFにフィールドが見つかりません: ${name}`);
        return;
      }
      setFieldValue(form, name, value);
    });

    form.updateFieldAppearances(font);
    form.flatten();

    return pdfDoc.save();
  } catch (error) {
    console.error("OTITテンプレPDF生成中にエラーが発生しました。", error);
    throw error;
  }
}
