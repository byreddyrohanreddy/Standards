"use client";

import React from "react";
import { RequirementGroupResult } from "@/types";
import { Layers, CheckCircle2, ChevronRight, Cpu, Zap, ShieldAlert, Award } from "lucide-react";

export interface TenderItemRailProps {
  groups: RequirementGroupResult[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export const TenderItemRail: React.FC<TenderItemRailProps> = ({
  groups,
  selectedIndex,
  onSelect,
  className = "",
}) => {
  if (!groups || groups.length === 0) return null;

  return (
    <div
      className={`rounded-2xl border border-[#E7D9BC] bg-[#FFFAEF] p-4 shadow-xs space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-[#E7D9BC]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#FC6C26]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
            Tender Clause Decomposition ({groups.length} Items Detected)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#8D7B68]">
          Click item to inspect dedicated standard match
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {groups.map((grp, idx) => {
          const isSelected = selectedIndex === idx;
          const score = grp.primary_standard?.ai_relevance_score
            ? Math.round(
                grp.primary_standard.ai_relevance_score > 1
                  ? grp.primary_standard.ai_relevance_score
                  : grp.primary_standard.ai_relevance_score * 100
              )
            : 90;

          return (
            <button
              key={grp.group_id}
              type="button"
              onClick={() => onSelect(idx)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-[#FFF2DE] border-[#FC6C26] shadow-xs ring-2 ring-[#FC6C26]/20"
                  : "bg-[#FFF8EC] border-[#E7D9BC] hover:border-[#D4C4A8] hover:bg-[#FFF4D6]"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold text-[#FC6C26]">
                  0{idx + 1} // ITEM
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                  {score}% Match
                </span>
              </div>

              <div className="text-xs font-bold text-[#231A14] truncate mb-1">
                {grp.requirement_label}
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-[#E7D9BC]/50 text-[10px] font-mono">
                <span className="text-[#D95218] font-bold truncate">
                  {grp.primary_standard?.is_number || "Evaluating"}
                </span>
                <span className={isSelected ? "text-[#FC6C26] font-bold" : "text-[#8D7B68]"}>
                  {isSelected ? "Active" : "Select"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
