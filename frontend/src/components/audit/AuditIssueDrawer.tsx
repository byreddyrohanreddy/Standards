"use client";

import React from "react";
import {
  X,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Copy,
  Check,
  FileText,
  Scale,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { useToast } from "../ui/Toast";
import { PrimaryButton, SecondaryButton } from "../ui/Button";

export interface AuditIssueData {
  id: string;
  title: string;
  severity: "critical" | "warning" | "info" | string;
  referencedStandard: string;
  replacementStandard?: string;
  sectionClause?: string;
  affectedRequirement?: string;
  reason: string;
  statutoryRule?: string;
  recommendation: string;
  suggestedClause?: string;
}

interface AuditIssueDrawerProps {
  issue: AuditIssueData | null;
  onClose: () => void;
}

export const AuditIssueDrawer: React.FC<AuditIssueDrawerProps> = ({ issue, onClose }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!issue) return null;

  const isCritical = issue.severity === "critical" || issue.severity === "error";

  const handleCopyClause = () => {
    const textToCopy =
      issue.suggestedClause ||
      `The supply and installation shall strictly conform to ${issue.replacementStandard || issue.referencedStandard} along with all latest amendments and statutory Quality Control Orders.`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast({
      title: "Compliant Clause Copied",
      description: "Clause replacement snippet copied to clipboard.",
      type: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#FFFCF4] border-l border-[#E7D9BC] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250 ease-out">
          {/* Header */}
          <div className="p-6 border-b border-[#E7D9BC] bg-[#FFF8EC]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    isCritical
                      ? "bg-rose-500/10 text-rose-800 border border-rose-500/20"
                      : "bg-amber-500/10 text-amber-800 border border-amber-500/20"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{issue.severity.toUpperCase()} AUDIT ISSUE</span>
                </span>
                <span className="text-xs font-mono text-[#8D7B68]">ID: {issue.id}</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#8D7B68] hover:text-[#231A14] hover:bg-[#EFE3CF] transition cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-[#231A14] mt-3 leading-snug">
              {issue.title}
            </h2>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Standard Comparison Callout */}
            <div className="p-4 rounded-xl bg-white border border-[#E7D9BC] shadow-xs space-y-3">
              <div className="text-[11px] font-mono text-[#8D7B68] uppercase font-bold tracking-wider">
                Specification Code Comparison
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 rounded-lg bg-rose-50 border border-rose-200">
                  <div className="text-[10px] font-mono text-rose-600 uppercase font-semibold">Tender Cited</div>
                  <div className="text-sm font-mono font-bold text-rose-950 line-through">
                    {issue.referencedStandard}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#FC6C26] shrink-0" />
                <div className="flex-1 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="text-[10px] font-mono text-emerald-600 uppercase font-semibold">Gazette Current</div>
                  <div className="text-sm font-mono font-bold text-emerald-950">
                    {issue.replacementStandard || "Standard IS"}
                  </div>
                </div>
              </div>
            </div>

            {/* Affected Tender Clause */}
            {issue.affectedRequirement && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
                  <FileText className="w-4 h-4 text-[#FC6C26]" />
                  <span>Affected Clause in Tender Document</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FFF9ED] border border-[#E7D9BC] text-xs font-mono text-[#4A3B32] leading-relaxed italic">
                  &ldquo;{issue.affectedRequirement}&rdquo;
                </div>
              </div>
            )}

            {/* Root Cause & Technical Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
                <Sparkles className="w-4 h-4 text-[#FC6C26]" />
                <span>Technical Defect & Root Cause</span>
              </div>
              <p className="text-xs text-[#5D4E42] leading-relaxed bg-white p-3.5 rounded-xl border border-[#E7D9BC]">
                {issue.reason}
              </p>
            </div>

            {/* Statutory Legal Rationale */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
                <Scale className="w-4 h-4 text-[#FC6C26]" />
                <span>Statutory Compliance Mandate</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FFF8E8] border border-[#E7D9BC] text-xs text-[#5D4E42] space-y-1">
                <div className="font-semibold text-[#231A14]">
                  {issue.statutoryRule || "GFR Rule 144(i)(b) & BIS Act 2016"}
                </div>
                <p className="text-[11px] leading-relaxed text-[#7D6B5E]">
                  Public procurement guidelines mandate specifying the latest valid standard. Referencing withdrawn editions can void warranties and incur audit objections from CAG.
                </p>
              </div>
            </div>

            {/* Actionable Recommendation */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
                <ShieldAlert className="w-4 h-4 text-[#16A34A]" />
                <span>Resolution & Remediation</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-medium leading-relaxed">
                {issue.recommendation}
              </div>
            </div>
          </div>

          {/* Sticky Drawer Actions */}
          <div className="p-4 border-t border-[#E7D9BC] bg-[#FFF8EC] flex items-center justify-between gap-3">
            <SecondaryButton onClick={onClose} size="sm" className="flex-1">
              Close Inspection
            </SecondaryButton>
            <PrimaryButton onClick={handleCopyClause} size="sm" className="flex-1">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Tender Fix"}</span>
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};
