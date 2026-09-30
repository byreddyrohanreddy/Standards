"use client";

import React from "react";
import { Shield, Sparkles, CheckCircle2, Award, Zap, Network } from "lucide-react";

const MARQUEE_ITEMS = [
  { text: "BUREAU OF INDIAN STANDARDS", icon: Shield },
  { text: "DETERMINISTIC AI RETRIEVAL", icon: Sparkles },
  { text: "QCO REGULATORY ENFORCEMENT", icon: Award },
  { text: "STANDARDS KNOWLEDGE GRAPH", icon: Network },
  { text: "TENDER DOCUMENT AUDITING", icon: CheckCircle2 },
  { text: "SUB-250MS VECTOR INFERENCE", icon: Zap },
  { text: "SIH 2026 PROBLEM STATEMENT #26108", icon: Shield },
];

export const InformationMarquee: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full overflow-hidden border-y border-[#E7D9BC] bg-[#FFF8EC] py-3 select-none ${className}`}
      aria-label="System Capabilities Ticker"
    >
      {/* Left/Right Fade Mask */}
      <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#FFF8EC] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#FFF8EC] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div className="flex w-max animate-marquee space-x-8 hover:[animation-play-state:paused]">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 text-xs font-mono font-bold tracking-wider text-[#6E5C4E]"
            >
              <Icon className="w-3.5 h-3.5 text-[#FC6C26]" />
              <span>{item.text}</span>
              <span className="text-[#D4C4A8] ml-6">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
