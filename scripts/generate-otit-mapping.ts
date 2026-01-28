const fs = require("fs").promises;
const path = require("path");

const CSV_PATH = path.join(process.cwd(), "data", "pdf", "otit", "240819-200-1-mapping.csv");
const JSON_PATH = path.join(process.cwd(), "data", "pdf", "otit", "240819-200-1-mapping.json");

type MappingEntry = {
  fields?: string[];
  split?: "name_ja" | "date_ymd" | "postal" | "tel" | "chars";
  splitFields?: string[];
  normalize?: "postal" | "address" | "gender" | "permitType" | "kana";
  maxLength?: number;
  skip?: boolean;
};

type MappingData = Record<string, MappingEntry>;

const parseCsv = (content: string) => {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }
    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(current);
      if (row.some((cell) => cell.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      current = "";
      continue;
    }
    current += char;
  }
  if (current.length || row.length) {
    row.push(current);
    if (row.some((cell) => cell.trim() !== "")) {
      rows.push(row);
    }
  }
  return rows;
};

const toList = (value?: string) => {
  if (!value) return [];
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
};

const main = async () => {
  const csv = await fs.readFile(CSV_PATH, "utf-8");
  const rows = parseCsv(csv);
  if (rows.length === 0) {
    throw new Error("CSVが空です");
  }
  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((value) => value.trim());
  const get = (row: string[], name: string) => {
    const index = headers.indexOf(name);
    return index >= 0 ? row[index]?.trim() ?? "" : "";
  };

  const mapping: MappingData = {};
  dataRows.forEach((row) => {
    const baseKey = get(row, "baseKey");
    if (!baseKey) return;
    const fields = toList(get(row, "pdfFieldName"));
    const split = get(row, "split") as MappingEntry["split"];
    const splitFields = toList(get(row, "splitFields"));
    const normalize = get(row, "normalize") as MappingEntry["normalize"];
    const maxLengthRaw = get(row, "maxLength");
    const skipRaw = get(row, "skip");

    const entry: MappingEntry = {};
    if (fields.length) entry.fields = fields;
    if (split) entry.split = split;
    if (splitFields.length) entry.splitFields = splitFields;
    if (normalize) entry.normalize = normalize;
    if (maxLengthRaw) {
      const parsed = Number(maxLengthRaw);
      if (!Number.isNaN(parsed) && parsed > 0) {
        entry.maxLength = parsed;
      }
    }
    if (skipRaw) {
      entry.skip = ["true", "1", "yes"].includes(skipRaw.toLowerCase());
    }

    mapping[baseKey] = entry;
  });

  await fs.writeFile(JSON_PATH, JSON.stringify(mapping, null, 2) + "\n", "utf-8");
  console.log(`Wrote ${Object.keys(mapping).length} mappings to ${JSON_PATH}`);
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
