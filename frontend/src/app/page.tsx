"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { RequirementInput } from "@/components/RequirementInput";
import { RequirementUnderstandingCard } from "@/components/RequirementUnderstandingCard";
import { VersionAlertBanner } from "@/components/VersionAlertBanner";
import { PrimaryStandardCard } from "@/components/PrimaryStandardCard";
import { RelatedStandardsSection } from "@/components/RelatedStandardsSection";
import { CandidateStandardsList } from "@/components/CandidateStandardsList";
import { StandardsGraphModal } from "@/components/StandardsGraphModal";
import { StandardDetailModal } from "@/components/StandardDetailModal";
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
} from "lucide-react";

export default function HomePage() {
  const [query, setQuery] = useState(
    "15 kW three phase induction motor, 415 V, 50 Hz for industrial applications with efficiency and IP protection requirements"
  );
  const [examples, setExamples] = useState<ExampleScenario[]>([]);
  const [standardsCount, setStandardsCount] = useState<number>(62);
  const [apiHealthy, setApiHealthy] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  // Modals state
  const [isGraphOpen, setIsGraphOpen] = useState<boolean>(false);
  const [selectedStandard, setSelectedStandard] = useState<StandardMetadata | null>(null);

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
                BIS-SpecAI Recommendation Engine Prototype
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  SIH 2026 #26108
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Demonstrating requirement understanding, hybrid BM25 + dense semantic retrieval, normative relationship graphs, and tender version detection across 62 curated Indian Standards.
              </p>
            </div>
          </div>

          <div className="shrink-0 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            Dataset: <strong>Curated Prototype Catalog</strong>
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
        {result && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* 1. Outdated Version Alert (if any) */}
            {result.version_alerts && result.version_alerts.length > 0 && (
              <VersionAlertBanner alerts={result.version_alerts} />
            )}

            {/* 2. Dynamic Requirement Understanding Card */}
            {result.extracted_requirements && (
              <RequirementUnderstandingCard requirements={result.extracted_requirements} />
            )}

            {/* 3. Primary Recommended Standard */}
            {result.primary_standard && (
              <PrimaryStandardCard
                standard={result.primary_standard}
                onOpenGraph={() => setIsGraphOpen(true)}
                onViewStandard={(std) => setSelectedStandard(std)}
              />
            )}

            {/* 4. Categorized Related Standards (Normative, Testing, Safety, Installation) */}
            {result.related_standards && (
              <RelatedStandardsSection
                related={result.related_standards}
                onSelectStandard={(std) => setSelectedStandard(std)}
              />
            )}

            {/* 5. Alternative Candidate Standards Pool */}
            {result.candidate_standards && (
              <CandidateStandardsList
                candidates={result.candidate_standards}
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
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Tender Summary
                </button>
              </div>
            </div>
          </div>
        )}

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
    </div>
  );
}
