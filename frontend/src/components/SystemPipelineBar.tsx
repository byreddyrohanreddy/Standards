"use client";

import React, { useState } from "react";
import { Workflow, ChevronRight, Info } from "lucide-react";

export const SystemPipelineBar: React.FC = () => {
  const [showExplanation, setShowExplanation] = useState(false);

  const steps = [
    { label: "DOCUMENT", desc: "NIT tender PDF or textual procurement requirement" },
    { label: "REQUIREMENTS", desc: "16-field generic NLP extraction for ratings & domains" },
    { label: "NORMALIZATION", desc: "Query term canonicalization & domain grounding" },
    { label: "HYBRID RETRIEVAL", desc: "BM25 lexical + all-MiniLM-L6-v2 dense semantic search" },
    { label: "GRAPH ENRICHMENT", desc: "759-edge DAG for normative, testing & safety codes" },
    { label: "RERANKING", desc: "Multi-factor standards-aware scoring & coverage weights" },
    { label: "EVIDENCE", desc: "Scope chunk extraction & confidence verification" },
    { label: "RECOMMENDATION", desc: "Primary IS, lifecycle audit & copy-to-tender clause" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-blue-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            System Architecture Pipeline
          </span>
          <span className="text-[10px] text-slate-500 font-medium hidden md:inline">
            • Grounded End-to-End Decision Flow
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowExplanation(!showExplanation)}
          className="inline-flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-900 font-medium self-start sm:self-auto"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showExplanation ? "Hide Stage Details" : "Inspect Pipeline Stages"}</span>
        </button>
      </div>

      {/* Pipeline Stages Trail */}
      <div className="flex items-center gap-1 overflow-x-auto py-1 text-[11px] font-mono scrollbar-thin">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div
              className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 whitespace-nowrap shrink-0 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-300 transition cursor-default"
              title={step.desc}
            >
              <span className="text-slate-400 font-sans text-[9px] mr-1">#{idx + 1}</span>
              <span className="font-bold">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {showExplanation && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs animate-in fade-in-50 duration-200">
          {steps.map((step, idx) => (
            <div key={step.label} className="p-2 rounded bg-slate-50 border border-slate-100">
              <div className="font-bold text-slate-900 font-mono text-[10px]">
                {idx + 1}. {step.label}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
