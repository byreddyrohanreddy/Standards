"use client";

import React from "react";
import { AlertTriangle, ArrowRight, ShieldAlert, CheckCircle } from "lucide-react";
import { VersionAlert } from "@/types";

interface Props {
  alerts: VersionAlert[];
}

export const VersionAlertBanner: React.FC<Props> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          className="bg-amber-50/90 border-2 border-amber-400 rounded-xl p-4 md:p-5 shadow-xs transition-all"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-amber-200 text-amber-900 shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-800" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900 border border-amber-300">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {alert.status}
                </span>

                <span className="text-xs text-amber-800 font-semibold">
                  Tender Audit Warning
                </span>
              </div>

              {/* Version Comparison Box */}
              <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-4 bg-white/80 p-3 rounded-lg border border-amber-200">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase">
                    Referenced in Tender
                  </span>
                  <span className="font-mono text-sm font-bold text-red-700 line-through">
                    {alert.referenced_standard}
                  </span>
                </div>

                <div className="text-slate-400">
                  <ArrowRight className="w-4 h-4 text-amber-600" />
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase">
                    Current Applicable Standard
                  </span>
                  <span className="font-mono text-sm font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    {alert.current_replacement}
                  </span>
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="mt-2.5 text-xs text-amber-950 font-medium leading-relaxed">
                <strong>Recommendation:</strong> {alert.recommendation}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
