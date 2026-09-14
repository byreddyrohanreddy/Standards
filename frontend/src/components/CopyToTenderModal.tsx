"use client";

import React, { useState } from "react";

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
  standardTitle,
  isNumber,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(clauseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
              📋
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Procurement Tender Compliance Clause
              </h3>
              <p className="text-xs text-slate-500">
                Evidence-grounded standards clause ready for insertion into Notice Inviting Tender (NIT)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 flex items-start space-x-2">
            <span className="text-blue-600 font-bold">ℹ</span>
            <span>
              This clause is generated directly from retrieved BIS catalog records ({isNumber || "applicable standards"}). 
              Copy and paste directly into your technical specifications, tender schedule, or GeM bid document.
            </span>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs leading-relaxed whitespace-pre-wrap select-all border border-slate-800 overflow-x-auto max-h-[420px]">
              {clauseText}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50">
          <span className="text-xs text-slate-500 font-medium">
            Strictly derived from prototype BIS catalog records
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-sm transition ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-700 hover:bg-blue-800 text-white"
              }`}
            >
              <span>{copied ? "✓ Copied to Clipboard" : "📋 Copy Standards to Tender"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
