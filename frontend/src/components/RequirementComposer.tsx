"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  Zap,
  RotateCcw,
  FileCheck,
  FileUp,
  Loader2,
  Cpu,
  Layers,
  ShieldCheck,
  Check,
  Plus
} from "lucide-react";
import { ExampleScenario } from "@/types";
import { PrimaryButton, SecondaryButton, Button } from "./ui/Button";
import { useToast } from "./ui/Toast";

export interface RequirementComposerProps {
  query: string;
  setQuery: (query: string) => void;
  onAnalyze: (customQuery?: string) => void;
  onUploadPdf: (file: File) => void;
  isLoading: boolean;
  examples?: ExampleScenario[];
  className?: string;
}

export type DropzoneState =
  | "EMPTY"
  | "HOVER"
  | "DRAGGING"
  | "UPLOADING"
  | "PARSING"
  | "READY"
  | "ERROR";

const QUICK_SUGGESTIONS = [
  { label: "+ 3-Phase 415V", value: " 3-phase, 415V ±10%, 50Hz" },
  { label: "+ IE3 / IE4 Efficiency", value: " conforming to energy efficiency class IE3 / IE4" },
  { label: "+ XLPE Insulated Cable", value: " 1100V grade, stranded aluminium conductor, XLPE insulated" },
  { label: "+ M45 Pre-stressed Concrete", value: " M45 grade design mix with w/c ratio <= 0.38" },
  { label: "+ IP55 Ingress Protection", value: " with minimum IP55 enclosure protection" },
  { label: "+ Mandatory QCO Compliance", value: " with BIS Quality Control Order mandatory certification" },
];

const PRESET_SCENARIOS = [
  {
    number: "01",
    title: "Induction Motor IE3",
    category: "Electrical Machines",
    icon: <Cpu className="w-4 h-4 text-[#FC6C26]" />,
    description: "15 kW, 4-pole, 415V, 50Hz squirrel cage motor foot-mounted IP55 continuous industrial drive",
    query: "Supply and commissioning of 15 kW, 4-pole, 415V ±10%, 50Hz, 3-phase squirrel cage induction motor conforming to energy efficiency class IE3, foot-mounted with IP55 protection for continuous industrial drive.",
    standards: "IS 12615:2018"
  },
  {
    number: "02",
    title: "1.1 kV XLPE Cable",
    category: "Power Cables",
    icon: <Layers className="w-4 h-4 text-amber-600" />,
    description: "3.5 core 185 sq mm aluminium conductor, armoured, PVC sheathed power distribution cable",
    query: "1100 V grade, 3.5 core 185 sq mm stranded compacted aluminium conductor, XLPE insulated, inner PVC taped, galvanized steel flat strip armoured and overall PVC sheathed power cables.",
    standards: "IS 7098 (Part 1)"
  },
  {
    number: "03",
    title: "Pre-stressed Concrete",
    category: "Civil & Infrastructure",
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    description: "High-performance M45 concrete mix with 53 grade cement for pre-stressed bridge girders",
    query: "Design mix proportioning for high performance M45 grade concrete using Ordinary Portland Cement 53 grade, with maximum water-cement ratio of 0.38, for pre-stressed concrete girder bridge spans.",
    standards: "IS 456 / IS 1343"
  },
  {
    number: "04",
    title: "Submersible Pump Sets",
    category: "Water Supply",
    icon: <Zap className="w-4 h-4 text-cyan-600" />,
    description: "150 mm borewell, 10 HP motor, 15 stages, 120m operating head with dynamic bronze impellers",
    query: "Borewell submersible pump set suitable for 150 mm borewell, 10 HP 3-phase motor, 15 stages, operating head of 120 meters and discharge rate 200 LPM with dynamically balanced bronze impellers.",
    standards: "IS 8034:2018"
  },
];

