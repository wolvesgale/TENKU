import { Construction } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UnderConstructionProps {
  title: string;
  description?: string;
  plannedFeatures?: string[];
}

export function UnderConstruction({ title, description, plannedFeatures }: UnderConstructionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <Badge className="border-brand-amber text-brand-amber flex items-center gap-1">
          <Construction size={12} />
          工事中
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-amber">
            <Construction size={20} />
            このセクションは現在開発中です
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {description && (
            <p className="text-sm text-muted">{description}</p>
          )}

          {plannedFeatures && plannedFeatures.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-white mb-2">実装予定機能：</p>
              <ul className="space-y-1">
                {plannedFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-3 rounded-lg border border-brand-amber/30 bg-brand-amber/5 text-xs text-brand-amber">
            現在の仕様書に基づき順次実装予定です。既存の技能実習データとの整合性を確認しながら差分追加します。
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
