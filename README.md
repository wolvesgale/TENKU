# TENKU Demo (Vercel-ready)

SF/HUD テーマの TENKU デモサイトです。Next.js (App Router) + TypeScript + Tailwind で構築し、モックデータとモック API で主要機能を体験できるようにしています。

## セットアップ
```bash
npm install
npm run dev
```

### 環境変数
`.env.example` を `.env.local` にコピーして必要に応じて上書きしてください。

| key | 説明 |
| --- | --- |
| `NEXT_PUBLIC_TENKU_TENANT_CODE` | デモ用管理団体コード (初期値: `240224`) |
| `NEXT_PUBLIC_TENKU_DEMO_EMAIL` | デモ用メール ID |
| `NEXT_PUBLIC_TENKU_DEMO_PASSWORD` | デモ用パスワード |
| `POSTGRES_PRISMA_URL` | Neon のプール付き接続文字列（Prisma/アプリ用） |
| `DATABASE_URL_UNPOOLED` | Neon の非プール接続文字列（migrate 用） |
| `NEXTAUTH_URL` | 本番のサイト URL (例: https://tenku-demo.vercel.app) |
| `NEXTAUTH_SECRET` | NextAuth 用の十分強いシークレット |
| `SEED_SECRET` | `/api/dev/seed` を叩くときの共有シークレット（本番では動作しない） |
| `SEED_DEMO_EMAIL` / `SEED_DEMO_PASSWORD` | シードされる資格情報の上書き（任意） |
| `OPENAI_API_KEY` | （任意）AI 差し替え用。/api/ai/chat を改修して利用 |

## Vercel デプロイ手順
1. GitHub でリポジトリを作成（推奨名: `tenku-demo`）し、このコードを push。
2. Vercel で「New Project」→ GitHub リポジトリを選択。
3. Framework: **Next.js**, Root: `/`。Build コマンドに `npm run vercel-build` を指定（Prisma generate + migrate deploy + next build を一括実行）。
4. Environment Variables に上記値を設定（Neon は `POSTGRES_PRISMA_URL` と `DATABASE_URL_UNPOOLED` を利用。非プール URL の代わりに `POSTGRES_URL_NON_POOLING` を使う場合は schema を合わせてください）。
5. Deploy → ブラウザで動作確認。

### Neon 接続 & マイグレーション
- ローカル / CI で以下を実行し、Neon への接続を確認します（`DATABASE_URL_UNPOOLED` を利用）。
  ```bash
  npx prisma migrate deploy
  ```
- Postinstall と Vercel の build で `prisma generate` が自動実行されます。

### Seed の投入（最短・安全な導線）
- オンデマンド seed: `/api/dev/seed` に `POST`。ヘッダー `Authorization: Bearer <SEED_SECRET>` もしくは JSON ボディ `{ "secret": "<SEED_SECRET>" }` で実行できます。`VERCEL_ENV=production` では 403 を返し無効化されます。
- ローカルから直接 seed: `npm run prisma:seed`（Neon の環境変数を `.env.local` に設定してから実行）。
- デフォルトの資格情報: email=`support@techtas.jp`, password=`techtas720`（`.env.example` と seed の初期値で一致）。

## 主要ページ / ルート
- `/login` : 管理団体コード + ID + PW でダミーログイン（固定値で成功）。将来 RBAC 用のユーザー種別トグル付き。
- `/dashboard` : KPI / リマインダー / お知らせ・外部リンク / 書類進捗 HUD。
- `/companies` : 実習実施先一覧 + 詳細/メモ欄。
- `/migrants` : 入国者一覧 + フェーズフィルタ + 詳細/メモ欄。
- `/sending-agencies` : 送出機関一覧 + 詳細/メモ欄。
- `/documents/plan` : 計画認定書類一覧、複製/出力ボタン、期限連動表示。
- `/documents/procedures` : 各種手続書類一覧、前月複製/出力、スケジュール連動。
- `/documents/audit` : 監査・報告・記録の一覧、複製/出力、期限連動。
- `/billing` : 監理費請求 UI（新規作成・前月複製、内訳モック）。
- `/csv` : インポート/エクスポートタブ、入力ルール、インポート履歴。ファイル選択でプレビュー。
- `/schedule` : ガント風のスケジュール表示 + アラートバッジ。
- `/templates/monitor` : 行政書式の監視リスト、差分チェック（モック）、AI 要約/更新案の枠。
- `/api/mock/*` : モックデータ API（companies, sending-agencies, migrants, tasks, documents, templates, schedule）。
- `/api/ai/chat` : ルールベースの AI 応答（期限や不足項目を返す）。
- `/api/dev/seed` : `SEED_SECRET` 一致時のみ seed 実行（production では無効）。

## デモ用ログイン情報
- 管理団体コード: `240224`
- ID: `support@techtas.jp`
- パスワード: `techtas720`

## モックデータ
`/lib/mockData.ts` に以下を 5 件以上ずつ収録。
- companies / sendingAgencies / migrants（進捗・リスク・期限）
- tasks（期限・重要度・関連エンティティ）
- documents（type/status/lastUpdated/completion）
- templateMonitors（監視対象 URL, 差分有無, AI 要約）

## 重要コンポーネント
- `components/layout/sidebar.tsx` : SF/HUD テーマのサイドナビ。
- `components/layout/topbar.tsx` : テナント・ユーザー種別表示、通知プレースホルダー。
- `components/ui/ai-widget.tsx` : 右下のチャットウィジェット。/api/ai/chat へ POST し、OpenAI 等に差し替え可能。
- `app/api/mock/[resource]/route.ts` : モックデータの API ルーター。

## セキュリティと注意点
- 機密情報は `.env` に置き、リポジトリに含めないでください（NEXTAUTH_SECRET / DB URL / SEED_SECRET 等）。
- XSS になり得る HTML を埋め込まない UI 設計にしています。
- すべてのデータはモックであり、実運用時は API / DB へ差し替えてください。
- NextAuth は `NEXTAUTH_URL` + `NEXTAUTH_SECRET` 前提で稼働し、Neon の Prisma datasource (pool/non-pool) を参照します。
