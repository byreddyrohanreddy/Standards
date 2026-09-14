"use client";

import React, { useState, useRef } from "react";
import { Search, UploadCloud, FileText, Sparkles, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { ExampleScenario } from "@/types";

interface RequirementInputProps {
  query: string;
  setQuery: (q: string) => void;
  onAnalyze: () => void;
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

  const handleSelectExample = (example: ExampleScenario) => {
    setQuery(example.query);
    setSelectedFileName(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 md:p-6 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-700" />
            Procurement Specification / Tender Requirement
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter technical specification text or upload a tender NIT document in PDF format.
          </p>
        </div>

        {/* Try Example Preset Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Try Example:
          </span>
          <select
            className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            onChange={(e) => {
              const ex = examples.find((x) => x.id === e.target.value);
              if (ex) handleSelectExample(ex);
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Select sample scenario...
            </option>
            {examples.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 15 kW three phase induction motor, 415 V, 50 Hz for industrial applications with efficiency and IP protection requirements..."
          rows={4}
          className="w-full text-sm text-slate-800 bg-slate-50/50 rounded-lg border border-slate-300 p-3.5 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute top-2.5 right-2.5 text-xs text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded-md hover:bg-slate-200 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Action Footer: Buttons + Upload Dropzone */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-3">
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
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition"
          >
            <UploadCloud className="w-4 h-4 text-slate-600" />
            {selectedFileName ? `PDF: ${selectedFileName}` : "Upload Tender PDF"}
          </button>

          {selectedFileName && (
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1 font-medium">
              <FileText className="w-3.5 h-3.5" />
              Document Parsed
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isLoading || (!query.trim() && !selectedFileName)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Analyzing Standards...
              </>
            ) : (
              <>
                Analyze Requirement
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Scenario Buttons */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-semibold text-slate-400 uppercase mr-1">Quick Presets:</span>
        {examples.slice(0, 4).map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => handleSelectExample(ex)}
            className="text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md transition"
          >
            {ex.label.split(". ")[1] || ex.label}
          </button>
        ))}
      </div>
    </div>
  );
};
