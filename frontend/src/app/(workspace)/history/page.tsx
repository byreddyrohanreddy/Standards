"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  History,
  FileSearch,
  Sparkles,
  Search,
  Trash2,
  Download,
  ArrowRight,
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  FileText,
  Filter
} from "lucide-react";
import {
  getRecommendationHistory,
  getAuditHistory,
  clearAllHistory
} from "@/lib/api";
import { RecommendationHistoryItem, AuditHistoryItem } from "@/types";

export default function HistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"recommend" | "audit">("recommend");
  const [searchFilter, setSearchFilter] = useState("");
  const [recomHistory, setRecomHistory] = useState<RecommendationHistoryItem[]>([]);
  const [auditHistory, setAuditHistory] = useState<AuditHistoryItem[]>([]);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  useEffect(() => {
    setRecomHistory(getRecommendationHistory());
    setAuditHistory(getAuditHistory());
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all history records?")) {
      clearAllHistory();
      setRecomHistory([]);
      setAuditHistory([]);
      setSelectedForCompare([]);
    }
  };

  const handleExportJSON = () => {
    const data = {
      exported_at: new Date().toISOString(),
      recommendation_history: recomHistory,
      audit_history: auditHistory
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BIS_SpecAI_History_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelectForCompare = (query: string) => {
    if (selectedForCompare.includes(query)) {
      setSelectedForCompare(selectedForCompare.filter((q) => q !== query));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], query]);
      } else {
        setSelectedForCompare([...selectedForCompare, query]);
      }
    }
  };

  const handleLaunchCompare = () => {
    if (selectedForCompare.length === 2) {
      router.push(`/compare?q1=${encodeURIComponent(selectedForCompare[0])}&q2=${encodeURIComponent(selectedForCompare[1])}`);
    }
  };

  const filteredRecom = recomHistory.filter(
    (item) =>
      item.query.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.primary_standard && item.primary_standard.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (item.domain && item.domain.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const filteredAudit = auditHistory.filter(
    (item) =>
      item.document_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.report.cited_standards && item.report.cited_standards.some((s) => s.toLowerCase().includes(searchFilter.toLowerCase())))
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FC6C26]/12 border border-[#FC6C26]/30 flex items-center justify-center text-[#D95218]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#231A14] tracking-tight">Analysis History</h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#FC6C26]/12 text-[#D95218] border border-[#FC6C26]/30">
                  PERSISTENT CACHE
                </span>
              </div>
              <p className="text-xs text-[#6E5C4E] font-medium mt-0.5">
                Past AI recommendation queries and tender compliance audit reports with side-by-side comparison.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {selectedForCompare.length === 2 && (
            <button
              type="button"
              onClick={handleLaunchCompare}
              className="tactile-btn-primary px-4 py-2 rounded-xl text-xs font-bold animate-pulse cursor-pointer shadow-md"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Selected (2)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportJSON}
            className="tactile-btn-secondary px-3.5 py-2 text-xs font-semibold rounded-xl"
          >
            <Download className="w-3.5 h-3.5 text-[#6E5C4E]" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 warm-glass p-3 rounded-2xl border border-[#E7D9BC]">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("recommend")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "recommend"
                ? "bg-[#FC6C26] text-white shadow-xs"
                : "text-[#6E5C4E] hover:text-[#231A14] hover:bg-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommendation Queries ({recomHistory.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "audit"
                ? "bg-[#FC6C26] text-white shadow-xs"
                : "text-[#6E5C4E] hover:text-[#231A14] hover:bg-white"
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Tender Audits ({auditHistory.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#9B8977] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter records..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E7D9BC] text-xs font-medium text-[#231A14] placeholder-[#9B8977] focus:outline-none focus:border-[#FC6C26] focus:ring-2 focus:ring-[#FC6C26]/10"
          />
        </div>
      </div>

      {/* Tab 1: Recommendations History */}
      {activeTab === "recommend" && (
        <div className="space-y-3">
          {selectedForCompare.length > 0 && (
            <div className="p-3.5 bg-[#FFF8E9] border border-[#FC6C26]/30 rounded-xl text-xs text-[#231A14] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-[#FC6C26] shrink-0" />
                <span>
                  <strong className="text-[#D95218]">{selectedForCompare.length}/2 items selected</strong> for side-by-side comparison.
                  {selectedForCompare.length === 1 && " Select one more query below to compare."}
                </span>
              </div>
              {selectedForCompare.length === 2 && (
                <button
                  type="button"
                  onClick={handleLaunchCompare}
                  className="font-bold text-[#D95218] hover:text-[#FC6C26] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Launch Side-by-Side Compare</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {filteredRecom.length === 0 ? (
            <div className="warm-glass rounded-2xl p-12 text-center text-xs text-[#6E5C4E] font-medium border border-[#E7D9BC]">
              No recommendation query history found matching your filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredRecom.map((item) => {
                const isSelected = selectedForCompare.includes(item.query);
                return (
                  <div
                    key={item.id}
                    className={`warm-glass rounded-xl p-4 border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isSelected
                        ? "border-[#FC6C26] bg-[#FFF8E9] shadow-md shadow-[#D95218]/10"
                        : "border-[#E7D9BC] hover:border-[#FC6C26]/50 bg-white"
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[11px] text-[#6E5C4E] font-semibold">
                        <Clock className="w-3 h-3 text-[#FC6C26]" />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span className="font-semibold text-[#231A14]">{item.domain || "General"}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[10px] font-mono">
                          {item.confidence || "high"} confidence
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-[#231A14] leading-snug line-clamp-2">
                        {item.query}
                      </div>

                      <div className="flex items-center gap-2 text-xs pt-0.5">
                        <span className="text-[#6E5C4E] font-medium">Primary Match:</span>
                        <span className="font-bold font-mono text-[#D95218] bg-[#FC6C26]/10 px-2 py-0.5 rounded border border-[#FC6C26]/30 text-[11px]">
                          {item.primary_standard}
                        </span>
                        {item.primary_title && (
                          <span className="text-[11px] text-[#6E5C4E] truncate max-w-sm">
                            {item.primary_title}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E7D9BC]/60">
                      <button
                        type="button"
                        onClick={() => toggleSelectForCompare(item.query)}
                        className={`tactile-btn-secondary px-3 py-1.5 text-xs font-semibold ${
                          isSelected ? "!bg-[#FC6C26]/15 !border-[#FC6C26] !text-[#D95218]" : ""
                        }`}
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                        <span>{isSelected ? "Selected" : "Compare"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push(`/recommend?q=${encodeURIComponent(item.query)}`)}
                        className="tactile-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Re-run Analysis</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Tender Audits History */}
      {activeTab === "audit" && (
        <div className="space-y-3">
          {filteredAudit.length === 0 ? (
            <div className="warm-glass rounded-2xl p-12 text-center text-xs text-[#6E5C4E] font-medium border border-[#E7D9BC]">
              No tender audit history found. Upload a tender document in the Tender Auditor to generate audit reports.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredAudit.map((item) => (
                <div
                  key={item.id}
                  className="warm-glass rounded-xl p-5 border border-[#E7D9BC] hover:border-[#FC6C26]/50 bg-white transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#FC6C26]" />
                      <h3 className="text-sm font-bold text-[#231A14] truncate">
                        {item.document_name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                        item.summary.has_compliance_issues
                          ? "bg-rose-50 text-rose-800 border-rose-300"
                          : "bg-emerald-50 text-emerald-800 border-emerald-300"
                      }`}>
                        {item.summary.has_compliance_issues ? "Compliance Gaps Found" : "Fully Compliant"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#6E5C4E] font-semibold">
                      <Clock className="w-3 h-3 text-[#9B8977]" />
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span>{item.summary.sections_analysed} Sections Analysed</span>
                    </div>

                    {/* Stats pills */}
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#FFF8E9] text-[#231A14] font-medium border border-[#E7D9BC]">
                        Standards Cited: <strong className="text-[#D95218] font-mono">{item.summary.total_standards_cited}</strong>
                      </span>
                      {item.summary.total_superseded_citations > 0 && (
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 font-semibold border border-amber-300">
                          Superseded: {item.summary.total_superseded_citations}
                        </span>
                      )}
                      {item.summary.total_missing_recommendations > 0 && (
                        <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-800 font-semibold border border-rose-300">
                          Missing Codes: {item.summary.total_missing_recommendations}
                        </span>
                      )}
                      {item.summary.total_qco_gaps > 0 && (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#FC6C26]/10 text-[#D95218] font-semibold border border-[#FC6C26]/30">
                          QCO Gaps: {item.summary.total_qco_gaps}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={() => router.push(`/audit/${item.id}`)}
                      className="tactile-btn-primary px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <FileSearch className="w-3.5 h-3.5" />
                      <span>View Full Audit Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
