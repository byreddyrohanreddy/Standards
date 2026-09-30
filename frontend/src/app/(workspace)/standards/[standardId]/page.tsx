"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Network,
  GitCompare,
  Copy,
  ExternalLink,
  Shield,
  Layers,
  Sparkles
} from "lucide-react";
import { fetchStandards, fetchStandardDetail, fetchQcoForStandard } from "@/lib/api";
import { StandardMetadata, QCOResult } from "@/types";

export default function StandardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params?.standardId as string) || "";
  const standardId = decodeURIComponent(rawId);

  const [standard, setStandard] = useState<StandardMetadata | null>(null);
  const [qcos, setQcos] = useState<QCOResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedClause, setCopiedClause] = useState(false);

  useEffect(() => {
    if (!standardId) return;
    setIsLoading(true);

    fetchStandards()
      .then((allStds) => {
        const found = allStds.find(
          (s) =>
            s.is_number.toLowerCase() === standardId.toLowerCase() ||
            s.id.toLowerCase() === standardId.toLowerCase()
        );
        if (found) {
          setStandard(found);
          fetchQcoForStandard(found.is_number)
            .then((res) => {
              if (res && res.qco_results) setQcos(res.qco_results);
            })
            .catch(() => {});
        } else {
          setError(`Standard "${standardId}" not found in catalog.`);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load standard details.");
        setIsLoading(false);
      });
  }, [standardId]);

  const handleCopyClause = () => {
    if (!standard) return;
    const clause = `The offered material/equipment shall conform to Indian Standard ${standard.is_number} ("${standard.title}"). All routine and type tests shall be conducted in accordance with referenced test standards (${standard.test_methods?.join(", ") || "applicable BIS codes"}). The manufacturer shall hold a valid BIS Certification License.`;
    navigator.clipboard.writeText(clause);
    setCopiedClause(true);
    setTimeout(() => setCopiedClause(false), 2000);
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-xs text-[#6E5C4E] font-medium">
        <div className="inline-flex items-center gap-2 p-3 warm-glass rounded-xl border border-[#E7D9BC]">
          <Sparkles className="w-4 h-4 text-[#FC6C26] animate-spin" />
          <span>Loading Indian Standard details for <strong className="text-[#D95218] font-mono">{standardId}</strong>...</span>
        </div>
      </main>
    );
  }

  if (error || !standard) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4 text-center">
        <div className="p-8 warm-glass border border-rose-300 bg-rose-50 rounded-2xl max-w-lg mx-auto text-xs text-[#231A14] space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
          <h2 className="text-base font-bold text-[#231A14]">Standard Not Found</h2>
          <p className="text-[#6E5C4E]">{error || `Could not find standard ${standardId}.`}</p>
          <Link
            href="/standards"
            className="tactile-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Standards Catalog</span>
          </Link>
        </div>
      </main>
    );
  }

  const isSuperseded = standard.status === "superseded" || standard.status === "withdrawn";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back button and quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/standards"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E5C4E] hover:text-[#D95218] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Standards Catalog</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/compare?std1=${encodeURIComponent(standard.is_number)}`}
            className="tactile-btn-secondary px-3.5 py-1.5 text-xs font-bold rounded-xl"
          >
            <GitCompare className="w-3.5 h-3.5 text-[#FC6C26]" />
            <span>Compare Standard</span>
          </Link>

          <Link
            href="/graph"
            className="tactile-btn-secondary px-3.5 py-1.5 text-xs font-bold rounded-xl"
          >
            <Network className="w-3.5 h-3.5 text-[#FC6C26]" />
            <span>View in Knowledge Graph</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyClause}
            className="tactile-btn-primary px-4 py-1.5 text-xs font-bold rounded-xl cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-white" />
            <span>{copiedClause ? "Copied Clause!" : "Copy Tender Clause"}</span>
          </button>
        </div>
      </div>

      {/* Main Standard Header Card */}
      <div className="warm-glass-glow rounded-3xl p-6 sm:p-8 border border-[#FC6C26]/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-black font-mono text-[#D95218] bg-[#FC6C26]/12 px-3.5 py-1 rounded-xl border border-[#FC6C26]/30">
              {standard.is_number}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-md border ${
              isSuperseded
                ? "bg-amber-500/15 text-amber-900 border-amber-500/30"
                : "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
            }`}>
              {standard.status.toUpperCase()}
            </span>
          </div>

          <div className="text-xs text-[#6E5C4E] font-medium flex items-center gap-3">
            <span><strong className="text-[#231A14]">Domain:</strong> {standard.domain}</span>
            <span>•</span>
            <span><strong className="text-[#231A14]">Year:</strong> {standard.year}</span>
            <span>•</span>
            <span><strong className="text-[#231A14]">Amendments:</strong> {standard.amendments?.length || 0}</span>
          </div>
        </div>

        <h1 className="text-lg sm:text-xl font-black text-[#231A14] leading-snug">
          {standard.title}
        </h1>

        {/* Supersession Banner */}
        {standard.superseded_by && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-[#231A14] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-900">Lifecycle Supersession Notice:</div>
              <p className="mt-0.5 text-[#6E5C4E] leading-relaxed text-[11px]">
                This standard has been superseded by <strong className="text-[#231A14] font-mono">{standard.superseded_by}</strong>. Tenders referencing {standard.is_number} should be updated to the latest revision to ensure legal compliance under General Financial Rules (GFR).
              </p>
            </div>
          </div>
        )}

        {/* Scope */}
        <div className="space-y-1.5 pt-2">
          <h2 className="text-xs font-bold text-[#6E5C4E] uppercase tracking-wider">Scope and Application:</h2>
          <p className="text-xs text-[#231A14] leading-relaxed bg-[#FFF8E9] p-4 rounded-xl border border-[#E7D9BC]">
            {standard.scope}
          </p>
        </div>
      </div>

      {/* Mandatory QCO Section */}
      {qcos.length > 0 && (
        <div className="warm-glass rounded-2xl p-6 border border-[#FC6C26]/30 bg-[#FC6C26]/5 space-y-3">
          <div className="flex items-center gap-2 text-[#231A14] font-bold text-sm">
            <Shield className="w-5 h-5 text-[#FC6C26]" />
            <h2 className="text-[#D95218]">Mandatory Quality Control Order (QCO) Applicability</h2>
          </div>
          <p className="text-xs text-[#6E5C4E]">
            This standard falls under mandatory Government of India Quality Control Orders. Goods manufactured or imported must carry BIS Certification.
          </p>

          <div className="space-y-2 pt-1">
            {qcos.map((q) => (
              <div key={q.qco_id} className="p-3.5 bg-white rounded-xl border border-[#E7D9BC] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#231A14]">{q.qco_title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FC6C26] text-white">
                    {q.status.status_label}
                  </span>
                </div>
                <div className="text-[11px] text-[#6E5C4E]">
                  <strong>Scheme:</strong> {q.certification_scheme} • <strong>Ministry:</strong> {q.issuing_ministry}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Normative & Testing Dependencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Normative References */}
        <div className="warm-glass rounded-2xl p-6 border border-[#E7D9BC] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7D9BC]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#231A14]">
              Normative References ({standard.normative_references?.length || 0})
            </h3>
            <span className="text-[10px] text-[#6E5C4E]">Mandatory Referenced Codes</span>
          </div>

          <div className="space-y-2">
            {standard.normative_references && standard.normative_references.length > 0 ? (
              standard.normative_references.map((ref, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-[#E7D9BC] flex items-center justify-between text-xs"
                >
                  <span className="font-mono font-bold text-[#D95218]">{ref}</span>
                  <Link
                    href={`/standards/${encodeURIComponent(ref)}`}
                    className="text-[#D95218] hover:text-[#FC6C26] font-bold text-[11px]"
                  >
                    View &rarr;
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-xs text-[#9B8977] italic">No normative references listed.</div>
            )}
          </div>
        </div>

        {/* Test Methods */}
        <div className="warm-glass rounded-2xl p-6 border border-[#E7D9BC] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7D9BC]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#231A14]">
              Test Methods & Testing Codes ({standard.test_methods?.length || 0})
            </h3>
            <span className="text-[10px] text-[#6E5C4E]">Verification Standards</span>
          </div>

          <div className="space-y-2">
            {standard.test_methods && standard.test_methods.length > 0 ? (
              standard.test_methods.map((tm, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-[#E7D9BC] flex items-center justify-between text-xs"
                >
                  <span className="font-mono font-bold text-[#D95218]">{tm}</span>
                  <Link
                    href={`/standards/${encodeURIComponent(tm)}`}
                    className="text-[#D95218] hover:text-[#FC6C26] font-bold text-[11px]"
                  >
                    View &rarr;
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-xs text-[#9B8977] italic">No test methods listed.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
