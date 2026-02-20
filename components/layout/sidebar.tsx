"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  ClipboardList,
  Users,
  Network,
  Award,
  ArrowRightLeft,
  HeartHandshake,
  GraduationCap,
  Languages,
  Plane,
  Bus,
  MapPin,
  MessageCircle,
  Bot,
  CheckSquare,
  Settings,
  ChevronDown,
  ChevronRight,
  Construction,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type SidebarLink = {
  href: string;
  label: string;
  icon: React.ElementType;
  wip?: boolean;
};

export type SidebarSection = {
  label: string;
  links: SidebarLink[];
  defaultOpen?: boolean;
};

export const sidebarSections: SidebarSection[] = [
  {
    label: "ダッシュボード",
    defaultOpen: true,
    links: [
      { href: "/dashboard", label: "ダッシュボード", icon: Home },
    ],
  },
  {
    label: "管理対象",
    defaultOpen: true,
    links: [
      { href: "/persons", label: "外国人（統合）", icon: Users },
      { href: "/companies", label: "企業（統合）", icon: Building2 },
      { href: "/organization", label: "組織管理", icon: Network },
    ],
  },
  {
    label: "申請・制度管理",
    defaultOpen: true,
    links: [
      { href: "/training-plans", label: "技能実習", icon: ClipboardList },
      { href: "/ssw", label: "特定技能", icon: Award, wip: true },
      { href: "/ta", label: "特定活動（移行）", icon: ArrowRightLeft, wip: true },
    ],
  },
  {
    label: "支援・運用",
    defaultOpen: false,
    links: [
      { href: "/support", label: "支援計画/面談/記録", icon: HeartHandshake, wip: true },
      { href: "/education", label: "教育（Classroom連携）", icon: GraduationCap, wip: true },
      { href: "/translation", label: "翻訳・通訳", icon: Languages, wip: true },
    ],
  },
  {
    label: "移動・渡航",
    defaultOpen: false,
    links: [
      { href: "/travel/flights", label: "航空券検索（TRP）", icon: Plane, wip: true },
      { href: "/travel/bus", label: "国内移動（高速バス）", icon: Bus, wip: true },
      { href: "/travel/homevisit", label: "一時帰国管理", icon: MapPin, wip: true },
    ],
  },
  {
    label: "コミュニケーション",
    defaultOpen: false,
    links: [
      { href: "/chat/foreigner", label: "外国人向けチャット", icon: MessageCircle, wip: true },
      { href: "/chat/staff", label: "職員向けAIアシスタント", icon: Bot, wip: true },
    ],
  },
  {
    label: "タスクセンター",
    defaultOpen: true,
    links: [
      { href: "/tasks", label: "タスク一覧", icon: CheckSquare },
    ],
  },
  {
    label: "設定・連携",
    defaultOpen: false,
    links: [
      { href: "/settings", label: "設定・API連携", icon: Settings, wip: true },
    ],
  },
];

// Flat list for backward compatibility
export const sidebarLinks: SidebarLink[] = sidebarSections.flatMap((s) => s.links);

function SidebarSection({ section, pathname }: { section: SidebarSection; pathname: string | null }) {
  const hasActive = section.links.some((l) => pathname?.startsWith(l.href));
  const [open, setOpen] = useState(section.defaultOpen || hasActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-2 py-1 mb-1 text-[10px] uppercase tracking-widest text-muted hover:text-white transition"
      >
        <span>{section.label}</span>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>

      {open && (
        <div className="space-y-0.5 mb-2">
          {section.links.map((link) => {
            const active = pathname?.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition text-sm",
                  active
                    ? "border-brand-blue text-white bg-brand-blue/10 shadow-glow"
                    : "border-transparent text-gray-300 hover:border-border hover:bg-surface/80"
                )}
              >
                <Icon size={15} className={active ? "text-brand-blue" : "text-muted"} />
                <span className="flex-1">{link.label}</span>
                {link.wip && (
                  <Construction size={11} className="text-brand-amber shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 hidden md:flex flex-col gap-3 p-4 border-r border-border bg-surface/60 overflow-y-auto">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-teal/70 to-brand-blue/70 flex items-center justify-center text-slate-900 font-bold shadow-glow shrink-0">
          T
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted">TENKU_Cloud</p>
          <p className="font-semibold text-white text-sm">AI Agent</p>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {sidebarSections.map((section) => (
          <SidebarSection key={section.label} section={section} pathname={pathname} />
        ))}
      </nav>

      <div className="text-[10px] text-muted border-t border-border pt-2 space-y-0.5">
        <div className="flex items-center gap-1">
          <Construction size={10} className="text-brand-amber" />
          <span className="text-brand-amber">工事中 = 開発中機能</span>
        </div>
        <div>外国人就労ライフサイクル管理</div>
      </div>
    </aside>
  );
}
