"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  FileSearch,
  BookOpen,
  Network,
  FileCheck2,
  ArrowRight,
  Upload,
  Clock,
  CheckCircle2,
  Search,
  Shield,
  Layers,
  ChevronRight,
  Database,
  Compass
} from "lucide-react";
import { fetchExamples, getRecommendationHistory, uploadTenderPdf } from "@/lib/api";
import { ExampleScenario, RecommendationHistoryItem } from "@/types";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { LiveBadge } from "@/components/ui/StatusBadge";

const WORKFLOW_SHORTCUTS = [
  {
    title: "Tender Document Audit",
    desc: "Verify full NIT specifications against active BIS codes and QCO mandates.",
    href: "/audit",
    icon: FileSearch,
    badge: "Document AI",
  },
  {
    title: "Standards Catalog",
    desc: "Browse 113 indexed BIS standards, normative test codes, and editions.",
    href: "/standards",
    icon: BookOpen,
    badge: "113 Standards",
  },
  {
    title: "Mandatory QCO Explorer",
    desc: "Inspect Central Government mandatory certification orders under Section 16.",
    href: "/qco",
    icon: FileCheck2,
    badge: "Statutory",
  },
  {
    title: "Knowledge Graph",
    desc: "Traverse normative, testing, safety, and installation relationships.",
    href: "/graph",
    icon: Network,
    badge: "Ontology",
  },
];

const PRESET_REQUIREMENTS = [
  {
    label: "15 kW Induction Motor",
    text: "15 kW, 4-pole, 415 V, 50 Hz, 3-phase squirrel cage induction motor for continuous duty (S1), IP55 enclosure, Class F insulation, IE3 efficiency.",
  },
  {
    label: "33 kV XLPE Power Cable",
    text: "33 kV grade, 3-core, 300 sq mm stranded aluminum conductor, cross-linked polyethylene (XLPE) insulated, galvanized steel flat strip armoured power cable.",
  },
  {
    label: "50 kVA Distribution Transformer",
    text: "50 kVA, 11 kV / 433 V, three-phase, 50 Hz, copper wound, oil-immersed naturally cooled (ONAN) outdoor distribution transformer with BIS energy efficiency Level 2.",
  },
  {
    label: "Solar PV Grid Inverter",
    text: "50 kW three-phase grid-tied solar photovoltaic central inverter with MPPT, 415 V AC output, IP65 protection, harmonic distortion under 3 percent.",
  },
];

