"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FileSearch,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { getAuditById } from "@/lib/api";
import { TenderAuditReport } from "@/types";

export default function AuditReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params?.auditId as string) || "";
  const auditId = decodeURIComponent(rawId);

  const [report, setReport] = useState<TenderAuditReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auditId) return;
    const found = getAuditById(auditId);
    if (found) {
      setReport(found);
    }
    setIsLoading(false);
  }, [auditId]);

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-xs font-mono text-[#6E5C4E]">
        Loading tender compliance audit report...
      </main>
    );
  }

  if (!report) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <div className="p-8 rounded-3xl warm-glass max-w-md mx-auto text-xs text-[#6E5C4E] shadow-sm space-y-3 border border-[#E7D9BC]">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-base font-bold text-[#231A14]">Audit Report Not Found</h2>
          <p>The requested audit report ID &quot;{auditId}&quot; could not be retrieved from history.</p>
          <div>
            <Link
              href="/audit"
              className="tactile-btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Tender Audits</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { summary } = report;
  const hasIssues = summary.has_compliance_issues;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top back button and action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/audit"
          className="tactile-btn-secondary px-3.5 py-1.5 text-xs inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tender Audits Dashboard</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="tactile-btn-secondary px-4 py-2 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-[#FC6C26]" />
            <span>Print Compliance Certificate</span>
          </button>

          <Link
            href="/audit/new"
            className="tactile-btn-primary px-4 py-2 text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Audit Another Document</span>
          </Link>
        </div>
      </div>

      {/* Main Verdict Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 relative overflow-hidden ${
        hasIssues
          ? "bg-amber-50/80 border-amber-300 text-amber-950"
          : "bg-emerald-50/80 border-emerald-300 text-emerald-950"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {hasIssues ? (
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E5C4E]">
                Tender Compliance Audit Verdict
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#231A14] tracking-tight">
                {hasIssues ? "Action Required: Standards Non-Compliance Detected" : "Passed: Compliant with Indian Standards & QCOs"}
              </h1>
            </div>
          </div>

          <div className="text-xs font-mono text-[#6E5C4E] flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-[#E7D9BC]">
            <Clock className="w-3.5 h-3.5 text-[#9B8977]" />
            <span>{new Date(report.audit_timestamp).toLocaleString()}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#6E5C4E] leading-relaxed max-w-3xl">
          Audit of document <strong className="font-mono text-[#231A14] bg-white px-2 py-0.5 rounded border border-[#E7D9BC]">{report.document_name}</strong> completed in {report.audit_latency_ms} ms.
          {hasIssues
            ? " Superseded standards citations or missing mandatory Quality Control Order (QCO) clauses were detected in this tender document. Please rectify before publishing the NIT to prevent audit objections and supplier disputes."
            : " All cited standards are current active editions and applicable mandatory quality certifications are fully covered."}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Standards Cited", val: summary.total_standards_cited, sub: "Unique IS numbers", color: "text-[#231A14]" },
          { label: "Superseded Citations", val: summary.total_superseded_citations, sub: "Withdrawn standards", alert: summary.total_superseded_citations > 0, color: summary.total_superseded_citations > 0 ? "text-amber-800" : "text-[#231A14]" },
          { label: "Outdated Editions", val: summary.total_outdated_citations, sub: "Old revision years", alert: summary.total_outdated_citations > 0, color: summary.total_outdated_citations > 0 ? "text-amber-700" : "text-[#231A14]" },
          { label: "Missing Standards", val: summary.total_missing_recommendations, sub: "Recommended codes", alert: summary.total_missing_recommendations > 0, color: summary.total_missing_recommendations > 0 ? "text-[#D95218]" : "text-[#231A14]" },
          { label: "QCO Compliance Gaps", val: summary.total_qco_gaps, sub: "Mandatory orders", alert: summary.total_qco_gaps > 0, color: summary.total_qco_gaps > 0 ? "text-rose-700" : "text-[#231A14]" },
        ].map((m, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-4 bg-white border border-[#E7D9BC] space-y-1 shadow-xs"
          >
            <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6E5C4E]">{m.label}</div>
            <div className={`text-2xl font-black font-mono ${m.color}`}>{m.val}</div>
            <div className="text-[10px] text-[#9B8977] font-medium">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Section 1: Superseded & Outdated Alerts */}
      {report.version_alerts && report.version_alerts.length > 0 && (
        <div className="rounded-3xl warm-glass border border-[#E7D9BC] p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#231A14] font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
            <h2>Superseded & Outdated Standard References ({report.version_alerts.length})</h2>
          </div>

          <div className="space-y-3">
            {report.version_alerts.map((alert, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300 text-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                      {alert.referenced}
                    </span>
                    <span className="font-semibold text-amber-800">{alert.status}</span>
                  </div>
                  {alert.replacement && (
                    <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      Active Replacement: {alert.replacement}
                    </span>
                  )}
                </div>
                <p className="text-[#6E5C4E] leading-relaxed text-[11px]">
                  <strong className="text-[#231A14]">Recommendation:</strong> {alert.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Mandatory QCO Gaps */}
      {report.qco_gaps && report.qco_gaps.length > 0 && (
        <div className="rounded-3xl warm-glass border border-[#E7D9BC] p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#231A14] font-bold text-sm">
            <Shield className="w-5 h-5 text-[#FC6C26]" />
            <h2>Mandatory Quality Control Order (QCO) Compliance Gaps ({report.qco_gaps.length})</h2>
          </div>
          <p className="text-xs text-[#6E5C4E]">
            The following items in the tender specification fall under mandatory Quality Control Orders, but the required certification clause was not found in the NIT document:
          </p>

          <div className="space-y-3">
            {report.qco_gaps.map((qco, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FC6C26]/8 border border-[#FC6C26]/25 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#231A14]">{qco.qco_title}</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#FC6C26] text-white">
                    Mandatory Scheme
                  </span>
                </div>
                <div className="text-[11px] text-[#6E5C4E] space-y-1">
                  <div><strong>Standard:</strong> {qco.standard} • <strong>Scheme:</strong> {qco.certification_scheme}</div>
                  <div><strong>Issuing Ministry:</strong> {qco.issuing_ministry}</div>
                  <div className="text-rose-700 font-semibold pt-1 border-t border-[#FC6C26]/20 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                    <span>Gap: {qco.gap}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Section-by-Section Breakdown */}
      {report.section_findings && report.section_findings.length > 0 && (
        <div className="rounded-3xl warm-glass border border-[#E7D9BC] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7D9BC]">
            <h2 className="text-sm font-bold text-[#231A14]">Section-by-Section Document Findings</h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-white border border-[#E7D9BC] text-[#6E5C4E]">
              {report.section_findings.length} Sections Audited
            </span>
          </div>

          <div className="space-y-3">
            {report.section_findings.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-[#E7D9BC] text-xs space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#D95218] uppercase">
                    [{sec.section_id}]
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                    sec.has_issues
                      ? "bg-rose-50 text-rose-800 border-rose-300"
                      : "bg-emerald-50 text-emerald-800 border-emerald-300"
                  }`}>
                    {sec.has_issues ? "Issues Found" : "Compliant"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FFF8E9] border border-[#E7D9BC] font-mono text-[11px] text-[#231A14]">
                  {sec.text_preview}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#6E5C4E]">Cited Standards: </span>
                    <span className="font-mono text-[#231A14] font-semibold">{sec.cited_standards?.join(", ") || "None"}</span>
                  </div>
                  <div>
                    <span className="text-[#6E5C4E]">Recommended Standards: </span>
                    <span className="font-mono text-[#D95218] font-semibold">{sec.recommended_standards?.join(", ") || "None"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
