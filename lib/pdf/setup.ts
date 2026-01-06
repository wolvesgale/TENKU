import fs from "node:fs";
import path from "node:path";
import { Font } from "@react-pdf/renderer";

export const PDF_FONT_FAMILY = "NotoSansJP";
const FONT_FILES = {
  normal: "NotoSansJP-Regular.ttf",
  bold: "NotoSansJP-Bold.ttf",
};

const FONT_DIR = path.join(process.cwd(), "public", "fonts");

let registeredFontFamily = PDF_FONT_FAMILY;
let hyphenationRegistered = false;
let fontsRegistered = false;
let lastErrorMessage: string | null = null;
let initialized = false;

type RegisteredFont = { src: Buffer | Uint8Array; fontWeight: number };

function loadFontBuffers(): RegisteredFont[] {
  try {
    const checkedPaths = [FONT_DIR];
    const regularPath = path.join(FONT_DIR, FONT_FILES.normal);
    const boldPath = path.join(FONT_DIR, FONT_FILES.bold);

    if (!fs.existsSync(regularPath) || !fs.existsSync(boldPath)) {
      const message = `[pdf] Noto Sans JP font files missing. checked: ${regularPath}, ${boldPath}`;
      console.warn(message);
      lastErrorMessage = message;
      return [];
    }

    const regular = fs.readFileSync(regularPath);
    const bold = fs.readFileSync(boldPath);

    if (!regular || !bold) {
      const message = `[pdf] Failed to read font files. checked: ${checkedPaths.join(", ")}`;
      console.warn(message);
      lastErrorMessage = message;
      return [];
    }

    return [
      { src: regular, fontWeight: 400 },
      { src: bold, fontWeight: 700 },
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
  if (initialized) return;

  const fonts = loadFontBuffers();
  if (fonts.length > 0) {
    Font.register({
      family: PDF_FONT_FAMILY,
      fonts: fonts.map((font) => ({ ...font, format: "truetype" })) as any,
    });
    registeredFontFamily = PDF_FONT_FAMILY;
    fontsRegistered = true;
    lastErrorMessage = null;
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

  initialized = true;
}
