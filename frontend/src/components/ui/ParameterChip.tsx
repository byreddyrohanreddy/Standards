"use client";

import React from "react";
import { Check, AlertCircle, HelpCircle } from "lucide-react";

export interface ParameterChipProps {
  label: string;
  value?: string | number;
  matched?: boolean | "partial" | "unknown";
  variant?: "clay" | "glass" | "subtle";
  className?: string;
  onClick?: () => void;
}

export const ParameterChip: React.FC<ParameterChipProps> = ({
  label,
  value,
  matched = "unknown",
  variant = "clay",
  className = "",
  onClick,
}) => {
  const matchIcon =
    matched === true ? (
      <Check className="w-2.5 h-2.5 text-emerald-700" />
    ) : matched === "partial" ? (
      <AlertCircle className="w-2.5 h-2.5 text-amber-700" />
    ) : matched === false ? (
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
    ) : null;

  const variantStyles = {
    clay:
      "bg-[#FFF8EC] border border-[#E7D9BC] text-[#231A14] shadow-2xs hover:border-[#D4C4A8]",
    glass:
      "bg-[#FFFAEF]/80 backdrop-blur-md border border-[#E7D9BC]/90 text-[#231A14] hover:bg-[#FFFAEF]",
    subtle:
      "bg-[#231A14]/4 border border-transparent text-[#6E5C4E] hover:bg-[#231A14]/8",
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${variantStyles} ${className}`}
    >
      {matchIcon}
      <span className="font-semibold text-[#8D7B68] uppercase text-[10px]">
        {label}:
      </span>
      <span className="font-medium text-[#231A14]">{value ?? label}</span>
    </div>
  );
};

export const ParameterGroup: React.FC<{
  title?: string;
  parameters: Array<{ label: string; value?: string | number; matched?: boolean | "partial" | "unknown" }>;
  className?: string;
}> = ({ title, parameters, className = "" }) => {
  if (!parameters || parameters.length === 0) return null;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {title && (
        <span className="text-[11px] font-semibold text-[#6E5C4E] uppercase tracking-wider font-mono">
          {title}
        </span>
      )}
      <div className="flex flex-wrap gap-1.5">
        {parameters.map((p, idx) => (
          <ParameterChip
            key={`${p.label}-${idx}`}
            label={p.label}
            value={p.value}
            matched={p.matched}
          />
        ))}
      </div>
    </div>
  );
};

export const ParameterComparison: React.FC<{
  required: string;
  standardValue: string;
  parameterName: string;
  isCompliant: boolean;
}> = ({ required, standardValue, parameterName, isCompliant }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFFAEF] border border-[#E7D9BC] text-xs font-mono">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isCompliant ? "bg-emerald-500" : "bg-amber-500"}`} />
        <span className="font-semibold text-[#231A14]">{parameterName}</span>
      </div>
      <div className="flex items-center gap-3 text-[11px]">
        <span className="text-[#6E5C4E]">Req: <strong className="text-[#231A14]">{required}</strong></span>
        <span className="text-[#D4C4A8]">→</span>
        <span className="text-[#6E5C4E]">Spec: <strong className="text-[#FC6C26]">{standardValue}</strong></span>
      </div>
    </div>
  );
};
