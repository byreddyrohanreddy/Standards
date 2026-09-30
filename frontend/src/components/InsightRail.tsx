"use client";

import React from "react";
import {
  Activity,
  Database,
  Network,
  Copy,
  Printer,
  ShieldCheck,
  Zap,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { StandardMetadata } from "@/types";

interface InsightRailProps {
  isLoading: boolean;
  score?: number;
  primaryStandard?: StandardMetadata | null;
  standardsCount?: number;
  onOpenGraph?: () => void;
  onOpenClause?: () => void;
  onViewStandard?: (std: StandardMetadata) => void;
}

export const InsightRail: React.FC<InsightRailProps> = ({
  isLoading,
  score,
  primaryStandard,
  standardsCount = 113,
  onOpenGraph,
  onOpenClause,
  onViewStandard,
}) => {
  return (
    <aside className="space-y-4">
      {/* 1. Contextual Intelligence Status */}
      <div className="warm-glass p-4 rounded-2xl border border-[#E7D9BC] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E7D9BC]/60">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FC6C26]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#231A14]">
              System Telemetry
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            {isLoading ? "Analyzing..." : "Engine Ready"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#FFF8E9] border border-[#E7D9BC]/60 space-y-0.5">
            <div className="text-[10px] text-[#9B8977] uppercase font-sans font-semibold">Indexed Codes</div>
            <div className="text-sm font-bold text-[#231A14]">{standardsCount} BIS</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF8E9] border border-[#E7D9BC]/60 space-y-0.5">
            <div className="text-[10px] text-[#9B8977] uppercase font-sans font-semibold">Graph Edges</div>
            <div className="text-sm font-bold text-[#231A14]">759 Normative</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF8E9] border border-[#E7D9BC]/60 space-y-0.5">
            <div className="text-[10px] text-[#9B8977] uppercase font-sans font-semibold">Active QCOs</div>
            <div className="text-sm font-bold text-[#FC6C26]">100% Audited</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF8E9] border border-[#E7D9BC]/60 space-y-0.5">
            <div className="text-[10px] text-[#9B8977] uppercase font-sans font-semibold">Recall@5</div>
            <div className="text-sm font-bold text-emerald-700">97.3% Benchmark</div>
          </div>
        </div>
      </div>

      {/* 2. Recommendation Snapshot if Available */}
      {primaryStandard && (
        <div className="warm-glass p-4 rounded-2xl border border-[#E7D9BC] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7D9BC]/60">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FC6C26]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#231A14]">
                Match Verdict
              </span>
            </div>
            {score !== undefined && (
              <span className="text-xs font-mono font-black text-[#D95218] bg-[#FC6C26]/12 px-2 py-0.5 rounded-md border border-[#FC6C26]/30">
                {score.toFixed(1)}% Match
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="font-mono text-xs font-bold text-[#D95218]">
              {primaryStandard.is_number}
            </div>
            <div className="text-xs font-bold text-[#231A14] line-clamp-2 leading-snug">
              {primaryStandard.title}
            </div>
            <div className="text-[11px] text-[#6E5C4E] font-medium pt-1">
              Domain: <strong className="text-[#231A14]">{primaryStandard.domain}</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E7D9BC]/60 space-y-2">
            {onOpenClause && (
              <button
                type="button"
                onClick={onOpenClause}
                className="w-full tactile-btn-primary py-2 text-xs font-bold rounded-xl"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Generate Tender Clause</span>
              </button>
            )}

            {onOpenGraph && (
              <button
                type="button"
                onClick={onOpenGraph}
                className="w-full tactile-btn-secondary py-2 text-xs font-bold rounded-xl"
              >
                <Network className="w-3.5 h-3.5 text-[#FC6C26]" />
                <span>Inspect Standards Network</span>
              </button>
            )}

            {onViewStandard && (
              <button
                type="button"
                onClick={() => onViewStandard(primaryStandard)}
                className="w-full text-center text-xs font-semibold text-[#D95218] hover:text-[#FC6C26] hover:underline pt-1 cursor-pointer transition flex items-center justify-center gap-1"
              >
                <span>Read Full Standard Specifications</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Quick Statutory Compliance Guide */}
      <div className="p-4 rounded-2xl bg-[#FFF8E9] border border-[#E7D9BC] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#231A14]">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>Statutory Compliance Gate</span>
        </div>
        <p className="text-[11px] text-[#6E5C4E] leading-relaxed">
          Indian Standards verified against DPIIT, Ministry of Power, and Heavy Industries Quality Control Orders (QCO) to satisfy GFR Rule 144.
        </p>
      </div>
    </aside>
  );
};
