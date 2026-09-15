"use client";

import React, { useState, useRef } from "react";
import {
  Search,
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Zap,
  Layers,
  AlertTriangle,
  HelpCircle,
  Play
} from "lucide-react";
import { ExampleScenario } from "@/types";

interface RequirementInputProps {
  query: string;
  setQuery: (q: string) => void;
  onAnalyze: (customQuery?: string) => void;
  onUploadPdf: (file: File) => void;
  isLoading: boolean;
  examples: ExampleScenario[];
}

export const RequirementInput: React.FC<RequirementInputProps> = ({
  query,
  setQuery,
  onAnalyze,
  onUploadPdf,
  isLoading,
  examples,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      onUploadPdf(file);
    }
  };

  const handleSelectExample = (example: ExampleScenario, autoRun: boolean = true) => {
    setQuery(example.query);
    setSelectedFileName(null);
    if (autoRun) {
      onAnalyze(example.query);
    }
  };

  // 5 Primary Judge Demonstration Scenarios
  const primaryDemos = examples.slice(0, 5);
  const additionalDemos = examples.slice(5);

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 md:p-6 transition-all space-y-4">
      {/* Action Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-700" />
            Procurement Requirement Input
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify applicable standards by typing technical parameters, uploading tender NIT, or selecting a judge demo scenario.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
            <span>{selectedFileName ? `PDF: ${selectedFileName}` : "Upload Tender PDF"}</span>
          </button>

          {selectedFileName && (
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1 font-medium">
              <FileText className="w-3.5 h-3.5" />
              Document Parsed
            </span>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter technical specification text (e.g., 15 kW three-phase squirrel-cage induction motor for industrial operation, 415 V, 50 Hz)..."
          rows={3}
          className="w-full text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-lg border border-slate-300 p-3.5 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all placeholder:text-slate-400 font-sans"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute top-2.5 right-2.5 text-xs text-slate-400 hover:text-slate-700 px-2 py-0.5 rounded-md hover:bg-slate-200 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Submit Button Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span>Supported inputs: Engineering ratings, commercial tender clauses, or IS citations.</span>
        </div>

        <button
          type="button"
          onClick={() => onAnalyze()}
          disabled={isLoading || (!query.trim() && !selectedFileName)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Standards...</span>
            </>
          ) : (
            <>
              <span>Identify Applicable Standards</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* JUDGE DEMO FLOW PANEL: 5 One-Click Live Scenarios */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            One-Click Judge Demonstration Scenarios:
          </span>

          {/* Additional scenarios dropdown */}
          {additionalDemos.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">More:</span>
              <select
                className="text-[11px] bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md px-2 py-1 text-slate-700 cursor-pointer focus:outline-hidden"
                onChange={(e) => {
                  const ex = examples.find((x) => x.id === e.target.value);
                  if (ex) handleSelectExample(ex, true);
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Additional Domains (Transformers, Cement, Rebar, PPE, Solar)...
                </option>
                {additionalDemos.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 5 Prominent Demonstration Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {primaryDemos.map((ex, idx) => {
            const isMatch = query.trim() === ex.query.trim();
            const badgeLabel = [
              "1. Technical Match",
              "2. Semantic Search",
              "3. Multi-Item Tender",
              "4. Superseded Audit",
              "5. Unknown Rejection"
            ][idx] || ex.category;

            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => handleSelectExample(ex, true)}
                className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                  isMatch
                    ? "bg-blue-50/80 border-blue-600 text-blue-950 shadow-2xs"
                    : "bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                      {badgeLabel}
                    </span>
                    <Play className="w-3 h-3 text-slate-400 group-hover:text-blue-700 shrink-0" />
                  </div>
                  <div className="text-xs font-bold mt-1 line-clamp-1 text-slate-900">
                    {ex.label.split(": ")[1] || ex.label}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    "{ex.query}"
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-emerald-700 font-medium">
                  → Click to Run
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
