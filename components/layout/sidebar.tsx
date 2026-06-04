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
  CheckSquare,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  ReceiptText,
  UserCircle,
  Loader2,
  AlertCircle,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// ─── 型 ──────────────────────────────────────────────────────────────────────

type SswPerson = {
  id: string;
  name: string;
  nationality?: string;
  residenceCardExpiry?: string;
  currentProgram?: string;
  nextProcedure?: string;
};

type SswCompany = {
  id: string;
  name: string;
  persons: SswPerson[];
};

// ─── 期限バッジ ───────────────────────────────────────────────────────────────

function ExpiryDot({ iso }: { iso?: string }) {
  if (!iso) return null;
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" title="期限切れ" />;
  if (days <= 30) return <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" title={`${days}日`} />;
  if (days <= 60) return <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title={`${days}日`} />;
  return null;
}

// ─── 特定技能ツリー ───────────────────────────────────────────────────────────

function SswTree({ pathname }: { pathname: string | null }) {
  const [companies, setCompanies] = useState<SswCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/v1/ssw/tree")
      .then((r) => r.json())
      .then((data) => {
        const list: SswCompany[] = data.companies ?? [];
        setCompanies(list);
        // 現在のパスに対応する企業を自動展開
        if (pathname) {
          const personId = pathname.match(/\/ssw\/persons\/([^/]+)/)?.[1];
          if (personId) {
            const cmp = list.find((c) => c.persons.some((p) => p.id === personId));
            if (cmp) setExpandedCompanies(new Set([cmp.id]));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pathname]);

  const toggleCompany = (id: string) => {
    setExpandedCompanies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-muted">
        <Loader2 size={11} className="animate-spin" />
        <span>読み込み中...</span>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-muted">
        <AlertCircle size={11} />
        <span>特定技能者なし</span>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 ml-1">
      {companies.map((company) => {
        const isExpanded = expandedCompanies.has(company.id);
        const hasActiveChild = company.persons.some((p) => pathname?.includes(p.id));

        return (
          <div key={company.id}>
            {/* 企業ノード */}
            <button
              type="button"
              onClick={() => toggleCompany(company.id)}
              className={cn(
                "w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition text-xs",
                hasActiveChild
                  ? "text-white bg-white/5"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              )}
            >
              <Building2 size={11} className="shrink-0 text-muted" />
              <span className="flex-1 truncate text-[11px]">{company.name}</span>
              <span className="text-[10px] text-muted shrink-0">{company.persons.length}</span>
              {isExpanded ? (
                <ChevronDown size={10} className="shrink-0 text-muted" />
              ) : (
                <ChevronRight size={10} className="shrink-0 text-muted" />
              )}
            </button>

            {/* 個人リスト */}
            {isExpanded && (
              <div className="ml-3 border-l border-border/40 pl-2 space-y-0.5">
                {company.persons.map((person) => {
                  const active = pathname?.includes(person.id);
                  return (
                    <Link
                      key={person.id}
                      href={`/ssw/persons/${person.id}`}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded transition text-[11px]",
                        active
                          ? "text-white bg-brand-blue/10 border border-brand-blue/30"
                          : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <UserCircle size={11} className={active ? "text-brand-blue shrink-0" : "text-muted shrink-0"} />
                      <span className="flex-1 truncate">{person.name}</span>
                      <ExpiryDot iso={person.residenceCardExpiry} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── 折りたたみセクション ─────────────────────────────────────────────────────

function CollapsibleSection({
  label,
  defaultOpen = false,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-2 py-1 mb-1 text-[10px] uppercase tracking-widest text-muted hover:text-white transition"
      >
        <span>{label}</span>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {open && <div className="space-y-0.5 mb-2">{children}</div>}
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  pathname,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  pathname: string | null;
}) {
  const active = pathname?.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition text-sm",
        active
          ? "border-brand-blue text-white bg-brand-blue/10 shadow-glow"
          : "border-transparent text-gray-300 hover:border-border hover:bg-surface/80"
      )}
    >
      <Icon size={15} className={active ? "text-brand-blue" : "text-muted"} />
      <span className="flex-1">{label}</span>
    </Link>
  );
}

// ─── サイドバー本体 ───────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 hidden md:flex flex-col gap-2 p-4 border-r border-border bg-surface/60 overflow-y-auto">
      {/* ロゴ */}
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
        {/* ダッシュボード */}
        <CollapsibleSection label="ダッシュボード" defaultOpen={true}>
          <NavLink href="/dashboard" icon={Home} label="ダッシュボード" pathname={pathname} />
        </CollapsibleSection>

        {/* 特定技能（ツリー） */}
        <div className="mb-2">
          <button
            type="button"
            className="w-full flex items-center justify-between px-2 py-1 mb-1 text-[10px] uppercase tracking-widest text-muted hover:text-white transition"
            onClick={() => {}}
          >
            <span>特定技能</span>
          </button>
          <div className="space-y-0.5 mb-1">
            <NavLink href="/ssw" icon={Award} label="特定技能 概要" pathname={pathname?.startsWith("/ssw/persons") ? null : pathname} />
          </div>
          <SswTree pathname={pathname} />
        </div>

        {/* 技能実習 */}
        <CollapsibleSection label="技能実習" defaultOpen={true}>
          <NavLink href="/training-plans" icon={ClipboardList} label="技能実習" pathname={pathname} />
        </CollapsibleSection>

        {/* DB管理（収納） */}
        <CollapsibleSection label="DBデータ管理" defaultOpen={false}>
          <NavLink href="/persons" icon={Users} label="外国人管理" pathname={pathname} />
          <NavLink href="/companies" icon={Building2} label="企業管理" pathname={pathname} />
          <NavLink href="/organization" icon={Network} label="組織管理" pathname={pathname} />
        </CollapsibleSection>

        {/* 書類・請求 */}
        <CollapsibleSection label="書類・請求" defaultOpen={false}>
          <NavLink href="/documents" icon={FolderOpen} label="書類管理" pathname={pathname} />
          <NavLink href="/billing" icon={ReceiptText} label="請求書管理" pathname={pathname} />
        </CollapsibleSection>

        {/* タスク */}
        <CollapsibleSection label="タスク" defaultOpen={true}>
          <NavLink href="/tasks" icon={CheckSquare} label="タスク一覧" pathname={pathname} />
        </CollapsibleSection>

        {/* ── 以下は一時非表示（データは保持）──
          支援・運用、移動・渡航、コミュニケーション、設定 は
          データを毀損せず、サイドバーからのみ非表示としています。
          要望に応じてここに追加していきます。
        ── */}
      </nav>

      <div className="text-[10px] text-muted border-t border-border pt-2">
        <div className="flex items-center gap-1">
          <Database size={9} className="text-muted" />
          <span>外国人就労ライフサイクル管理</span>
        </div>
      </div>
    </aside>
  );
}

// backward compat export
export const sidebarSections: never[] = [];
export const sidebarLinks: never[] = [];
export type SidebarLink = { href: string; label: string; icon: React.ElementType; wip?: boolean };
export type SidebarSection = { label: string; links: SidebarLink[]; defaultOpen?: boolean };
