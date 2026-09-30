"use client";

import React from "react";
import { History, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { StandardMetadata } from "@/types";

export interface VersionTimelineProps {
  standard: StandardMetadata;
  className?: string;
}

export const VersionTimeline: React.FC<VersionTimelineProps> = ({
  standard,
  className = "",
}) => {
  const isCurrent = standard.status === "current" || standard.status === "active";
  const supersedes = standard.supersedes || [];
  const supersededBy = standard.superseded_by;

  return (
    <div
      className={`rounded-2xl border border-[#E7D9BC] bg-[#FFFAEF] p-4 shadow-xs space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-[#E7D9BC]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#FC6C26]" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
            Standards Version Lineage
          </h4>
        </div>
        <span
          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
            isCurrent
              ? "bg-emerald-500/10 text-emerald-800 border border-emerald-500/25"
              : "bg-amber-500/15 text-amber-900 border border-amber-500/30"
          }`}
        >
          {isCurrent ? "ACTIVE IN GAZETTE" : "SUPERSEDED"}
        </span>
      </div>

      {/* Stepper / Timeline Nodes */}
      <div className="space-y-2 pt-1">
        {/* Preceding / Withdrawn edition */}
        {supersedes.length > 0 && (
          <div className="flex items-start gap-2.5 text-xs font-mono">
            <div className="w-5 h-5 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center shrink-0 text-neutral-600 mt-0.5 text-[10px]">
              01
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-neutral-500 line-through">
                <span>{supersedes.join(", ")}</span>
              </div>
              <span className="text-[10px] text-neutral-400">Withdrawn / Replaced</span>
            </div>
          </div>
        )}

        {/* Current Node */}
        <div className="flex items-start gap-2.5 text-xs font-mono">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white mt-0.5 text-[10px] font-bold ${
              isCurrent ? "bg-[#FC6C26] shadow-xs" : "bg-amber-500"
            }`}
          >
            {isCurrent ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <strong className="text-[#231A14]">{standard.is_number}</strong>
              <span className="text-[10px] text-[#8D7B68]">({standard.year || "Current"})</span>
            </div>
            <span className={`text-[10px] ${isCurrent ? "text-emerald-700 font-semibold" : "text-amber-800"}`}>
              {isCurrent ? "Official Enforced Edition" : "Outdated Specification"}
            </span>
          </div>
        </div>

        {/* Subsequent Replacement (if superseded) */}
        {!isCurrent && supersededBy && (
          <div className="flex items-start gap-2.5 text-xs font-mono pt-1">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold shadow-xs">
              →
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <strong className="text-emerald-900">{supersededBy}</strong>
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                  MANDATORY REPLACEMENT
                </span>
              </div>
              <span className="text-[10px] text-emerald-700">Must be cited in tender NIT to avoid disqualification</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
