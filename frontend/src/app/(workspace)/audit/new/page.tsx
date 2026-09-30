"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileSearch,
  Upload,
  FileText,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  UploadCloud
} from "lucide-react";
import { auditTenderPdf, saveAuditToHistory } from "@/lib/api";
import { TenderAuditReport } from "@/types";

const SAMPLE_DEMOS = [
  {
    name: "NIT_PWD_Electrical_Substation_2026.pdf",
    label: "Demo 1: Electrical Substation NIT (Contains Outdated IS 325)",
    desc: "Cites superseded standard IS 325:1996 for induction motors and outdated IS 732:1989 for wiring.",
    presetReport: {
      document_name: "NIT_PWD_Electrical_Substation_2026.pdf",
      audit_timestamp: new Date().toISOString(),
      audit_latency_ms: 71.4,
      summary: {
        total_standards_cited: 4,
        total_superseded_citations: 1,
        total_outdated_citations: 1,
        total_missing_recommendations: 2,
        total_qco_gaps: 1,
        sections_analysed: 5,
        sections_with_issues: 2,
        has_compliance_issues: true
      },
      cited_standards: ["IS 325:1996", "IS 732:1989", "IS 3043:2018", "IS 694:2010"],
      version_alerts: [
        {
          referenced: "IS 325:1996",
          status: "Superseded Standard",
          replacement: "IS 12615:2018",
          recommendation: "Replace IS 325:1996 with IS 12615:2018 (Line Operated Three Phase Induction Motors) as IS 325 is withdrawn.",
          severity: "error"
        },
        {
          referenced: "IS 732:1989",
          status: "Outdated Edition Reference",
          replacement: "IS 732:2019",
          recommendation: "Update citation to IS 732:2019 (Code of Practice for Electrical Wiring Installations - 4th Revision).",
          severity: "warning"
        }
      ],
      qco_gaps: [
        {
          standard: "IS 12615:2018",
          qco_title: "Electric Motors (Quality Control) Order",
          certification_scheme: "BIS Scheme-I (ISI Mark)",
          issuing_ministry: "Ministry of Heavy Industries",
          gap: "Tender does not stipulate mandatory ISI Certification Mark required under Electric Motors QCO."
        }
      ],
      section_findings: [
        {
          section_id: "sec_2",
          text_preview: "CLAUSE 4.2: Motors supplied shall conform to IS 325:1996 with Class F insulation and IP55 protection.",
          cited_standards: ["IS 325:1996"],
          recommended_standards: ["IS 12615:2018"],
          missing_standards: ["IS 12615:2018 (Line Operated Three-Phase Induction Motors)"],
          version_alerts: [
            {
              referenced: "IS 325:1996",
              status: "Superseded Standard",
              replacement: "IS 12615:2018",
              recommendation: "Update to active standard IS 12615:2018.",
              severity: "error"
            }
          ],
          has_issues: true
        },
        {
          section_id: "sec_4",
          text_preview: "CLAUSE 8.1: Earthing system shall be designed and executed in accordance with IS 3043:2018.",
          cited_standards: ["IS 3043:2018"],
          recommended_standards: ["IS 3043:2018"],
          missing_standards: [],
          version_alerts: [],
          has_issues: false
        }
      ]
    }
  },
  {
    name: "CPWD_Civil_Bridge_Work_2026.pdf",
    label: "Demo 2: Civil Infrastructure Tender (Compliant)",
    desc: "Cites active IS 456:2000, IS 10262:2019 concrete design specifications.",
    presetReport: {
      document_name: "CPWD_Civil_Bridge_Work_2026.pdf",
      audit_timestamp: new Date().toISOString(),
      audit_latency_ms: 54.2,
      summary: {
        total_standards_cited: 3,
        total_superseded_citations: 0,
        total_outdated_citations: 0,
        total_missing_recommendations: 1,
        total_qco_gaps: 0,
        sections_analysed: 4,
        sections_with_issues: 1,
        has_compliance_issues: false
      },
      cited_standards: ["IS 456:2000", "IS 10262:2019", "IS 383:2016"],
      version_alerts: [],
      qco_gaps: [],
      section_findings: [
        {
          section_id: "sec_1",
          text_preview: "SCOPE: Concrete mix proportioning shall follow IS 10262:2019 and structural concrete design shall comply with IS 456:2000.",
          cited_standards: ["IS 456:2000", "IS 10262:2019"],
          recommended_standards: ["IS 516:1959"],
          missing_standards: ["IS 516:1959 (Testing for Strength of Concrete)"],
          version_alerts: [],
          has_issues: false
        }
      ]
    }
  }
];

