"use client";

import React from "react";
import { Shield, CheckCircle2, Database, Sparkles, FileCode2 } from "lucide-react";

interface HeaderProps {
  apiHealthy: boolean;
  standardsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ apiHealthy, standardsCount }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Government Tricolor Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
          {/* Left: Branding & Subtitle */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center text-white shadow-sm border border-blue-800 shrink-0 mt-0.5 sm:mt-0">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  BIS-SpecAI
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                  SIH 2026 #26108
                </span>
                <span className="text-xs font-medium text-slate-600">
                  AI-Powered Recommendation Engine for Indian Standards in Procurement
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                Upload or enter a procurement requirement to identify applicable Indian Standards, related standards, current versions, and compliance requirements.
              </p>
            </div>
          </div>

          {/* Right: Prototype Scope & Backend Status */}
          <div className="flex items-center flex-wrap gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs">
              <Database className="w-3.5 h-3.5 text-blue-700" />
              <span>
                <strong className="text-slate-900 font-semibold">Prototype Knowledge Base:</strong> 113 Indian Standards • 6 domains • 759 edges
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className={`w-2 h-2 rounded-full ${apiHealthy ? "bg-emerald-500" : "bg-red-500"}`} />
              <span className="text-slate-600 font-medium">
                {apiHealthy ? "Engine Ready" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
