"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  FileSearch,
  FileCheck2,
  Network,
  Sparkles,
  Shield,
  Upload,
  CheckCircle2,
  ChevronRight,
  Search,
  Zap,
  Target,
  Layers,
  BarChart3,
  Activity,
  Database,
} from "lucide-react";
import { SplitText, BlurText, FadeIn, CountUp, GlowCard } from "@/components/effects/Animations";
import { BentoGrid } from "@/components/effects/BentoGrid";
import { InformationMarquee } from "@/components/effects/InformationMarquee";
import { SideRays } from "@/components/effects/SideRays";
import { uploadTenderPdf } from "@/lib/api";

/* ─── DATA ─── */

const CAPABILITIES = [
  {
    icon: Search,
    title: "Multi-Parameter Matching",
    desc: "Voltage, power rating, duty cycle, insulation class, enclosure type. Every parameter is cross-referenced against the full BIS index.",
    metric: "113",
    metricLabel: "Standards Indexed",
  },
  {
    icon: Target,
    title: "Deterministic Retrieval",
    desc: "No hallucination. Vector similarity scoring with explainable evidence chains. Every recommendation cites specific IS clause numbers.",
    metric: "90.9%",
    metricLabel: "Top-1 Recall (100% Top-5)",
  },
  {
    icon: FileCheck2,
    title: "QCO Compliance Check",
    desc: "Automatic cross-check against Central Government Quality Control Orders under BIS Act Section 16. Flags mandatory certifications.",
    metric: "14",
    metricLabel: "Active QCO Orders",
  },
  {
    icon: Network,
    title: "Standards Knowledge Graph",
    desc: "Traverse normative references, testing standards, safety codes, and installation relationships between interconnected IS codes.",
    metric: "750+",
    metricLabel: "Graph Relationships",
  },
  {
    icon: Layers,
    title: "Tender Document Intelligence",
    desc: "Upload NIT/tender PDFs. The system extracts technical specifications and maps each parameter to applicable Indian Standards.",
    metric: "PDF",
    metricLabel: "Document Parsing",
  },
  {
    icon: BarChart3,
    title: "Evaluation Benchmarks",
    desc: "Full retrieval performance metrics: precision, recall, MRR, and NDCG across all 9 electrotechnical domains.",
    metric: "9",
    metricLabel: "Domains Covered",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Describe Your Requirement",
    desc: "Enter procurement specifications with equipment parameters, ratings, voltage class, duty cycle, or upload a tender PDF directly.",
  },
  {
    step: "02",
    title: "AI Retrieves Standards",
    desc: "Multi-parameter vector matching identifies the most relevant BIS codes. Each match includes similarity scores and evidence.",
  },
  {
    step: "03",
    title: "Review Evidence Chain",
    desc: "Examine why each standard was recommended. See parameter matches, normative references, and QCO compliance flags.",
  },
  {
    step: "04",
    title: "Export for Procurement",
    desc: "Copy verified standards directly into tender specifications. Full traceability from requirement to Indian Standard.",
  },
];

const DOMAINS = [
  "Rotating Machines",
  "Power Cables",
  "Transformers",
  "Solar PV",
  "Switchgear",
  "Wiring Accessories",
  "Energy Storage",
  "Insulators",
  "Smart Meters",
];

/* ─── HERO RIGHT PANEL: ENGINE INTELLIGENCE ─── */

const RECENT_MATCHES = [
  { standard: "IS 12615:2018", desc: "3-phase squirrel cage induction motors", score: 0.97, domain: "Rotating Machines" },
  { standard: "IS 1554-1:2020", desc: "PVC insulated power cables up to 1100 V", score: 0.94, domain: "Power Cables" },
  { standard: "IS 2026-1:2011", desc: "Power transformers - general", score: 0.92, domain: "Transformers" },
  { standard: "IS 16169:2023", desc: "Grid-connected solar PV inverters", score: 0.91, domain: "Solar PV" },
  { standard: "IS 13947-1:2019", desc: "Low-voltage switchgear assemblies", score: 0.89, domain: "Switchgear" },
];

const PIPELINE_STEPS = [
  { label: "Parse", icon: FileSearch, color: "#6E5C4E" },
  { label: "Embed", icon: Zap, color: "#D95218" },
  { label: "Match", icon: Target, color: "#FC6C26" },
  { label: "Verify", icon: Shield, color: "#16A34A" },
];

