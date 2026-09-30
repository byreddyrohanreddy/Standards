"use client";

import React from "react";
import {
  BrainCircuit,
  Filter,
  Search,
  ShieldAlert,
  Network,
  Award,
  CheckCircle2,
  Loader2
} from "lucide-react";

export type PipelineStageId =
  | "understand"
  | "extract"
  | "retrieve"
  | "audit"
  | "connect"
  | "recommend";

export interface PipelineStage {
  id: PipelineStageId;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  engine: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "understand",
    label: "Understand",
    sublabel: "NLP Intent & Scope",
    icon: BrainCircuit,
    engine: "LLM Parser",
  },
  {
    id: "extract",
    label: "Extract",
    sublabel: "Parameters & Units",
    icon: Filter,
    engine: "NER Extraction",
  },
  {
    id: "retrieve",
    label: "Retrieve",
    sublabel: "Dense + BM25 Hybrid",
    icon: Search,
    engine: "Vector Search",
  },
  {
    id: "audit",
    label: "Audit",
    sublabel: "QCO & Active Version",
    icon: ShieldAlert,
    engine: "Govt Mandates",
  },
  {
    id: "connect",
    label: "Connect",
    sublabel: "Normative & Test DAG",
    icon: Network,
    engine: "Ontology Graph",
  },
  {
    id: "recommend",
    label: "Recommend",
    sublabel: "Score & Clause Match",
    icon: Award,
    engine: "5-Factor Ranker",
  },
];

export interface AnalysisPipelineProps {
  currentStage?: PipelineStageId | "idle" | "complete";
  completedStages?: PipelineStageId[];
  className?: string;
}

export const AnalysisPipeline: React.FC<AnalysisPipelineProps> = ({
  currentStage = "idle",
  completedStages = [],
  className = "",
}) => {
  const getStageStatus = (stageId: PipelineStageId) => {
    if (completedStages.includes(stageId)) return "complete";
    if (currentStage === stageId) return "active";
    if (currentStage === "complete") return "complete";
    return "pending";
  };

  return (
    <div
      className={`rounded-2xl border border-[#E7D9BC] bg-[#FFFAEF] p-4 sm:p-5 shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FC6C26] animate-pulse" />
          <h3 className="text-xs font-bold text-[#231A14] uppercase tracking-wider font-mono">
            6-Stage Standards Intelligence Pipeline
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#8D7B68]">
          all-MiniLM-L6-v2 Dense • BM25 Lexical • QCO Verification • Graph DAG
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative">
        {PIPELINE_STAGES.map((stage, idx) => {
          const status = getStageStatus(stage.id);
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`relative p-3 rounded-xl border transition-all flex flex-col justify-between ${
                status === "active"
                  ? "bg-[#FC6C26]/10 border-[#FC6C26] ring-2 ring-[#FC6C26]/20 shadow-xs"
                  : status === "complete"
                  ? "bg-emerald-500/8 border-emerald-500/30"
                  : "bg-[#FFF8EC] border-[#E7D9BC]/80 opacity-75"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    status === "active"
                      ? "bg-[#FC6C26] text-white border-[#FC6C26]"
                      : status === "complete"
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-[#FFFAEF] text-[#8D7B68] border-[#E7D9BC]"
                  }`}
                >
                  {status === "active" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : status === "complete" ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <span className="text-[10px] font-mono font-bold text-[#8D7B68]">
                  0{idx + 1}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#231A14] leading-tight">
                  {stage.label}
                </h4>
                <p className="text-[10px] text-[#6E5C4E] mt-0.5 leading-snug">
                  {stage.sublabel}
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-[#E7D9BC]/50 flex items-center justify-between text-[9px] font-mono">
                <span className="text-[#8D7B68] uppercase">{stage.engine}</span>
                <span
                  className={
                    status === "active"
                      ? "text-[#FC6C26] font-bold"
                      : status === "complete"
                      ? "text-emerald-700 font-bold"
                      : "text-[#8D7B68]"
                  }
                >
                  {status === "active"
                    ? "RUNNING"
                    : status === "complete"
                    ? "VERIFIED"
                    : "QUEUED"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
