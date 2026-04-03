"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";

// ─── 型 ───────────────────────────────────────────────────────────────────────

type InvoiceLineItem = { description: string; unitPrice: number; quantity: number; amount: number };
type InvoiceStatus = "draft" | "confirmed" | "sent" | "paid";
type Invoice = {
  id: string;
  invoiceNumber: string;
  companyId: string;
  billingMonth: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  dueDate?: string;
  confirmedAt?: string;
  sentAt?: string;
  paidAt?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};
type Company = { id: string; name: string };

// ─── ユーティリティ ──────────────────────────────────────────────────────────

const STATUS_MAP: Record<InvoiceStatus, { label: string; color: string }> = {
  draft:     { label: "下書き",   color: "border-gray-500 text-gray-400" },
  confirmed: { label: "確認済み", color: "border-brand-blue text-brand-blue" },
  sent:      { label: "送付済み", color: "border-brand-amber text-brand-amber" },
  paid:      { label: "入金済み", color: "border-green-500 text-green-400" },
};

function fmt(n: number) { return `¥${n.toLocaleString()}`; }
function fmtDate(iso?: string) { return iso ? new Date(iso).toLocaleDateString("ja-JP") : "-"; }

const BILLING_TABS = [
  { id: "list",   label: "請求書一覧" },
  { id: "new",    label: "新規作成" },
  { id: "detail", label: "明細・確認" },
];

const COMMON_ITEMS = [
  { description: "監理費（技能実習1号）", unitPrice: 30000 },
  { description: "監理費（技能実習2号）", unitPrice: 35000 },
  { description: "監理費（技能実習3号）", unitPrice: 35000 },
  { description: "支援費（特定技能1号）", unitPrice: 50000 },
  { description: "育成就労監理費",         unitPrice: 30000 },
];

// ─── コンポーネント ──────────────────────────────────────────────────────────

