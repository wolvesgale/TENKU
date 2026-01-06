"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PdfTemplateSummary } from "@/lib/pdf/templates/manifest";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCcw, Download, AlertCircle } from "lucide-react";

type PreviewerProps = {
  template: PdfTemplateSummary;
};

export function PdfPreviewer({ template }: PreviewerProps) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<{ status?: number; contentType?: string; size?: number; source?: string } | null>(null);
  const activePreviewRef = useRef<string | null>(null);

  const templateKey = useMemo(() => `${template.id}-${template.title}`, [template.id, template.title]);

  const buildPreviewUrl = useCallback(() => {
    return `/api/v1/pdf/preview?templateId=${encodeURIComponent(template.id)}&t=${Date.now()}`;
  }, [template.id]);

  const cleanupFallbackUrl = useCallback((url: string | null) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }, []);

  const refreshPreview = useCallback(() => {
    const nextUrl = buildPreviewUrl();
    activePreviewRef.current = nextUrl;
    setPreviewSrc(nextUrl);
    setLoading(true);
    setError(null);
    setDiagnostics(null);
    setFallbackSrc((prev) => {
      if (prev !== nextUrl) cleanupFallbackUrl(prev);
      return null;
    });
  }, [buildPreviewUrl, cleanupFallbackUrl]);

  const applyFallbackFetch = useCallback(
    async (url: string) => {
      setLoading(true);
      try {
        const response = await fetch(url, { cache: "no-store" });
        const sizeHeader = response.headers.get("content-length");
        const parsedSize = sizeHeader ? Number(sizeHeader) : undefined;
        const normalizedSize = Number.isFinite(parsedSize) ? parsedSize : undefined;
        const contentType = response.headers.get("content-type") ?? undefined;

        if (activePreviewRef.current !== url) return;
        setDiagnostics({ status: response.status, contentType, size: normalizedSize, source: "fetch" });

        if (!response.ok) {
          let message = `プレビューAPIでエラーが発生しました (${response.status})`;
          try {
            const data = await response.clone().json();
            if (data?.message) message += `: ${data.message}`;
          } catch {
            // ignore non-JSON responses
          }
          setError(message);
          return;
        }

        const blob = await response.blob();
        if (activePreviewRef.current !== url) return;

        const blobUrl = URL.createObjectURL(blob);
        setFallbackSrc((prev) => {
          cleanupFallbackUrl(prev);
          return blobUrl;
        });
        setDiagnostics({ status: response.status, contentType, size: normalizedSize ?? blob.size, source: "fetch" });
        setError(null);
      } catch (err) {
        if (activePreviewRef.current !== url) return;
        console.error(err);
        setError("プレビュー取得に失敗しました");
      } finally {
        if (activePreviewRef.current === url) setLoading(false);
      }
    },
    [cleanupFallbackUrl],
  );

  const handleDownload = useCallback(() => {
    const baseUrl = previewSrc ?? buildPreviewUrl();
    const downloadUrl = new URL(baseUrl, window.location.origin);
    downloadUrl.searchParams.set("download", "1");
    window.open(downloadUrl.toString(), "_blank");
  }, [buildPreviewUrl, previewSrc]);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(null);
    setDiagnostics((prev) => prev ?? { status: 200, contentType: "application/pdf", source: "iframe" });
  }, []);

  const handleError = useCallback(() => {
    if (previewSrc) applyFallbackFetch(previewSrc);
  }, [applyFallbackFetch, previewSrc]);

  useEffect(() => {
    refreshPreview();
  }, [templateKey, refreshPreview]);

  useEffect(() => {
    return () => {
      cleanupFallbackUrl(fallbackSrc);
      cleanupFallbackUrl(activePreviewRef.current);
    };
  }, [cleanupFallbackUrl, fallbackSrc]);

  const embedSrc = fallbackSrc ?? previewSrc;

  const renderDiagnostics = () => {
    if (!diagnostics) return null;
    return (
      <div className="flex flex-wrap gap-4 border-t border-border/60 bg-surface/50 px-4 py-2 text-xs text-muted">
        <span>ソース: {diagnostics.source ?? "-"}</span>
        <span>ステータス: {diagnostics.status ?? "-"}</span>
        <span>Content-Type: {diagnostics.contentType ?? "-"}</span>
        <span>サイズ: {diagnostics.size !== undefined ? `${(diagnostics.size / 1024).toFixed(1)} KB` : "-"}</span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge className="border-brand-blue text-brand-blue">{template.category}</Badge>
        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={refreshPreview} disabled={loading}>
          <RefreshCcw size={14} />
          プレビュー更新
        </Button>
        <Button size="sm" className="flex items-center gap-1" onClick={handleDownload} disabled={loading}>
          <Download size={14} />
          エクスポート
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-surface">
        <div className="relative">
          {embedSrc ? (
            <iframe
              key={previewSrc ?? templateKey}
              title={template.title}
              src={embedSrc}
              className="w-full h-[520px]"
              onLoad={handleLoad}
              onError={handleError}
            />
          ) : (
            <div className="flex h-[520px] items-center justify-center text-muted">プレビューURLを初期化中...</div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface/70 backdrop-blur-sm text-muted">
              <Loader2 className="mr-2 animate-spin" size={18} />
              プレビューを生成中...
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 border-t border-border/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
            <AlertCircle size={16} className="mt-0.5" />
            <div>
              <p className="font-semibold">プレビューの取得に失敗しました</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {renderDiagnostics()}
      </div>
    </div>
  );
}
