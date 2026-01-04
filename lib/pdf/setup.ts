import { Font } from "@react-pdf/renderer";

let initialized = false;

export function ensurePdfSetup() {
  if (initialized) return;

  // 日本語フォント登録（必要に応じて有効化）
  // Font.register({ family: "NotoSansJP", src: "/fonts/NotoSansJP-Regular.ttf" });

  // ハイフネーションを無効化して日本語表示を安定化
  Font.registerHyphenationCallback((word) => [word]);

  initialized = true;
}
