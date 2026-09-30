"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, Clock, Zap, XCircle } from "lucide-react";

export type StatusType =
  | "ready"
  | "processing"
  | "complete"
  | "current"
  | "superseded"
  | "qco"
  | "warning"
  | "danger"
  | "neutral";

interface StatusConfig {
  dotClass: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  defaultLabel: string;
}

const statusConfigs: Record<StatusType, StatusConfig> = {
  ready: {
    dotClass: "bg-emerald-500",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/20",
    textClass: "text-emerald-800",
    defaultLabel: "Engine Ready",
  },
  processing: {
    dotClass: "bg-[#FC6C26] animate-ping",
    bgClass: "bg-[#FC6C26]/10",
    borderClass: "border-[#FC6C26]/20",
    textClass: "text-[#D95218]",
    defaultLabel: "Processing",
  },
  complete: {
    dotClass: "bg-emerald-500",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/20",
    textClass: "text-emerald-800",
    defaultLabel: "Complete",
  },
  current: {
    dotClass: "bg-emerald-500",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/25",
    textClass: "text-emerald-900",
    defaultLabel: "Active / Current",
  },
  superseded: {
    dotClass: "bg-amber-500",
    bgClass: "bg-amber-500/12",
    borderClass: "border-amber-500/30",
    textClass: "text-amber-900",
    defaultLabel: "Superseded",
  },
  qco: {
    dotClass: "bg-rose-500",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/25",
    textClass: "text-rose-800",
    defaultLabel: "Mandatory QCO",
  },
  warning: {
    dotClass: "bg-amber-500",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/25",
    textClass: "text-amber-800",
    defaultLabel: "Attention Required",
  },
  danger: {
    dotClass: "bg-rose-500",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/25",
    textClass: "text-rose-800",
    defaultLabel: "Non-Compliant",
  },
  neutral: {
    dotClass: "bg-[#8D7B68]",
    bgClass: "bg-[#8D7B68]/10",
    borderClass: "border-[#8D7B68]/20",
    textClass: "text-[#6E5C4E]",
    defaultLabel: "Indexed",
  },
};

export const StatusDot: React.FC<{
  status?: StatusType;
  pulse?: boolean;
  className?: string;
}> = ({ status = "ready", pulse = false, className = "" }) => {
  const config = statusConfigs[status];
  return (
    <span className={`relative inline-flex items-center justify-center shrink-0 w-2 h-2 ${className}`}>
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${config.dotClass}`}
        />
      )}
      <span className={`relative inline-flex rounded-full w-1.5 h-1.5 ${config.dotClass}`} />
    </span>
  );
};

export const StatusPill: React.FC<{
  status: StatusType;
  label?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}> = ({ status, label, icon, size = "sm", className = "" }) => {
  const config = statusConfigs[status];
  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[10px] gap-1.5 font-medium rounded-full"
      : "px-2.5 py-1 text-xs gap-2 font-medium rounded-md";

  return (
    <span
      className={`inline-flex items-center border font-mono tracking-tight ${config.bgClass} ${config.borderClass} ${config.textClass} ${sizeClasses} ${className}`}
    >
      {icon ? (
        <span className="shrink-0">{icon}</span>
      ) : (
        <StatusDot status={status} pulse={status === "processing"} />
      )}
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};

export const LiveBadge: React.FC<{
  label?: string;
  className?: string;
}> = ({ label = "LIVE", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono font-semibold text-emerald-800 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      {label}
    </span>
  );
};

export const QCOBadge: React.FC<{
  active?: boolean;
  orderNumber?: string;
  className?: string;
}> = ({ active = true, orderNumber, className = "" }) => {
  if (!active) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-[#8D7B68] bg-[#8D7B68]/10 border border-[#8D7B68]/20 ${className}`}
      >
        <span>Voluntary Standard</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold text-rose-800 bg-rose-500/12 border border-rose-500/25 ${className}`}
      title={orderNumber ? `QCO Order: ${orderNumber}` : "Mandatory under Quality Control Order"}
    >
      <ShieldCheck className="w-2.5 h-2.5 text-rose-700" />
      <span>MANDATORY QCO</span>
    </span>
  );
};

export const VersionBadge: React.FC<{
  isCurrent: boolean;
  year?: string | number;
  supersededBy?: string;
  className?: string;
}> = ({ isCurrent, year, supersededBy, className = "" }) => {
  if (isCurrent) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-500/10 border border-emerald-500/25 ${className}`}
      >
        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
        <span>CURRENT {year ? `(${year})` : ""}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold text-amber-800 bg-amber-500/12 border border-amber-500/30 ${className}`}
      title={supersededBy ? `Superseded by ${supersededBy}` : "Superseded standard version"}
    >
      <AlertTriangle className="w-2.5 h-2.5 text-amber-700" />
      <span>SUPERSEDED {supersededBy ? `→ ${supersededBy}` : ""}</span>
    </span>
  );
};
