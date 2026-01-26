import Link from "next/link";

const cards = [
  {
    title: "監理団体情報",
    description: "監理団体の基本情報を編集",
    href: "/organization",
  },
  {
    title: "法人（実習実施者）",
    description: "法人情報の登録・編集",
    href: "/companies",
  },
  {
    title: "実習生",
    description: "実習生情報の登録・編集",
    href: "/persons",
  },
  {
    title: "技能実習計画",
    description: "プレビューとPDF出力",
    href: "/training-plans",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-slate-500">TENKU Demo</p>
          <h1 className="text-3xl font-semibold">技能実習計画のデモ体験</h1>
          <p className="text-slate-600">必要な情報を入力し、テンプレPDFへ即時反映できます。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="border rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="text-sm text-slate-600 mt-1">{card.description}</p>
              <span className="inline-block mt-3 text-blue-600 text-sm">開く →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