function HeroIntelligencePanel() {
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);
  const [pipelineStep, setPipelineStep] = useState(0);

  useEffect(() => {
    const matchInterval = setInterval(() => {
      setActiveMatchIdx((prev) => (prev + 1) % RECENT_MATCHES.length);
    }, 3000);
    return () => clearInterval(matchInterval);
  }, []);

  useEffect(() => {
    const pipelineInterval = setInterval(() => {
      setPipelineStep((prev) => (prev + 1) % (PIPELINE_STEPS.length + 1));
    }, 2000);
    return () => clearInterval(pipelineInterval);
  }, []);

  return (
    <div className="hidden lg:block relative">
      <div className="relative rounded-2xl bg-white border border-[#E7D9BC] shadow-lg shadow-[#D95218]/5 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E7D9BC]/60 bg-[#FFFCF6]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600 shadow-xs shadow-emerald-500/50 animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#4D3E33] uppercase tracking-wider">
              Engine Benchmark Verification
            </span>
          </div>
          <span className="text-xs font-mono font-semibold text-[#5F4F42]">BENCHMARK SUITE</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-0 border-b border-[#E7D9BC]/60">
          {[
            { value: "113", label: "Standards", sublabel: "Indexed", icon: BookOpen },
            { value: "90.9%", label: "Recall@1", sublabel: "100% Recall@5", icon: Target },
            { value: "14", label: "Active QCOs", sublabel: "Statutory", icon: Layers },
          ].map((stat, idx) => {
            const SIcon = stat.icon;
            return (
              <div
                key={idx}
                className={`px-4 py-4 text-center ${idx < 2 ? "border-r border-[#E7D9BC]/50" : ""} hover:bg-[#FFFDF9] transition-colors`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <SIcon className="w-3.5 h-3.5 text-[#FC6C26]" />
                  <span className="text-xl font-black text-[#1E1510] tracking-tight">{stat.value}</span>
                </div>
                <div className="text-xs font-bold text-[#4D3E33]">{stat.label}</div>
                <div className="text-xs font-mono text-[#5F4F42]">{stat.sublabel}</div>
              </div>
            );
          })}
        </div>

        {/* Mini Analysis Pipeline */}
        <div className="px-5 py-4 border-b border-[#E7D9BC]/60 bg-[#FFFDF9]">
          <div className="text-xs font-mono font-bold text-[#5F4F42] uppercase tracking-wider mb-3">
            Analysis Pipeline
          </div>
          <div className="flex items-center gap-2">
            {PIPELINE_STEPS.map((step, idx) => {
              const PIcon = step.icon;
              const isActive = pipelineStep === idx;
              const isDone = pipelineStep > idx;
              return (
                <React.Fragment key={idx}>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-300 ${
                      isActive
                        ? "border-[#FC6C26] bg-[#FC6C26]/10 shadow-xs"
                        : isDone
                        ? "border-emerald-500/40 bg-emerald-50"
                        : "border-[#E7D9BC]/60 bg-white"
                    }`}
                  >
                    <PIcon
                      className={`w-3.5 h-3.5 transition-colors duration-300 ${
                        isActive ? "text-[#FC6C26]" : isDone ? "text-emerald-700" : "text-[#5F4F42]"
                      }`}
                    />
                    <span
                      className={`text-xs font-bold transition-colors duration-300 ${
                        isActive ? "text-[#D95218]" : isDone ? "text-emerald-800" : "text-[#5F4F42]"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  </div>
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <div
                      className={`w-3.5 h-[1.5px] rounded-full transition-colors duration-300 ${
                        isDone ? "bg-emerald-500" : "bg-[#E7D9BC]"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Benchmark Match Feed */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-[#5F4F42] uppercase tracking-wider">
              Benchmark Verification Suite
            </span>
            <span className="text-xs font-mono text-[#D95218] font-bold">
              Sample {activeMatchIdx + 1} of {RECENT_MATCHES.length}
            </span>
          </div>

          <div className="space-y-2">
            {RECENT_MATCHES.map((match, idx) => {
              const isActive = idx === activeMatchIdx;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#FFF8EC] border border-[#FC6C26]/30 shadow-xs"
                      : "bg-transparent border border-transparent opacity-60"
                  }`}
                >
                  <div className="shrink-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-colors duration-300 ${
                        isActive
                          ? "bg-[#FC6C26]/12 text-[#D95218] border border-[#FC6C26]/30"
                          : "bg-[#FFF8E9] text-[#5F4F42] border border-[#E7D9BC]/60"
                      }`}
                    >
                      IS
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1E1510] truncate">
                        {match.standard}
                      </span>
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-[#E7D9BC] text-[#D95218] shrink-0">
                        {(match.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-xs text-[#4D3E33] truncate">{match.desc}</div>
                  </div>
                  {isActive && (
                    <div className="shrink-0 w-2 h-2 rounded-full bg-[#FC6C26] animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FC6C26]/40 to-transparent" />
      </div>
    </div>
  );
}

/* ─── LANDING PAGE ─── */

export default function LandingPage() {
  const router = useRouter();
  const [specInput, setSpecInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = specInput.trim();
    if (!q) return;
    router.push(`/recommend?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF4D6] text-[#231A14] overflow-x-hidden selection:bg-[#FC6C26]/20 selection:text-[#D95218] relative">
      {/* Environmental Side Rays Shader for Landing Page */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <SideRays
          origin="top-right"
          speed={1.3}
          intensity={1.8}
          rayColor1="#FC6C26"
          rayColor2="#FFE0A3"
          spread={2.6}
          tilt={-12}
          opacity={0.65}
          falloff={1.6}
          saturation={1.25}
        />
      </div>

      {/* ═══════════════ NAVIGATION BAR ═══════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFF4D6]/80 backdrop-blur-xl border-b border-[#E7D9BC]/60">
        <div className="landing-section flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FC6C26] to-[#D95218] flex items-center justify-center text-white shadow-sm">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold tracking-tight text-[#231A14]">BIS-SpecAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#6E5C4E]">
            <a href="#capabilities" className="hover:text-[#FC6C26] transition-colors">Capabilities</a>
            <a href="#how-it-works" className="hover:text-[#FC6C26] transition-colors">How It Works</a>
            <a href="#domains" className="hover:text-[#FC6C26] transition-colors">Domains</a>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#231A14] text-white text-xs font-semibold hover:bg-[#3D2E22] transition-colors"
          >
            Open Workspace
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative pt-14 min-h-[92vh] flex items-center">


        {/* Subtle Grid Overlay */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(217, 82, 24, 0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.5,
          }}
          aria-hidden="true"
        />

        <div className="landing-section relative z-10 w-full py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Headlines + Search */}
            <div>
              {/* System Label */}
              <FadeIn delay={0} duration={500}>
                <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-md bg-[#FFFAEF]/80 border border-[#E7D9BC] text-[11px] font-mono font-semibold text-[#6E5C4E] backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FC6C26]" />
                  Smart India Hackathon 2026 — Problem Statement #26108
                </div>
              </FadeIn>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.08] mb-6">
                <SplitText
                  text="Technical specifications"
                  splitBy="words"
                  delay={80}
                  duration={700}
                  direction="up"
                  tag="span"
                />
                <br />
                <SplitText
                  text="to verified"
                  splitBy="words"
                  delay={80}
                  duration={700}
                  direction="up"
                  tag="span"
                  className="text-[#231A14]"
                />
                {" "}
                <SplitText
                  text="Indian Standards."
                  splitBy="words"
                  delay={80}
                  duration={700}
                  direction="up"
                  tag="span"
                  className="text-[#FC6C26]"
                />
              </h1>

              {/* Subhead */}
              <FadeIn delay={400} duration={700}>
                <p className="text-base sm:text-lg text-[#6E5C4E] max-w-xl leading-relaxed mb-8">
                  AI-powered recommendation engine that maps procurement equipment parameters
                  to applicable BIS codes, QCO mandates, and normative test requirements.
                  Deterministic retrieval. No hallucination.
                </p>
              </FadeIn>

              {/* Hero CTA: Inline Specification Input */}
              <FadeIn delay={600} duration={700}>
                <form
                  onSubmit={handleSubmit}
                  className="relative max-w-xl bg-white/90 backdrop-blur-lg rounded-xl border border-[#E7D9BC] shadow-lg shadow-[#D95218]/5 overflow-hidden"
                >
                  <div className="flex items-start">
                    <textarea
                      value={specInput}
                      onChange={(e) => setSpecInput(e.target.value)}
                      placeholder="Describe equipment specifications (e.g. 15 kW, 3-phase induction motor, 415 V, IP55, IE3 efficiency)..."
                      rows={2}
                      className="flex-1 px-4 py-3.5 text-sm bg-transparent border-none outline-none resize-none placeholder-[#9B8977] font-normal"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5 border-t border-[#E7D9BC]/60">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-[#6E5C4E] hover:bg-[#FFF8E9] transition-colors cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        Upload PDF
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploading(true);
                          try {
                            const res = await uploadTenderPdf(file);
                            if (res.query) router.push(`/recommend?q=${encodeURIComponent(res.query)}`);
                          } catch (_) {
                            router.push("/recommend");
                          } finally {
                            setIsUploading(false);
                          }
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!specInput.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#231A14] text-white text-xs font-semibold hover:bg-[#3D2E22] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Analyze
                    </button>
                  </div>
                </form>
              </FadeIn>

              {/* Proof Bar */}
              <FadeIn delay={800} duration={700}>
                <div className="flex flex-wrap items-center gap-4 mt-6 text-[12px] text-[#6E5C4E]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>113 BIS standards indexed</span>
                  </div>
                  <span className="text-[#E7D9BC]">|</span>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#FC6C26]" />
                    <span>90.9% Top-1 Recall (100% Recall@5)</span>
                  </div>
                  <span className="text-[#E7D9BC]">|</span>
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#D95218]" />
                    <span>0.9470 Mean Reciprocal Rank (MRR)</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Interactive Engine Intelligence Panel */}
            <FadeIn delay={500} duration={900} direction="right">
              <HeroIntelligencePanel />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════ MARQUEE INFORMATION TICKER ═══════════════ */}
      <InformationMarquee />

      {/* ═══════════════ CAPABILITIES & WORKSPACE INTELLIGENCE ═══════════════ */}
      <section id="capabilities" className="py-20 lg:py-28 bg-[#FFFAEF]">
        <div className="landing-section">
          <FadeIn>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded bg-[#FFF4D6] border border-[#E7D9BC] text-xs font-mono font-bold uppercase tracking-wider text-[#D95218]">
                <span>[ 01 // ARCHITECTURE ]</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1510]">
                Institutional Standards Workstation
              </h2>
              <p className="text-sm text-[#4D3E33] max-w-xl mt-2 leading-relaxed">
                Dual-engine retrieval cross-referencing dense neural vectors with statutory Quality Control Orders (QCO) under the Bureau of Indian Standards Act, 2016.
              </p>
            </div>
          </FadeIn>

          {/* Asymmetric Bento Grid Section */}
          <FadeIn delay={150}>
            <BentoGrid className="mb-14" />
          </FadeIn>

          {/* Live Specification Verification Trace (Replaces repetitive feature cards) */}
          <FadeIn delay={250}>
            <div className="rounded-2xl border border-[#E7D9BC] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E7D9BC]/60 gap-4">
                <div>
                  <div className="text-xs font-mono font-bold text-[#FC6C26] uppercase tracking-wider mb-1">
                    Traceability Engine Output
                  </div>
                  <h3 className="text-lg font-bold text-[#1E1510]">
                    Automated Parameter Verification & Clause Resolution
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    100% Deterministic Match
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
                {/* Column 1: Input Specification */}
                <div className="rounded-xl border border-[#E7D9BC]/80 bg-[#FFFCF6] p-5">
                  <div className="text-xs font-mono font-bold text-[#5F4F42] uppercase tracking-wider mb-3">
                    01 • Ingested Parameters
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1.5 border-b border-[#E7D9BC]/40">
                      <span className="text-[#5F4F42]">Equipment Type:</span>
                      <strong className="text-[#1E1510]">3-Phase Induction Motor</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#E7D9BC]/40">
                      <span className="text-[#5F4F42]">Rated Power:</span>
                      <strong className="text-[#1E1510]">15.0 kW (20 HP)</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#E7D9BC]/40">
                      <span className="text-[#5F4F42]">Voltage & Frequency:</span>
                      <strong className="text-[#1E1510]">415 V ±10%, 50 Hz</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#E7D9BC]/40">
                      <span className="text-[#5F4F42]">Efficiency Class:</span>
                      <strong className="text-[#FC6C26]">IE3 (Premium)</strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-[#5F4F42]">Protection & Duty:</span>
                      <strong className="text-[#1E1510]">IP55 / S1 Continuous</strong>
                    </div>
                  </div>
                </div>

                {/* Column 2: Resolved Primary Standard */}
                <div className="rounded-xl border border-[#FC6C26]/30 bg-[#FFF9F2] p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-mono font-bold text-[#D95218] uppercase tracking-wider">
                      02 • Recommended Standard
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-[#D95218] border border-[#E7D9BC]">
                      Top Benchmark Match
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="text-base font-bold text-[#1E1510]">IS 12615:2018</div>
                    <div className="text-xs text-[#4D3E33] mt-1 leading-snug">
                      Line Operated Three-Phase Squirrel Cage Induction Motors (IE Code)
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-[#E7D9BC]/60 text-xs font-mono">
                    <div className="text-[#5F4F42]">Sectional Committee: <span className="text-[#1E1510] font-bold">ETD 15</span></div>
                    <div className="text-[#5F4F42]">Applicable Clause: <span className="text-[#1E1510] font-bold">Clause 7.2 (Losses & IE3 Limits)</span></div>
                    <div className="text-[#5F4F42]">QCO Status: <span className="text-[#B45309] font-bold">Mandatory (S.O. 423E)</span></div>
                  </div>
                </div>

                {/* Column 3: Normative Dependency Graph */}
                <div className="rounded-xl border border-[#E7D9BC]/80 bg-[#FFFCF6] p-5">
                  <div className="text-xs font-mono font-bold text-[#5F4F42] uppercase tracking-wider mb-3">
                    03 • Linked Normative Codes
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <div>
                        <strong className="font-mono text-[#1E1510]">IS/IEC 60034-1:2017</strong>
                        <p className="text-[#5F4F42] text-[11px] leading-tight">General rating, cooling methods, and temperature rise</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <div>
                        <strong className="font-mono text-[#1E1510]">IS 12065:1987</strong>
                        <p className="text-[#5F4F42] text-[11px] leading-tight">Permissible acoustic noise limits for industrial duty</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <div>
                        <strong className="font-mono text-[#1E1510]">IS 15999 (Part 2/Sec 1)</strong>
                        <p className="text-[#5F4F42] text-[11px] leading-tight">Standard methods for determining losses and efficiency</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS / VERIFICATION PIPELINE ═══════════════ */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="landing-section">
          <FadeIn>
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold uppercase tracking-wider text-[#15803D]">
                <span>[ 02 // METHODOLOGY ]</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1510]">
                Four-Stage Deterministic Verification Pipeline
              </h2>
              <p className="text-sm text-[#4D3E33] max-w-xl mt-2 leading-relaxed">
                From raw procurement clause or tender schedule to legally verifiable, audited Indian Standards citation.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step, idx) => (
              <FadeIn key={idx} delay={idx * 100} direction="up">
                <div className="rounded-xl border border-[#E7D9BC] bg-white p-5 h-full flex flex-col justify-between shadow-xs hover:border-[#CBB998] transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-8 h-8 rounded-lg bg-[#1E1510] text-white flex items-center justify-center text-xs font-mono font-bold">
                        {step.step}
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#5F4F42]">
                        STAGE {step.step}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1E1510] mb-2">{step.title}</h3>
                    <p className="text-xs text-[#4D3E33] leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#E7D9BC]/50 text-xs font-mono text-[#D95218] font-semibold">
                    {idx === 0 && "NLP Parameter Extraction"}
                    {idx === 1 && "Dense + Lexical Search"}
                    {idx === 2 && "Normative Cross-Check"}
                    {idx === 3 && "Verified Audit Package"}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DOMAIN COVERAGE MATRIX ═══════════════ */}
      <section id="domains" className="py-20 lg:py-28 bg-[#FFFAEF]">
        <div className="landing-section">
          <div className="mb-10">
            <FadeIn>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded bg-white border border-[#E7D9BC] text-xs font-mono font-bold uppercase tracking-wider text-[#4D3E33]">
                <span>[ 03 // STANDARDIZATION SCOPE ]</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1510] mb-2">
                9 Electrotechnical Sectional Committees
              </h2>
              <p className="text-sm text-[#4D3E33] max-w-2xl leading-relaxed">
                Complete coverage of core industrial product standards, testing codes, safety specifications, and active Central Government QCO mandates.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { code: "ETD 15", domain: "Rotating Machinery", sample: "IS 12615:2018 (IE3/IE4 Motors)", qco: "Active QCO", count: "16 Standards" },
              { code: "ETD 09", domain: "Power Cables & Conductors", sample: "IS 1554 / IS 7098 (PVC & XLPE)", qco: "Active QCO", count: "21 Standards" },
              { code: "ETD 16", domain: "Transformers", sample: "IS 2026 / IS 1180 (Distribution)", qco: "Active QCO", count: "14 Standards" },
              { code: "ETD 28", domain: "Solar Photovoltaic Energy", sample: "IS 16169 / IS 16221 (Inverters)", qco: "Mandatory MNRE", count: "11 Standards" },
              { code: "ETD 07", domain: "Low Voltage Switchgear", sample: "IS/IEC 60947 / IS 13947 (MCCB/ACB)", qco: "Active QCO", count: "18 Standards" },
              { code: "ETD 14", domain: "Electrical Wiring Accessories", sample: "IS 3854 / IS 1293 (Switches/Plugs)", qco: "Active QCO", count: "9 Standards" },
              { code: "ETD 11", domain: "Secondary Cells & Batteries", sample: "IS 16046 / IS 16270 (Li-ion/Lead)", qco: "Active QCO", count: "8 Standards" },
              { code: "ETD 06", domain: "High Voltage Insulators", sample: "IS 731 / IS 2544 (Porcelain/Polymer)", qco: "Normative", count: "7 Standards" },
              { code: "ETD 13", domain: "Smart Metering & Grid", sample: "IS 16444 / IS 15885 (AMI Smart Meters)", qco: "Active QCO", count: "9 Standards" },
            ].map((d, idx) => (
              <FadeIn key={idx} delay={idx * 60} direction="up">
                <div className="rounded-xl border border-[#E7D9BC] bg-white p-4 hover:border-[#CBB998] hover:shadow-xs transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-[#FC6C26] px-2 py-0.5 rounded bg-[#FC6C26]/10 border border-[#FC6C26]/20">
                        {d.code}
                      </span>
                      <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {d.qco}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[#1E1510] mb-1">{d.domain}</div>
                    <div className="text-xs font-mono text-[#5F4F42]">{d.sample}</div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#E7D9BC]/50 flex items-center justify-between text-xs font-mono text-[#5F4F42]">
                    <span>Indexed Corpus:</span>
                    <strong className="text-[#1E1510]">{d.count}</strong>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/standards"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1E1510] text-white text-xs font-semibold hover:bg-[#382B21] transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Full 113 Standards Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="py-20 lg:py-28">
        <div className="landing-section">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1510] mb-4">
                Start Analyzing Equipment Specifications
              </h2>
              <p className="text-sm text-[#4D3E33] leading-relaxed mb-8">
                Enter your procurement parameters, upload a tender document, or inspect the
                full Bureau of Indian Standards catalog. Every recommendation is backed by deterministic
                vector retrieval with explainable clause citations.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/recommend"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FC6C26] text-white text-sm font-bold hover:bg-[#E05A17] transition-colors shadow-md shadow-[#D95218]/20"
                >
                  <Sparkles className="w-4 h-4" />
                  Run AI Analysis
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-[#E7D9BC] text-sm font-semibold text-[#1E1510] hover:border-[#CBB998] transition-colors shadow-xs"
                >
                  Open Control Center
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-[#E7D9BC] bg-[#FFFAEF] py-8">
        <div className="landing-section flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#4D3E33]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FC6C26] to-[#D95218] flex items-center justify-center text-white shadow-xs">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium">
              <strong className="font-bold text-[#1E1510]">BIS-SpecAI</strong> — Smart India Hackathon 2026 Problem Statement #26108
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <Link href="/about" className="hover:text-[#FC6C26] transition-colors">Architecture</Link>
            <span className="text-[#E7D9BC]">|</span>
            <Link href="/standards" className="hover:text-[#FC6C26] transition-colors">Standards</Link>
            <span className="text-[#E7D9BC]">|</span>
            <Link href="/evaluation" className="hover:text-[#FC6C26] transition-colors">Benchmarks</Link>
            <span className="text-[#E7D9BC]">|</span>
            <Link href="/graph" className="hover:text-[#FC6C26] transition-colors">Knowledge Graph</Link>
            <span className="text-[#E7D9BC]">|</span>
            <Link href="/privacy" className="text-[#D95218] font-semibold hover:underline">Privacy & Compliance</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
