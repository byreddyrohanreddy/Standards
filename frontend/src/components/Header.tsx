"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Sparkles,
  BookOpen,
  FileCheck2,
  FileSearch,
  Network,
  BarChart3,
  History,
  GitCompare,
  Info,
  Menu,
  X,
  Database,
  Compass,
  Activity
} from "lucide-react";
import { checkHealth } from "@/lib/api";

interface HeaderProps {
  apiHealthy?: boolean;
  standardsCount?: number;
}

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Compass },
  { href: "/recommend", label: "Workspace", icon: Sparkles, highlight: true },
  { href: "/standards", label: "Standards", icon: BookOpen },
  { href: "/audit", label: "Tender Audit", icon: FileSearch },
  { href: "/qco", label: "QCO Orders", icon: FileCheck2 },
  { href: "/graph", label: "Knowledge Graph", icon: Network },
  { href: "/evaluation", label: "Evaluation", icon: BarChart3 },
  { href: "/history", label: "History", icon: History },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/about", label: "About", icon: Info },
];

export const Header: React.FC<HeaderProps> = ({
  apiHealthy: initialHealth = true,
  standardsCount: initialCount = 113,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [healthy, setHealthy] = useState(initialHealth);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    checkHealth()
      .then((res) => {
        setHealthy(res.status === "healthy");
        if (res.standards_indexed) setCount(res.standards_indexed);
      })
      .catch(() => {
        setHealthy(false);
      });
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-2.5 z-50 max-w-7xl mx-auto px-3 sm:px-6 w-full mb-4">
      {/* Floating Warm Glass Command Bar */}
      <div className="relative rounded-2xl bg-[#FFFAEF]/90 backdrop-blur-xl border border-[#E7D9BC] shadow-lg shadow-[#D95218]/5 overflow-hidden">
        {/* Subtle luminous warm orange top reflection bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FC6C26]/70 to-[#D95218]/50" />

        {/* Command Bar Header Row */}
        <div className="px-4 py-2 sm:px-5 flex items-center justify-between gap-3">
          {/* Product Identity */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FC6C26] to-[#D95218] flex items-center justify-center text-white shadow-sm shadow-[#D95218]/30 transition-transform duration-150 group-hover:scale-105">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-[#231A14]">
                  BIS-Spec<span className="text-[#FC6C26]">AI</span>
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#FC6C26]/12 border border-[#FC6C26]/30 text-[#D95218] tracking-wider">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] font-medium text-[#6E5C4E] hidden sm:block">
                Technical Standards Engine & Procurement Verification
              </p>
            </div>
          </Link>

          {/* Right Status Telemetry & Primary CTA */}
          <div className="flex items-center gap-2">
            {/* Standards Count Chip */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFF8E9] border border-[#E7D9BC] text-xs font-mono text-[#6E5C4E]">
              <Database className="w-3.5 h-3.5 text-[#FC6C26]" />
              <span>
                <strong className="text-[#231A14]">{count}</strong> Standards
              </span>
            </div>

            {/* Engine Health Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFF8E9] border border-[#E7D9BC] text-xs font-mono text-[#6E5C4E]">
              <span className={`inline-block w-2 h-2 rounded-full ${healthy ? "bg-emerald-500" : "bg-rose-500"}`} />
              <span className="text-[11px] font-medium text-[#231A14] hidden sm:inline">
                {healthy ? "Engine Ready" : "Offline"}
              </span>
            </div>

            {/* Launch Workspace CTA */}
            <Link
              href="/recommend"
              className="tactile-btn-primary px-3 py-1.5 text-xs font-bold rounded-xl"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Spec</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg border border-[#E7D9BC] bg-[#FFF8E9] text-[#231A14] hover:text-[#FC6C26] transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links Strip */}
        <nav className="border-t border-[#E7D9BC]/60 bg-[#FFF8E9]/70 px-3 py-1">
          <div className="hidden md:flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#FC6C26]/12 text-[#D95218] border border-[#FC6C26]/30 shadow-xs"
                      : "text-[#6E5C4E] hover:text-[#231A14] hover:bg-white/60"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors ${
                      active ? "text-[#FC6C26]" : "text-[#9B8977]"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Collapsible Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-2 space-y-1 border-t border-[#E7D9BC] mt-1 animate-in fade-in-50 duration-150">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      active
                        ? "bg-[#FC6C26]/15 text-[#D95218] border border-[#FC6C26]/30"
                        : "text-[#6E5C4E] hover:bg-white/80 hover:text-[#231A14]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[#FC6C26]" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
