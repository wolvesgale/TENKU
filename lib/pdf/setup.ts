import { Font } from "@react-pdf/renderer";

let initialized = false;

export function ensurePdfSetup() {
  if (initialized) return;

  Font.register({ family: "NotoSansJP", src: "/fonts/NotoSansJP-Regular.ttf" });
  Font.register({ family: "NotoSansJP", src: "/fonts/NotoSansJP-Bold.ttf", fontWeight: 700 });

  // ハイフネーションを無効化して日本語表示を安定化
  Font.registerHyphenationCallback((word) => [word]);

  initialized = true;
}
