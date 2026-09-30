"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  FileText,
  Shield,
  Download,
  Printer,
  FileCheck2,
  AlertCircle
} from "lucide-react";

interface CopyToTenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  clauseText: string;
  standardTitle?: string;
  isNumber?: string;
}

export const CopyToTenderModal: React.FC<CopyToTenderModalProps> = ({
  isOpen,
  onClose,
  clauseText,
  standardTitle = "Three-Phase Induction Motor",
  isNumber = "IS 12615:2018",
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const defaultClause =
    clauseText ||
    `TECHNICAL COMPLIANCE CLAUSE (BIS SPECIFICATION COMPLIANCE):
1. MANDATORY TECHNICAL CONFORMANCE:
The equipment and all associated assemblies offered shall strictly comply with Indian Standard ${isNumber} ("${standardTitle}") including all amendments issued up to the date of tender submission.

2. MANDATORY TYPE & ROUTINE TESTING:
All mandatory type tests, routine tests, and acceptance tests shall be performed in strict accordance with the testing codes referenced in ${isNumber}. Test certificates from NABL/BIS accredited laboratories must be furnished with technical bid submission.

3. STATUTORY QUALITY CONTROL ORDER (QCO) COMPLIANCE:
The bidder and OEM shall hold a valid Bureau of Indian Standards (BIS) certification license under the mandatory Quality Control Order (QCO) notified by the Central Government.

4. INDELIBLE MARKING & NAMEPLATE VERIFICATION:
The BIS Standard Mark (ISI logo) along with the valid CM/L license number must be indelibly stamped on the equipment nameplate. Failure to provide proof of valid BIS license will result in immediate technical disqualification under GFR 2017 Rule 144.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultClause);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Procurement Document Workspace */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#FFFAEF] border border-[#E7D9BC] shadow-2xl flex flex-col overflow-hidden text-[#231A14] my-auto">
        {/* Document Workspace Control Bar */}
        <div className="px-6 py-4 border-b border-[#E7D9BC] bg-[#FFF8E9] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FC6C26] to-[#D95218] flex items-center justify-center text-white shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#231A14]">
                  Tender Compliance Specification Document
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FC6C26]/12 border border-[#FC6C26]/25 text-[#D95218]">
                  NIT CLAUSE
                </span>
              </div>
              <p className="text-[11px] text-[#6E5C4E] font-medium">
                Standard: <strong className="font-mono text-[#231A14]">{isNumber}</strong> • {standardTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#E7D9BC] bg-white text-[#6E5C4E] hover:text-[#231A14] transition cursor-pointer"
            aria-label="Close document workspace"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Document Sheet Body */}
        <div className="p-6 sm:p-8 bg-[#FFF8E9]/40 overflow-y-auto max-h-[70vh]">
          {/* Paper Sheet Preview */}
          <div className="bg-white rounded-xl border border-[#E7D9BC] p-6 sm:p-8 shadow-sm space-y-6 text-xs sm:text-sm font-sans leading-relaxed">
            {/* Sheet Official Header */}
            <div className="border-b border-[#E7D9BC] pb-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#9B8977] font-bold">
                  GOVERNMENT PROCUREMENT SPECIFICATION
                </div>
                <div className="text-base font-black tracking-tight text-[#231A14]">
                  SPECIAL CONDITIONS OF CONTRACT — TECHNICAL COMPLIANCE
                </div>
                <div className="text-xs text-[#6E5C4E] font-medium mt-0.5">
                  Governed under GFR 2017 Rule 144 & BIS Act 2016
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-[#9B8977] shrink-0">
                <div>REF: NIT-BIS-SPEC</div>
                <div>STANDARD: {isNumber}</div>
              </div>
            </div>

            {/* Document Content View */}
            <div className="space-y-4 font-mono text-xs text-[#231A14] bg-[#FFFDF9] p-5 rounded-lg border border-[#E7D9BC] whitespace-pre-line leading-relaxed selection:bg-[#FC6C26]/20">
              {defaultClause}
            </div>

            {/* Statutory Note */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FFF8E9] border border-[#E7D9BC] text-xs text-[#6E5C4E]">
              <AlertCircle className="w-4 h-4 text-[#FC6C26] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#231A14] font-semibold">Regulatory Notice: </strong>
                Under current Ministry Quality Control Orders, tenders specifying superseded standards (or omitting mandatory ISI mark stipulations) are liable for rejection under CVC guidelines.
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="px-6 py-3.5 border-t border-[#E7D9BC] bg-[#FFF8E9] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="tactile-btn-secondary px-3 py-1.5 text-xs font-semibold rounded-xl"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Specification</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="tactile-btn-primary px-4 py-2 text-xs font-bold rounded-xl"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Clause Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Procurement Clause</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-[#6E5C4E] hover:text-[#231A14]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
