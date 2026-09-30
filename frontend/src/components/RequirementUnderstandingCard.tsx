"use client";

import React from "react";
import {
  Cpu,
  Zap,
  Shield,
  Layers,
  Sparkles,
  Gauge,
  Box,
  FileCheck
} from "lucide-react";
import { ExtractedRequirements } from "@/types";

interface RequirementUnderstandingCardProps {
  requirements: ExtractedRequirements;
}

export const RequirementUnderstandingCard: React.FC<RequirementUnderstandingCardProps> = ({
  requirements,
}) => {
  const extractedParams: Record<string, any> =
    (requirements as any).parameters || requirements.ratings || {};
  const hasParams = Object.keys(extractedParams).length > 0;
  const hasTests =
    requirements.testing_requirements &&
    requirements.testing_requirements.length > 0;
  const isSafetyCritical =
    Boolean((requirements as any).safety_critical) ||
    Boolean(requirements.safety_requirements && requirements.safety_requirements.length > 0);

  return (
    <div className="warm-glass rounded-2xl p-5 sm:p-6 border border-[#E7D9BC] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7D9BC]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FC6C26]/12 border border-[#FC6C26]/30 flex items-center justify-center text-[#D95218]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D95218]">
              Extracted Requirement Understanding
            </h3>
            <p className="text-[11px] text-[#6E5C4E] font-medium">
              NLP semantic entity extraction from procurement specification
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FFF8E9] border border-[#E7D9BC] text-[#6E5C4E]">
          Domain: {requirements.domain || "Engineering"}
        </span>
      </div>

      {/* Grouped Visual Clusters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* 1. Target Product */}
        <div className="p-3.5 rounded-xl bg-[#FFF8E9] border border-[#E7D9BC]/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#9B8977]">
            <Box className="w-3.5 h-3.5 text-[#FC6C26]" />
            <span>Target Equipment / Product</span>
          </div>
          <div className="text-xs font-bold text-[#231A14]">
            {requirements.product || "General Industrial Equipment"}
          </div>
        </div>

        {/* 2. Application & Environment */}
        <div className="p-3.5 rounded-xl bg-[#FFF8E9] border border-[#E7D9BC]/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#9B8977]">
            <Zap className="w-3.5 h-3.5 text-[#FC6C26]" />
            <span>Operating Application</span>
          </div>
          <div className="text-xs font-bold text-[#231A14]">
            {requirements.application || "Standard Operation"}
          </div>
        </div>

        {/* 3. Safety Criticality */}
        <div className="p-3.5 rounded-xl bg-[#FFF8E9] border border-[#E7D9BC]/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#9B8977]">
            <Shield className="w-3.5 h-3.5 text-[#FC6C26]" />
            <span>Safety Criticality</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
              isSafetyCritical
                ? "bg-rose-500/15 text-rose-800 border border-rose-500/30"
                : "bg-emerald-500/15 text-emerald-800 border border-emerald-500/30"
            }`}>
              {isSafetyCritical ? "Safety-Critical Rigor Required" : "Standard Industrial Duty"}
            </span>
          </div>
        </div>
      </div>

      {/* Technical Parameters Tokens */}
      {hasParams && (
        <div className="space-y-2 pt-1">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E5C4E] flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-[#FC6C26]" />
            <span>Extracted Specifications & Parameter Limits:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(extractedParams).map(([key, val], idx) => (
              <div
                key={idx}
                className="clay-chip text-xs"
              >
                <span className="text-[#9B8977] uppercase text-[9px] font-mono">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="font-mono font-bold text-[#231A14]">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Requirements & Materials if present */}
      {hasTests && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E5C4E] flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-[#FC6C26]" />
            <span>Mandatory Verification Tests Identified:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {requirements.testing_requirements!.map((test, idx) => (
              <span
                key={idx}
                className="clay-chip text-[11px]"
              >
                {test}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
