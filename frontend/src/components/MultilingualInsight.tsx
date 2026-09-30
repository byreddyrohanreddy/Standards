"use client";

import React from "react";
import { Globe, Sparkles } from "lucide-react";

interface MultilingualInsightProps {
  isMultilingual?: boolean;
  semanticNote?: string;
  className?: string;
}

export const MultilingualInsight: React.FC<MultilingualInsightProps> = ({
  isMultilingual,
  semanticNote,
  className = "",
}) => {
  if (!isMultilingual) return null;

  return (
    <div
      className={`rounded-2xl p-4 border border-indigo-300/40 bg-gradient-to-r from-indigo-50/60 to-[#FFFAEF] space-y-2 ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center">
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-800">
          Language-Aware Match
        </span>
        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono font-bold text-indigo-700">
          Multilingual
        </span>
      </div>

      <p className="text-[11px] text-[#6E5C4E] leading-relaxed">
        Query processed using <strong className="text-indigo-800">multilingual semantic retrieval</strong>.
        Cross-language vocabulary bridging was applied to match Indian Standard specifications.
      </p>

      {semanticNote && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/60 border border-indigo-200/40">
          <Sparkles className="w-3.5 h-3.5 text-[#FC6C26] mt-0.5 shrink-0" />
          <p className="text-[11px] text-[#231A14] leading-relaxed font-medium">
            {semanticNote}
          </p>
        </div>
      )}
    </div>
  );
};
