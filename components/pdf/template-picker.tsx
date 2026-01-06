"use client";
import { useMemo, useState } from "react";
import { FileText, Layers, Shuffle } from "lucide-react";
import { pdfTemplateManifest, type PdfTemplateId, type PdfTemplateSummary } from "@/lib/pdf/templates/manifest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PdfPreviewer } from "./pdf-previewer";

const templates = pdfTemplateManifest;

export function TemplatePicker() {
  const [selectedId, setSelectedId] = useState<PdfTemplateId>(templates[0].id);

  const selected = useMemo(
    () => templates.find((tpl) => tpl.id === selectedId) ?? templates[0],
    [selectedId],
  );

  const handleNext = () => {
    const currentIndex = templates.findIndex((tpl) => tpl.id === selectedId);
    const nextIndex = (currentIndex + 1) % templates.length;
    setSelectedId(templates[nextIndex].id);
  };

  return (
    <div className="grid lg:grid-cols-[1.2fr_1.8fr] gap-4">
      <Card className="h-full">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Layers size={18} />
            テンプレ一覧
          </CardTitle>
          <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleNext}>
            <Shuffle size={14} />
            順送り
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setSelectedId(tpl.id)}
              className={`w-full text-left p-3 rounded-lg border transition ${
                tpl.id === selectedId ? "border-brand-blue bg-brand-blue/10 shadow-glow" : "border-border hover:border-brand-blue/60 bg-surface/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-brand-blue" />
                  <div>
                    <p className="font-semibold text-white">{tpl.title}</p>
                    <p className="text-xs text-muted">{tpl.description}</p>
                  </div>
                </div>
                <Badge className="border-border text-xs">{tpl.category}</Badge>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>{selected.title} プレビュー</CardTitle>
          <p className="text-sm text-muted">テンプレ切替は共通のセレクタ状態で管理しています。</p>
        </CardHeader>
        <CardContent>
          <PdfPreviewer template={selected} />
        </CardContent>
      </Card>
    </div>
  );
}
