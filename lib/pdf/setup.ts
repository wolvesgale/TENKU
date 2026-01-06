import { Font } from "@react-pdf/renderer";
import path from "path";

let initialized = false;

export function ensurePdfSetup() {
  if (initialized) return;

  const regularSrc = path.resolve(process.cwd(), "public/fonts/NotoSansJP-Regular.ttf");
  const boldSrc = path.resolve(process.cwd(), "public/fonts/NotoSansJP-Bold.ttf");

  Font.register({ family: "NotoSansJP", src: regularSrc });
  Font.register({ family: "NotoSansJP", src: boldSrc, fontWeight: 700 });

  // ハイフネーションを無効化して日本語表示を安定化
  Font.registerHyphenationCallback((word) => [word]);

  initialized = true;
}
