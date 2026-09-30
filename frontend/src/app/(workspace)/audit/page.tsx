"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileSearch,
  PlusCircle,
  FileCheck2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Download,
  FileText,
  Layers,
  Sparkles
} from "lucide-react";
import { getAuditHistory } from "@/lib/api";
import { AuditHistoryItem } from "@/types";
import dynamic from "next/dynamic";
import { PrimaryButton } from "@/components/ui/Button";

const AuditWorkspace = dynamic(
  () => import("@/components/audit/AuditWorkspace").then((m) => m.AuditWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-3xl warm-glass border border-[#E7D9BC] p-12 flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-mono text-[#8D7B68]">
          <div className="w-2 h-2 rounded-full bg-[#FC6C26] animate-ping" />
          <span>Initializing audit workspace...</span>
        </div>
      </div>
    ),
  }
);

export default function AuditDashboardPage() {
  const router = useRouter();
  const [audits, setAudits] = useState<AuditHistoryItem[]>([]);

  useEffect(() => {
    setAudits(getAuditHistory());
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-3xl warm-glass border border-[#E7D9BC] p-6 shadow-xs">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#FFF8E9] text-[#D95218] text-xs font-mono font-bold border border-[#E7D9BC]">
            <Sparkles className="w-3.5 h-3.5 text-[#FC6C26]" />
            <span>TENDER AUDIT & COMPLIANCE WORKSTATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#231A14]">
            Statutory Standards & QCO Tender Audit
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5C4E] font-normal leading-relaxed">
            Audit tender and procurement specifications before floating. Detect superseded citations, identify missing normative references, and eliminate non-compliance with mandatory Quality Control Orders.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Link
            href="/audit/new"
            className="tactile-btn-primary px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Upload New Tender PDF</span>
          </Link>
        </div>
      </div>

      {/* Main Interactive Audit Intelligence Workspace */}
      <AuditWorkspace />

      {/* Historical Audit Dossiers */}
      {audits.length > 0 && (
        <section className="rounded-3xl warm-glass border border-[#E7D9BC] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E7D9BC]">
            <div>
              <h2 className="text-sm font-bold text-[#231A14]">Prior Tender Audit Reports</h2>
              <p className="text-xs text-[#6E5C4E]">Saved compliance evaluations from previous sessions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {audits.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white hover:bg-[#FFF8E9]/60 border border-[#E7D9BC] hover:border-[#FC6C26]/40 transition flex items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#FC6C26] shrink-0" />
                    <span className="text-xs font-bold text-[#231A14] truncate">
                      {item.document_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#8D7B68]">
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{item.summary.sections_analysed} Sections</span>
                    <span>•</span>
                    <span className={item.summary.has_compliance_issues ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                      {item.summary.has_compliance_issues ? "Issues Found" : "Clean"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push(`/audit/${item.id}`)}
                  className="tactile-btn-secondary px-3 py-1.5 text-xs font-semibold rounded-xl"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FC6C26]" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

