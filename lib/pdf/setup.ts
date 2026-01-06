import { Font } from "@react-pdf/renderer";

let initialized = false;

export function ensurePdfSetup() {
  if (initialized) return;

  const regularSrc = new URL("../../public/fonts/NotoSansJP-Regular.ttf", import.meta.url).toString();
  const boldSrc = new URL("../../public/fonts/NotoSansJP-Bold.ttf", import.meta.url).toString();

  Font.register({ family: "NotoSansJP", src: regularSrc });
  Font.register({ family: "NotoSansJP", src: boldSrc, fontWeight: 700 });

  // ハイフネーションを無効化して日本語表示を安定化
  Font.registerHyphenationCallback((word) => [word]);

  initialized = true;
}
