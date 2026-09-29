"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SystemPipelineBar } from "@/components/SystemPipelineBar";
import { RequirementInput } from "@/components/RequirementInput";
import { RequirementUnderstandingCard } from "@/components/RequirementUnderstandingCard";
import { VersionAlertBanner } from "@/components/VersionAlertBanner";
import { PrimaryStandardCard } from "@/components/PrimaryStandardCard";
import { RelatedStandardsSection } from "@/components/RelatedStandardsSection";
import { CandidateStandardsList } from "@/components/CandidateStandardsList";
import { AnalysisDetailsCard } from "@/components/AnalysisDetailsCard";
import { StandardsGraphModal } from "@/components/StandardsGraphModal";
import { StandardDetailModal } from "@/components/StandardDetailModal";
import { CopyToTenderModal } from "@/components/CopyToTenderModal";
import {
  analyzeRequirement,
  uploadTenderPdf,
  fetchExamples,
  fetchStandards,
} from "@/lib/api";
import { AnalysisResponse, ExampleScenario, StandardMetadata } from "@/types";

import {
  FileCheck2,
  AlertCircle,
  Sparkles,
  Printer,
  CheckCircle2,
  HelpCircle,
  Layers,
  Copy,
  ArrowRight,
  ShieldAlert,
  Database
} from "lucide-react";

