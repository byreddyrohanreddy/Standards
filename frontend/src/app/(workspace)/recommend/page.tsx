"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SystemPipelineBar } from "@/components/SystemPipelineBar";
import { RequirementComposer } from "@/components/RequirementComposer";
import { RequirementUnderstandingCard } from "@/components/RequirementUnderstandingCard";
import { VersionAlertBanner } from "@/components/VersionAlertBanner";
import { PrimaryRecommendation } from "@/components/PrimaryRecommendation";
import { RelatedStandardsSection } from "@/components/RelatedStandardsSection";
import { CandidateStandardsList } from "@/components/CandidateStandardsList";
import { AnalysisDetailsCard } from "@/components/AnalysisDetailsCard";
import { StandardsGraphModal } from "@/components/StandardsGraphModal";
import { StandardDetailModal } from "@/components/StandardDetailModal";
import { StandardDetailDrawer } from "@/components/StandardDetailDrawer";
import { CopyToTenderModal } from "@/components/CopyToTenderModal";
import { AnalysisLoadingState } from "@/components/AnalysisLoadingState";
import { InsightRail } from "@/components/InsightRail";
import { ParameterCluster } from "@/components/recommend/ParameterCluster";
import { EvidenceBreakdown } from "@/components/recommend/EvidenceBreakdown";
import { VersionTimeline } from "@/components/recommend/VersionTimeline";
import { TenderItemRail } from "@/components/recommend/TenderItemRail";
import { QCOCompliancePanel } from "@/components/QCOCompliancePanel";
import { MultilingualInsight } from "@/components/MultilingualInsight";
import { LiveVerificationBadge } from "@/components/LiveVerificationBadge";
import { DiscoveredStandardsSection } from "@/components/DiscoveredStandardsSection";
import { ChatSidebar } from "@/components/ChatSidebar";
import {
  analyzeRequirement,
  uploadTenderPdf,
  fetchExamples,
} from "@/lib/api";
import { AnalysisResponse, ExampleScenario, StandardMetadata } from "@/types";

import {
  FileCheck2,
  AlertCircle,
  Printer,
  Layers,
  Copy,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Zap
} from "lucide-react";
import { EmptyState } from "@/components/ui/Skeleton";

