"use client";

import React, { useState } from "react";
import {
  Star,
  CheckCircle2,
  AlertCircle,
  Network,
  Award,
  Calendar,
  BookOpen,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Layers,
  FileText
} from "lucide-react";
import { StandardMetadata } from "@/types";

interface Props {
  standard: StandardMetadata;
  semanticNote?: string;
  onOpenGraph: () => void;
  onViewStandard: (std: StandardMetadata) => void;
}

export const PrimaryStandardCard: React.FC<Props> = ({
  standard,
  semanticNote,
  onOpenGraph,
  onViewStandard,
}) => {
  const [showEvidence, setShowEvidence] = useState(false);
  const [showAmendments, setShowAmendments] = useState(false);
  const score = standard.ai_relevance_score || 85;

  // Score bar colors
  const barColor =
    score >= 85
      ? "bg-emerald-600"
      : score >= 70
      ? "bg-blue-600"
      : "bg-amber-500";

  return (
    <div className="bg-white rounded-xl shadow-xs border-2 border-blue-600/30 p-5 md:p-6 transition-all hover:border-blue-600/50">
      {/* 1. Header: Primary Badge + Graph Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-700 text-white shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            ⭐ PRIMARY APPLICABLE STANDARD
          </span>

          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              standard.status === "current"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {standard.status === "current" ? "Active / Current Edition" : "Superseded Edition"}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenGraph}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg shadow-2xs transition self-start sm:self-auto"
        >
          <Network className="w-4 h-4 text-blue-700" />
          Relationship Graph
        </button>
      </div>

      {/* 2. Standard Identification: IS Number & Title */}
      <div className="mt-4">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
            {standard.is_number}
          </h3>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Edition: {standard.year}
          </span>
          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium border border-slate-200">
            {standard.domain}
          </span>
        </div>

        <p className="text-base font-bold text-slate-800 mt-1 leading-snug">
          {standard.title}
        </p>
      </div>

      {/* 3. AI Relevance Score Bar (Visual Gauge) */}
      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            AI Relevance Score
          </span>
          <span className="font-mono text-base font-black text-slate-900">{score}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
          />
        </div>
      </div>

      {/* 4. Semantic vs Keyword Insight (if triggered by paraphrased wording) */}
      {(semanticNote || standard.semantic_insight) && (
        <div className="mt-3.5 p-3 bg-indigo-50/70 rounded-lg border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-[11px] uppercase tracking-wider text-indigo-800">
              Semantic Vector Match (SentenceTransformer all-MiniLM-L6-v2)
            </div>
            <p className="mt-0.5 leading-relaxed text-indigo-950">
              {semanticNote || standard.semantic_insight}
            </p>
          </div>
        </div>
      )}

      {/* 5. WHY RECOMMENDED (Structured 4-Point Checklist) */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Why Recommended
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(standard.why_recommended || [
            "Product category and function match specification requirements",
            "Technical parameters align with standard performance parameters",
            "Application context matches standard scope",
            `Current active edition (${standard.year}) on official record`
          ]).map((reason, idx) => (
            <div
              key={idx}
              className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2"
            >
              <span className="text-emerald-600 font-bold text-sm leading-none">✓</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Collapsible "View Evidence" Drawer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowEvidence(!showEvidence)}
          className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 py-1 px-2.5 rounded-md bg-blue-50 border border-blue-200 transition"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{showEvidence ? "Hide Retrieved Evidence Snippets" : "View Retrieved Evidence Snippets"}</span>
          {showEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Amendments Action */}
        {standard.amendments && standard.amendments.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAmendments(!showAmendments)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{standard.amendments.length} Active Amendments</span>
            {showAmendments ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Expanded Evidence Details */}
      {showEvidence && (
        <div className="mt-3 p-4 bg-slate-50/90 rounded-lg border border-slate-200 space-y-3 text-xs animate-in fade-in-50 duration-200">
          <div>
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
              Retrieved Standard Scope:
            </span>
            <p className="mt-1 text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px]">
              "{standard.scope}"
            </p>
          </div>

          {standard.evidence_items && standard.evidence_items.length > 0 && (
            <div>
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Verified Specification Matches:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                {standard.evidence_items.map((item, i) => (
                  <div key={i} className="bg-white p-2 rounded border border-slate-200 flex items-start gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 shrink-0">
                      {item.criterion}
                    </span>
                    <span className="text-[11px] text-slate-700">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expanded Amendments List */}
      {showAmendments && standard.amendments && (
        <div className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-200 space-y-2 text-xs">
          <div className="font-bold text-blue-900">Official Amendments on Record:</div>
          {standard.amendments.map((am, idx) => (
            <div key={idx} className="bg-white p-2.5 rounded border border-blue-100">
              <div className="font-semibold text-slate-900 font-mono">
                {am.number} ({am.year})
              </div>
              <div className="text-slate-600 mt-0.5">{am.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

