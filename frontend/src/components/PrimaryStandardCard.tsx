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
} from "lucide-react";
import { StandardMetadata } from "@/types";

interface Props {
  standard: StandardMetadata;
  onOpenGraph: () => void;
  onViewStandard: (std: StandardMetadata) => void;
}

export const PrimaryStandardCard: React.FC<Props> = ({
  standard,
  onOpenGraph,
  onViewStandard,
}) => {
  const [showAmendments, setShowAmendments] = useState(false);
  const score = standard.ai_relevance_score || 85;

  // Score color gradient
  const scoreColor =
    score >= 85
      ? "text-emerald-700 bg-emerald-50 border-emerald-300"
      : score >= 70
      ? "text-blue-700 bg-blue-50 border-blue-300"
      : "text-amber-700 bg-amber-50 border-amber-300";

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-blue-600/30 p-5 md:p-6 transition-all hover:border-blue-600/50">
      {/* Top Banner: Primary Badge + Score Gauge + Graph Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-700 text-white shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            ⭐ Recommended Primary Standard
          </span>

          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              standard.status === "current"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {standard.status === "current" ? "Active / Current Edition" : "Superseded"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Relevance Score Gauge */}
          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${scoreColor}`}>
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              AI Relevance Score:
            </span>
            <span className="text-lg font-black">{score}%</span>
          </div>

          <button
            type="button"
            onClick={onOpenGraph}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg shadow-2xs transition"
          >
            <Network className="w-4 h-4 text-blue-700" />
            Relationship Graph
          </button>
        </div>
      </div>

      {/* Main Standard Header: IS Number & Full Title */}
      <div className="mt-4">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
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

        <p className="text-sm font-semibold text-slate-700 mt-1 leading-snug">
          {standard.title}
        </p>

        {/* Scope */}
        <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <strong className="text-slate-800">Scope: </strong>
          {standard.scope}
        </p>
      </div>

      {/* Structured Explainability: Why Recommended */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Explainable Recommendation Evidence
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(standard.why_recommended || []).map((reason, idx) => (
            <div
              key={idx}
              className="text-xs text-slate-700 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/80 flex items-start gap-2"
            >
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Certification & Amendments Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* BIS Certification Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {standard.certification && standard.certification.length > 0 ? (
            standard.certification.map((cert, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md"
              >
                <Award className="w-3.5 h-3.5 text-indigo-700" />
                {cert}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 italic">
              Standard voluntary compliance
            </span>
          )}
        </div>

        {/* Amendments Toggle */}
        {standard.amendments && standard.amendments.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowAmendments(!showAmendments)}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <FileCheck className="w-3.5 h-3.5" />
              {standard.amendments.length} Active Amendments
              {showAmendments ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Collapsible Amendments List */}
      {showAmendments && standard.amendments && (
        <div className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-200 space-y-2 text-xs">
          <div className="font-bold text-blue-900">Official Amendments on Record:</div>
          {standard.amendments.map((am, idx) => (
            <div key={idx} className="bg-white p-2.5 rounded border border-blue-100">
              <div className="font-semibold text-slate-900">
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
