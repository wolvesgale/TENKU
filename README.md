# TENKU AI Agent Demo

Next.js (App Router) + TypeScript + Tailwind + shadcn-style UI + Prisma(Postgres) で TENKU AI Agent のMVPをデプロイ可能な形で構築しています。マルチテナント前提で tenant_id を保持し、制度スイッチ（ALL/TITP/SSW/TA）でUI呼称を切り替えます。

## セットアップ
```bash
npm install
# DB を作成 (例: postgres://postgres:postgres@localhost:5432/tenku_demo)
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## 環境変数
`.env` を作成して以下を設定:
- `DATABASE_URL` Postgres接続文字列
- `NEXTAUTH_URL` (例: http://localhost:3000)
- `AUTH_SECRET` NextAuth用の秘密鍵
- `TENKU_DEMO_EMAIL` デモユーザーのメール (seedと合わせる)
- `TENKU_DEMO_PASSWORD` デモユーザーのパスワード (seedと合わせる)

## Vercel デプロイ手順
1. リポジトリを Vercel にインポート
2. Framework: **Next.js**, Root: `/`
3. Env設定に `.env.example` の値を入力 (本番用の `AUTH_SECRET`/`DATABASE_URL` を指定)
4. `npx prisma migrate deploy && npm run prisma:seed` を `postinstall` または Build Step に追加することを推奨（ホストDB接続が必要）
5. Deploy を実行

## ルート一覧（MVP）
- `/login` : Credentialsログイン (NextAuth)
- `/dashboard` : 制度スイッチ + KPI/アラート/最新ログ
- `/persons` → `/persons/[id]` : 外国人一覧/詳細（在留履歴・Case・Docs・Log）
- `/companies` → `/companies/[id]`
- `/orgs` → `/orgs/[id]`
- `/jobs` → `/jobs/[id]`（求人票PDF生成ボタン）
- `/cases` → `/cases/[id]`（タスク自動生成ボタン）
- `/tasks`
- `/documents`
- `/logs`

## APIエンドポイント（MVP）
- 認証: `/api/auth/*`
- `/api/v1/me`
- CRUD: `/api/v1/persons`, `/companies`, `/orgs`, `/jobs`, `/cases`
- `/api/v1/cases/:id/tasks/auto-generate`
- `/api/v1/jobs/:id/job-offer-pdf`
- 一覧は `?program=ALL|TITP|SSW|TA` に対応

## Prismaテーブル（抜粋）
TENANT / USER / ORGANIZATION / COMPANY / PERSON / PERSON_STATUS_HISTORY / JOB / CASE / TASK / DOCUMENT / LOG / ALERT / SCHEDULE_EVENT

## デモデータ (seed)
- tenant1 (TENANT-001)
- org: Supervisory / Support / Sending / Training 各1
- company: Orion Robotics, Aster Foods
- person: 5名 (多国籍架空名)
- job: 3件
- case: 5件（主要3タイプを含む）
- task/doc/log/alert/schedule: 最小限のモック

## 注意
- すべて架空データで構成し、KIZUNA/絆等の表記はありません。
- DB接続がない環境ではAPIがエラーになるため、開発時は Postgres を起動してください。
