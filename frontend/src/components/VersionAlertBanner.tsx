"use client";

import React from "react";
import { AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2, FileCheck } from "lucide-react";
import { VersionAlert } from "@/types";

interface Props {
  alerts: VersionAlert[];
}

export const VersionAlertBanner: React.FC<Props> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => {
        const isSuperseded =
          alert.status.toLowerCase().includes("superseded") ||
          alert.status.toLowerCase().includes("outdated") ||
          Boolean(alert.current_replacement);

        const isAmended = alert.status.toLowerCase().includes("amend");

        return (
          <div
            key={idx}
            className="bg-amber-50/95 border-2 border-amber-400 rounded-xl p-4 sm:p-5 shadow-xs transition-all"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-amber-200 text-amber-900 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-800" />
              </div>

              <div className="flex-1">
                {/* Header Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-amber-200 text-amber-900 border border-amber-300">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {isSuperseded ? "⚠ Superseded Standard Detected" : isAmended ? "Amended Standard" : alert.status}
                    </span>
                    <span className="text-xs font-bold text-amber-900">
                      Lifecycle Audit Notice
                    </span>
                  </div>

                  <span className="text-[11px] text-amber-800 font-semibold bg-white/70 px-2 py-0.5 rounded border border-amber-200">
                    High Priority Tender Advisory
                  </span>
                </div>

                {/* Prominent Old vs Current Standard Comparison Box */}
                {alert.current_replacement ? (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-lg border border-amber-300 shadow-2xs">
                    <div className="bg-red-50/60 p-2.5 rounded-md border border-red-200">
                      <span className="block text-[10px] font-bold text-red-700 uppercase tracking-wider">
                        Old / Superseded in Tender:
                      </span>
                      <span className="font-mono text-base font-black text-red-800 line-through">
                        {alert.referenced_standard}
                      </span>
                      <span className="block text-[10px] text-red-600 mt-0.5">
                        Status: Withdrawn / Obsolete
                      </span>
                    </div>

                    <div className="bg-emerald-50/70 p-2.5 rounded-md border border-emerald-200">
                      <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Current Applicable Standard:
                      </span>
                      <span className="font-mono text-base font-black text-emerald-900">
                        {alert.current_replacement}
                      </span>
                      <span className="block text-[10px] text-emerald-700 mt-0.5 font-medium">
                        Status: Active & Authoritative
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 bg-white p-3 rounded-lg border border-amber-200 font-mono text-xs text-slate-800">
                    Referenced Standard: <strong>{alert.referenced_standard}</strong>
                  </div>
                )}

                {/* Required Explanation Text */}
                <div className="mt-3 text-xs text-amber-950 font-medium leading-relaxed bg-amber-100/50 p-2.5 rounded-md border border-amber-200">
                  <p className="font-bold text-amber-900">
                    This standard has been superseded. The current applicable standard should be considered for procurement specifications.
                  </p>
                  <p className="mt-1 text-[11px] text-amber-900/90">
                    <strong>Technical Recommendation:</strong> {alert.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
