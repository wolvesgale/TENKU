"use client";
import { useEffect, useMemo, useState } from "react";
import type { PdfTemplateDefinition } from "@/lib/pdf/templates/registry";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCcw, Download } from "lucide-react";

type PreviewerProps<TData> = {
  template: PdfTemplateDefinition<TData>;
};

export function PdfPreviewer<TData>({ template }: PreviewerProps<TData>) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const templateKey = useMemo(() => `${template.id}-${template.title}`, [template.id, template.title]);

  const fetchPreviewBlob = async () => {
    const res = await fetch("/api/v1/pdf/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: template.id }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return res.blob();
  };

  const generatePreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const blob = await fetchPreviewBlob();
      const url = URL.createObjectURL(blob);
      setBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "プレビュー生成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await fetchPreviewBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${template.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "エクスポートに失敗しました");
    }
  };

  useEffect(() => {
    generatePreview();
    return () => {
      setBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateKey]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge className="border-brand-blue text-brand-blue">{template.category}</Badge>
        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={generatePreview} disabled={loading}>
          <RefreshCcw size={14} />
          プレビュー更新
        </Button>
        <Button size="sm" className="flex items-center gap-1" onClick={handleDownload} disabled={loading}>
          <Download size={14} />
          エクスポート
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-surface">
        {loading && (
          <div className="flex items-center justify-center py-16 text-muted">
            <Loader2 className="animate-spin mr-2" size={18} />
            プレビューを生成中...
          </div>
        )}
        {error && <p className="p-4 text-sm text-rose-300">{error}</p>}
        {!loading && !error && blobUrl && <iframe title={template.title} src={blobUrl} className="w-full h-[520px]" />}
      </div>
    </div>
  );
}
