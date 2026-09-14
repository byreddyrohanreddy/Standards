"use client";

import React from "react";
import { X, BookOpen, Shield, Award, Calendar, Layers, CheckCircle } from "lucide-react";
import { StandardMetadata } from "@/types";

interface Props {
  standard: StandardMetadata | null;
  onClose: () => void;
}

export const StandardDetailModal: React.FC<Props> = ({ standard, onClose }) => {
  if (!standard) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in-50 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-700" />
            <h3 className="text-base font-bold text-slate-900">
              Indian Standard Specification Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-black text-blue-900">
                {standard.is_number}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  standard.status === "current"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {standard.status === "current" ? "Active Standard" : "Superseded"}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Year: {standard.year} • {standard.domain}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-800 mt-1.5 leading-snug">
              {standard.title}
            </h4>
          </div>

          {/* Scope Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <div className="font-bold text-slate-900 mb-1">Standard Scope & Provisions:</div>
            {standard.scope}
          </div>

          {/* Certification Scheme */}
          {standard.certification && standard.certification.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-700" />
                Conformity & Quality Certification
              </div>
              <div className="text-xs text-indigo-900 bg-indigo-50/70 p-3 rounded-lg border border-indigo-200">
                {standard.certification.map((c, i) => (
                  <div key={i} className="font-medium">
                    • {c}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cross References Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {standard.normative_references && standard.normative_references.length > 0 && (
              <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                <div className="font-bold text-blue-900 mb-1">Normative References:</div>
                <ul className="space-y-1 text-slate-700">
                  {standard.normative_references.map((n, i) => (
                    <li key={i}>• {n}</li>
                  ))}
                </ul>
              </div>
            )}

            {standard.test_methods && standard.test_methods.length > 0 && (
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <div className="font-bold text-emerald-900 mb-1">Test Methods:</div>
                <ul className="space-y-1 text-slate-700">
                  {standard.test_methods.map((t, i) => (
                    <li key={i}>• {t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Amendments */}
          {standard.amendments && standard.amendments.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Amendments on Record:
              </div>
              <div className="space-y-1.5">
                {standard.amendments.map((am, i) => (
                  <div key={i} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="font-semibold text-slate-900 mr-2">
                      {am.number} ({am.year}):
                    </span>
                    <span className="text-slate-600">{am.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
