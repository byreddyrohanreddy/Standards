"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  Info
} from "lucide-react";
import { QCOResult } from "@/types";

interface QCOCompliancePanelProps {
  qcoResults?: QCOResult[];
  className?: string;
}

export const QCOCompliancePanel: React.FC<QCOCompliancePanelProps> = ({
  qcoResults = [],
  className = "",
}) => {
  const [expanded, setExpanded] = useState(false);

  if (qcoResults.length === 0) {
    return (
      <div className={`rounded-2xl p-4 border border-[#E7D9BC] bg-[#FFFAEF] ${className}`}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#9B8977]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#9B8977]">
            QCO Compliance
          </span>
        </div>
        <p className="text-[11px] text-[#6E5C4E] mt-2 leading-relaxed">
          No applicable Quality Control Order found for this standard in the current indexed registry.
        </p>
      </div>
    );
  }

  const qco = qcoResults[0];
  const status = qco.status;
  const isMandatory = status?.enforcement_status === "mandatory";
  const isUpcoming = status?.enforcement_status === "upcoming";

  const statusColor = isMandatory
    ? "text-rose-700 bg-rose-500/10 border-rose-500/25"
    : isUpcoming
    ? "text-amber-700 bg-amber-500/10 border-amber-500/25"
    : "text-[#6E5C4E] bg-[#FFF8E9] border-[#E7D9BC]";

  const statusIcon = isMandatory ? (
    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
  ) : isUpcoming ? (
    <Clock className="w-3.5 h-3.5 text-amber-600" />
  ) : (
    <Info className="w-3.5 h-3.5 text-[#6E5C4E]" />
  );

  return (
    <div className={`rounded-2xl border border-[#E7D9BC] bg-[#FFFAEF] overflow-hidden ${className}`}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#FFF6E3] transition-colors cursor-pointer"
        aria-expanded={expanded}
        aria-label="Toggle QCO compliance details"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#FC6C26]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#231A14]">
            QCO Compliance
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${statusColor}`}
          >
            {statusIcon}
            {status?.status_label || status?.enforcement_status || "Unknown"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {qco.verified && (
            <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-700">
              <CheckCircle2 className="w-3 h-3" />
              Gazette Verified
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-[#9B8977]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#9B8977]" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#E7D9BC]/60">
          {/* QCO Identity */}
          <div className="pt-3 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <DetailRow
                icon={<FileText className="w-3.5 h-3.5 text-[#FC6C26]" />}
                label="Order"
                value={qco.qco_title || qco.qco_id}
              />
              <DetailRow
                icon={<ShieldCheck className="w-3.5 h-3.5 text-[#FC6C26]" />}
                label="Certification"
                value={qco.certification_scheme}
              />
              <DetailRow
                icon={<Building2 className="w-3.5 h-3.5 text-[#FC6C26]" />}
                label="Ministry"
                value={qco.issuing_ministry}
              />
              {status?.enforcement_date && (
                <DetailRow
                  icon={<Clock className="w-3.5 h-3.5 text-[#FC6C26]" />}
                  label="Enforcement"
                  value={status.enforcement_date}
                />
              )}
            </div>

            {/* Product Scope */}
            {qco.product_name && (
              <div className="text-[11px] text-[#6E5C4E] bg-[#FFF8E9] rounded-lg p-2.5 border border-[#E7D9BC]/50">
                <span className="font-bold text-[#231A14] text-[10px] uppercase tracking-wider">
                  Product:{" "}
                </span>
                {qco.product_name}
              </div>
            )}

            {/* Scope Note */}
            {qco.scope_note && (
              <p className="text-[11px] text-[#6E5C4E] leading-relaxed italic">
                {qco.scope_note}
              </p>
            )}

            {/* Status Detail */}
            {status?.status_detail && (
              <p className="text-[11px] text-[#6E5C4E] leading-relaxed">
                {status.status_detail}
              </p>
            )}

            {/* Gazette & Source */}
            <div className="flex items-center gap-3 flex-wrap pt-1">
              {qco.gazette_notification && (
                <span className="text-[10px] font-mono text-[#9B8977]">
                  Gazette: {qco.gazette_notification}
                  {qco.gazette_date ? ` (${qco.gazette_date})` : ""}
                </span>
              )}
              {qco.source_url && (
                <a
                  href={qco.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-[#D95218] hover:text-[#FC6C26] transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Source
                </a>
              )}
            </div>
          </div>

          {/* Additional QCOs */}
          {qcoResults.length > 1 && (
            <div className="space-y-1.5 pt-2 border-t border-[#E7D9BC]/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B8977]">
                {qcoResults.length - 1} Additional QCO
                {qcoResults.length > 2 ? "s" : ""}
              </span>
              {qcoResults.slice(1).map((q, i) => (
                <div
                  key={q.qco_id || i}
                  className="text-[11px] text-[#6E5C4E] p-2 rounded-lg bg-[#FFF8E9] border border-[#E7D9BC]/40"
                >
                  <span className="font-semibold text-[#231A14]">{q.qco_id}</span>
                  {" — "}
                  {q.qco_title || q.product_name}
                  <span className="ml-2 text-[10px] font-mono text-[#9B8977]">
                    ({q.status?.enforcement_status || "unknown"})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 text-[11px]">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9B8977]">
          {label}
        </div>
        <div className="text-[#231A14] font-medium leading-snug">{value}</div>
      </div>
    </div>
  );
}
