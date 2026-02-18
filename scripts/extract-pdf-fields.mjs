import { PDFDocument, PDFTextField, PDFDropdown, PDFCheckBox, PDFRadioGroup, PDFOptionList } from "pdf-lib";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

async function main() {
  // Try acro version first, fall back to standard
  let bytes;
  try {
    bytes = readFileSync(join(root, "public/pdf/otit/240819-200-1-acro.pdf"));
    console.log("Using: 240819-200-1-acro.pdf");
  } catch {
    bytes = readFileSync(join(root, "public/pdf/otit/240819-200-1.pdf"));
    console.log("Using: 240819-200-1.pdf (standard)");
  }
  const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  const pages = pdfDoc.getPages();

  const result = fields.map((field) => {
    const name = field.getName();
    const widgets = field.acroField?.getWidgets?.() ?? [];
    const widget = widgets[0];
    const page = widget?.getPage?.();
    const pageIndex = page ? pages.indexOf(page) : -1;

    let type = "unknown";
    let options = undefined;
    let maxLength = undefined;

    if (field instanceof PDFTextField) {
      type = "text";
      maxLength = field.getMaxLength();
    } else if (field instanceof PDFDropdown) {
      type = "dropdown";
      options = field.getOptions();
    } else if (field instanceof PDFCheckBox) {
      type = "checkbox";
    } else if (field instanceof PDFRadioGroup) {
      type = "radio";
      options = field.getOptions();
    } else if (field instanceof PDFOptionList) {
      type = "optionList";
      options = field.getOptions();
    }

    return { name, type, pageIndex: pageIndex + 1, maxLength, options };
  });

  // Group by page
  const byPage = {};
  result.forEach((f) => {
    if (!byPage[f.pageIndex]) byPage[f.pageIndex] = [];
    byPage[f.pageIndex].push(f);
  });

  Object.keys(byPage)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((page) => {
      console.log("\n=== Page " + page + " ===");
      byPage[page].forEach((f) => {
        const opts = f.options ? " opts=[" + f.options.join("|") + "]" : "";
        const ml = f.maxLength != null ? " maxLen=" + f.maxLength : "";
        console.log("  [" + f.type + "]" + ml + opts + " " + f.name);
      });
    });

  console.log("\nTotal fields:", result.length);

  // Output JSON for further processing
  console.log("\n\n--- JSON OUTPUT ---");
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
