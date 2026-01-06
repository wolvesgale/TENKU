import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Font } from "@react-pdf/renderer";

export const PDF_FONT_FAMILY = "NotoSansJP";
const FONT_FILES = {
  normal: "NotoSansJP-Regular.otf",
  bold: "NotoSansJP-Bold.otf",
};

let registeredFontFamily = PDF_FONT_FAMILY;
let hyphenationRegistered = false;
let fontsRegistered = false;
let lastErrorMessage: string | null = null;

type RegisteredFont = { src: string; fontWeight: number };

function findFontFilesDir(): { dir: string | null; searched: string[] } {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const searchRoots = new Set<string>([process.cwd(), moduleDir]);

  let currentDir = moduleDir;
  for (let i = 0; i < 5; i += 1) {
    currentDir = path.dirname(currentDir);
    searchRoots.add(currentDir);
  }

  const searched: string[] = [];
  for (const root of searchRoots) {
    const dir = path.join(root, "public", "fonts");
    searched.push(dir);
    if (fs.existsSync(dir)) {
      return { dir, searched };
    }
  }
  return { dir: null, searched };
}

function resolveNotoSansFonts(): RegisteredFont[] {
  try {
    const searchResult = findFontFilesDir();
    const filesDir = searchResult.dir;
    const checkedPaths = searchResult.searched;

    if (!filesDir || !fs.existsSync(filesDir)) {
      const message = `[pdf] Noto Sans JP font directory could not be located. searched: ${checkedPaths.join(", ")}`;
      console.warn(message);
      lastErrorMessage = message;
      return [];
    }

    const regularPath = path.join(filesDir, FONT_FILES.normal);
    const boldPath = path.join(filesDir, FONT_FILES.bold);

    if (!fs.existsSync(regularPath) || !fs.existsSync(boldPath)) {
      const message = `[pdf] Noto Sans JP font files missing. checked: ${regularPath}, ${boldPath}`;
      console.warn(message);
      lastErrorMessage = message;
      return [];
    }

    return [
      { src: regularPath, fontWeight: 400 },
      { src: boldPath, fontWeight: 700 },
    ];
  } catch (error) {
    const message = `[pdf] Failed to resolve Noto Sans JP fonts: ${String(error)}`;
    console.warn(message);
    lastErrorMessage = message;
    return [];
  }
}

export function getPdfFontFamily() {
  ensurePdfSetup();
  return registeredFontFamily;
}

export function getPdfFontStatus() {
  return { fontFamily: registeredFontFamily, ok: fontsRegistered, message: lastErrorMessage };
}

export function ensurePdfSetup() {
  const fonts = resolveNotoSansFonts();
  if (fonts.length > 0) {
    if (!fontsRegistered || registeredFontFamily !== PDF_FONT_FAMILY) {
      Font.register({ family: PDF_FONT_FAMILY, fonts });
      registeredFontFamily = PDF_FONT_FAMILY;
      fontsRegistered = true;
      lastErrorMessage = null;
    }
  } else {
    // Graceful fallback to avoid breaking preview generation
    registeredFontFamily = "Helvetica";
    fontsRegistered = false;
    if (!lastErrorMessage) {
      lastErrorMessage = "[pdf] Falling back to built-in Helvetica because Noto Sans JP fonts were not found";
    }
    console.warn(lastErrorMessage);
  }

  if (!hyphenationRegistered) {
    // ハイフネーションを無効化して日本語表示を安定化
    Font.registerHyphenationCallback((word) => [word]);
    hyphenationRegistered = true;
  }
}
