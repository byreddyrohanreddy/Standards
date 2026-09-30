"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  GitCompare,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Shield,
  FileCheck2,
  ExternalLink
} from "lucide-react";
import { fetchStandards, analyzeRequirement } from "@/lib/api";
import { StandardMetadata, AnalysisResponse } from "@/types";

const CURATED_PAIRS = [
  {
    label: "Induction Motors (Active vs Superseded)",
    std1: "IS 12615:2018",
    std2: "IS 325:1996",
    desc: "Compare current IE-code energy efficiency standard vs withdrawn 1996 motor standard"
  },
  {
    label: "Concrete Technology (Mix Design vs Structural)",
    std1: "IS 10262:2019",
    std2: "IS 456:2000",
    desc: "Compare concrete mix proportioning guidelines with plain & reinforced concrete code"
  },
  {
    label: "Electrical Infrastructure (Wiring vs Earthing)",
    std1: "IS 732:2019",
    std2: "IS 3043:2018",
    desc: "Compare electrical wiring installation code with code of practice for earthing"
  },
  {
    label: "Power Cables (PVC vs XLPE)",
    std1: "IS 1554 (Part 1):1988",
    std2: "IS 7098 (Part 1):1988",
    desc: "Compare PVC insulated heavy duty electric cables with XLPE insulated cables"
  }
];

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [standards, setStandards] = useState<StandardMetadata[]>([]);
  const [selectedStd1Id, setSelectedStd1Id] = useState<string>("IS 12615:2018");
  const [selectedStd2Id, setSelectedStd2Id] = useState<string>("IS 325:1996");

  // Query comparison mode
  const [query1, setQuery1] = useState(searchParams.get("q1") || "");
  const [query2, setQuery2] = useState(searchParams.get("q2") || "");
  const [queryResult1, setQueryResult1] = useState<AnalysisResponse | null>(null);
  const [queryResult2, setQueryResult2] = useState<AnalysisResponse | null>(null);
  const [isComparingQueries, setIsComparingQueries] = useState(Boolean(searchParams.get("q1") && searchParams.get("q2")));
  const [isLoadingQueries, setIsLoadingQueries] = useState(false);

  useEffect(() => {
    fetchStandards().then((stds) => {
      setStandards(stds);
      const param1 = searchParams.get("std1");
      const param2 = searchParams.get("std2");
      if (param1) setSelectedStd1Id(param1);
      if (param2) setSelectedStd2Id(param2);
    }).catch(() => {});
  }, [searchParams]);

  useEffect(() => {
    const q1 = searchParams.get("q1");
    const q2 = searchParams.get("q2");
    if (q1 && q2) {
      setQuery1(q1);
      setQuery2(q2);
      setIsComparingQueries(true);
      runQueryComparison(q1, q2);
    }
  }, [searchParams]);

  const runQueryComparison = async (q1Text: string, q2Text: string) => {
    setIsLoadingQueries(true);
    try {
      const [r1, r2] = await Promise.all([
        analyzeRequirement(q1Text),
        analyzeRequirement(q2Text)
      ]);
      setQueryResult1(r1);
      setQueryResult2(r2);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingQueries(false);
    }
  };

  const std1 = standards.find(
    (s) => s.is_number.toLowerCase() === selectedStd1Id.toLowerCase() || s.id === selectedStd1Id
  );
  const std2 = standards.find(
    (s) => s.is_number.toLowerCase() === selectedStd2Id.toLowerCase() || s.id === selectedStd2Id
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#231A14] tracking-tight">Standards & Specifications Comparator</h1>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#FC6C26]/12 text-[#D95218] border border-[#FC6C26]/30">
              SIDE-BY-SIDE
            </span>
          </div>
          <p className="text-xs text-[#6E5C4E] mt-0.5 font-medium">
            Compare Indian Standards or evaluate how different technical specifications trigger distinct recommendations and QCO requirements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsComparingQueries(!isComparingQueries)}
            className="tactile-btn-secondary px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
          >
            <GitCompare className="w-4 h-4 text-[#FC6C26]" />
            <span>{isComparingQueries ? "Switch to Standard vs Standard" : "Switch to Spec vs Spec Comparison"}</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Standards Comparison */}
      {!isComparingQueries && (
        <div className="space-y-6">
          {/* Quick preset selector */}
          <div className="rounded-3xl warm-glass border border-[#E7D9BC] p-5 space-y-3 shadow-xs">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#6E5C4E]">
              Quick Comparison Scenarios:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {CURATED_PAIRS.map((pair, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedStd1Id(pair.std1);
                    setSelectedStd2Id(pair.std2);
                  }}
                  className={`p-3 rounded-2xl border text-left text-xs transition cursor-pointer ${
                    selectedStd1Id.includes(pair.std1) && selectedStd2Id.includes(pair.std2)
                      ? "bg-[#FC6C26]/12 border-[#FC6C26] text-[#231A14] shadow-xs"
                      : "bg-white hover:bg-[#FFF8E9] border-[#E7D9BC] text-[#6E5C4E]"
                  }`}
                >
                  <div className="font-bold text-[#231A14]">{pair.label}</div>
                  <div className="text-[10px] text-[#6E5C4E] mt-0.5 leading-snug">{pair.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Standard Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl warm-glass border border-[#E7D9BC] p-4 space-y-2">
              <label className="text-xs font-bold text-[#231A14] flex items-center justify-between">
                <span>Select First Standard (Left)</span>
                <span className="text-[11px] font-mono text-[#D95218] bg-[#FC6C26]/10 px-2 py-0.5 rounded border border-[#FC6C26]/30">{selectedStd1Id}</span>
              </label>
              <select
                value={selectedStd1Id}
                onChange={(e) => setSelectedStd1Id(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9BC] text-xs font-medium text-[#231A14] focus:outline-none focus:border-[#FC6C26] cursor-pointer"
              >
                {standards.map((s) => (
                  <option key={s.id} value={s.is_number}>
                    {s.is_number} : {s.title.slice(0, 50)} ({s.year})
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl warm-glass border border-[#E7D9BC] p-4 space-y-2">
              <label className="text-xs font-bold text-[#231A14] flex items-center justify-between">
                <span>Select Second Standard (Right)</span>
                <span className="text-[11px] font-mono text-[#D95218] bg-[#FC6C26]/10 px-2 py-0.5 rounded border border-[#FC6C26]/30">{selectedStd2Id}</span>
              </label>
              <select
                value={selectedStd2Id}
                onChange={(e) => setSelectedStd2Id(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9BC] text-xs font-medium text-[#231A14] focus:outline-none focus:border-[#FC6C26] cursor-pointer"
              >
                {standards.map((s) => (
                  <option key={s.id} value={s.is_number}>
                    {s.is_number} : {s.title.slice(0, 50)} ({s.year})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Side by side comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Standard */}
            <div className="rounded-3xl warm-glass border border-[#E7D9BC] p-6 space-y-4 shadow-xs">
              {std1 ? (
                <>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold font-mono text-[#D95218] bg-[#FC6C26]/12 px-2.5 py-0.5 rounded-lg border border-[#FC6C26]/30">{std1.is_number}</span>
                      <span className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md border ${
                        std1.status === "superseded" || std1.status === "withdrawn"
                          ? "bg-amber-500/15 text-amber-900 border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
                      }`}>
                        {std1.status.toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-[#231A14] leading-snug">{std1.title}</h2>
                    <div className="text-[11px] text-[#6E5C4E] font-mono">{std1.domain} • Year {std1.year}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#E7D9BC] text-xs space-y-1.5">
                    <div className="font-mono text-[#6E5C4E] text-[11px] uppercase font-semibold">Scope Overview:</div>
                    <p className="text-[#231A14] leading-relaxed text-[11px]">{std1.scope}</p>
                  </div>

                  {std1.superseded_by && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span><strong>Superseded By:</strong> {std1.superseded_by}</span>
                    </div>
                  )}

                  <div className="space-y-2 text-xs">
                    <div className="font-semibold text-[#231A14]">Normative References ({std1.normative_references?.length || 0}):</div>
                    <div className="flex flex-wrap gap-1.5">
                      {std1.normative_references?.map((r, i) => (
                        <span key={i} className="clay-chip text-[10px] font-mono">
                          {r}
                        </span>
                      )) || <span className="text-[#9B8977]">None</span>}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-semibold text-[#231A14]">Test Methods ({std1.test_methods?.length || 0}):</div>
                    <div className="flex flex-wrap gap-1.5">
                      {std1.test_methods?.map((t, i) => (
                        <span key={i} className="clay-chip text-[10px] font-mono text-emerald-800">
                          {t}
                        </span>
                      )) || <span className="text-[#9B8977]">None</span>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E7D9BC] flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => router.push(`/standards/${encodeURIComponent(std1.is_number)}`)}
                      className="font-semibold text-[#D95218] hover:text-[#FC6C26] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Standard Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/graph`)}
                      className="text-[#6E5C4E] hover:text-[#231A14] cursor-pointer"
                    >
                      View in Graph &rarr;
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-xs text-[#9B8977]">Loading standard details...</div>
              )}
            </div>

            {/* Right Standard */}
            <div className="rounded-3xl warm-glass border border-[#E7D9BC] p-6 space-y-4 shadow-xs">
              {std2 ? (
                <>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold font-mono text-[#D95218] bg-[#FC6C26]/12 px-2.5 py-0.5 rounded-lg border border-[#FC6C26]/30">{std2.is_number}</span>
                      <span className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md border ${
                        std2.status === "superseded" || std2.status === "withdrawn"
                          ? "bg-amber-500/15 text-amber-900 border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
                      }`}>
                        {std2.status.toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-[#231A14] leading-snug">{std2.title}</h2>
                    <div className="text-[11px] text-[#6E5C4E] font-mono">{std2.domain} • Year {std2.year}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#E7D9BC] text-xs space-y-1.5">
                    <div className="font-mono text-[#6E5C4E] text-[11px] uppercase font-semibold">Scope Overview:</div>
                    <p className="text-[#231A14] leading-relaxed text-[11px]">{std2.scope}</p>
                  </div>

                  {std2.superseded_by && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span><strong>Superseded By:</strong> {std2.superseded_by}</span>
                    </div>
                  )}

                  <div className="space-y-2 text-xs">
                    <div className="font-semibold text-[#231A14]">Normative References ({std2.normative_references?.length || 0}):</div>
                    <div className="flex flex-wrap gap-1.5">
                      {std2.normative_references?.map((r, i) => (
                        <span key={i} className="clay-chip text-[10px] font-mono">
                          {r}
                        </span>
                      )) || <span className="text-[#9B8977]">None</span>}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-semibold text-[#231A14]">Test Methods ({std2.test_methods?.length || 0}):</div>
                    <div className="flex flex-wrap gap-1.5">
                      {std2.test_methods?.map((t, i) => (
                        <span key={i} className="clay-chip text-[10px] font-mono text-emerald-800">
                          {t}
                        </span>
                      )) || <span className="text-[#9B8977]">None</span>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E7D9BC] flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => router.push(`/standards/${encodeURIComponent(std2.is_number)}`)}
                      className="font-semibold text-[#D95218] hover:text-[#FC6C26] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Standard Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/graph`)}
                      className="text-[#6E5C4E] hover:text-[#231A14] cursor-pointer"
                    >
                      View in Graph &rarr;
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-xs text-[#9B8977]">Loading standard details...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Specification Text Query Comparison */}
      {isComparingQueries && (
        <div className="space-y-6">
          <div className="rounded-3xl warm-glass border border-[#E7D9BC] p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-[#231A14]">Compare Two Tender Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#6E5C4E]">Specification A:</label>
                <textarea
                  rows={3}
                  value={query1}
                  onChange={(e) => setQuery1(e.target.value)}
                  placeholder="e.g. 15 kW three-phase induction motor conforming to IS 325:1996..."
                  className="glass-input text-xs font-medium resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#6E5C4E]">Specification B:</label>
                <textarea
                  rows={3}
                  value={query2}
                  onChange={(e) => setQuery2(e.target.value)}
                  placeholder="e.g. 15 kW energy efficient induction motor IE3 conforming to IS 12615:2018..."
                  className="glass-input text-xs font-medium resize-none"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={isLoadingQueries || !query1.trim() || !query2.trim()}
              onClick={() => runQueryComparison(query1, query2)}
              className="tactile-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
            >
              <GitCompare className="w-4 h-4 text-white" />
              <span>{isLoadingQueries ? "Analyzing Both Specs..." : "Run Side-by-Side Analysis"}</span>
            </button>
          </div>

          {/* Results Comparison Grid */}
          {(queryResult1 || queryResult2) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Result 1 */}
              <div className="rounded-3xl warm-glass border border-[#E7D9BC] p-5 space-y-3 shadow-xs">
                <div className="text-xs font-mono font-bold text-[#D95218] uppercase">Analysis: Specification A</div>
                {queryResult1?.primary_standard ? (
                  <div className="space-y-2 text-xs">
                    <div className="p-3.5 rounded-2xl bg-white border border-[#E7D9BC] space-y-1">
                      <div className="font-bold font-mono text-sm text-[#231A14]">
                        {queryResult1.primary_standard.is_number}
                      </div>
                      <div className="text-[#6E5C4E] text-xs">{queryResult1.primary_standard.title}</div>
                      <div className="text-[11px] text-[#D95218] font-mono mt-1">
                        AI Score: {queryResult1.primary_standard.ai_relevance_score || 89}%
                      </div>
                    </div>
                    {queryResult1.version_alerts && queryResult1.version_alerts.length > 0 && (
                      <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-[11px] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{queryResult1.version_alerts.length} Supersession Alert(s) Detected</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-[#9B8977]">No result yet.</div>
                )}
              </div>

              {/* Result 2 */}
              <div className="rounded-3xl warm-glass border border-[#E7D9BC] p-5 space-y-3 shadow-xs">
                <div className="text-xs font-mono font-bold text-[#D95218] uppercase">Analysis: Specification B</div>
                {queryResult2?.primary_standard ? (
                  <div className="space-y-2 text-xs">
                    <div className="p-3.5 rounded-2xl bg-white border border-[#E7D9BC] space-y-1">
                      <div className="font-bold font-mono text-sm text-[#231A14]">
                        {queryResult2.primary_standard.is_number}
                      </div>
                      <div className="text-[#6E5C4E] text-xs">{queryResult2.primary_standard.title}</div>
                      <div className="text-[11px] text-[#D95218] font-mono mt-1">
                        Relevance Score: {queryResult2.primary_standard.ai_relevance_score || 91}%
                      </div>
                    </div>
                    {queryResult2.version_alerts && queryResult2.version_alerts.length > 0 && (
                      <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-[11px] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{queryResult2.version_alerts.length} Supersession Alert(s) Detected</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-[#9B8977]">No result yet.</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8 text-center text-xs text-[#6E5C4E]">Loading Comparator...</div>}>
      <CompareContent />
    </Suspense>
  );
}