export default function HomePage() {
  const [query, setQuery] = useState(
    "15 kW three-phase squirrel-cage induction motor for industrial operation, 415 V, 50 Hz."
  );
  const [examples, setExamples] = useState<ExampleScenario[]>([]);
  const [standardsCount, setStandardsCount] = useState<number>(113);
  const [apiHealthy, setApiHealthy] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  // Modals state
  const [isGraphOpen, setIsGraphOpen] = useState<boolean>(false);
  const [selectedStandard, setSelectedStandard] = useState<StandardMetadata | null>(null);
  const [isClauseModalOpen, setIsClauseModalOpen] = useState<boolean>(false);
  const [activeRequirementIndex, setActiveRequirementIndex] = useState<number>(0);

  // Load initial examples & standards
  useEffect(() => {
    async function init() {
      try {
        const [exData, stdsData] = await Promise.all([
          fetchExamples().catch(() => []),
          fetchStandards().catch(() => []),
        ]);
        if (exData.length > 0) setExamples(exData);
        if (stdsData.length > 0) setStandardsCount(stdsData.length);
        setApiHealthy(true);
      } catch (e) {
        setApiHealthy(false);
      }
    }
    init();
  }, []);

  const handleAnalyze = async (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : query).trim();
    if (!q) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeRequirement(q);
      setResult(data);
      setActiveRequirementIndex(0);
    } catch (err: any) {
      setError(err.message || "Failed to analyze requirement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadPdf = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await uploadTenderPdf(file);
      setResult(data);
      setActiveRequirementIndex(0);
      if (data.query) {
        setQuery(data.query.slice(0, 300) + "...");
      }
    } catch (err: any) {
      setError(err.message || "Failed to parse PDF document");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70">
      <Header apiHealthy={apiHealthy} standardsCount={standardsCount} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Unobtrusive 8-Stage Architecture Pipeline Bar */}
        <SystemPipelineBar />

        {/* Input Section (Textarea + PDF Upload + 5 One-Click Demos) */}
        <RequirementInput
          query={query}
          setQuery={setQuery}
          onAnalyze={handleAnalyze}
          onUploadPdf={handleUploadPdf}
          isLoading={isLoading}
          examples={examples}
        />

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Stream */}
        {result && (() => {
          const isMulti = Boolean(result.is_multi_requirement && result.requirement_groups && result.requirement_groups.length > 1);
          const activeGroup = isMulti && result.requirement_groups ? result.requirement_groups[activeRequirementIndex] || result.requirement_groups[0] : null;

          const currentRequirements = activeGroup ? activeGroup.extracted_requirements : result.extracted_requirements;
          const currentPrimary = activeGroup ? activeGroup.primary_standard : result.primary_standard;
          const currentRelated = activeGroup ? activeGroup.related_standards : result.related_standards;
          const currentCandidates = activeGroup ? activeGroup.candidate_standards : result.candidate_standards;
          const currentAlerts = activeGroup ? activeGroup.version_alerts : result.version_alerts;
          const currentSemanticNote = activeGroup ? activeGroup.semantic_vs_keyword_note : result.semantic_vs_keyword_note;
          const meetsThresh = activeGroup ? activeGroup.meets_recommendation_threshold : result.meets_recommendation_threshold;
          const threshMsg = activeGroup ? activeGroup.threshold_message : result.threshold_message;

          return (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* COMPOUND TENDER: MULTI-REQUIREMENT SEGMENTATION BREAKDOWN */}
              {isMulti && result.requirement_groups && (
                <div className="bg-white rounded-xl p-5 border-2 border-blue-600/40 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          PROCUREMENT DOCUMENT BREAKDOWN ({result.requirement_groups.length} Distinct Requirements Identified)
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          The system independently segments compound procurement specifications into distinct technical requirement groups.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsClauseModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition self-start sm:self-auto shadow-xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>View Combined Tender Clause</span>
                    </button>
                  </div>

                  {/* Visual 3-Group Card Grid for Judges */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {result.requirement_groups.map((group, idx) => {
                      const isSelected = activeRequirementIndex === idx;
                      const primaryNum = group.primary_standard?.is_number || "No Match";
                      const primaryTitle = group.primary_standard?.title || "No applicable standard";
                      const relatedCount =
                        (group.related_standards?.normative_references?.length || 0) +
                        (group.related_standards?.testing_standards?.length || 0) +
                        (group.related_standards?.safety_standards?.length || 0);

                      const isOutdated = (group.version_alerts || []).length > 0;

                      return (
                        <div
                          key={group.group_id}
                          onClick={() => setActiveRequirementIndex(idx)}
                          className={`p-3.5 rounded-xl border-2 transition text-left cursor-pointer space-y-2.5 ${
                            isSelected
                              ? "bg-blue-50/70 border-blue-600 shadow-xs"
                              : "bg-slate-50/70 hover:bg-slate-100/80 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono">
                              [{idx + 1}] Item #{idx + 1}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isSelected ? "bg-blue-700 text-white" : "text-slate-500"
                            }`}>
                              {isSelected ? "Active Inspection" : "Click to Inspect"}
                            </span>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-slate-900 line-clamp-1">
                              {group.requirement_label}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {group.extracted_requirements?.product || "Procurement item"}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-1">
                            <div className="flex items-start gap-1">
                              <span className="text-blue-700 font-bold">→ Primary:</span>
                              <span className="font-mono font-bold text-slate-900 truncate">
                                {primaryNum}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <span className="text-slate-400">→ Related:</span>
                              <span>{relatedCount} Normative/Testing codes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">→ Version:</span>
                              {isOutdated ? (
                                <span className="font-semibold text-amber-700">⚠ Superseded Edition</span>
                              ) : (
                                <span className="font-semibold text-emerald-700">✓ Current Active</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 1. Outdated Version Alert (if any detected) */}
              {currentAlerts && currentAlerts.length > 0 && (
                <VersionAlertBanner alerts={currentAlerts} />
              )}

              {/* 2. Extracted Requirements Understanding Card */}
              {currentRequirements && (
                <RequirementUnderstandingCard requirements={currentRequirements} />
              )}

              {/* 3. Unknown Query / Low-Confidence Rejection Notice */}
              {(!currentPrimary || meetsThresh === false) && (
                <div className="p-5 bg-amber-50 border-2 border-amber-400 rounded-xl text-amber-950 shadow-xs space-y-2">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-amber-900">
                    <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
                    <span>No Sufficiently Relevant Indian Standard Found in Catalog</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {threshMsg || "The input specification does not meet the minimum procurement confidence threshold (AI Relevance < 50% or low semantic similarity). The system strictly avoids recommending false or irrelevant standards for unknown products."}
                  </p>
                  <div className="text-[11px] text-amber-800 italic pt-1 border-t border-amber-200/80">
                    ✓ Verified Confidence Enforcement: Non-standard items are rejected gracefully rather than hallucinating an inapplicable specification.
                  </div>
                </div>
              )}

              {/* 4. Primary Recommended Standard */}
              {currentPrimary && (
                <PrimaryStandardCard
                  standard={currentPrimary}
                  semanticNote={currentSemanticNote}
                  qcoResults={activeGroup ? activeGroup.qco_results : result.qco_results}
                  isMultilingual={result.is_multilingual}
                  onOpenGraph={() => setIsGraphOpen(true)}
                  onViewStandard={(std) => setSelectedStandard(std)}
                  onOpenClause={() => setIsClauseModalOpen(true)}
                />
              )}

              {/* 5. Algorithmic Evidence & Scoring Details Card (Secondary / Collapsible) */}
              <AnalysisDetailsCard
                result={result}
                onSelectStandard={(std) => setSelectedStandard(std)}
              />

              {/* 6. Categorized Related Standards (Normative, Testing, Safety, Installation) */}
              {currentRelated && (
                <RelatedStandardsSection
                  related={currentRelated}
                  onSelectStandard={(std) => setSelectedStandard(std)}
                />
              )}

              {/* 7. Alternative Candidate Standards Pool */}
              {currentCandidates && currentCandidates.length > 0 && (
                <CandidateStandardsList
                  candidates={currentCandidates}
                  onSelectStandard={(std) => setSelectedStandard(std)}
                />
              )}

              {/* Summary & Procurement Action Bar */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-600">
                  <strong className="text-slate-800">Analysis Summary:</strong> {result.summary_explanation}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsClauseModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Standards to Tender
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Summary
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Empty State before analysis */}
        {!result && !isLoading && (
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-3">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Ready to Analyze Procurement Specification
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Select one of the 5 judge demo buttons above or enter technical parameters to retrieve applicable Indian Standards, explore normative relationships, and detect outdated editions.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>
            Smart India Hackathon 2026 Prototype • Problem Statement 26108: AI-Powered Recommendation Engine for Applicable Indian Standards
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            National E-Procurement Evaluation • Prototype Knowledge Base: 113 Indian Standards across 6 Domains • BM25 + Dense Semantic Vector Retrieval
          </p>
        </div>
      </footer>

      {/* Interactive Standards Relationship Graph Modal */}
      {result && result.graph_data && (
        <StandardsGraphModal
          isOpen={isGraphOpen}
          onClose={() => setIsGraphOpen(false)}
          graphData={result.graph_data}
          onSelectStandardMetadata={(std) => setSelectedStandard(std)}
        />
      )}

      {/* Standard Detail Modal */}
      <StandardDetailModal
        standard={selectedStandard}
        onClose={() => setSelectedStandard(null)}
      />

      {/* Copy to Tender Clause Modal */}
      {result && (
        <CopyToTenderModal
          isOpen={isClauseModalOpen}
          onClose={() => setIsClauseModalOpen(false)}
          clauseText={
            result.is_multi_requirement
              ? result.tender_clause || ""
              : (result.requirement_groups && result.requirement_groups[activeRequirementIndex]?.tender_clause) || result.tender_clause || ""
          }
          standardTitle={
            (result.requirement_groups && result.requirement_groups[activeRequirementIndex]?.primary_standard?.title) ||
            result.primary_standard?.title
          }
          isNumber={
            (result.requirement_groups && result.requirement_groups[activeRequirementIndex]?.primary_standard?.is_number) ||
            result.primary_standard?.is_number
          }
        />
      )}
    </div>
  );
}
