"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Sparkles,
  BookOpen,
  FileSearch,
  FileCheck2,
  Network,
  History,
  GitCompare,
  BarChart3,
  Info,
  Compass,
  CheckCircle2,
  Database,
  ArrowRight
} from "lucide-react";
import { checkHealth } from "@/lib/api";

import { StatusDot } from "./ui/StatusBadge";
import { Search } from "lucide-react";

interface ContextToolbarProps {
  onOpenMobileRail: () => void;
  onOpenCommandPalette?: () => void;
}

interface RouteContext {
  title: string;
  badge: string;
  description: string;
  primaryAction?: {
    href: string;
    label: string;
    icon: React.ElementType;
  };
}

const ROUTE_CONTEXTS: Record<string, RouteContext> = {
  "/": {
    title: "AI Procurement Control Center",
    badge: "Command Station",
    description: "Multi-parameter BIS Standards recommendation and compliance engine",
    primaryAction: {
      href: "/recommend",
      label: "Open Workspace",
      icon: Sparkles,
    },
  },
  "/recommend": {
    title: "AI Recommendation Engine",
    badge: "Workspace",
    description: "Semantic parameter mapping, QCO enforcement and normative standard verification",
    primaryAction: {
      href: "/audit",
      label: "Audit Tender PDF",
      icon: FileSearch,
    },
  },
  "/standards": {
    title: "BIS Standards Catalog",
    badge: "113 Standards",
    description: "Searchable technical repository with normative clauses and testing mandates",
    primaryAction: {
      href: "/recommend",
      label: "Match Requirement",
      icon: Sparkles,
    },
  },
  "/audit": {
    title: "Tender Compliance Audit",
    badge: "Document Intelligence",
    description: "Full-text NIT verification, obsolete standard detection and QCO gap analysis",
    primaryAction: {
      href: "/audit/new",
      label: "New Document Audit",
      icon: FileSearch,
    },
  },
  "/qco": {
    title: "Quality Control Orders (QCO)",
    badge: "Regulatory Mandates",
    description: "Central Government mandatory certification orders under BIS Act Section 16",
    primaryAction: {
      href: "/recommend",
      label: "Verify Product QCO",
      icon: Sparkles,
    },
  },
  "/graph": {
    title: "Standards Knowledge Graph",
    badge: "Ontology Canvas",
    description: "Interactive graph mapping normative, testing, safety and installation dependencies",
    primaryAction: {
      href: "/standards",
      label: "Explore Standards",
      icon: BookOpen,
    },
  },
  "/history": {
    title: "Audit Log & History",
    badge: "Session Telemetry",
    description: "Review prior specification analyses, parameter extractions and verification runs",
    primaryAction: {
      href: "/recommend",
      label: "New Analysis",
      icon: Sparkles,
    },
  },
  "/compare": {
    title: "Standards Comparator",
    badge: "Diffing Engine",
    description: "Side-by-side technical requirement, test code and edition comparison",
    primaryAction: {
      href: "/standards",
      label: "Select Standards",
      icon: BookOpen,
    },
  },
  "/evaluation": {
    title: "Benchmark & Evaluation Metrics",
    badge: "Telemetry",
    description: "Top-k retrieval accuracy, semantic coverage and response latency metrics",
    primaryAction: {
      href: "/recommend",
      label: "Test Engine",
      icon: Sparkles,
    },
  },
  "/about": {
    title: "System Architecture & Specifications",
    badge: "SIH 2026 PS #26108",
    description: "Problem statement documentation, pipeline architecture and technical stack",
    primaryAction: {
      href: "/recommend",
      label: "Try Workspace",
      icon: Sparkles,
    },
  },
};

export const ContextToolbar: React.FC<ContextToolbarProps> = ({
  onOpenMobileRail,
  onOpenCommandPalette,
}) => {
  const pathname = usePathname();
  const [healthy, setHealthy] = useState<boolean>(true);
  const [count, setCount] = useState<number>(113);

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

  // Determine current context based on pathname
  let currentContext = ROUTE_CONTEXTS[pathname];
  if (!currentContext) {
    if (pathname.startsWith("/standards/")) {
      currentContext = {
        title: "Standard Detail View",
        badge: "Technical Specification",
        description: "Full normative scope, testing requirements and regulatory mandate",
        primaryAction: {
          href: "/standards",
          label: "All Standards",
          icon: BookOpen,
        },
      };
    } else if (pathname.startsWith("/audit/")) {
      currentContext = {
        title: "Tender Audit Report",
        badge: "Verification Report",
        description: "Detailed document analysis findings and compliance discrepancies",
        primaryAction: {
          href: "/audit",
          label: "Audit List",
          icon: FileSearch,
        },
      };
    } else {
      currentContext = ROUTE_CONTEXTS["/recommend"];
    }
  }

  const ActionIcon = currentContext.primaryAction?.icon;

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FFF4D6]/20 backdrop-blur-sm border-b border-[#E7D9BC]/15 py-2.5 px-4 sm:px-6">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Mobile Rail Toggle + Route Context Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileRail}
            className="lg:hidden p-2 rounded-xl border border-[#E7D9BC] bg-[#FFF8E9] text-[#6E5C4E] hover:text-[#231A14] hover:bg-[#FFF4D6] transition-colors cursor-pointer shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-[#231A14] truncate">
                {currentContext.title}
              </h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#FFF8E9] border border-[#E7D9BC] text-[#D95218] hidden sm:inline-block">
                {currentContext.badge}
              </span>
            </div>
            <p className="text-[11px] text-[#6E5C4E] font-medium truncate hidden md:block">
              {currentContext.description}
            </p>
          </div>
        </div>

        {/* Right: Search / Command Palette + Engine Telemetry + Contextual Action */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Command Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#FFF8EC] border border-[#E7D9BC] text-xs text-[#6E5C4E] hover:text-[#231A14] hover:bg-[#FFF4D6] transition-colors cursor-pointer"
              title="Open Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#FC6C26]" />
              <span className="hidden sm:inline text-[11px] font-medium">Quick Jump</span>
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono text-[#8D7B68] bg-[#E7D9BC]/35 border border-[#E7D9BC] rounded">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Status Chip */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#FFF8E9] border border-[#E7D9BC] text-[11px] font-mono text-[#6E5C4E]">
            <StatusDot status={healthy ? "ready" : "danger"} pulse={healthy} />
            <span className="text-[#231A14] font-medium hidden lg:inline">
              Engine Ready
            </span>
            <span className="text-[#E7D9BC] hidden lg:inline">•</span>
            <span>
              <strong className="text-[#231A14]">{count}</strong> Standards
            </span>
          </div>

          {/* Primary Quick CTA */}
          {currentContext.primaryAction && (
            <Link
              href={currentContext.primaryAction.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FC6C26] to-[#D95218] text-white text-xs font-bold shadow-sm shadow-[#FC6C26]/20 hover:brightness-105 active:scale-95 transition-all"
            >
              {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
              <span>{currentContext.primaryAction.label}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
