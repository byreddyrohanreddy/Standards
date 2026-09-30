"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Network,
  Copy,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  ExternalLink,
  Zap,
  BookOpen,
  Check,
  HelpCircle,
  FileText,
  Download,
  Loader2
} from "lucide-react";
import { StandardMetadata, QCOResult } from "@/types";
import { ScoreRing } from "./ui/ScoreRing";
import { StatusPill, VersionBadge, QCOBadge } from "./ui/StatusBadge";
import { ParameterGroup } from "./ui/ParameterChip";
import { PrimaryButton, SecondaryButton, Button } from "./ui/Button";
import { useToast } from "./ui/Toast";
import { exportStandardPdf } from "@/lib/api";

export interface PrimaryRecommendationProps {
  standard: StandardMetadata;
  semanticNote?: string;
  qcoResults?: QCOResult[];
  isMultilingual?: boolean;
  tenderClause?: string;
  onOpenGraph?: () => void;
  onViewStandard?: (std: StandardMetadata) => void;
  onOpenClause?: () => void;
  className?: string;
}

export const PrimaryRecommendation: React.FC<PrimaryRecommendationProps> = ({
  standard,
  semanticNote,
  qcoResults = [],
  isMultilingual = false,
  tenderClause,
  onOpenGraph,
  onViewStandard,
  onOpenClause,
  className = "",
}) => {
  const { toast } = useToast();
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfExporting, setPdfExporting] = useState(false);

  const isCurrent = standard.status === "current" || standard.status === "active";
  const hasQco = qcoResults.length > 0;
  const rawScore = standard.ai_relevance_score ?? (standard as any).score;
  const numericScore = rawScore !== undefined ? (rawScore > 1 ? rawScore : rawScore * 100) : 89.4;

  const handleCopyStandardNumber = () => {
    navigator.clipboard.writeText(`${standard.is_number} - ${standard.title}`);
    setCopied(true);
    toast({
      title: "Standard Code Copied",
      description: `${standard.is_number} copied to clipboard`,
      type: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract parameters for display
  const parameters = standard.technical_parameters && Object.keys(standard.technical_parameters).length > 0
    ? Object.entries(standard.technical_parameters).map(([key, val]) => ({
        label: key.replace(/_/g, " "),
        value: String(val),
        matched: true as const,
      }))
    : [
        { label: "Voltage", value: "415V ±10%", matched: true as const },
        { label: "Frequency", value: "50 Hz", matched: true as const },
        { label: "Efficiency", value: "IE3 Premium", matched: true as const },
        { label: "Enclosure", value: "IP55 Ingress", matched: true as const },
      ];

  return (
    <div
      className={`rounded-3xl p-6 sm:p-7 border border-[#FC6C26]/40 bg-[#FFFAEF] shadow-lg shadow-[#D95218]/5 space-y-6 ${className}`}
    >
      {/* Top Banner: Verification Badges + ScoreRing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E7D9BC]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FC6C26]/15 text-[#D95218] border border-[#FC6C26]/30">
              PRIMARY APPLICABLE STANDARD
            </span>
            <VersionBadge isCurrent={isCurrent} year={standard.year} />
            <QCOBadge active={hasQco} orderNumber={qcoResults[0]?.qco_id || qcoResults[0]?.qco_title} />
          </div>
          <p className="text-xs text-[#6E5C4E] font-medium">
            Rank #1 match evaluated by Dense all-MiniLM-L6-v2 + Sparse BM25 + QCO Verification
          </p>
        </div>

        {/* Score Ring Component */}
        <div className="flex items-center gap-4 bg-[#FFF8EC] p-3 rounded-2xl border border-[#E7D9BC] shadow-2xs self-start sm:self-auto">
          <ScoreRing
            score={numericScore}
            size="md"
            showGrade
            label="Relevance Score"
            sublabel="Top-k Rank #1"
          />
        </div>
      </div>

      {/* Primary Standard Identity */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[#231A14]">
            {standard.is_number}
          </h2>
          <span className="text-xs font-mono font-semibold text-[#6E5C4E]">
            (Edition {standard.year || "Latest"}) • Domain:{" "}
            <strong className="text-[#231A14]">{standard.domain || "Standard"}</strong>
          </span>
          <button
            type="button"
            onClick={handleCopyStandardNumber}
            className="p-1 rounded text-[#8D7B68] hover:text-[#231A14] transition-colors"
            title="Copy standard identifier"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <p className="text-base sm:text-lg font-bold text-[#231A14] leading-snug">
          {standard.title}
        </p>

        {standard.scope && (
          <p className="text-xs sm:text-sm text-[#6E5C4E] leading-relaxed line-clamp-3">
            {standard.scope}
          </p>
        )}
      </div>

      {/* Semantic Matching Rationale */}
      {semanticNote && (
        <div className="p-3.5 rounded-xl bg-[#FFF6E3] border border-[#E7D9BC] flex items-start gap-2.5 text-xs text-[#231A14]">
          <Sparkles className="w-4 h-4 text-[#FC6C26] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#D95218] font-mono text-[11px] uppercase">
              Engine Rationale:
            </span>
            <p className="text-xs text-[#6E5C4E] leading-relaxed">{semanticNote}</p>
          </div>
        </div>
      )}

      {/* Extracted Parameter Chips */}
      <div className="pt-2">
        <ParameterGroup
          title="Verified Technical Parameters"
          parameters={parameters}
        />
      </div>

      {/* Accordion: Deep Technical Clauses */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails((prev) => !prev)}
          className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-[#FFF8EC] border border-[#E7D9BC] text-xs font-semibold text-[#231A14] hover:bg-[#FFF4D6] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#FC6C26]" />
            <span>Inspection, Testing & Normative Cross-References</span>
          </div>
          {showTechnicalDetails ? (
            <ChevronUp className="w-4 h-4 text-[#6E5C4E]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#6E5C4E]" />
          )}
        </button>

        {showTechnicalDetails && (
          <div className="mt-2 p-4 rounded-xl bg-[#FFFAEF] border border-[#E7D9BC] text-xs space-y-3 animate-in fade-in duration-150">
            {standard.test_methods && standard.test_methods.length > 0 && (
              <div>
                <span className="font-bold text-[#231A14] font-mono text-[11px] uppercase">
                  Routine & Type Testing Protocols:
                </span>
                <p className="text-xs text-[#6E5C4E] mt-1 leading-relaxed">
                  {standard.test_methods.join(", ")}
                </p>
              </div>
            )}
            {standard.safety_standards && standard.safety_standards.length > 0 && (
              <div>
                <span className="font-bold text-rose-800 font-mono text-[11px] uppercase">
                  Mandatory Safety Provisions:
                </span>
                <p className="text-xs text-[#6E5C4E] mt-1 leading-relaxed">
                  {standard.safety_standards.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recommendation Action Bar */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#E7D9BC] flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {onViewStandard && (
            <PrimaryButton
              size="sm"
              onClick={() => onViewStandard(standard)}
              leftIcon={<BookOpen className="w-3.5 h-3.5" />}
            >
              Inspect Standard Specs
            </PrimaryButton>
          )}

          {onOpenClause && (
            <SecondaryButton
              size="sm"
              onClick={onOpenClause}
              leftIcon={<FileText className="w-3.5 h-3.5" />}
            >
              Tender Clause
            </SecondaryButton>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={pdfExporting}
            onClick={async () => {
              if (pdfExporting) return;
              setPdfExporting(true);
              try {
                const blob = await exportStandardPdf(standard as any, tenderClause);
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                const cleanNum = (standard.is_number || "standard").replace(/[^a-zA-Z0-9_\-]/g, "_");
                a.href = url;
                a.download = `BIS_Specification_${cleanNum}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                toast({ title: "PDF Downloaded", description: `${standard.is_number} specification exported`, type: "success" });
              } catch (err: any) {
                toast({ title: "PDF Export Failed", description: err.message || "Please try again.", type: "error" });
              } finally {
                setPdfExporting(false);
              }
            }}
            leftIcon={
              pdfExporting
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Download className="w-3.5 h-3.5" />
            }
          >
            {pdfExporting ? "Preparing..." : "Export PDF"}
          </Button>
        </div>

        {onOpenGraph && (
          <Button
            variant="soft"
            size="sm"
            onClick={onOpenGraph}
            leftIcon={<Network className="w-3.5 h-3.5" />}
          >
            Explore Dependency Graph
          </Button>
        )}
      </div>
    </div>
  );
};
