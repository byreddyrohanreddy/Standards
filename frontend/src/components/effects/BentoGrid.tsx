"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Network,
  FileCheck2,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Activity,
  Layers,
  Cpu,
  Clock
} from "lucide-react";
import { ScoreRing } from "../ui/ScoreRing";
import { LiveBadge, StatusPill } from "../ui/StatusBadge";

export const BentoGrid: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* TILE 1: Large Featured Tile (7 cols) - AI Recommendation Engine Preview */}
        <div className="md:col-span-7 rounded-2xl p-6 sm:p-7 bg-[#FFFCF6] border border-[#E7D9BC] shadow-sm flex flex-col justify-between hover:border-[#CBB998] hover:shadow-md transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FC6C26]/8 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#FC6C26]/12 text-[#D95218] border border-[#FC6C26]/20">
                Core AI Workspace
              </span>
              <LiveBadge label="ENGINE READY" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#1E1510] tracking-tight leading-snug mb-2">
              Multi-Parameter Neural Matching
            </h3>
            <p className="text-xs sm:text-sm text-[#4D3E33] leading-relaxed mb-5">
              Dense semantic embeddings (all-MiniLM-L6-v2) combined with BM25 lexical ranking cross-reference 15+ engineering parameters (voltage, power, duty, insulation) to provide deterministic BIS standard citations with clause-level verification.
            </p>

            {/* Interactive Micro Mockup */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E7D9BC]/80 space-y-2 mb-4 shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#1E1510] font-bold">IS 12615:2018</span>
                <span className="text-[#FC6C26] font-bold">Top Candidate (Rank 1)</span>
              </div>
              <div className="text-xs text-[#4D3E33] truncate">
                Energy Efficient Induction Motors — Three Phase Squirrel Cage (IE3/IE4)
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-mono font-semibold border border-emerald-200">
                  ACTIVE
                </span>
                <span className="px-2 py-0.5 rounded bg-orange-50 text-[#B45309] text-xs font-mono font-semibold border border-orange-200">
                  QCO MANDATORY
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-[#E7D9BC]/60">
            <span className="text-xs font-mono text-[#5F4F42]">
              Dual-Engine Pipeline • Zero Hallucination
            </span>
            <Link
              href="/recommend"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FC6C26] group-hover:text-[#D95218] transition-colors"
            >
              <span>Explore Engine</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* TILE 2: Top Right (5 cols) - Telemetry & Accuracy Metrics */}
        <div className="md:col-span-5 rounded-2xl p-6 sm:p-7 bg-[#FFFCF6] border border-[#E7D9BC] shadow-sm flex flex-col justify-between hover:border-[#CBB998] hover:shadow-md transition-all duration-300 group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#E7D9BC]/40 text-[#4D3E33]">
                System Benchmarks
              </span>
              <Activity className="w-4 h-4 text-[#FC6C26]" />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <ScoreRing score={90.91} size="sm" showGrade={false} />
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#1E1510] font-mono">
                  90.91%
                </span>
                <p className="text-xs text-[#4D3E33] font-medium leading-tight">
                  Recall@1 Accuracy (100% Recall@5 across all 22 ground-truth benchmark queries)
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E7D9BC]/60 text-xs font-mono">
              <div className="flex justify-between text-[#4D3E33]">
                <span>Average Latency:</span>
                <strong className="text-[#1E1510]">83.7 ms</strong>
              </div>
              <div className="flex justify-between text-[#4D3E33]">
                <span>Indexed Standards:</span>
                <strong className="text-[#1E1510]">113 IS Codes</strong>
              </div>
              <div className="flex justify-between text-[#4D3E33]">
                <span>MRR (Mean Reciprocal):</span>
                <strong className="text-[#D95218]">0.9470</strong>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E7D9BC]/60">
            <Link
              href="/evaluation"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FC6C26] group-hover:text-[#D95218] transition-colors"
            >
              <span>View Accuracy Audit</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* TILE 3: Bottom Left (5 cols) - Document Intelligence & Tender Audit */}
        <div className="md:col-span-5 rounded-2xl p-6 sm:p-7 bg-[#FFFCF6] border border-[#E7D9BC] shadow-sm flex flex-col justify-between hover:border-[#CBB998] hover:shadow-md transition-all duration-300 group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                DOCUMENT AI
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#1E1510] tracking-tight mb-2">
              Automated Tender Audit & Gap Analysis
            </h3>
            <p className="text-xs text-[#4D3E33] leading-relaxed mb-4">
              Upload raw NIT/tender PDF schedules. The system segments clauses, identifies outdated or superseded IS codes, and produces a compliance gap scorecard.
            </p>

            <div className="p-2.5 rounded-lg bg-white border border-[#E7D9BC]/80 text-xs font-mono flex items-center justify-between">
              <span className="text-[#4D3E33]">Supersession Check:</span>
              <span className="text-emerald-700 font-bold">Automatic Warning</span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E7D9BC]/60">
            <Link
              href="/audit"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FC6C26] group-hover:text-[#D95218] transition-colors"
            >
              <span>Launch Tender Auditor</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* TILE 4: Bottom Right (7 cols) - Interactive Standards Knowledge Graph */}
        <div className="md:col-span-7 rounded-2xl p-6 sm:p-7 bg-[#FFFCF6] border border-[#E7D9BC] shadow-sm flex flex-col justify-between hover:border-[#CBB998] hover:shadow-md transition-all duration-300 group relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                  <Network className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-[#1E1510] tracking-tight">
                  Ontological Knowledge Graph
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-[#5F4F42] bg-[#FFF8EC] px-2 py-0.5 rounded border border-[#E7D9BC]">
                750+ EDGES
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#4D3E33] leading-relaxed mb-4">
              Explore interconnected BIS codes via interactive DAG visualizers. Trace testing methods (IS 9000), safety protocols (IS 12065), and installation specifications directly linked to the primary standard.
            </p>

            {/* Mini Graph Diagram Nodes Preview */}
            <div className="p-3 rounded-xl bg-white border border-[#E7D9BC]/80 flex items-center justify-around text-xs font-mono text-[#1E1510]">
              <div className="flex flex-col items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#FC6C26]" />
                <span className="text-xs font-bold">IS 12615</span>
              </div>
              <span className="text-[#8C7764]">── normative ──</span>
              <div className="flex flex-col items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold">IS 15999</span>
              </div>
              <span className="text-[#8C7764]">── test ──</span>
              <div className="flex flex-col items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold">IS 12065</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 flex items-center justify-between border-t border-[#E7D9BC]/60">
            <span className="text-xs font-mono text-[#5F4F42]">
              Powered by React Flow • Real-Time Physics Layout
            </span>
            <Link
              href="/graph"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FC6C26] group-hover:text-[#D95218] transition-colors"
            >
              <span>Explore Graph Canvas</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
