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
| `DATABASE_URL` | PostgreSQL 接続文字列（Prisma 用）。デモでは未接続でもビルド可 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob のトークン（求人票 PDF 出力用） |
| `OPENAI_API_KEY` | （任意）AI 差し替え用。/api/ai/chat を改修して利用 |

## Vercel デプロイ手順
1. GitHub でリポジトリを作成（推奨名: `tenku-demo`）し、このコードを push。
2. Vercel で「New Project」→ GitHub リポジトリを選択。
3. Framework: **Next.js**, Root: `/`（追加の build コマンド不要）。
4. Environment Variables に `.env.example` の値を入力（秘密情報は本番値に差し替え）。
5. Deploy → ブラウザで動作確認。モック API のため DB 接続は不要です。

## 主要ページ / ルート
- `/login` : 管理団体コード + ID + PW でダミーログイン（固定値で成功）。将来 RBAC 用のユーザー種別トグル付き。
- `/dashboard` : KPI / リマインダー / お知らせ・外部リンク / 書類進捗 HUD。
- `/companies` : 実習実施先一覧 + 詳細/メモ欄。
- `/persons` : 人材（在留カード/パスポート期限）一覧と詳細。
- `/cases` : 案件一覧。タスク自動生成の対象。
- `/applications` : 申請一覧。案件紐付けのあるモック申請を表示。
- `/training-plans` : 実習計画一覧。
- `/tasks` : 案件・在留関連タスクの一覧。
- `/billing` : 監理費請求 UI（新規作成・前月複製、内訳モック）。
- `/templates/pdf` : PDF テンプレプレビューと出力。
- `/residence-center` : 在留期限アラートと案件リンクの簡易ハブ。
- `/api/v1/*` : companies / persons / cases / tasks などのデモ API。
- `/api/ai/chat` : ルールベースの AI 応答（期限や不足項目を返す）。

## デモ用ログイン情報
- 管理団体コード: `240224`
- ID: `support@techtas.jp`
- パスワード: `techtas720`

## デモデータ
- `/lib/demo-store.ts` : テナント・企業・人材・案件・タスク・アラートなどのデモ用ストア。`/api/v1/*` が参照。
- `/lib/demo-dashboard-data.ts` : ダッシュボードの KPI / 書類サマリー / 外部リンクの静的データ。

## 重要コンポーネント
- `components/layout/sidebar.tsx` : SF/HUD テーマのサイドナビ。
- `components/layout/topbar.tsx` : テナント・ユーザー種別表示、通知プレースホルダー。
- `components/ui/ai-widget.tsx` : 右下のチャットウィジェット。/api/ai/chat へ POST し、OpenAI 等に差し替え可能。
- `app/api/v1/*` : デモストアを元にしたシンプルな JSON API。

## セキュリティと注意点
- 機密情報は `.env` に置き、リポジトリに含めないでください（本デモは固定値で動作）。
- XSS になり得る HTML を埋め込まない UI 設計にしています。
- すべてのデータはモックであり、実運用時は API / DB へ差し替えてください。
