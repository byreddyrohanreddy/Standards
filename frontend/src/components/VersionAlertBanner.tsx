"use client";

import React from "react";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { VersionAlert } from "@/types";

interface VersionAlertBannerProps {
  alerts: VersionAlert[];
}

export const VersionAlertBanner: React.FC<VersionAlertBannerProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          className="rounded-2xl p-5 bg-[#FFF8E9] border border-amber-500/40 shadow-md shadow-amber-500/5 space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-900 border border-amber-500/30">
                    SUPERSEDED STANDARD NOTICE
                  </span>
                  <span className="text-xs font-bold text-[#231A14]">
                    Outdated Standard Code Referenced
                  </span>
                </div>
                <p className="text-xs text-[#6E5C4E] leading-relaxed pt-1">
                  {alert.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-500/20 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white border border-rose-400/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-700">
                Referenced (Withdrawn / Old)
              </span>
              <div className="text-sm font-black text-[#231A14]">
                {alert.referenced_standard || (alert as any).referenced}
              </div>
              <div className="text-[10px] text-rose-600 font-sans">
                Non-compliant for new government procurement contracts
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-emerald-500/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-800">
                Enforced Replacement (Active)
              </span>
              <div className="text-sm font-black text-emerald-800">
                {alert.current_replacement || (alert as any).replacement}
              </div>
              <div className="text-[10px] text-emerald-700 font-sans">
                Direct statutory replacement in accordance with BIS lifecycle
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
