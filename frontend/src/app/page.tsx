"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
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
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  Layers,
  Copy
} from "lucide-react";

export default function HomePage() {
  const [query, setQuery] = useState(
    "15 kW three phase induction motor, 415 V, 50 Hz for industrial applications with efficiency and IP protection requirements"
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

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeRequirement(query);
      setResult(data);
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Prototype Disclaimer Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-xl p-4 text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-800/80 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                BIS-SpecAI Recommendation Engine
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  SIH 2026 #26108
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <strong>Prototype Dataset:</strong> This prototype uses a curated standards corpus for demonstration. Recommendations should be verified against the latest authoritative BIS publications before procurement.
              </p>
            </div>
          </div>

          <div className="shrink-0 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            Catalog: <strong>62 Curated Standards</strong>
          </div>
        </div>

        {/* Input Section */}
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
              {/* Multi-Requirement Group Switcher (if composite query or tender) */}
              {isMulti && result.requirement_groups && (
                <div className="bg-white rounded-xl p-4 border-2 border-blue-600/30 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                        <Layers className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          Multi-Requirement Procurement Tender ({result.requirement_groups.length} Items Identified)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Select a requirement item below to inspect specific standard recommendations, testing methods, and relationship graphs.
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

                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {result.requirement_groups.map((group, idx) => {
                      const isSelected = activeRequirementIndex === idx;
                      const primaryNum = group.primary_standard?.is_number || "No Match";
                      return (
                        <button
                          key={group.group_id}
                          type="button"
                          onClick={() => setActiveRequirementIndex(idx)}
                          className={`px-3.5 py-2.5 rounded-lg text-left transition border shrink-0 min-w-[200px] ${
                            isSelected
                              ? "bg-blue-700 text-white border-blue-700 shadow-xs"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          <div className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-blue-200" : "text-slate-500"}`}>
                            Requirement Item #{idx + 1}
                          </div>
                          <div className="font-bold text-xs mt-0.5 truncate max-w-[220px]">
                            {group.requirement_label}
                          </div>
                          <div className={`text-[11px] mt-1 font-mono font-medium ${isSelected ? "text-amber-300" : "text-blue-700"}`}>
                            → {primaryNum}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 1. Outdated Version Alert (if any) */}
              {currentAlerts && currentAlerts.length > 0 && (
                <VersionAlertBanner alerts={currentAlerts} />
              )}

              {/* 2. Dynamic Requirement Understanding Card */}
              {currentRequirements && (
                <RequirementUnderstandingCard requirements={currentRequirements} />
              )}

              {/* 3. Unknown Query / Low Confidence Warning Card */}
              {(!currentPrimary || meetsThresh === false) && (
                <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-900 shadow-xs">
                  <div className="flex items-center gap-2.5 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                    <span>No Sufficiently Relevant Standard Found in Prototype Corpus</span>
                  </div>
                  <p className="mt-1.5 text-xs text-amber-800 leading-relaxed">
                    {threshMsg || "The input specification does not meet the minimum confidence threshold for automated recommendation. Weak potential matches are displayed below for audit inspection."}
                  </p>
                  <div className="mt-2 text-[11px] text-amber-700 italic">
                    * In a production deployment across all 20,000+ Indian Standards, out-of-catalog items are routed for manual technical committee review.
                  </div>
                </div>
              )}

              {/* 4. Primary Recommended Standard */}
              {currentPrimary && (
                <PrimaryStandardCard
                  standard={currentPrimary}
                  semanticNote={currentSemanticNote}
                  onOpenGraph={() => setIsGraphOpen(true)}
                  onViewStandard={(std) => setSelectedStandard(std)}
                  onOpenClause={() => setIsClauseModalOpen(true)}
                />
              )}

              {/* 5. Algorithmic Evidence & Scoring Details Card (Collapsible) */}
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

              {/* Summary & Procurement Export Bar */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-600">
                  <strong>Analysis Summary:</strong> {result.summary_explanation}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsClauseModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Standards to Tender
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Tender Summary
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
              Select an example preset above or enter technical parameters to retrieve applicable Indian Standards, explore normative relationships, and detect outdated editions.
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
            Designed for National E-Procurement Evaluation • Built with Next.js, React Flow, FastAPI, BM25 & Semantic Retrieval
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
