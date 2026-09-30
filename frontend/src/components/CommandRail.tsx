"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  Sparkles,
  BookOpen,
  FileSearch,
  Network,
  History,
  GitCompare,
  BarChart3,
  Info,
  ChevronLeft,
  ChevronRight,
  Shield,
  X
} from "lucide-react";
import { checkHealth } from "@/lib/api";
import {
  LineSidebar,
  LineSidebarItemObject,
  LineSidebarItem,
} from "./navigation/LineSidebar";

interface CommandRailProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const SIDEBAR_ITEMS: LineSidebarItemObject[] = [
  { label: "Control Center", href: "/dashboard", sublabel: "Command Station", icon: Compass },
  { label: "Recommendation", href: "/recommend", sublabel: "AI Workspace", icon: Sparkles, badge: "AI" },
  { label: "Standards Catalog", href: "/standards", sublabel: "BIS Registry", icon: BookOpen },
  { label: "Tender Audit", href: "/audit", sublabel: "Document Intelligence", icon: FileSearch },
  { label: "Knowledge Graph", href: "/graph", sublabel: "Ontology Canvas", icon: Network },
  { label: "Audit History", href: "/history", sublabel: "Previous Queries", icon: History },
  { label: "Comparator", href: "/compare", sublabel: "Standard Diff", icon: GitCompare },
  { label: "Benchmark", href: "/evaluation", sublabel: "Telemetry & Eval", icon: BarChart3 },
  { label: "Architecture", href: "/about", sublabel: "SIH 2026 PS #26108", icon: Info },
];

// Module-level cache: health check fires once per browser session, not per navigation
let _healthPromise: Promise<any> | null = null;
const getCachedHealth = () => {
  if (!_healthPromise) {
    _healthPromise = checkHealth().catch(() => ({ status: "unhealthy" }));
  }
  return _healthPromise;
};

export const CommandRail: React.FC<CommandRailProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [healthy, setHealthy] = useState<boolean>(true);
  const [standardsCount, setStandardsCount] = useState<number>(113);

  useEffect(() => {
    getCachedHealth()
      .then((res) => {
        setHealthy(res.status === "healthy");
        if (res.standards_indexed) setStandardsCount(res.standards_indexed);
      })
      .catch(() => {
        setHealthy(false);
      });
  }, []);

  const activeIndex = SIDEBAR_ITEMS.findIndex((item) => {
    if (!item.href) return false;
    if (item.href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(item.href);
  });

  const handleItemClick = (_index: number, _label: string, _item?: LineSidebarItem) => {
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Seamless Integrated Navigation Rail */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col transition-all duration-250 ease-out ${
          collapsed ? "w-18" : "w-72"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${
          mobileOpen ? "bg-[#FFF4D6]/80 backdrop-blur-lg" : ""
        } lg:bg-transparent lg:backdrop-blur-none`}
        style={{ }}
      >
        {/* Soft right-edge gradient divider instead of hard border */}
        <div
          className="absolute top-0 bottom-0 right-0 w-[1px] pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 5%, rgba(231,217,188,0.25) 20%, rgba(231,217,188,0.18) 80%, transparent 95%)',
          }}
          aria-hidden="true"
        />
        {/* Subtle Ambient Top Accent */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#FC6C26]/40 via-[#FC6C26]/15 to-transparent" />

        {/* Rail Header / Brand Identity */}
        <div
          className={`p-4 border-b border-[#E7D9BC]/12 flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
          style={{ background: 'transparent' }}
        >
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 group overflow-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FC6C26] to-[#D95218] flex items-center justify-center text-white shadow-xs shadow-[#FC6C26]/20 shrink-0 group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold tracking-tight text-[#231A14]">
                    BIS-Spec<span className="text-[#FC6C26]">AI</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#FC6C26]/10 border border-[#FC6C26]/20 text-[#D95218]">
                    SIH
                  </span>
                </div>
                <p className="text-[10px] font-medium text-[#8D7B68] truncate">
                  Procurement Intelligence
                </p>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg border border-[#E7D9BC]/50 text-[#6E5C4E] hover:text-[#231A14] hover:bg-[#FFF4D6]/60 transition"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-3 scrollbar-thin">
          {!collapsed ? (
            <div className="space-y-1.5">
              <div className="px-2 pt-1 pb-1 text-[9px] font-mono font-bold uppercase tracking-wider text-[#9B8977]/80">
                Navigation Rail
              </div>

              {/* Integrated React Bits LineSidebar */}
              <LineSidebar
                items={SIDEBAR_ITEMS}
                accentColor="#FC6C26"
                textColor="#6E5C4E"
                markerColor="#D4C4A8"
                showIndex={true}
                showMarker={true}
                proximityRadius={85}
                maxShift={14}
                falloff="smooth"
                markerLength={30}
                markerGap={6}
                tickScale={0.5}
                scaleTick={true}
                itemGap={8}
                fontSize={0.85}
                smoothing={85}
                active={activeIndex !== -1 ? activeIndex : 0}
                onItemClick={handleItemClick}
                className="w-full"
              />
            </div>
          ) : (
            /* Compact Collapsed Icons */
            <div className="space-y-1 pt-2">
              {SIDEBAR_ITEMS.map((item, idx) => {
                const active = activeIndex === idx;
                const Icon = item.icon || Compass;
                return (
                  <Link
                    key={item.href}
                    href={item.href || "/"}
                    onClick={onCloseMobile}
                    title={`${item.label} (${item.sublabel || ""})`}
                    className={`flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-150 relative ${
                      active
                        ? "bg-[#FC6C26]/12 text-[#FC6C26] border border-[#FC6C26]/30 shadow-xs ring-1 ring-[#FC6C26]/20 font-bold"
                        : "text-[#6E5C4E] hover:text-[#231A14] hover:bg-[#FFF4D6]/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.badge && !active && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FC6C26]" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Rail Section: Telemetry & Collapse Control */}
        <div className="p-3 border-t border-[#E7D9BC]/12 space-y-2" style={{ background: 'transparent' }}>
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#FFF8E9]/25 border border-[#E7D9BC]/15 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      healthy ? "bg-emerald-500 shadow-xs shadow-emerald-500/50" : "bg-rose-500"
                    }`}
                  />
                  <span className="text-[#6E5C4E] font-medium">
                    {healthy ? "Engine Online" : "Engine Offline"}
                  </span>
                </div>
                <span className="text-[10px] text-[#8D7B68] font-bold">
                  {standardsCount} BIS
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#9B8977] px-1 font-mono">
                <span>PS #26108</span>
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="hidden lg:inline-flex items-center gap-1 text-[#8D7B68] hover:text-[#FC6C26] transition-colors cursor-pointer"
                  title="Collapse Command Rail"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Collapse</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg bg-[#FFF8E9]/25 border border-[#E7D9BC]/15 flex items-center justify-center text-xs"
                title={`${healthy ? "Engine Online" : "Engine Offline"} • ${standardsCount} Standards`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    healthy ? "bg-emerald-500 shadow-xs shadow-emerald-500/50" : "bg-rose-500"
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex w-8 h-8 rounded-lg border border-[#E7D9BC]/15 bg-[#FFF8E9]/20 text-[#6E5C4E] hover:text-[#FC6C26] items-center justify-center transition-colors cursor-pointer"
                title="Expand Command Rail"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
