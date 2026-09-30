"use client";

import React from "react";
import Link from "next/link";
import { Shield, Lock, FileText, Database, CheckCircle2, ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/effects/Animations";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <FadeIn>
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#5F4F42] hover:text-[#FC6C26] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        <div className="rounded-2xl border border-[#E7D9BC] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FC6C26] to-[#D95218] flex items-center justify-center text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#FC6C26] uppercase tracking-wider">
                Institutional Data Governance
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1E1510] tracking-tight">
                Privacy, Data Handling & Statutory Compliance
              </h1>
            </div>
          </div>
          <p className="text-sm text-[#4D3E33] leading-relaxed">
            Institutional disclosure on how BIS-SpecAI processes procurement documents, protects technical data, and attributes standards under the Bureau of Indian Standards Act, 2016.
          </p>
        </div>
      </FadeIn>

      {/* Grid of Key Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Document Processing Policy */}
        <FadeIn delay={100}>
          <div className="rounded-2xl border border-[#E7D9BC] bg-white p-6 shadow-xs h-full flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#D95218] mb-4">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-base font-bold text-[#1E1510] mb-2">
                Tender Document Ephemeral Processing
              </h2>
              <p className="text-xs text-[#4D3E33] leading-relaxed mb-4">
                Uploaded tender documents (NITs, RFP technical schedules, bill of materials) are processed in-memory for parameter extraction and clause classification.
              </p>
              <ul className="space-y-2 text-xs text-[#4D3E33]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>No proprietary pricing or vendor commercial bids are stored or transmitted to external third parties.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Temporary PDF buffers are cleaned up immediately following vector segmentation.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E7D9BC]/50 text-xs font-mono text-[#5F4F42]">
              Policy: Zero Persistent File Retention
            </div>
          </div>
        </FadeIn>

        {/* Local Storage & Client Session */}
        <FadeIn delay={150}>
          <div className="rounded-2xl border border-[#E7D9BC] bg-white p-6 shadow-xs h-full flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4">
                <Database className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-base font-bold text-[#1E1510] mb-2">
                Client-Side Audit History
              </h2>
              <p className="text-xs text-[#4D3E33] leading-relaxed mb-4">
                Query evaluations, tender gap reports, and comparison bookmarks are stored in your browser&apos;s local storage for audit traceability.
              </p>
              <ul className="space-y-2 text-xs text-[#4D3E33]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>You retain 100% control over local audit sessions, with one-click export and purge capabilities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>No advertising cookies, cross-site trackers, or third-party behavioral pixels are installed.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E7D9BC]/50 text-xs font-mono text-[#5F4F42]">
              Storage: Isolated Browser Sandboxing
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Statutory & Copyright Attribution Section */}
      <FadeIn delay={200}>
        <div className="rounded-2xl border border-[#E7D9BC] bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#FC6C26]" />
            <h2 className="text-base font-bold text-[#1E1510]">
              Bureau of Indian Standards Statutory Framework & Attribution
            </h2>
          </div>
          <div className="space-y-3 text-xs text-[#4D3E33] leading-relaxed">
            <p>
              BIS-SpecAI is developed as an AI-powered technical recommendation and regulatory compliance engine for <strong>Smart India Hackathon 2026 (Problem Statement #26108)</strong>, addressing the automated alignment of procurement specifications with applicable Indian Standards.
            </p>
            <p>
              Standard titles, standard numbers (e.g., IS 12615, IS 1554, IS 2026), and clause summaries are cited under fair dealing for educational, regulatory compliance, and statutory verification purposes pursuant to Section 16 of the <strong>Bureau of Indian Standards Act, 2016</strong> and relevant Quality Control Orders issued by the Government of India.
            </p>
            <p>
              Full unabridged normative standards documents remain the intellectual property and copyright of the Bureau of Indian Standards. For official authoritative copies, engineers and procurement officials should consult the official BIS Standards Portal (<a href="https://www.services.bis.gov.in" target="_blank" rel="noopener noreferrer" className="text-[#D95218] underline font-semibold">services.bis.gov.in</a>).
            </p>
          </div>
        </div>
      </FadeIn>

      {/* System Security Standards */}
      <FadeIn delay={250}>
        <div className="rounded-2xl border border-[#E7D9BC] bg-[#FFFCF6] p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#1E1510] mb-3">
            Technical Security Headers & Data Transmission
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-white border border-[#E7D9BC]/80">
              <span className="text-[#5F4F42] block text-[11px]">Frame Protection:</span>
              <strong className="text-[#1E1510]">SAMEORIGIN</strong>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#E7D9BC]/80">
              <span className="text-[#5F4F42] block text-[11px]">MIME Sniffing:</span>
              <strong className="text-[#1E1510]">X-Content-Type: nosniff</strong>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#E7D9BC]/80">
              <span className="text-[#5F4F42] block text-[11px]">Referrer Policy:</span>
              <strong className="text-[#1E1510]">strict-origin</strong>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
