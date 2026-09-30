"use client";

import React from "react";
import {
  ListFilter,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Sliders,
  ExternalLink,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { StandardMetadata } from "@/types";
import { SecondaryButton, Button } from "./ui/Button";

export type CandidateItem = StandardMetadata & {
  rank?: number;
  score?: number;
  match_explanation?: string;
};

export interface CandidateStandardsListProps {
  candidates: CandidateItem[] | StandardMetadata[];
  onSelectStandard?: (std: StandardMetadata) => void;
  className?: string;
}

export const CandidateStandardsList: React.FC<CandidateStandardsListProps> = ({
  candidates,
  onSelectStandard,
  className = "",
}) => {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 border border-[#E7D9BC] bg-[#FFFAEF] shadow-xs space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7D9BC]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FC6C26]/12 border border-[#FC6C26]/30 flex items-center justify-center text-[#D95218]">
            <ListFilter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D95218]">
              Alternative Candidate Standards
            </h3>
            <p className="text-[11px] text-[#6E5C4E] font-medium">
              Ranked comparison pool evaluated during 2-stage hybrid retrieval
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#8D7B68] bg-[#FFF8EC] px-2 py-0.5 rounded border border-[#E7D9BC]">
          {candidates.length} Standards Evaluated
        </span>
      </div>

      {/* Candidate Comparison Grid */}
      <div className="space-y-2.5">
        {candidates.map((cand, idx) => {
          const rawScore = cand.ai_relevance_score ?? (cand as any).score ?? 0;
          const scorePercent = rawScore > 1 ? rawScore.toFixed(1) : (rawScore * 100).toFixed(1);
          const rank = (cand as any).rank || idx + 1;
          const isRank1 = rank === 1;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isRank1
                  ? "bg-[#FFF8EC] border-[#FC6C26]/40 shadow-xs"
                  : "bg-[#FFFAEF] hover:bg-[#FFF6E3] border-[#E7D9BC]"
              }`}
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isRank1
                        ? "bg-gradient-to-r from-[#FC6C26] to-[#D95218] text-white"
                        : "bg-[#FFF8EC] text-[#6E5C4E] border border-[#E7D9BC]"
                    }`}
                  >
                    Rank #{rank}
                  </span>
                  <span className="font-mono text-xs font-black text-[#231A14]">
                    {cand.is_number}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#D95218] bg-[#FC6C26]/10 border border-[#FC6C26]/20 px-2 py-0.5 rounded">
                    {scorePercent}% Match
                  </span>
                  {cand.domain && (
                    <span className="text-[10px] font-mono text-[#8D7B68] hidden md:inline">
                      • {cand.domain}
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-[#231A14] truncate">
                  {cand.title}
                </div>

                <p className="text-[11px] text-[#6E5C4E] line-clamp-1 leading-relaxed">
                  {(cand as any).match_explanation || cand.scope || "Evaluated standard specifications and testing criteria."}
                </p>
              </div>

              {onSelectStandard && (
                <div className="shrink-0 pt-2 sm:pt-0">
                  <SecondaryButton
                    size="sm"
                    onClick={() => onSelectStandard(cand as unknown as StandardMetadata)}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  >
                    Inspect
                  </SecondaryButton>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