export const RequirementComposer: React.FC<RequirementComposerProps> = ({
  query,
  setQuery,
  onAnalyze,
  onUploadPdf,
  isLoading,
  examples = [],
  className = "",
}) => {
  const { toast } = useToast();
  const [activeMode, setActiveMode] = useState<"text" | "pdf">("text");
  const [dropState, setDropState] = useState<DropzoneState>("EMPTY");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = query.length;
  const wordCount = query.trim() ? query.trim().split(/\s+/).length : 0;

  // Handle Ctrl+Enter to trigger analysis
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleTriggerAnalyze();
    }
  };

  const handleTriggerAnalyze = () => {
    if (!query.trim() || isLoading || isSubmitting) return;
    setIsSubmitting(true);
    onAnalyze();
    // Reset submission state after slight delay
    setTimeout(() => setIsSubmitting(false), 800);
  };

  const handleAppendSuggestion = (suggestionText: string) => {
    const updated = query ? `${query.trim()}${suggestionText}` : suggestionText.trim();
    setQuery(updated);
    toast({
      title: "Parameter Appended",
      description: `Added "${suggestionText.trim()}" to requirement specification`,
      type: "info",
      duration: 2500,
    });
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleSelectScenario = (index: number) => {
    const scenario = PRESET_SCENARIOS[index];
    setSelectedScenarioIdx(index);
    setQuery(scenario.query);
    toast({
      title: `Loaded Scenario #${scenario.number}`,
      description: `${scenario.title} — Targeted BIS: ${scenario.standards}`,
      type: "success",
      duration: 3000,
    });
  };

  // PDF Dropzone Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropState !== "UPLOADING" && dropState !== "PARSING") {
      setDropState("DRAGGING");
    }
  };

  const handleDragLeave = () => {
    if (dropState === "DRAGGING") {
      setDropState(selectedFile ? "READY" : "EMPTY");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processSelectedFile(files[0]);
    } else {
      setDropState("EMPTY");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setDropState("ERROR");
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid tender or specification PDF file (.pdf)",
        type: "error",
      });
      return;
    }

    setSelectedFile(file);
    setDropState("UPLOADING");

    // Simulate upload -> parsing -> ready
    setTimeout(() => {
      setDropState("PARSING");
      setTimeout(() => {
        setDropState("READY");
        toast({
          title: "PDF Ready for Extraction",
          description: `${file.name} (${(file.size / 1024).toFixed(1)} KB) staged for deep analysis`,
          type: "success",
        });
      }, 700);
    }, 600);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) return;
    onUploadPdf(selectedFile);
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setDropState("EMPTY");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      className={`rounded-2xl border border-[#E7D9BC] bg-[#FFFAEF]/95 shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      {/* Composer Header & Mode Selector */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#E7D9BC] bg-[#FFF8EC]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FC6C26] to-[#D95218] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#231A14] tracking-tight">
              Requirement Specification Composer
            </h2>
            <p className="text-[11px] text-[#6E5C4E] hidden sm:block">
              Input raw tender clauses, equipment ratings, or upload technical documents
            </p>
          </div>
        </div>

        {/* Mode Toggle (Text / PDF) */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#FFF6E3] border border-[#E7D9BC] text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveMode("text")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeMode === "text"
                ? "bg-[#FFFAEF] text-[#231A14] font-bold shadow-xs border border-[#E7D9BC]/80"
                : "text-[#6E5C4E] hover:text-[#231A14]"
            }`}
          >
            Specification Text
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("pdf")}
            className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeMode === "pdf"
                ? "bg-[#FFFAEF] text-[#231A14] font-bold shadow-xs border border-[#E7D9BC]/80"
                : "text-[#6E5C4E] hover:text-[#231A14]"
            }`}
          >
            <span>Tender PDF</span>
            {selectedFile && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>
      </div>

      {/* Main Composer Body */}
      <div className="p-4 sm:p-6 space-y-4">
        {activeMode === "text" ? (
          <>
            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-[#8D7B68] uppercase font-mono mr-1">
                Quick Insert:
              </span>
              {QUICK_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAppendSuggestion(item.value)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#FFF6E3] border border-[#E7D9BC] hover:border-[#FC6C26]/40 hover:bg-[#FFF2D9] text-[#6E5C4E] hover:text-[#231A14] transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-2.5 h-2.5 text-[#FC6C26]" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Requirement Textarea */}
            <div className="relative rounded-xl border border-[#E7D9BC] bg-[#FFFAEF] focus-within:border-[#FC6C26] focus-within:ring-2 focus-within:ring-[#FC6C26]/20 transition-all shadow-inner">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                placeholder="Enter technical specifications, equipment scope, voltage levels, testing criteria, or paste directly from tender schedules (e.g. '15 kW, 415V induction motor conforming to IE3, IP55 protection')..."
                className="w-full p-4 text-xs sm:text-sm font-mono text-[#231A14] placeholder-[#8D7B68] bg-transparent resize-y focus:outline-none leading-relaxed"
              />

              {/* Textarea Bottom Action Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E7D9BC]/60 bg-[#FFF8EC]/60 text-[11px] font-mono text-[#8D7B68]">
                <div className="flex items-center gap-3">
                  <span>
                    <strong className="text-[#231A14]">{wordCount}</strong> words
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-[#231A14]">{charCount}</strong> characters
                  </span>
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="ml-2 text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-[#8D7B68]">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-[#E7D9BC]/35 border border-[#E7D9BC]">Ctrl+Enter</kbd> to analyze
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6E5C4E] hidden sm:inline">
                  Dual-Engine: Dense all-MiniLM-L6-v2 + BM25 Lexical + QCO Enforcement
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <PrimaryButton
                  onClick={handleTriggerAnalyze}
                  disabled={!query.trim() || isLoading || isSubmitting}
                  isLoading={isLoading || isSubmitting}
                  immediateFeedback
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  size="md"
                >
                  Analyze Requirement
                </PrimaryButton>
              </div>
            </div>
          </>
        ) : (
          /* PDF Dropzone Mode */
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[220px] ${
                dropState === "DRAGGING"
                  ? "border-[#FC6C26] bg-[#FC6C26]/5 scale-[0.99]"
                  : dropState === "READY"
                  ? "border-emerald-500/60 bg-emerald-500/5"
                  : dropState === "ERROR"
                  ? "border-rose-500/60 bg-rose-500/5"
                  : "border-[#E7D9BC] bg-[#FFF8EC] hover:border-[#FC6C26]/50 hover:bg-[#FFF4D6]/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {dropState === "UPLOADING" || dropState === "PARSING" ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-[#FC6C26] animate-spin" />
                  <p className="text-sm font-semibold text-[#231A14]">
                    {dropState === "UPLOADING" ? "Uploading document..." : "Parsing tender clauses..."}
                  </p>
                  <p className="text-xs font-mono text-[#6E5C4E]">
                    {selectedFile?.name}
                  </p>
                </div>
              ) : selectedFile && dropState === "READY" ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-700 shadow-xs">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#231A14]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs font-mono text-[#6E5C4E] mt-0.5">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Staged for multi-clause extraction
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <PrimaryButton
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadSubmit();
                      }}
                      isLoading={isLoading}
                      immediateFeedback
                      leftIcon={<FileText className="w-3.5 h-3.5" />}
                    >
                      Extract & Match Standards
                    </PrimaryButton>
                    <SecondaryButton size="sm" onClick={handleClearFile}>
                      Change PDF
                    </SecondaryButton>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#FC6C26]/10 border border-[#FC6C26]/20 flex items-center justify-center text-[#FC6C26] mb-1">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-[#231A14]">
                    Drag and drop tender specification PDF
                  </p>
                  <p className="text-xs text-[#6E5C4E] max-w-sm">
                    Upload NIT tender documents, schedule of requirements, or technical data sheets to extract all clauses automatically.
                  </p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono text-[#FC6C26] bg-[#FC6C26]/8 border border-[#FC6C26]/20 mt-2">
                    <Upload className="w-3 h-3" /> Select File from Computer
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 15: Preset Scenario Cards */}
        <div className="pt-2 border-t border-[#E7D9BC]/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E5C4E] font-mono">
              Pre-Engineered Benchmark Scenarios
            </span>
            <span className="text-[11px] text-[#8D7B68]">
              Click any card to load verified technical criteria
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_SCENARIOS.map((scenario, idx) => {
              const isSelected = selectedScenarioIdx === idx;
              return (
                <div
                  key={scenario.number}
                  onClick={() => handleSelectScenario(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#FFF2DE] border-[#FC6C26] shadow-xs ring-1 ring-[#FC6C26]/20"
                      : "bg-[#FFF8EC] border-[#E7D9BC] hover:border-[#D4C4A8] hover:bg-[#FFF4D6]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-[#FFFAEF] border border-[#E7D9BC] flex items-center justify-center shrink-0">
                        {scenario.icon}
                      </div>
                      <span className="text-xs font-bold text-[#231A14] leading-tight truncate">
                        {scenario.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#8D7B68] bg-[#E7D9BC]/40 px-1.5 py-0.5 rounded shrink-0">
                      #{scenario.number}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6E5C4E] line-clamp-2 leading-relaxed mb-2.5">
                    {scenario.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E7D9BC]/50 text-[10px] font-mono gap-2">
                    <span className="text-[#FC6C26] font-semibold truncate">
                      {scenario.standards}
                    </span>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isSelected
                          ? "bg-[#FC6C26] text-white"
                          : "bg-[#E7D9BC]/40 text-[#6E5C4E] hover:bg-[#FC6C26]/10 hover:text-[#FC6C26]"
                      }`}
                    >
                      {isSelected ? "Active" : "Load"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
