"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Copy,
  Layers,
  ChevronRight,
  Shield,
  Network,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { StandardMetadata } from "@/types";
import { useToast } from "./ui/Toast";

interface StandardDetailDrawerProps {
  standard: StandardMetadata | null;
  onClose: () => void;
  onOpenClauseModal?: (standard: StandardMetadata) => void;
}

export const StandardDetailDrawer: React.FC<StandardDetailDrawerProps> = ({
  standard,
  onClose,
  onOpenClauseModal,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!standard) return null;

  const handleCopyClause = () => {
    const clause = `The equipment/materials shall strictly conform to Indian Standard ${standard.is_number} ("${standard.title}"). Routine and type testing must satisfy all normative requirements therein, and the manufacturer must hold a valid Bureau of Indian Standards (BIS) license under the applicable Quality Control Order.`;
    navigator.clipboard.writeText(clause);
    setCopied(true);
    toast({
      title: "Tender Clause Copied",
      description: `Formal procurement clause for ${standard.is_number} copied to clipboard`,
      type: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const isCurrent = standard.status === "current" || standard.status === "active";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {/* Slide-out Drawer Panel */}
        <div className="w-screen max-w-2xl bg-[#FFFAEF] border-l border-[#E7D9BC] shadow-2xl flex flex-col text-[#231A14] animate-in slide-in-from-right duration-200 ease-out">
          {/* Top Luminous Accent Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FC6C26] to-[#D95218]" />

          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#E7D9BC] bg-[#FFF8E9] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-base font-black text-[#D95218] bg-[#FC6C26]/12 px-3 py-1 rounded-xl border border-[#FC6C26]/30">
                {standard.is_number}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${
                  isCurrent
                    ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-900 border-amber-500/30"
                }`}
              >
                {isCurrent ? "CURRENT / ACTIVE" : "SUPERSEDED"}
              </span>
              {standard.certification && standard.certification.length > 0 && (
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#FC6C26]/15 text-[#D95218] border border-[#FC6C26]/30">
                  {standard.certification[0]}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-[#E7D9BC] bg-white text-[#6E5C4E] hover:text-[#231A14] hover:bg-[#FFF4D6] transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Title & Metadata */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#6E5C4E] flex items-center gap-2">
                <span>Domain: <strong className="text-[#231A14]">{standard.domain}</strong></span>
                <span className="text-[#E7D9BC]">•</span>
                <span>Edition: <strong className="text-[#231A14]">{standard.year || 2018}</strong></span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#231A14] tracking-tight leading-snug">
                {standard.title}
              </h2>
            </div>

            {/* Scope */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D95218] flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#FC6C26]" />
                Standard Scope & Regulatory Intent
              </h3>
              <div className="p-4 rounded-2xl bg-[#FFF8E9] border border-[#E7D9BC] text-xs sm:text-sm text-[#6E5C4E] leading-relaxed">
                {standard.scope ||
                  "Technical specification setting normative boundaries, material specifications, efficiency benchmarks, and mandatory verification procedures."}
              </div>
            </div>

            {/* Technical Parameters / Limits */}
            {standard.technical_parameters &&
              Object.keys(standard.technical_parameters).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D95218] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#FC6C26]" />
                    Technical Parameters & Limits
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {Object.entries(standard.technical_parameters).map(
                      ([key, val], idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-xl border border-[#E7D9BC] space-y-1 shadow-xs"
                        >
                          <div className="text-[10px] uppercase font-semibold text-[#9B8977] tracking-wider truncate">
                            {key.replace(/_/g, " ")}
                          </div>
                          <div className="font-mono font-bold text-[#231A14] text-xs sm:text-sm truncate">
                            {String(val)}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Mandatory Normative References */}
            {standard.normative_references &&
              standard.normative_references.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D95218] flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#FC6C26]" />
                    Normative References ({standard.normative_references.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {standard.normative_references.map((ref: string, idx: number) => (
                      <span
                        key={idx}
                        className="clay-chip font-mono text-xs text-[#231A14]"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Testing Requirements */}
            {standard.test_methods &&
              standard.test_methods.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D95218] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Testing Standards & Protocols
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {standard.test_methods.map((test: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-mono text-xs text-emerald-900 font-semibold"
                      >
                        {test}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Drawer Actions Footer */}
          <div className="p-5 border-t border-[#E7D9BC] bg-[#FFF8E9] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/graph?focus=${encodeURIComponent(standard.is_number)}`}
                className="tactile-btn-secondary px-3.5 py-2 text-xs font-semibold rounded-xl"
              >
                <Network className="w-3.5 h-3.5 text-[#FC6C26]" />
                <span>Open in Graph</span>
              </Link>

              <button
                type="button"
                onClick={
                  onOpenClauseModal
                    ? () => onOpenClauseModal(standard)
                    : handleCopyClause
                }
                className="tactile-btn-primary px-4 py-2 text-xs font-bold rounded-xl"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Clause Copied!" : "Tender Clause"}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-[#6E5C4E] hover:text-[#231A14] px-2 py-1"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Backwards compatibility export
export const StandardDetailModal = StandardDetailDrawer;
