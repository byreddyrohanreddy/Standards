"use client";

import React, { useState } from "react";
import {
  FileSearch,
  FileCheck2,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Upload,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  ChevronRight,
  Calendar,
  Clock,
  Printer,
  FileText,
  BadgeAlert,
  Scale
} from "lucide-react";
import { TenderAuditReport } from "@/types";
import { AuditIssueDrawer, AuditIssueData } from "./AuditIssueDrawer";
import { PrimaryButton, SecondaryButton } from "../ui/Button";
import { StatusPill, LiveBadge } from "../ui/StatusBadge";
import { useToast } from "../ui/Toast";

interface AuditWorkspaceProps {
  initialReport?: TenderAuditReport;
  onUploadFile?: (file: File) => void;
  onSelectSample?: (sampleName: string) => void;
}

export const SAMPLE_TENDERS = [
  {
    id: "nit_pwd_electrical",
    name: "NIT_PWD_Electrical_Substation_2026.pdf",
    label: "Electrical Substation NIT",
    desc: "Cites superseded IS 325:1996 for induction motors & outdated IS 732.",
    report: {
      document_name: "NIT_PWD_Electrical_Substation_2026.pdf",
      audit_timestamp: new Date().toISOString(),
      audit_latency_ms: 68.2,
      summary: {
        total_standards_cited: 4,
        total_superseded_citations: 1,
        total_outdated_citations: 1,
        total_missing_recommendations: 2,
        total_qco_gaps: 1,
        sections_analysed: 5,
        sections_with_issues: 2,
        has_compliance_issues: true,
      },
      cited_standards: ["IS 325:1996", "IS 732:1989", "IS 3043:2018", "IS 694:2010"],
      version_alerts: [
        {
          referenced: "IS 325:1996",
          status: "Superseded Standard",
          replacement: "IS 12615:2018",
          recommendation:
            "Replace IS 325:1996 with IS 12615:2018 (Line Operated Three Phase Induction Motors) as IS 325 is withdrawn.",
          severity: "error",
        },
        {
          referenced: "IS 732:1989",
          status: "Outdated Edition Reference",
          replacement: "IS 732:2019",
          recommendation:
            "Update citation to IS 732:2019 (Code of Practice for Electrical Wiring Installations - 4th Revision).",
          severity: "warning",
        },
      ],
      qco_gaps: [
        {
          standard: "IS 12615:2018",
          qco_title: "Electric Motors (Quality Control) Order",
          certification_scheme: "BIS Scheme-I (ISI Mark)",
          issuing_ministry: "Ministry of Heavy Industries",
          gap: "Tender does not stipulate mandatory ISI Certification Mark required under Electric Motors QCO.",
        },
      ],
      section_findings: [
        {
          section_id: "sec_2",
          text_preview:
            "CLAUSE 4.2: Motors supplied shall conform to IS 325:1996 with Class F insulation and IP55 protection.",
          cited_standards: ["IS 325:1996"],
          recommended_standards: ["IS 12615:2018"],
          missing_standards: ["IS 12615:2018 (Line Operated Three-Phase Induction Motors)"],
          version_alerts: [
            {
              referenced: "IS 325:1996",
              status: "Superseded Standard",
              replacement: "IS 12615:2018",
              recommendation: "Update to active standard IS 12615:2018.",
              severity: "error",
            },
          ],
          has_issues: true,
        },
        {
          section_id: "sec_4",
          text_preview:
            "CLAUSE 8.1: Earthing system shall be designed and executed in accordance with IS 3043:2018.",
          cited_standards: ["IS 3043:2018"],
          recommended_standards: ["IS 3043:2018"],
          missing_standards: [],
          version_alerts: [],
          has_issues: false,
        },
      ],
    } as TenderAuditReport,
  },
  {
    id: "cpwd_civil_bridge",
    name: "CPWD_Civil_Bridge_Work_2026.pdf",
    label: "Civil Infrastructure Tender",
    desc: "Cites active IS 456:2000, IS 10262:2019 concrete design specifications.",
    report: {
      document_name: "CPWD_Civil_Bridge_Work_2026.pdf",
      audit_timestamp: new Date().toISOString(),
      audit_latency_ms: 54.8,
      summary: {
        total_standards_cited: 3,
        total_superseded_citations: 0,
        total_outdated_citations: 0,
        total_missing_recommendations: 0,
        total_qco_gaps: 0,
        sections_analysed: 4,
        sections_with_issues: 0,
        has_compliance_issues: false,
      },
      cited_standards: ["IS 456:2000", "IS 10262:2019", "IS 1786:2008"],
      version_alerts: [],
      qco_gaps: [],
      section_findings: [
        {
          section_id: "sec_1",
          text_preview: "CLAUSE 2.1: Plain and reinforced concrete works shall conform to IS 456:2000.",
          cited_standards: ["IS 456:2000"],
          recommended_standards: ["IS 456:2000"],
          missing_standards: [],
          version_alerts: [],
          has_issues: false,
        },
      ],
    } as TenderAuditReport,
  },
];

