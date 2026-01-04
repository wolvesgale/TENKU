"use client";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Copy, PlusCircle, ReceiptJapaneseYen } from "lucide-react";

const mockBreakdown = [
  { label: "技能実習1号", count: 120, amount: 360000 },
  { label: "技能実習2号", count: 86, amount: 301000 },
  { label: "特定技能1号", count: 34, amount: 170000 },
];

export default function BillingPage() {
  const [status, setStatus] = useState("ドラフト生成済み");
  const [message, setMessage] = useState("");

  const totalAmount = useMemo(() => mockBreakdown.reduce((sum, b) => sum + b.amount, 0), []);

  const handleMock = (text: string) => {
    setStatus(text);
    setMessage(`${text} (モック)`);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>監理費請求</CardTitle>
          <Badge className="border-brand-blue text-brand-blue flex items-center gap-1">
            <ReceiptJapaneseYen size={14} /> 請求書
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleMock("新規作成済み")} size="sm">
              <PlusCircle size={14} /> 新規作成
            </Button>
            <Button onClick={() => handleMock("前月複製済み")} size="sm" variant="ghost">
              <Copy size={14} /> 前月複製
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-surface/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">ステータス</p>
                <p className="font-semibold text-white">{status}</p>
              </div>
              <Badge className={status.includes("複製") ? "border-brand-blue text-brand-blue" : "border-brand-amber text-brand-amber"}>
                {status}
              </Badge>
            </div>
            <p className="text-xs text-muted">種別ごとの人数内訳を確認し、確定前にAIチェックを走らせる想定。</p>
          </div>
          <div className="space-y-3">
            {mockBreakdown.map((b) => (
              <div
                key={b.label}
                className="flex items-center justify-between rounded-lg border border-border bg-surface/70 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-brand-blue" />
                  <div>
                    <p className="text-white font-semibold">{b.label}</p>
                    <p className="text-xs text-muted">人数 {b.count}</p>
                  </div>
                </div>
                <p className="text-white font-semibold">¥{b.amount.toLocaleString()}</p>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm text-brand-teal border-t border-border pt-2">
              <span>合計</span>
              <span className="text-xl font-bold">¥{totalAmount.toLocaleString()}</span>
            </div>
          </div>
          {message && <p className="text-xs text-brand-blue">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
