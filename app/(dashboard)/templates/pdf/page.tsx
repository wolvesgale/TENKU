import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplatePicker } from "@/components/pdf/template-picker";

export default function PdfTemplatesPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>PDFテンプレート</CardTitle>
            <p className="text-sm text-muted">在留資格関連と登録支援機関向けの簡易テンプレを切替・出力できます。</p>
          </div>
          <Badge className="border-brand-blue text-brand-blue">Preview + Export</Badge>
        </CardHeader>
        <CardContent>
          <TemplatePicker />
        </CardContent>
      </Card>
    </div>
  );
}
