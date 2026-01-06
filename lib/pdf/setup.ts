import fs from "node:fs";
import path from "node:path";
import { Font } from "@react-pdf/renderer";

export const PDF_FONT_FAMILY = "NotoSansJP";
const FONT_FILES = {
  normal: "NotoSansJP-Regular.ttf",
  bold: "NotoSansJP-Bold.ttf",
};

let registeredFontFamily = PDF_FONT_FAMILY;
let hyphenationRegistered = false;
let fontsRegistered = false;
let lastErrorMessage: string | null = null;
let initialized = false;

type RegisteredFont = { src: string; fontWeight: number };

function buildFontPaths(): { regularPath: string; boldPath: string } {
  const baseDir = path.join(process.cwd(), "public", "fonts");
  return {
    regularPath: path.join(baseDir, FONT_FILES.normal),
    boldPath: path.join(baseDir, FONT_FILES.bold),
  };
}

function loadFontPaths(): RegisteredFont[] {
  try {
    const { regularPath, boldPath } = buildFontPaths();

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
  if (typeof window !== "undefined") return;
  if (initialized) return;

  const fonts = loadFontPaths();
  if (fonts.length > 0) {
    Font.register({ family: PDF_FONT_FAMILY, fonts });
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
