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
      {/* Top Government Tiranga Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Branding & Titles */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center text-white shadow-md border border-blue-800">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                BIS-SpecAI
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  SIH 2026 #26108 MVP
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications
            </p>
          </div>
        </div>

        {/* Right: Prototype Catalog Badge & Status */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>Prototype Dataset: <strong>{standardsCount || 62} Indian Standards</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <span className={`w-2 h-2 rounded-full ${apiHealthy ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
            <span>{apiHealthy ? "Backend Engine Online" : "Connecting..."}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
