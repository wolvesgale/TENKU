import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Font } from "@react-pdf/renderer";

const DEFAULT_FONT_FAMILY = "NotoSansJP";
const FONT_PACKAGE = "@openfonts/noto-sans-jp_japanese";
let registeredFontFamily = DEFAULT_FONT_FAMILY;
let hyphenationRegistered = false;
let fontsRegistered = false;

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
    const dir = path.join(root, "node_modules", FONT_PACKAGE, "files");
    searched.push(dir);
    if (fs.existsSync(dir)) {
      return { dir, searched };
    }
  }
  return { dir: null, searched };
}

function resolveNotoSansFonts(): RegisteredFont[] {
  try {
    let filesDir: string | null = null;
    const checkedPaths: string[] = [];

    try {
      // Use runtime require to avoid bundler path remapping
      const nodeRequire = eval("require") as NodeRequire;
      const pkgJsonPath = nodeRequire.resolve(`${FONT_PACKAGE}/package.json`);
      filesDir = path.join(path.dirname(pkgJsonPath), "files");
      checkedPaths.push(filesDir);
    } catch (error) {
      console.warn("[pdf] Failed to resolve Noto Sans JP package via require", error);
    }

    if (!filesDir || !fs.existsSync(filesDir)) {
      const searchResult = findFontFilesDir();
      filesDir = filesDir ?? searchResult.dir;
      checkedPaths.push(...searchResult.searched);
    }

    if (!filesDir || !fs.existsSync(filesDir)) {
      console.warn(`[pdf] Noto Sans JP font directory could not be located. searched: ${checkedPaths.join(", ")}`);
      return [];
    }

    const files = fs.readdirSync(filesDir, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => entry.name);

    const pickFont = (weight: 400 | 700) => {
      const filename = files.find((file) => new RegExp(`-${weight}(?:-.*)?\\.woff$`, "i").test(file));
      if (!filename) return null;
      return { src: path.join(filesDir, filename), fontWeight: weight };
    };

    return [pickFont(400), pickFont(700)].filter(Boolean) as RegisteredFont[];
  } catch (error) {
    console.warn("[pdf] Failed to resolve Noto Sans JP fonts from npm package", error);
    return [];
  }
}

export function getPdfFontFamily() {
  ensurePdfSetup();
  return registeredFontFamily;
}

export function ensurePdfSetup() {
  const fonts = resolveNotoSansFonts();
  if (fonts.length > 0) {
    if (!fontsRegistered || registeredFontFamily !== DEFAULT_FONT_FAMILY) {
      Font.register({ family: DEFAULT_FONT_FAMILY, fonts });
      registeredFontFamily = DEFAULT_FONT_FAMILY;
      fontsRegistered = true;
    }
  } else {
    // Graceful fallback to avoid breaking preview generation
    registeredFontFamily = "Helvetica";
    fontsRegistered = false;
    console.warn("[pdf] Falling back to built-in Helvetica because Noto Sans JP fonts were not found");
  }

  if (!hyphenationRegistered) {
    // ハイフネーションを無効化して日本語表示を安定化
    Font.registerHyphenationCallback((word) => [word]);
    hyphenationRegistered = true;
  }
}