export default function BillingPage() {
  const [tab, setTab] = useState("list");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState("");

  // 新規作成フォーム
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [form, setForm] = useState({
    companyId: "",
    billingMonth: currentMonth,
    dueDate: "",
    memo: "",
    lineItems: [{ description: "", unitPrice: 0, quantity: 1, amount: 0 }] as InvoiceLineItem[],
  });

  const fetchInvoices = useCallback(() => {
    fetch("/api/v1/billing").then((r) => r.json()).then((res) => setInvoices(res.data ?? []));
  }, []);

  useEffect(() => {
    fetchInvoices();
    fetch("/api/v1/companies").then((r) => r.json()).then((res) => setCompanies(res.data ?? []));
  }, [fetchInvoices]);

  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? id;
  const selectedInv = invoices.find((i) => i.id === selectedId);

  // 明細計算
  const subtotal = form.lineItems.reduce((s, l) => s + l.amount, 0);
  const taxAmount = Math.floor(subtotal * 0.1);
  const totalAmount = subtotal + taxAmount;

  function setLineItem(idx: number, key: keyof InvoiceLineItem, val: string | number) {
    setForm((f) => {
      const items = [...f.lineItems];
      items[idx] = { ...items[idx], [key]: val };
      if (key === "unitPrice" || key === "quantity") {
        items[idx].amount = Number(items[idx].unitPrice) * Number(items[idx].quantity);
      }
      return { ...f, lineItems: items };
    });
  }

  function addLineItem() {
    setForm((f) => ({ ...f, lineItems: [...f.lineItems, { description: "", unitPrice: 0, quantity: 1, amount: 0 }] }));
  }
  function removeLineItem(idx: number) {
    setForm((f) => ({ ...f, lineItems: f.lineItems.filter((_, i) => i !== idx) }));
  }
  function applyTemplate(tpl: typeof COMMON_ITEMS[0]) {
    const item: InvoiceLineItem = { description: tpl.description, unitPrice: tpl.unitPrice, quantity: 1, amount: tpl.unitPrice };
    setForm((f) => ({ ...f, lineItems: [...f.lineItems.filter((l) => l.description), item] }));
  }

  async function createInvoice() {
    if (!form.companyId) { setActionMsg("請求先企業を選択してください"); return; }
    const res = await fetch("/api/v1/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    const data = await res.json();
    fetchInvoices();
    setSelectedId(data.data.id);
    setTab("detail");
    setActionMsg(`請求書 ${data.data.invoiceNumber} を作成しました`);
    setTimeout(() => setActionMsg(""), 3000);
  }

  async function updateStatus(id: string, status: InvoiceStatus) {
    await fetch(`/api/v1/billing/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchInvoices();
    setActionMsg(`ステータスを「${STATUS_MAP[status].label}」に変更しました`);
    setTimeout(() => setActionMsg(""), 3000);
  }

  function printInvoice(inv: Invoice) {
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>請求書 ${inv.invoiceNumber}</title>
<style>
  body { font-family: "Helvetica", sans-serif; margin: 40px; color: #222; }
  h1 { font-size: 28px; text-align: center; margin-bottom: 4px; }
  .meta { text-align: right; margin-bottom: 20px; font-size: 13px; }
  .to { font-size: 16px; font-weight: bold; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th { background: #f0f0f0; padding: 8px; text-align: left; font-size: 13px; border: 1px solid #ccc; }
  td { padding: 8px; font-size: 13px; border: 1px solid #ccc; }
  .total-row { font-weight: bold; background: #f8f8f8; }
  .footer { margin-top: 40px; font-size: 12px; color: #666; }
</style>
</head>
<body>
<h1>請 求 書</h1>
<div class="meta">
  <p>請求書番号：${inv.invoiceNumber}</p>
  <p>請求日：${fmtDate(inv.createdAt)}</p>
  ${inv.dueDate ? `<p>支払期限：${fmtDate(inv.dueDate)}</p>` : ""}
</div>
<div class="to">${companyName(inv.companyId)} 御中</div>
<p>下記の通りご請求申し上げます。</p>
<table>
  <thead>
    <tr><th>摘要</th><th>単価</th><th>数量</th><th>金額</th></tr>
  </thead>
  <tbody>
    ${inv.lineItems.map((l) => `<tr><td>${l.description}</td><td>¥${l.unitPrice.toLocaleString()}</td><td>${l.quantity}</td><td>¥${l.amount.toLocaleString()}</td></tr>`).join("")}
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="text-align:right">小計</td><td>¥${inv.subtotal.toLocaleString()}</td></tr>
    <tr><td colspan="3" style="text-align:right">消費税（${Math.round(inv.taxRate * 100)}%）</td><td>¥${inv.taxAmount.toLocaleString()}</td></tr>
    <tr class="total-row"><td colspan="3" style="text-align:right">合計</td><td>¥${inv.totalAmount.toLocaleString()}</td></tr>
  </tfoot>
</table>
${inv.memo ? `<p>備考：${inv.memo}</p>` : ""}
<div class="footer">
  <p>TENKU監理協同組合 / TENKU_Cloud Demo</p>
</div>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.print();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">請求書管理</h1>
          <p className="text-xs text-muted mt-0.5">管理団体から企業への監理費・支援費請求書を一元管理</p>
        </div>
        {actionMsg && <p className="text-xs text-green-400">{actionMsg}</p>}
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["draft", "confirmed", "sent", "paid"] as InvoiceStatus[]).map((s) => {
          const st = STATUS_MAP[s];
          const cnt = invoices.filter((i) => i.status === s).length;
          return (
            <div key={s} className="p-3 rounded-lg border border-border bg-surface/60">
              <p className="text-xs text-muted">{st.label}</p>
              <p className="text-2xl font-bold text-white">{cnt}</p>
              <p className="text-[10px] text-muted">件</p>
            </div>
          );
        })}
      </div>

      <Tabs tabs={BILLING_TABS} defaultTab="list" onChange={setTab} />

      {/* ─── 一覧 ─── */}
      {tab === "list" && (
        <Card>
          <CardContent className="p-0">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface/80 border-b border-border">
                  <th className="px-3 py-2 text-left text-xs text-muted">請求書番号</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">請求先</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">請求月</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">合計（税込）</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">状態</th>
                  <th className="px-3 py-2 text-left text-xs text-muted">支払期限</th>
                  <th className="px-3 py-2 text-xs text-muted">操作</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr><td colSpan={7} className="px-3 py-8 text-center text-muted text-xs">請求書なし</td></tr>
                ) : (
                  invoices.map((inv) => {
                    const st = STATUS_MAP[inv.status];
                    return (
                      <tr key={inv.id} className="border-b border-border/50 hover:bg-white/5">
                        <td className="px-3 py-2 font-mono text-xs text-white">{inv.invoiceNumber}</td>
                        <td className="px-3 py-2 text-gray-300 text-xs">{companyName(inv.companyId)}</td>
                        <td className="px-3 py-2 text-gray-300 text-xs">{inv.billingMonth}</td>
                        <td className="px-3 py-2 font-semibold text-white">{fmt(inv.totalAmount)}</td>
                        <td className="px-3 py-2"><Badge className={`${st.color} text-[10px]`}>{st.label}</Badge></td>
                        <td className="px-3 py-2 text-gray-300 text-xs">{fmtDate(inv.dueDate)}</td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => { setSelectedId(inv.id); setTab("detail"); }}
                            className="text-brand-blue text-xs hover:underline"
                          >
                            詳細
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ─── 新規作成 ─── */}
      {tab === "new" && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">基本情報</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted block mb-1">請求先企業 *</label>
                <select
                  className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={form.companyId}
                  onChange={(e) => setForm((f) => ({ ...f, companyId: e.target.value }))}
                >
                  <option value="">選択してください</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">請求月 *</label>
                <input
                  type="month"
                  className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={form.billingMonth}
                  onChange={(e) => setForm((f) => ({ ...f, billingMonth: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">支払期限</label>
                <input
                  type="date"
                  className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={form.dueDate}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-muted block mb-1">備考</label>
                <input
                  className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                  value={form.memo}
                  onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
                  placeholder="備考・振込先等"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">請求明細</CardTitle>
                <div className="flex gap-1 flex-wrap">
                  {COMMON_ITEMS.map((t) => (
                    <button
                      key={t.description}
                      onClick={() => applyTemplate(t)}
                      className="px-2 py-0.5 rounded border border-border text-[10px] text-muted hover:text-white hover:border-brand-blue transition"
                    >
                      + {t.description}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {form.lineItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <input
                      className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                      placeholder="摘要"
                      value={item.description}
                      onChange={(e) => setLineItem(idx, "description", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                      placeholder="単価"
                      value={item.unitPrice || ""}
                      onChange={(e) => setLineItem(idx, "unitPrice", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      className="w-full bg-black/30 border border-border rounded px-2 py-1.5 text-sm text-white"
                      placeholder="数量"
                      value={item.quantity}
                      onChange={(e) => setLineItem(idx, "quantity", parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-2 text-right text-sm font-semibold text-white">
                    {fmt(item.amount)}
                  </div>
                  <div className="col-span-1 text-center">
                    <button onClick={() => removeLineItem(idx)} className="text-red-400 text-xs hover:opacity-70">✕</button>
                  </div>
                </div>
              ))}
              <button onClick={addLineItem} className="text-xs text-brand-blue hover:underline">＋ 行を追加</button>

              {/* 合計 */}
              <div className="border-t border-border pt-3 space-y-1">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>小計</span><span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>消費税（10%）</span><span>{fmt(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white">
                  <span>合計（税込）</span><span>{fmt(totalAmount)}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={createInvoice}
                  className="px-5 py-2 rounded bg-brand-blue text-white text-sm font-semibold hover:opacity-90"
                >
                  請求書を作成する
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── 明細・確認 ─── */}
      {tab === "detail" && (
        <div className="space-y-3">
          {/* 選択 */}
          <div>
            <label className="text-xs text-muted block mb-1">請求書を選択</label>
            <select
              className="bg-black/30 border border-border rounded px-3 py-1.5 text-sm text-white"
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">選択してください</option>
              {invoices.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.invoiceNumber} — {companyName(i.companyId)} {i.billingMonth} ({STATUS_MAP[i.status].label})
                </option>
              ))}
            </select>
          </div>

          {selectedInv && (() => {
            const st = STATUS_MAP[selectedInv.status];
            return (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-mono">{selectedInv.invoiceNumber}</CardTitle>
                      <p className="text-xs text-muted mt-0.5">{companyName(selectedInv.companyId)} · {selectedInv.billingMonth}</p>
                    </div>
                    <Badge className={`${st.color}`}>{st.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 明細 */}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs text-muted pb-1">摘要</th>
                        <th className="text-right text-xs text-muted pb-1">単価</th>
                        <th className="text-right text-xs text-muted pb-1">数量</th>
                        <th className="text-right text-xs text-muted pb-1">金額</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInv.lineItems.map((l, i) => (
                        <tr key={i} className="border-b border-border/30">
                          <td className="py-2 text-gray-300">{l.description}</td>
                          <td className="py-2 text-right text-gray-300">{fmt(l.unitPrice)}</td>
                          <td className="py-2 text-right text-gray-300">{l.quantity}</td>
                          <td className="py-2 text-right font-semibold text-white">{fmt(l.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="text-right text-xs text-muted pt-2">小計</td>
                        <td className="text-right text-gray-300 pt-2">{fmt(selectedInv.subtotal)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="text-right text-xs text-muted">消費税（{Math.round(selectedInv.taxRate * 100)}%）</td>
                        <td className="text-right text-gray-300">{fmt(selectedInv.taxAmount)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="text-right font-bold text-white pt-1">合計（税込）</td>
                        <td className="text-right font-bold text-xl text-white">{fmt(selectedInv.totalAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* タイムライン */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded border border-border bg-surface/60">
                      <p className="text-muted">作成日</p>
                      <p className="text-white">{fmtDate(selectedInv.createdAt)}</p>
                    </div>
                    {selectedInv.dueDate && (
                      <div className="p-2 rounded border border-border bg-surface/60">
                        <p className="text-muted">支払期限</p>
                        <p className="text-white">{fmtDate(selectedInv.dueDate)}</p>
                      </div>
                    )}
                    {selectedInv.confirmedAt && (
                      <div className="p-2 rounded border border-green-900 bg-green-900/20">
                        <p className="text-muted">確認日</p>
                        <p className="text-green-300">{fmtDate(selectedInv.confirmedAt)}</p>
                      </div>
                    )}
                    {selectedInv.sentAt && (
                      <div className="p-2 rounded border border-brand-amber/50 bg-brand-amber/10">
                        <p className="text-muted">送付日</p>
                        <p className="text-brand-amber">{fmtDate(selectedInv.sentAt)}</p>
                      </div>
                    )}
                    {selectedInv.paidAt && (
                      <div className="p-2 rounded border border-green-500/50 bg-green-900/20">
                        <p className="text-muted">入金日</p>
                        <p className="text-green-300">{fmtDate(selectedInv.paidAt)}</p>
                      </div>
                    )}
                  </div>
                  {selectedInv.memo && <p className="text-xs text-muted">備考：{selectedInv.memo}</p>}

                  {/* アクションボタン */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    {selectedInv.status === "draft" && (
                      <button
                        onClick={() => updateStatus(selectedInv.id, "confirmed")}
                        className="px-4 py-1.5 rounded bg-brand-blue text-white text-sm hover:opacity-90"
                      >
                        ✓ 内容確認・承認
                      </button>
                    )}
                    {selectedInv.status === "confirmed" && (
                      <button
                        onClick={() => updateStatus(selectedInv.id, "sent")}
                        className="px-4 py-1.5 rounded bg-brand-amber text-black text-sm font-semibold hover:opacity-90"
                      >
                        送付済みにする
                      </button>
                    )}
                    {selectedInv.status === "sent" && (
                      <button
                        onClick={() => updateStatus(selectedInv.id, "paid")}
                        className="px-4 py-1.5 rounded bg-green-600 text-white text-sm hover:opacity-90"
                      >
                        入金確認済みにする
                      </button>
                    )}
                    <button
                      onClick={() => printInvoice(selectedInv)}
                      className="px-4 py-1.5 rounded border border-border text-sm text-gray-300 hover:bg-white/5"
                    >
                      🖨 PDF印刷
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </div>
      )}
    </div>
  );
}