export default function NewAuditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const report = await auditTenderPdf(file);
      const auditId = "audit_" + Date.now();
      report.id = auditId;
      saveAuditToHistory(report);
      router.push(`/audit/${auditId}`);
    } catch (err: any) {
      setError(err.message || "Failed to audit tender document.");
      setIsLoading(false);
    }
  };

  const handleRunPresetDemo = (preset: typeof SAMPLE_DEMOS[0]) => {
    setIsLoading(true);
    setTimeout(() => {
      const auditId = "audit_" + Date.now();
      const report: TenderAuditReport = {
        ...preset.presetReport,
        id: auditId
      };
      saveAuditToHistory(report);
      router.push(`/audit/${auditId}`);
    }, 600);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back button */}
      <Link
        href="/audit"
        className="tactile-btn-secondary px-3.5 py-1.5 text-xs inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tender Audit Dashboard</span>
      </Link>

      <div className="relative p-6 sm:p-8 rounded-3xl warm-glass border border-[#E7D9BC] shadow-xs space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF8E9] border border-[#E7D9BC] text-[11px] font-mono font-medium uppercase text-[#D95218]">
          <Sparkles className="w-3.5 h-3.5 text-[#FC6C26]" />
          <span>Automated Tender Scanner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#231A14] tracking-tight">
          Run New Tender Standards Audit
        </h1>
        <p className="text-xs sm:text-sm text-[#6E5C4E] font-normal">
          Upload an NIT or Tender document PDF to scan every clause for standards compliance, superseded editions, and mandatory QCO enforcement.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-xs font-semibold text-rose-800 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* PDF Upload Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`rounded-3xl p-10 border-2 border-dashed transition text-center space-y-4 ${
          dragActive
            ? "border-[#FC6C26] bg-[#FC6C26]/10 text-[#D95218]"
            : "border-[#E7D9BC] bg-white hover:bg-[#FFF8E9]/60 hover:border-[#FC6C26]/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <div className="w-16 h-16 rounded-2xl bg-[#FC6C26]/12 text-[#D95218] flex items-center justify-center mx-auto border border-[#FC6C26]/30 shadow-xs">
          <UploadCloud className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-bold text-[#231A14]">
            {isLoading ? "Auditing Document Against BIS Knowledge Base..." : "Upload Tender or NIT Document PDF"}
          </h2>
          <p className="text-xs text-[#6E5C4E] max-w-sm mx-auto">
            Drag and drop your PDF tender specification here, or browse files from your computer.
          </p>
        </div>

        <div>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
            className="tactile-btn-primary px-6 py-2.5 text-xs font-bold rounded-xl inline-flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>{isLoading ? "Processing PDF..." : "Choose PDF Document"}</span>
          </button>
        </div>
      </div>

      {/* One-Click Presets for Evaluation */}
      <div className="rounded-3xl warm-glass border border-[#E7D9BC] p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#6E5C4E]">
          <Sparkles className="w-4 h-4 text-[#FC6C26]" />
          <span>One-Click Evaluation Tenders (Instant Audit):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {SAMPLE_DEMOS.map((demo, idx) => (
            <div
              key={idx}
              onClick={() => handleRunPresetDemo(demo)}
              className="p-4 rounded-2xl bg-white hover:bg-[#FFF8E9] border border-[#E7D9BC] hover:border-[#FC6C26]/40 transition cursor-pointer space-y-2 group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#231A14] group-hover:text-[#D95218] transition">{demo.label}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FC6C26]/12 text-[#D95218] border border-[#FC6C26]/30 flex items-center gap-1">
                  <span>Run</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <p className="text-[11px] text-[#6E5C4E] leading-relaxed font-normal">{demo.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
