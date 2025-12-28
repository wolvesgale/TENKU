# TENKU Demo (Next.js + Tailwind)

TENKUは「絆/KIZUNA」の主要機能を再現しつつ、SF風UIとAIアシスタントを備えたデモサイトです。モックデータで営業・検討用の体験を提供し、本番拡張を見据えた情報設計を採用しています。

## リポジトリ作成（GitHubが空の場合）
1. GitHubで新規リポジトリを作成（リポジトリ名: `tenku-demo`）。
2. ローカルでこのディレクトリをリポジトリに接続:
   ```bash
   git remote add origin git@github.com:<your-account>/tenku-demo.git
   git branch -M main
   git push -u origin main
   ```
3. 以降は通常のPR/CIフローで運用できます。

## デモ用ログイン情報
- tenantCode: `240224`
- email: `support@techtas.jp`
- password: `techtas720`
- 役割選択: tenantAdmin / tenantStaff / migrantUser（RBAC拡張を想定したUI）

## セットアップ
```bash
npm install
npm run dev
# http://localhost:3000 にアクセス
```

### 環境変数
`.env.example` を参照して `.env.local` を作成してください。
- `NEXT_PUBLIC_DEMO_TENANT_CODE`
- `NEXT_PUBLIC_DEMO_EMAIL`
- `NEXT_PUBLIC_DEMO_PASSWORD`

APIキーなどの秘密情報はコミットに含めず、環境変数で注入してください。

## Vercel デプロイ手順
1. GitHubの `tenku-demo` リポジトリを Vercel にインポート。
2. Framework: **Next.js**, Root Directory: `/` を選択。
3. Environment Variables に `.env.example` の値を設定（デモ用固定値）。
4. Deploy を実行。ビルド後は `https://<project>.vercel.app` で確認できます。

## 主要ルート
- `/login` : 管理団体コード + ID + PW でダミーログイン
- `/dashboard` : KPI、リマインダー、お知らせ、外部リンク
- `/companies` : 実習実施先の一覧 + 詳細 + 対応履歴UI
- `/migrants` : 入国者一覧（期限・フェーズを強調）
- `/sending-agencies` : 送出機関一覧 + 対応履歴UI
- `/documents/plan` : 計画認定書類（複製/出力ボタン）
- `/documents/procedures` : 各種手続（前月複製/出力）
- `/documents/audit` : 監査・報告・記録（差分チェック+出力）
- `/billing` : 監理費請求（新規作成/前月複製 + 内訳）
- `/csv` : インポート/エクスポートタブ、入力ルール、履歴
- `/schedule` : ガント風スケジュール表示
- `/templates/monitor` : 行政書式の更新検知（ハッシュ差分 + AI要約表示）

## 主要コンポーネント
- **Sidebar / Topbar**: 左サイドバー + 上部ヘッダの共通レイアウト。ネオン/ガラス調のHUD風UI。
- **AiWidget**: 画面右下のチャットウィジェット。`/app/api/ai/chat` でモック応答し、期限が近いタスクや不足項目を提示。OpenAI等に差し替え可能な構造。
- **Mock API & Data**: `lib/mockData.ts` に各マスター/タスク/ドキュメントのモックを集約。`/app/api/ai/chat` はこのデータを参照して応答を生成。
- **UI Primitives**: `components/ui` にKPIカード、バッジ、プログレスバーなどのHUD風パーツを配置し、Tailwindで統一。

## デザインガイド
- ダーク + ネオン（シアン/グリーン） + グローをベースにHUD調のカードを採用。
- 期限、状態、リスク、進捗が一目で分かるテーブル/カード構成。

## セキュリティと本番拡張
- デモ用固定値は環境変数で管理し、機密情報は含めていません。
- 入力値はクライアントでのみ扱い、HTMLの危険な埋め込みは行っていません。
- 本番移行時はRBAC実装、IDプロバイダ連携、実データAPIを差し替えれば拡張できます。