export default function AIControlCenter() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [specificationInput, setSpecificationInput] = useState("");
  const [recentAnalyses, setRecentAnalyses] = useState<RecommendationHistoryItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setRecentAnalyses(getRecommendationHistory().slice(0, 4));
  }, []);

  const handleRunAnalysis = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = specificationInput.trim();
    if (!query) return;
    router.push(`/recommend?q=${encodeURIComponent(query)}`);
  };

  const handleSelectPreset = (presetText: string) => {
    setSpecificationInput(presetText);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadTenderPdf(file);
      if (res.query) {
        router.push(`/recommend?q=${encodeURIComponent(res.query)}`);
      } else {
        router.push("/recommend");
      }
    } catch (_) {
      router.push("/recommend");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10 pb-12 max-w-6xl mx-auto">
      {/* 1. ASYMMETRIC CONTROL CENTER HEADER */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <LiveBadge label="OPERATIONAL" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#D95218] font-bold">
            BIS-SpecAI // AI CONTROL CENTER
          </span>
          <span className="text-[#E7D9BC]">•</span>
          <span className="text-[11px] font-mono text-[#6E5C4E]">
            Smart India Hackathon 2026 PS #26108
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#231A14] leading-[1.1]">
              Turn Specifications into <br />
              <span className="bg-gradient-to-r from-[#FC6C26] to-[#D95218] bg-clip-text text-transparent">
                Verified Indian Standards
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#6E5C4E] max-w-md font-normal leading-relaxed">
            Multi-parameter technical specification mapping to active Bureau of Indian Standards (BIS) codes, statutory Quality Control Orders (QCO), and normative test requirements.
          </p>
        </div>
      </section>

      {/* 2. PRIMARY SPECIFICATION COMPOSER CONSOLE */}
      <section className="relative rounded-2xl bg-[#FFFAEF] border border-[#E7D9BC] shadow-lg shadow-[#D95218]/5 overflow-hidden">
        {/* Luminous Top Warm Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#FC6C26] via-[#D95218] to-transparent" />

        <div className="p-5 sm:p-7 space-y-5">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7D9BC] pb-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
                Procurement Requirement Console
              </div>
              <div className="text-xs text-[#6E5C4E]">
                Enter technical equipment parameters, rating, voltage, duty cycle, or standards keywords
              </div>
            </div>

            {/* Quick Upload Alternative */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E7D9BC] bg-[#FFF8E9] text-xs font-semibold text-[#231A14] hover:bg-[#FFF4D6] hover:border-[#FC6C26]/40 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#FC6C26]" />
                <span>{isUploading ? "Reading PDF..." : "Upload Tender PDF"}</span>
              </button>
            </div>
          </div>

          {/* Form Area */}
          <form onSubmit={handleRunAnalysis} className="space-y-4">
            <div className="relative">
              <textarea
                value={specificationInput}
                onChange={(e) => setSpecificationInput(e.target.value)}
                placeholder="Describe your procurement requirement (e.g. 15 kW 3-phase induction motor, 415 V, 50 Hz, IP55 enclosure, Class F insulation, IE3 efficiency)..."
                rows={4}
                className="w-full p-4 rounded-xl bg-white border border-[#E7D9BC] text-[#231A14] placeholder-[#9B8977] text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:border-[#FC6C26] focus:ring-2 focus:ring-[#FC6C26]/10 resize-y"
              />
            </div>

            {/* Presets Row */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-[#9B8977]">
                Quick technical presets:
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_REQUIREMENTS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset.text)}
                    className="clay-chip text-xs hover:border-[#FC6C26]/40 cursor-pointer"
                  >
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-[#6E5C4E] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Deterministic vector retrieval across 113 Indian Standards</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {specificationInput.trim() && (
                  <button
                    type="button"
                    onClick={() => setSpecificationInput("")}
                    className="text-xs text-[#9B8977] hover:text-[#231A14] px-2 py-1"
                  >
                    Clear
                  </button>
                )}
                <PrimaryButton
                  type="submit"
                  disabled={!specificationInput.trim()}
                  immediateFeedback
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  size="md"
                  className="w-full sm:w-auto"
                >
                  Run AI Recommendation
                </PrimaryButton>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 3. ASYMMETRIC SECONDARY SECTION: WORKFLOWS & RECENT LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Primary Technical Workflows */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
              System Workflows & Tooling
            </h2>
            <Link
              href="/recommend"
              className="text-xs font-semibold text-[#D95218] hover:text-[#FC6C26] flex items-center gap-1"
            >
              <span>Go to Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {WORKFLOW_SHORTCUTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="p-4 rounded-xl bg-[#FFFAEF] border border-[#E7D9BC] hover:border-[#FC6C26]/40 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF8E9] border border-[#E7D9BC] flex items-center justify-center text-[#D95218] group-hover:scale-105 group-hover:bg-[#FC6C26] group-hover:text-white transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#FFF8E9] border border-[#E7D9BC] text-[#6E5C4E]">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#231A14] group-hover:text-[#FC6C26] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#6E5C4E] mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Recent Analyses & Engine Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
              Recent Activity
            </h2>
            <Link
              href="/history"
              className="text-xs font-semibold text-[#D95218] hover:text-[#FC6C26]"
            >
              View All
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFAEF] border border-[#E7D9BC] space-y-3">
            {recentAnalyses.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#9B8977] space-y-1">
                <Clock className="w-5 h-5 mx-auto text-[#E7D9BC]" />
                <p>No prior queries in current session.</p>
                <p className="text-[11px]">Run an analysis above to build your audit log.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentAnalyses.map((item, idx) => (
                  <Link
                    key={idx}
                    href={`/recommend?q=${encodeURIComponent(item.query)}`}
                    className="block p-2.5 rounded-lg bg-[#FFF8E9] border border-[#E7D9BC] hover:border-[#FC6C26]/40 hover:bg-[#FFF4D6] transition-colors group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#9B8977]">
                      <span className="font-bold text-[#D95218]">
                        {item.primary_standard || "IS 12615:2018"}
                      </span>
                      <span>
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-[#231A14] truncate mt-0.5 group-hover:text-[#FC6C26] transition-colors">
                      {item.query}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Quick Engine Telemetry */}
            <div className="pt-3 border-t border-[#E7D9BC] space-y-1.5 text-[11px] font-mono text-[#6E5C4E]">
              <div className="flex justify-between">
                <span>Vector Index:</span>
                <span className="font-bold text-[#231A14]">113 Standards</span>
              </div>
              <div className="flex justify-between">
                <span>Domain Coverage:</span>
                <span className="font-bold text-[#231A14]">9 Domains</span>
              </div>
              <div className="flex justify-between">
                <span>Retrieval Benchmark:</span>
                <span className="font-bold text-emerald-700">90.9% Recall@1 (100% Top-5)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