export const AuditWorkspace: React.FC<AuditWorkspaceProps> = ({
  initialReport,
}) => {
  const { toast } = useToast();
  const [currentReport, setCurrentReport] = useState<TenderAuditReport>(
    initialReport || SAMPLE_TENDERS[0].report
  );
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [selectedIssue, setSelectedIssue] = useState<AuditIssueData | null>(null);

  // Compile issues into uniform structure
  const allIssues: AuditIssueData[] = [];

  currentReport.version_alerts?.forEach((va, idx) => {
    allIssues.push({
      id: `VA-0${idx + 1}`,
      title: `${va.referenced} - ${va.status}`,
      severity: va.severity || "critical",
      referencedStandard: va.referenced,
      replacementStandard: va.replacement,
      affectedRequirement:
        currentReport.section_findings?.find((sec) =>
          sec.cited_standards?.includes(va.referenced)
        )?.text_preview || "Tender Technical Specifications Clause",
      reason: `Citation ${va.referenced} is withdrawn from BIS registry. Procurement contracts citing withdrawn standards violate GFR Rule 144.`,
      statutoryRule: "GFR Rule 144(i)(b) & Public Procurement Order",
      recommendation: va.recommendation,
      suggestedClause: `The item shall strictly conform to ${va.replacement || va.referenced} (with latest amendments) and certified under BIS mark.`,
    });
  });

  currentReport.qco_gaps?.forEach((gap, idx) => {
    allIssues.push({
      id: `QCO-0${idx + 1}`,
      title: `Mandatory QCO Non-Compliance: ${gap.standard}`,
      severity: "warning",
      referencedStandard: gap.standard,
      replacementStandard: gap.standard,
      affectedRequirement: "General Conditions of Tender",
      reason: gap.gap || "Mandatory Quality Control Order requires ISI certification.",
      statutoryRule: `${gap.qco_title} (${gap.issuing_ministry})`,
      recommendation: `Incorporate clause requiring valid BIS Scheme certification under ${gap.certification_scheme}.`,
      suggestedClause: `The bidder must submit valid BIS License under ${gap.certification_scheme} as per mandatory ${gap.qco_title}.`,
    });
  });

  const filteredIssues = allIssues.filter((iss) => {
    if (filterSeverity === "all") return true;
    if (filterSeverity === "critical") return iss.severity === "critical" || iss.severity === "error";
    if (filterSeverity === "warning") return iss.severity === "warning";
    if (filterSeverity === "qco") return iss.id.startsWith("QCO");
    return true;
  });

  const handleSelectSample = (sample: typeof SAMPLE_TENDERS[0]) => {
    setCurrentReport(sample.report);
    setSelectedIssue(null);
    toast({
      title: "Sample Tender Loaded",
      description: `Loaded ${sample.label} for compliance verification.`,
      type: "info",
    });
  };

  return (
    <div className="space-y-6">
      {/* Workspace Grid: Left Document Sidebar + Right Audit Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            ZONE 1: LEFT DOCUMENT SIDEBAR
            ========================================================================= */}
        <aside className="lg:col-span-4 xl:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#FC6C26]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
                Document Dossier & Inputs
              </h2>
            </div>
          </div>

          {/* File Status Card */}
          <div className="rounded-2xl border border-[#E7D9BC] bg-[#FFFAEF] p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FC6C26]/10 border border-[#FC6C26]/30 flex items-center justify-center text-[#FC6C26]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#231A14] truncate max-w-[190px]">
                    {currentReport.document_name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#8D7B68]">
                    Scanned in {currentReport.audit_latency_ms?.toFixed(1) || "62.4"}ms
                  </span>
                </div>
              </div>
              <StatusPill
                status={currentReport.summary.has_compliance_issues ? "warning" : "current"}
                label={currentReport.summary.has_compliance_issues ? "ACTION REQ." : "COMPLIANT"}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#E7D9BC]/60">
              <div className="p-2 rounded-lg bg-white border border-[#E7D9BC]/60">
                <span className="text-[10px] text-[#8D7B68] block">SECTIONS</span>
                <span className="font-bold text-[#231A14]">
                  {currentReport.summary.sections_analysed} Clauses
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#E7D9BC]/60">
                <span className="text-[10px] text-[#8D7B68] block">CITED CODES</span>
                <span className="font-bold text-[#FC6C26]">
                  {currentReport.summary.total_standards_cited} BIS Standards
                </span>
              </div>
            </div>
          </div>

          {/* Sample Tender Switcher */}
          <div className="rounded-2xl border border-[#E7D9BC] bg-[#FFFAEF] p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7D9BC]/60">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
                Sample Tenders for Audit
              </span>
              <span className="text-[10px] font-mono text-[#8D7B68]">NIT Scenarios</span>
            </div>

            <div className="space-y-2">
              {SAMPLE_TENDERS.map((s) => {
                const isSelected = currentReport.document_name === s.report.document_name;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSample(s)}
                    className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#FFF2DE] border-[#FC6C26] ring-2 ring-[#FC6C26]/20"
                        : "bg-white hover:bg-[#FFF9EE] border-[#E7D9BC]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#231A14]">{s.label}</span>
                      {isSelected ? (
                        <span className="text-[10px] font-mono font-bold text-[#FC6C26]">Active</span>
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-[#8D7B68]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#6E5C4E] line-clamp-1 mt-1 font-normal">
                      {s.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cited Standards Cloud */}
          <div className="rounded-2xl border border-[#E7D9BC] bg-[#FFFAEF] p-4 shadow-xs space-y-2.5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
              Extracted Indian Standards Citations
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentReport.cited_standards.map((std, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-white border border-[#E7D9BC] text-xs font-mono font-semibold text-[#231A14] shadow-xs"
                >
                  {std}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* =========================================================================
            ZONE 2: AUDIT INTELLIGENCE & SUMMARY
            ========================================================================= */}
        <main className="lg:col-span-8 xl:col-span-8 space-y-5 min-w-0">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#D95218]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
                Audit Findings & Regulatory Remediation
              </h2>
            </div>
            <button
              onClick={() => window.print()}
              className="text-xs font-mono font-semibold text-[#D95218] hover:text-[#FC6C26] flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Audit Sheet</span>
            </button>
          </div>

          {/* Issue Count Ticker / Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E7D9BC] shadow-xs space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#8D7B68] font-bold">
                Standards Cited
              </div>
              <div className="text-2xl font-mono font-black text-[#231A14]">
                {currentReport.summary.total_standards_cited}
              </div>
              <div className="text-[10px] text-neutral-500">Across tender text</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E7D9BC] shadow-xs space-y-1">
              <div className="text-[10px] font-mono uppercase text-rose-600 font-bold">
                Superseded Citations
              </div>
              <div className="text-2xl font-mono font-black text-rose-700">
                {currentReport.summary.total_superseded_citations}
              </div>
              <div className="text-[10px] text-rose-600 font-medium">Withdrawn from gazette</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E7D9BC] shadow-xs space-y-1">
              <div className="text-[10px] font-mono uppercase text-amber-600 font-bold">
                Outdated Editions
              </div>
              <div className="text-2xl font-mono font-black text-amber-700">
                {currentReport.summary.total_outdated_citations}
              </div>
              <div className="text-[10px] text-amber-600 font-medium">Older revisions cited</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E7D9BC] shadow-xs space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#FC6C26] font-bold">
                QCO Deficiencies
              </div>
              <div className="text-2xl font-mono font-black text-[#FC6C26]">
                {currentReport.summary.total_qco_gaps}
              </div>
              <div className="text-[10px] text-[#FC6C26] font-medium">Mandatory ISI gaps</div>
            </div>
          </div>

          {/* Severity Filter Chips */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#FFFAEF] border border-[#E7D9BC]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono text-[#8D7B68] mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {[
                { id: "all", label: `All Issues (${allIssues.length})` },
                {
                  id: "critical",
                  label: `Critical (${
                    allIssues.filter((i) => i.severity === "critical" || i.severity === "error").length
                  })`,
                },
                {
                  id: "warning",
                  label: `Warnings (${allIssues.filter((i) => i.severity === "warning").length})`,
                },
                {
                  id: "qco",
                  label: `QCO Gaps (${currentReport.summary.total_qco_gaps})`,
                },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setFilterSeverity(chip.id)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer ${
                    filterSeverity === chip.id
                      ? "bg-[#FC6C26] text-white font-bold shadow-xs"
                      : "bg-white text-[#5D4E42] border border-[#E7D9BC] hover:bg-[#FFF4E0]"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono text-[#8D7B68] hidden sm:inline">
              Click issue to inspect legal remedy
            </span>
          </div>

          {/* Audit Issue List */}
          {filteredIssues.length > 0 ? (
            <div className="space-y-3">
              {filteredIssues.map((issue) => {
                const isCritical = issue.severity === "critical" || issue.severity === "error";
                return (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className="p-4 rounded-2xl bg-white border border-[#E7D9BC] hover:border-[#FC6C26] hover:shadow-md transition-all duration-200 cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isCritical ? "bg-rose-600 animate-pulse" : "bg-amber-500"
                          }`}
                        />
                        <span className="font-mono text-xs font-bold text-[#231A14]">
                          {issue.id}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#FC6C26]">
                          {issue.referencedStandard}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            isCritical
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {issue.severity.toUpperCase()}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#8D7B68] group-hover:text-[#FC6C26] transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    <div className="text-xs font-bold text-[#231A14] group-hover:text-[#FC6C26] transition-colors">
                      {issue.title}
                    </div>

                    {issue.affectedRequirement && (
                      <div className="p-2.5 rounded-xl bg-[#FFF9ED] border border-[#E7D9BC]/60 text-xs font-mono text-[#5D4E42] italic line-clamp-1">
                        &ldquo;{issue.affectedRequirement}&rdquo;
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E7D9BC]/50">
                      <span className="text-[#8D7B68] font-mono">
                        Recommendation: <strong className="text-[#231A14]">{issue.replacementStandard || "Updated IS"}</strong>
                      </span>
                      <span className="text-[#D95218] font-semibold flex items-center gap-1">
                        <span>Inspect Defect</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-[#E7D9BC] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-[#231A14]">Zero Issues Detected in this Category</h3>
              <p className="text-xs text-[#8D7B68]">
                All specifications conform to gazetted BIS standards and statutory Quality Control Orders.
              </p>
            </div>
          )}

          {/* Audit Timeline / Trace */}
          <div className="p-5 rounded-2xl bg-[#FFFAEF] border border-[#E7D9BC] space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FC6C26]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
                Audit Execution Trace
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#5D4E42]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Text parsed: 5 specification sections ingested from tender text.</span>
              </div>
              <div className="flex items-center gap-2 text-[#5D4E42]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Regex & NER extracted 4 Indian Standard citations across clauses.</span>
              </div>
              <div className="flex items-center gap-2 text-[#5D4E42]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FC6C26]" />
                <span>Gazette database verified status: 1 superseded, 1 outdated, 1 QCO gap identified.</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Slide-in Issue Drawer */}
      <AuditIssueDrawer
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />
    </div>
  );
};
