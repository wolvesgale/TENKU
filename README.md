# TENKU Demo (Next.js + Tailwind)

TENKUは監理・申請・請求を一元化する未来志向のデモSaaSです。モダンUIとAIアシスタントで運用負荷を下げる体験を示します（データはすべてモック）。

## リポジトリ作成（GitHubが空の場合）
1. GitHubで新規リポジトリを作成（リポジトリ名: `tenku-demo`）。
2. ローカルでこのディレクトリをリポジトリに接続:
   ```bash
   git remote add origin git@github.com:<your-account>/tenku-demo.git
   git branch -M main
   git push -u origin main
   ```
3. 以降は通常のPR/CIフローで運用できます。

## デモ用ログイン情報（架空の値）
- tenantCode: `T-739102`
- email: `demo@tenku.cloud`
- password: `tenku-demo42`
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
- `/dashboard` : KPI、期限接近、最近更新、リスク高の4ブロック
- `/companies` : 実習実施先のテーブル + 右サマリー
- `/migrants` : 入国者テーブル（VISA期限・フェーズ・リスク）
- `/sending-agencies` : 送出機関テーブル
- `/documents/plan` : 計画認定（カードグリッド + テンプレ表示）
- `/documents/procedures` : 各種手続（複製/出力 + テンプレ）
- `/documents/audit` : 監査（差分チェック + 安全項目サマリ）
- `/billing` : 監理費請求（内訳 + 複製 UI）
- `/csv` : D&Dインポート、エクスポート、履歴
- `/schedule` : タイムライン表示
- `/templates/monitor` : 書式変更検知（差分 + AI要約）

## 主要コンポーネント
- **Sidebar / Topbar**: 折りたたみ式サイドバーとグローバルトップバー。
- **AiWidget**: 画面右下のチャットウィジェット。`/app/api/ai/chat` でモック応答。
- **Mock API & Data**: `lib/mockData.ts` に各マスター/タスク/ドキュメントのモックを集約。`/app/api/ai/chat` はこのデータを参照して応答を生成。
- **UI Primitives**: `components/ui` にカード、バッジ、プログレスバーなどのパーツを配置し、Tailwindのカラートークンで統一。

## デザインガイド
- ダーク基調にブランドカラー（blue/teal/violet/amber）をアクセントとして控えめに使用。
- 期限、状態、リスク、進捗が一目で分かるテーブル/カード構成。

## セキュリティと本番拡張
- デモ用固定値は環境変数で管理し、機密情報は含めていません。
- 入力値はクライアントでのみ扱い、HTMLの危険な埋め込みは行っていません。
- 本番移行時はRBAC実装、IDプロバイダ連携、実データAPIを差し替えれば拡張できます。
