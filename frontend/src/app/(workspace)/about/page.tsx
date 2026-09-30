"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Layers,
  Cpu,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Network,
  Scale,
  ArrowRight,
  ExternalLink,
  BookOpen
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl warm-glass border border-[#E7D9BC] p-8 sm:p-10 shadow-sm space-y-4 overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#FFF8E9] border border-[#E7D9BC] text-xs font-mono font-medium text-[#D95218]">
          <Shield className="w-3.5 h-3.5 text-[#FC6C26]" />
          <span>Smart India Hackathon 2026 : Problem Statement #26108</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#231A14] leading-tight">
          BIS-SpecAI: Architecture & System Overview
        </h1>

        <p className="text-sm text-[#6E5C4E] font-normal leading-relaxed max-w-3xl">
          An AI-powered recommendation and audit engine engineered to identify applicable Indian Standards for procurement specifications, verify current editions, discover related normative and testing codes, and enforce mandatory Quality Control Orders (QCOs).
        </p>

        <div className="pt-2 flex items-center gap-3 flex-wrap">
          <Link
            href="/recommend"
            className="tactile-btn-primary px-5 py-2.5 text-xs font-bold rounded-xl"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
          <Link
            href="/audit"
            className="tactile-btn-secondary px-5 py-2.5 text-xs font-semibold rounded-xl"
          >
            <span>Audit Tender Document</span>
          </Link>
        </div>
      </div>

      {/* The Problem Statement Context */}
      <section className="rounded-3xl warm-glass border border-[#E7D9BC] p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-[#231A14] flex items-center gap-2">
          <Scale className="w-5 h-5 text-rose-600" />
          <span>Problem Statement & National Significance</span>
        </h2>

        <div className="text-xs text-[#6E5C4E] leading-relaxed space-y-3">
          <p>
            In Indian public procurement (spanning Central Ministries, State PWDs, Indian Railways, Defense, and Public Sector Undertakings), technical specifications drafted by tender officers often cite <strong className="text-[#231A14]">withdrawn or superseded Indian Standards</strong>, omit <strong className="text-[#231A14]">essential testing protocols</strong>, or fail to mention <strong className="text-[#231A14]">mandatory Quality Control Orders (QCOs)</strong> issued under the Bureau of Indian Standards Act, 2016.
          </p>
          <p>
            This leads to costly vendor litigation, substandard material deliveries, audit objections from the Comptroller and Auditor General (CAG), and non-compliance with General Financial Rules (GFR 2017 Rule 144).
          </p>
          <div className="p-4 rounded-2xl bg-[#FFF8E9] border border-[#FC6C26]/30 text-[#231A14]">
            <strong className="text-[#D95218]">The Solution:</strong> BIS-SpecAI automates standards discovery by parsing unstructured technical specifications, performing hybrid semantic & lexical vector retrieval with chunk-level max pooling, traversing relationship knowledge graphs, and validating legal QCO compliance in under 50 milliseconds.
          </div>
        </div>
      </section>

      {/* 8-Stage Architecture */}
      <section className="rounded-3xl warm-glass border border-[#E7D9BC] p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#231A14] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#FC6C26]" />
            <span>End-to-End 8-Stage Pipeline Architecture</span>
          </h2>
          <p className="text-xs text-[#6E5C4E] mt-0.5">
            How a raw procurement text or PDF query travels through our AI intelligence stack:
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              stage: "Stage 1: Multilingual Detection & Normalization",
              desc: "Detects query language (supports English, Hindi, and Indian technical loanwords) and normalizes product phrasing and engineering abbreviations.",
            },
            {
              stage: "Stage 2: Dynamic NLP Parameter Extraction & Segmentation",
              desc: "Extracts technical variables (voltage, power, grade, materials, frequency) and segments multi-product compound tenders into independent requirement groups.",
            },
            {
              stage: "Stage 3: Version & Supersession Audit",
              desc: "Audits every cited IS standard number in the specification text. Immediately flags obsolete editions (e.g. IS 325:1996) and substitutes current active standards (IS 12615:2018).",
            },
            {
              stage: "Stage 4: Hybrid BM25 Lexical + Dense Semantic Embedding Search",
              desc: "Executes parallel dual-stream retrieval using BM25 keyword matching alongside 384-dimensional dense sentence embeddings (sentence-transformers/all-MiniLM-L6-v2).",
            },
            {
              stage: "Stage 5: Chunk-Level Max Pooling Across Standards Scopes",
              desc: "Computes similarity against segmented technical clauses, scope paragraphs, and technical tables within each standard to catch specific clause-level applicability.",
            },
            {
              stage: "Stage 6: Reciprocal Rank Fusion & Confidence Guardrails",
              desc: "Merges ranked lists into an explainable AI relevance percentage. Rejects non-standard or out-of-scope queries gracefully to prevent hallucination.",
            },
            {
              stage: "Stage 7: Standards Knowledge Graph Traversal (DAG)",
              desc: "Navigates 759 relationship edges to assemble normative references, routine & type testing codes, safety specifications, and installation standards.",
            },
            {
              stage: "Stage 8: Mandatory Quality Control Order (QCO) Verification",
              desc: "Checks official Central Government Gazette notifications for mandatory BIS Scheme-I (ISI Mark) or CRS enforcement under Section 16 & 17 of BIS Act 2016.",
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E7D9BC] flex items-start gap-3.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#FC6C26]/12 text-[#D95218] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#FC6C26]/30">
                0{idx + 1}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-[#231A14]">{item.stage}</h3>
                <p className="text-[11px] text-[#6E5C4E] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integration Vision */}
      <section className="rounded-3xl warm-glass border border-[#E7D9BC] p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-[#231A14] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#FC6C26]" />
          <span>E-Procurement Integration Vision</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-[#E7D9BC] space-y-1.5 shadow-xs">
            <div className="font-bold text-[#231A14]">GeM (Government e-Marketplace)</div>
            <p className="text-[#6E5C4E] text-[11px] leading-relaxed">
              Direct API integration into GeM tender creation wizard to validate standards and mandatory QCOs before floating bids.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E7D9BC] space-y-1.5 shadow-xs">
            <div className="font-bold text-[#231A14]">CPPP (Central Public Procurement Portal)</div>
            <p className="text-[#6E5C4E] text-[11px] leading-relaxed">
              Automated PDF tender pre-screening to eliminate CAG audit objections for citing withdrawn or superseded IS codes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E7D9BC] space-y-1.5 shadow-xs">
            <div className="font-bold text-[#231A14]">IREPS (Indian Railways)</div>
            <p className="text-[#6E5C4E] text-[11px] leading-relaxed">
              Seamless linking with RDSO and Indian Standards for rolling stock, signaling, and track material tenders.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
