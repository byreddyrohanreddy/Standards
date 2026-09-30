"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Cpu,
  Search,
  CheckCircle2,
  Network,
  Shield,
  Layers,
  Zap
} from "lucide-react";

const STAGES = [
  { label: "Understanding Requirement", icon: Cpu, desc: "Tokenizing technical specifications and constraints" },
  { label: "Extracting Parameters", icon: Zap, desc: "Isolating electrical/mechanical limits and materials" },
  { label: "Searching BIS Catalog", icon: Search, desc: "Executing dense semantic + sparse BM25 hybrid retrieval" },
  { label: "Auditing Version Lifecycle", icon: Shield, desc: "Checking active vs superseded editions & QCO status" },
  { label: "Enriching Knowledge Graph", icon: Network, desc: "Traversing normative references & test methods" },
  { label: "Generating Recommendation", icon: Sparkles, desc: "Synthesizing multi-factor scores & evidence rationale" },
];

export const AnalysisLoadingState: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="warm-glass rounded-3xl p-8 sm:p-10 border border-[#FC6C26]/40 shadow-xl shadow-[#D95218]/10 text-center space-y-6">
      {/* Central Luminous Orange Node */}
      <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-[#FC6C26]/20 animate-ping opacity-75" />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FC6C26] to-[#D95218] flex items-center justify-center text-white shadow-lg shadow-[#D95218]/30">
          <Sparkles className="w-7 h-7 animate-spin" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-[#231A14] tracking-tight">
          AI Standards Recommendation Engine Processing...
        </h3>
        <p className="text-xs text-[#6E5C4E] max-w-md mx-auto">
          Executing multi-stage neural retrieval, version auditing, and citation graph traversal.
        </p>
      </div>

      {/* 6 Processing Stages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-w-4xl mx-auto pt-2 text-left">
        {STAGES.map((stg, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;
          const Icon = stg.icon;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                isCurrent
                  ? "bg-[#FC6C26]/12 border-[#FC6C26] shadow-xs"
                  : isDone
                  ? "bg-white/80 border-[#E7D9BC]"
                  : "bg-white/40 border-[#E7D9BC]/50 opacity-60"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? "bg-[#FC6C26] text-white"
                    : isDone
                    ? "bg-emerald-500/15 text-emerald-700"
                    : "bg-[#FFF8E9] text-[#9B8977]"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[#231A14] truncate">
                  {stg.label}
                </div>
                <div className="text-[10px] text-[#6E5C4E] truncate">
                  {isCurrent ? "Analyzing..." : isDone ? "Completed" : stg.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
