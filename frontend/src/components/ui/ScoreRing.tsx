"use client";

import React from "react";

export interface ScoreRingProps {
  score: number; // 0 to 100 or 0.0 to 1.0
  size?: "sm" | "md" | "lg";
  label?: string;
  sublabel?: string;
  showGrade?: boolean;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = "md",
  label,
  sublabel,
  showGrade = false,
  className = "",
}) => {
  // Normalize score to percentage 0-100
  const normalizedScore = score > 1 ? Math.min(100, Math.max(0, score)) : Math.min(100, Math.max(0, score * 100));
  const rounded = Math.round(normalizedScore);

  const dimensions = {
    sm: { size: 48, stroke: 4, text: "text-xs", labelText: "text-[9px]" },
    md: { size: 68, stroke: 5, text: "text-base font-bold", labelText: "text-[10px]" },
    lg: { size: 96, stroke: 7, text: "text-2xl font-bold", labelText: "text-xs" },
  }[size];

  const radius = (dimensions.size - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Grade determination
  const grade =
    rounded >= 90 ? "A+" : rounded >= 80 ? "A" : rounded >= 70 ? "B" : rounded >= 60 ? "C" : "D";

  const colorClass =
    rounded >= 85
      ? "text-[#FC6C26] stroke-[#FC6C26]"
      : rounded >= 70
      ? "text-amber-600 stroke-amber-500"
      : "text-neutral-500 stroke-neutral-400";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: dimensions.size, height: dimensions.size }}
      >
        <svg
          width={dimensions.size}
          height={dimensions.size}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke="#E7D9BC"
            strokeWidth={dimensions.stroke}
            fill="transparent"
            className="opacity-40"
          />
          {/* Progress fill */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={dimensions.stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-700 ease-out ${colorClass}`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono leading-none tracking-tight text-[#231A14] ${dimensions.text}`}>
            {rounded}%
          </span>
          {showGrade && (
            <span className="text-[9px] font-mono text-[#D95218] font-semibold mt-0.5">
              Grade {grade}
            </span>
          )}
        </div>
      </div>

      {(label || sublabel) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs font-semibold text-[#231A14] tracking-tight">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[11px] text-[#6E5C4E]">{sublabel}</span>
          )}
        </div>
      )}
    </div>
  );
};
