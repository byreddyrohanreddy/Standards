"use client";

import React from "react";
import { Cpu, Tag, Layers, Zap, CheckCircle, Compass, Shield, Wrench, Thermometer } from "lucide-react";
import { ExtractedRequirements } from "@/types";

interface Props {
  requirements: ExtractedRequirements;
}

export const RequirementUnderstandingCard: React.FC<Props> = ({ requirements }) => {
  const hasRatings = Object.keys(requirements.ratings || {}).length > 0;
  const hasMaterials = (requirements.materials || []).length > 0;
  const hasCompliance = (requirements.compliance_needs || []).length > 0;
  const hasDetectedStds = (requirements.detected_standards || []).length > 0;
  const hasSafety = (requirements.safety_requirements || []).length > 0;
  const hasTesting = (requirements.testing_requirements || []).length > 0;
  const hasPerformance = (requirements.performance_requirements || []).length > 0;

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
          <Cpu className="w-4 h-4 text-blue-700" />
          Requirement Understanding & Dynamic NLP Extraction
        </h3>
        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Generic 16-Field NLP Extractor
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Identified Product & Class */}
        <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            Identified Equipment / Product
          </div>
          <div className="text-sm font-bold text-slate-900">
            {requirements.product || "General Procurement Item"}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {requirements.product_type ? `${requirements.product_type} • ` : ""}
            <span className="font-medium text-slate-700">
              {requirements.industry_domain || requirements.domain || "General"} Domain
            </span>
          </div>
        </div>

        {/* Operating Environment & Context */}
        <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            Application & Context
          </div>
          <div className="text-sm font-bold text-slate-900">
            {requirements.application || "General Application"}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {requirements.ip_rating ? `Ingress Protection: ${requirements.ip_rating}` : "Standard operating conditions"}
          </div>
        </div>

        {/* Technical Ratings Extracted */}
        <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            Technical Parameters Extracted
          </div>
          {hasRatings ? (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(requirements.ratings).map(([key, val]) => (
                <span
                  key={key}
                  className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-300 shadow-2xs"
                >
                  <span className="text-slate-400 font-normal mr-1">{key}:</span>
                  {val}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">No specific numerical ratings detected</span>
          )}
        </div>
      </div>

      {/* Secondary Tags: Materials, Performance, Safety, Testing, Citations */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
        {hasMaterials && (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Materials:</span>
            {requirements.materials.map((m) => (
              <span key={m} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                {m}
              </span>
            ))}
          </div>
        )}

        {hasSafety && (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Shield className="w-3 h-3 text-red-600" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Safety:</span>
            {requirements.safety_requirements.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded font-medium">
                {s}
              </span>
            ))}
          </div>
        )}

        {hasTesting && (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Wrench className="w-3 h-3 text-emerald-600" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Testing:</span>
            {requirements.testing_requirements.map((t) => (
              <span key={t} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium">
                {t}
              </span>
            ))}
          </div>
        )}

        {hasPerformance && (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Performance:</span>
            {requirements.performance_requirements.map((p) => (
              <span key={p} className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-medium">
                {p}
              </span>
            ))}
          </div>
        )}

        {hasDetectedStds && (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Citations in Text:</span>
            {requirements.detected_standards.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded font-mono font-medium">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