function RecommendContent() {
  const searchParams = useSearchParams();
  const initialQuery =
    searchParams.get("q") ||
    "15 kW three-phase squirrel-cage induction motor for industrial operation, 415 V, 50 Hz.";

  const [query, setQuery] = useState(initialQuery);
  const [examples, setExamples] = useState<ExampleScenario[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  // Modals state
  const [isGraphOpen, setIsGraphOpen] = useState<boolean>(false);
  const [selectedStandard, setSelectedStandard] = useState<StandardMetadata | null>(null);
  const [isClauseModalOpen, setIsClauseModalOpen] = useState<boolean>(false);
  const [activeRequirementIndex, setActiveRequirementIndex] = useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Load initial examples
  useEffect(() => {
    fetchExamples()
      .then((exData) => {
        if (exData.length > 0) setExamples(exData);
      })
      .catch(() => {});
  }, []);

  // Trigger analysis if 'q' param is provided
  useEffect(() => {
    const qParam = searchParams.get("q");
    if (qParam && qParam.trim().length > 3) {
      setQuery(qParam);
      handleAnalyze(qParam);
    }
  }, [searchParams]);

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

  const isMulti = Boolean(
    result?.is_multi_requirement &&
    result.requirement_groups &&
    result.requirement_groups.length > 1
  );

  const activeGroup =
    isMulti && result?.requirement_groups
      ? result.requirement_groups[activeRequirementIndex] || result.requirement_groups[0]
      : null;

  const currentRequirements = activeGroup
    ? activeGroup.extracted_requirements
    : result?.extracted_requirements;
  const currentPrimary = activeGroup
    ? activeGroup.primary_standard
    : result?.primary_standard;
  const currentRelated = activeGroup
    ? activeGroup.related_standards
    : result?.related_standards;
  const currentCandidates = activeGroup
    ? activeGroup.candidate_standards
    : result?.candidate_standards;
  const currentAlerts = activeGroup
    ? activeGroup.version_alerts
    : result?.version_alerts;
  const currentSemanticNote = activeGroup
    ? activeGroup.semantic_vs_keyword_note
    : result?.semantic_vs_keyword_note;
  const meetsThresh = activeGroup
    ? activeGroup.meets_recommendation_threshold
    : result?.meets_recommendation_threshold;
  const threshMsg = activeGroup
    ? activeGroup.threshold_message
    : result?.threshold_message;
  const currentQco = activeGroup
    ? activeGroup.qco_results
    : result?.qco_results;
  const currentTenderClause = activeGroup
    ? activeGroup.tender_clause
    : result?.tender_clause;

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 space-y-5">
      {/* Architecture Pipeline Bar */}
      <SystemPipelineBar />

      {/* 3-ZONE WORKSPACE LAYOUT (Desktop) / 2-ZONE (Tablet) / 1-COLUMN (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* =========================================================================
            ZONE 1: LEFT WORKSPACE : REQUIREMENT COMPOSER & TENDER INTAKE
            ========================================================================= */}
        <section className="lg:col-span-4 xl:col-span-4 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FC6C26]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
              Workspace: Requirement Composer
            </h2>
          </div>

          <RequirementComposer
            query={query}
            setQuery={setQuery}
            onAnalyze={handleAnalyze}
            onUploadPdf={handleUploadPdf}
            isLoading={isLoading}
            examples={examples}
          />
        </section>

        {/* =========================================================================
            ZONE 2: MAIN ANALYSIS WORKSPACE : TECHNICAL RECOMMENDATION & EVIDENCE
            ========================================================================= */}
        <section className="lg:col-span-8 xl:col-span-5 space-y-5 min-w-0">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#D95218]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
                Technical Recommendation & Findings
              </h2>
            </div>
            {result && (
              <span className="text-[10px] font-mono text-[#6E5C4E] bg-white px-2.5 py-0.5 rounded-md border border-[#E7D9BC]">
                Latency: {(result.latency_breakdown?.total_ms ?? (result as any).latency_ms ?? 42).toFixed(1)}ms
              </span>
            )}
          </div>

          {/* Loading State */}
          {isLoading && <AnalysisLoadingState />}

          {/* Error Message */}
          {error && !isLoading && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Populated Results Workspace */}
          {result && !isLoading && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              {/* Compound Tender Decomposition (if multi-requirement) */}
              {isMulti && result.requirement_groups && (
                <TenderItemRail
                  groups={result.requirement_groups}
                  selectedIndex={activeRequirementIndex}
                  onSelect={(idx) => setActiveRequirementIndex(idx)}
                />
              )}

              {/* Version Alerts (if superseded) */}
              {currentAlerts && currentAlerts.length > 0 && (
                <VersionAlertBanner alerts={currentAlerts} />
              )}

              {/* Low-Confidence Gate Notice */}
              {(!currentPrimary || meetsThresh === false) && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#231A14]">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>No Sufficiently Relevant Standard Identified</span>
                  </div>
                  <p className="text-[#6E5C4E] leading-relaxed">
                    {threshMsg || "Specification confidence score fell below threshold. The system prevents false positive recommendations."}
                  </p>
                </div>
              )}

              {/* Primary Applicable Standard (Visual Anchor with ScoreRing & Badges) */}
              {currentPrimary && (
                <PrimaryRecommendation
                  standard={currentPrimary}
                  semanticNote={currentSemanticNote}
                  qcoResults={currentQco}
                  isMultilingual={result.is_multilingual}
                  tenderClause={currentTenderClause}
                  onOpenGraph={() => setIsGraphOpen(true)}
                  onViewStandard={(std) => setSelectedStandard(std)}
                  onOpenClause={() => setIsClauseModalOpen(true)}
                />
              )}

              {/* Live BIS Verification */}
              {currentPrimary && (
                <LiveVerificationBadge
                  isNumber={currentPrimary.is_number}
                  year={currentPrimary.year}
                  title={currentPrimary.title}
                />
              )}

              {/* QCO Compliance Panel */}
              {currentPrimary && (
                <QCOCompliancePanel qcoResults={currentQco} />
              )}

              {/* Multilingual Insight */}
              <MultilingualInsight
                isMultilingual={result.is_multilingual}
                semanticNote={currentSemanticNote}
              />

              {/* Requirement Parameter Cluster (Interactive Chips) */}
              {currentRequirements && (
                <ParameterCluster requirements={currentRequirements} />
              )}

              {/* Version Lineage Timeline */}
              {currentPrimary && (
                <VersionTimeline standard={currentPrimary} />
              )}

              {/* Algorithmic Evidence Meters & Citations */}
              <EvidenceBreakdown
                scoring={result.scoring_breakdown}
                evidenceItems={result.evidence_items}
              />

              {/* Related Standards Knowledge Network */}
              {currentRelated && (
                <RelatedStandardsSection
                  related={currentRelated}
                  onSelectStandard={(std) => setSelectedStandard(std)}
                />
              )}

              {/* Alternative Candidate Standards */}
              {currentCandidates && currentCandidates.length > 0 && (
                <CandidateStandardsList
                  candidates={currentCandidates}
                  onSelectStandard={(std) => setSelectedStandard(std)}
                />
              )}

              {/* Live BIS Discovery */}
              {result.query && (
                <DiscoveredStandardsSection query={result.query} />
              )}
            </div>
          )}

          {/* Empty State before running analysis */}
          {!result && !isLoading && (
            <EmptyState
              icon={<FileCheck2 className="w-6 h-6 text-[#FC6C26]" />}
              title="Ready to Recommend Applicable Indian Standards"
              description="Enter technical specifications in the Left Composer, upload an NIT tender PDF, or select one of the pre-engineered scenarios to begin neural analysis."
              actionLabel="Load Electrical Motor Scenario"
              onAction={() =>
                handleAnalyze(
                  "Supply and commissioning of 15 kW, 4-pole, 415V ±10%, 50Hz, 3-phase squirrel cage induction motor conforming to energy efficiency class IE3, foot-mounted with IP55 protection for continuous industrial drive."
                )
              }
            />
          )}
        </section>

        {/* =========================================================================
            ZONE 3: RIGHT INSIGHT RAIL : METRICS, QUICK ACTIONS, CONTEXT
            ========================================================================= */}
        <section className="lg:col-span-12 xl:col-span-3 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
              Insight Rail
            </h2>
          </div>

          <InsightRail
            isLoading={isLoading}
            score={
              currentPrimary?.ai_relevance_score
                ? currentPrimary.ai_relevance_score > 1
                  ? currentPrimary.ai_relevance_score
                  : currentPrimary.ai_relevance_score * 100
                : (currentPrimary as any)?.score
                ? (currentPrimary as any).score * 100
                : undefined
            }
            primaryStandard={currentPrimary}
            standardsCount={113}
            onOpenGraph={() => setIsGraphOpen(true)}
            onOpenClause={() => setIsClauseModalOpen(true)}
            onViewStandard={(std) => setSelectedStandard(std)}
          />
        </section>
      </div>

      {/* Standards Knowledge Network Graph Modal */}
      {result && result.graph_data && (
        <StandardsGraphModal
          isOpen={isGraphOpen}
          onClose={() => setIsGraphOpen(false)}
          graphData={result.graph_data}
          onSelectStandardMetadata={(std) => setSelectedStandard(std)}
        />
      )}

      {/* Standard Detail Slide-in Drawer */}
      <StandardDetailDrawer
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

      {/* AI Intelligence Assistant Chat Sidebar */}
      <ChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        analysisResult={result}
      />

      {/* Floating Assistant Button */}
      {!isChatOpen && (
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-20 right-6 z-30 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FC6C26] to-[#D95218] text-white shadow-lg shadow-[#D95218]/30 hover:shadow-xl hover:shadow-[#D95218]/40 flex items-center justify-center transition-all hover:scale-105 cursor-pointer print:hidden"
          aria-label="Open BIS-SpecAI Intelligence Assistant"
          title="Ask AI Assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        </button>
      )}
    </main>
  );
}

export default function RecommendPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center text-xs text-[#6E5C4E] font-medium">
          Loading BIS-SpecAI Workspace...
        </div>
      }
    >
      <RecommendContent />
    </Suspense>
  );
}
