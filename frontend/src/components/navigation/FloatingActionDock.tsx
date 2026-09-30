"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Sparkles,
  Upload,
  Search,
  Network,
  FileCheck2,
  Copy,
  Command,
  ArrowUp,
  X
} from "lucide-react";
import { useToast } from "../ui/Toast";

export interface FloatingActionDockProps {
  onOpenCommandPalette?: () => void;
  className?: string;
}

export const FloatingActionDock: React.FC<FloatingActionDockProps> = ({
  onOpenCommandPalette,
  className = "",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't show dock on landing page to keep landing clean
  if (pathname === "/") return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 print:hidden ${className}`}
      role="region"
      aria-label="Quick Actions Dock"
    >
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#FFFAEF]/90 backdrop-blur-xl border border-[#E7D9BC] shadow-xl shadow-[#D95218]/10 text-[#231A14] transition-all duration-200 hover:border-[#FC6C26]/40">
        {/* Analyze Requirement */}
        <Link
          href="/recommend"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            pathname === "/recommend"
              ? "bg-[#FC6C26] text-white shadow-sm shadow-[#FC6C26]/30"
              : "hover:bg-[#FFF6E3] text-[#6E5C4E] hover:text-[#231A14]"
          }`}
          title="New Recommendation Analysis"
        >
          <Sparkles className="w-3.5 h-3.5 text-current" />
          <span className="hidden sm:inline">Analyze</span>
        </Link>

        {/* Tender Audit */}
        <Link
          href="/audit"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            pathname === "/audit"
              ? "bg-[#FC6C26] text-white shadow-sm shadow-[#FC6C26]/30"
              : "hover:bg-[#FFF6E3] text-[#6E5C4E] hover:text-[#231A14]"
          }`}
          title="Tender Document Audit"
        >
          <FileCheck2 className="w-3.5 h-3.5 text-current" />
          <span className="hidden sm:inline">Audit</span>
        </Link>

        {/* Knowledge Graph */}
        <Link
          href="/graph"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            pathname === "/graph"
              ? "bg-[#FC6C26] text-white shadow-sm shadow-[#FC6C26]/30"
              : "hover:bg-[#FFF6E3] text-[#6E5C4E] hover:text-[#231A14]"
          }`}
          title="Explore Standards Graph"
        >
          <Network className="w-3.5 h-3.5 text-current" />
          <span className="hidden sm:inline">Graph</span>
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-[#E7D9BC]" />

        {/* Command Palette Trigger */}
        {onOpenCommandPalette && (
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-[#6E5C4E] hover:text-[#231A14] hover:bg-[#FFF6E3] transition-colors cursor-pointer"
            title="Command Palette (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#FC6C26]" />
            <kbd className="hidden md:inline text-[10px] font-mono text-[#8D7B68] bg-[#E7D9BC]/40 px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Scroll To Top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="p-1.5 rounded-xl text-[#8D7B68] hover:text-[#231A14] hover:bg-[#FFF6E3] transition-colors cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
