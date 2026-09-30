"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  Ban,
} from "lucide-react";
import { StandardVerificationResult } from "@/types";
import { verifyStandardOnBis } from "@/lib/api";

type VerifyState = "idle" | "verifying" | "verified" | "error";

interface LiveVerificationBadgeProps {
  isNumber: string;
  year?: number;
  title?: string;
  className?: string;
}

export const LiveVerificationBadge: React.FC<LiveVerificationBadgeProps> = ({
  isNumber,
  year,
  title,
  className = "",
}) => {
  const [state, setState] = useState<VerifyState>("idle");
  const [result, setResult] = useState<StandardVerificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showDetails, setShowDetails] = useState(false);
  // Cache guard: prevent duplicate calls for same standard
  const cachedRef = useRef<string>("");
  const inflightRef = useRef(false);

  const handleVerify = useCallback(async () => {
    // If already verified for this standard and not an explicit refresh, skip
    if (inflightRef.current) return;
    if (cachedRef.current === isNumber && state === "verified" && result) {
      setShowDetails(true);
      return;
    }

    inflightRef.current = true;
    setState("verifying");
    setErrorMsg("");
    setShowDetails(false);

    try {
      const data = await verifyStandardOnBis(isNumber, year, title);
      setResult(data);
      cachedRef.current = isNumber;
      setState("verified");
      setShowDetails(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Verification failed");
      setState("error");
    } finally {
      inflightRef.current = false;
    }
  }, [isNumber, year, title, state, result]);

  const handleRefresh = useCallback(async () => {
    cachedRef.current = ""; // clear cache
    await handleVerify();
  }, [handleVerify]);

  // Status-aware icon and color
  const getStatusVisual = (status: string) => {
    switch (status) {
      case "ACTIVE_CURRENT":
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          color: "text-emerald-700 bg-emerald-500/10 border-emerald-500/25",
          label: "Active / Current",
        };
      case "SUPERSEDED":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          color: "text-amber-700 bg-amber-500/10 border-amber-500/25",
          label: "Superseded",
        };
      case "WITHDRAWN":
        return {
          icon: <Ban className="w-3.5 h-3.5 text-rose-600" />,
          color: "text-rose-700 bg-rose-500/10 border-rose-500/25",
          label: "Withdrawn",
        };
      case "UNDER_REVISION":
        return {
          icon: <Clock className="w-3.5 h-3.5 text-blue-600" />,
          color: "text-blue-700 bg-blue-500/10 border-blue-500/25",
          label: "Under Revision",
        };
      default:
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-[#6E5C4E]" />,
          color: "text-[#6E5C4E] bg-[#FFF8E9] border-[#E7D9BC]",
          label: status,
        };
    }
  };

  return (
    <div className={`rounded-2xl border border-[#E7D9BC] bg-[#FFFAEF] overflow-hidden ${className}`}>
      {/* Verification Trigger / Status Bar */}
      <div className="flex items-center justify-between p-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FC6C26]/15 to-[#D95218]/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D95218]" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#231A14] truncate">
            Live BIS Verification
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {state === "idle" && (
            <button
              type="button"
              onClick={handleVerify}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#D95218] bg-[#FC6C26]/10 hover:bg-[#FC6C26]/18 border border-[#FC6C26]/20 transition-colors cursor-pointer"
              aria-label="Verify standard with BIS portal"
            >
              <ShieldCheck className="w-3 h-3" />
              Verify with BIS
            </button>
          )}

          {state === "verifying" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#D95218] bg-[#FC6C26]/10 border border-[#FC6C26]/20">
              <Loader2 className="w-3 h-3 animate-spin" />
              Verifying...
            </span>
          )}

          {state === "verified" && result && (
            <>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                  getStatusVisual(result.status).color
                }`}
              >
                {getStatusVisual(result.status).icon}
                {result.status_label}
              </span>
              <button
                type="button"
                onClick={() => setShowDetails((p) => !p)}
                className="p-1 rounded-md hover:bg-[#E7D9BC]/40 transition-colors cursor-pointer"
                aria-label="Toggle verification details"
              >
                {showDetails ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#9B8977]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#9B8977]" />
                )}
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="p-1 rounded-md hover:bg-[#E7D9BC]/40 transition-colors cursor-pointer"
                aria-label="Re-verify standard"
                title="Refresh verification"
              >
                <RefreshCw className="w-3 h-3 text-[#9B8977]" />
              </button>
            </>
          )}

          {state === "error" && (
            <>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-rose-700 bg-rose-500/10 border border-rose-500/25">
                <XCircle className="w-3 h-3" />
                Error
              </span>
              <button
                type="button"
                onClick={handleRefresh}
                className="p-1 rounded-md hover:bg-[#E7D9BC]/40 transition-colors cursor-pointer"
                aria-label="Retry verification"
              >
                <RefreshCw className="w-3 h-3 text-[#9B8977]" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {state === "error" && errorMsg && (
        <div className="px-3 pb-3">
          <p className="text-[11px] text-rose-700 bg-rose-50 rounded-lg p-2 border border-rose-200">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Verified Details Panel */}
      {state === "verified" && showDetails && result && (
        <div className="px-3 pb-4 space-y-3 border-t border-[#E7D9BC]/60">
          <div className="pt-3 grid grid-cols-2 gap-2">
            <VField label="Standard" value={result.is_number} mono />
            <VField label="Latest Edition" value={result.latest_edition} mono />
            {result.published_year && (
              <VField label="Published" value={result.published_year} />
            )}
            {result.reaffirmed_year && (
              <VField label="Reaffirmed" value={result.reaffirmed_year} />
            )}
            <VField
              label="Procurement"
              value={result.is_valid_for_procurement ? "✓ Valid" : "✗ Invalid"}
              highlight={result.is_valid_for_procurement}
            />
            {result.amendments_count > 0 && (
              <VField
                label="Amendments"
                value={`${result.amendments_count} recorded`}
              />
            )}
            {result.superseded_by && (
              <VField
                label="Superseded By"
                value={result.superseded_by}
                mono
                warn
              />
            )}
          </div>

          {/* Agent Summary */}
          {result.agent_summary && (
            <p className="text-[11px] text-[#6E5C4E] leading-relaxed bg-[#FFF8E9] rounded-lg p-2.5 border border-[#E7D9BC]/50">
              {result.agent_summary}
            </p>
          )}

          {/* Linked Normative Standards */}
          {result.linked_normative_standards &&
            result.linked_normative_standards.length > 0 && (
              <div className="text-[11px] text-[#6E5C4E]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B8977]">
                  Linked Standards:{" "}
                </span>
                {result.linked_normative_standards.join(", ")}
              </div>
            )}

          {/* Source Attribution & Timestamp */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-[#E7D9BC]/40">
            <span className="text-[10px] text-[#9B8977] font-mono">
              {result.verified_via}
            </span>
            {result.portal_url && (
              <a
                href={result.portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-medium text-[#D95218] hover:text-[#FC6C26] transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Open BIS Source
              </a>
            )}
            {result.verification_timestamp && (
              <span className="text-[10px] text-[#9B8977] font-mono">
                {new Date(result.verification_timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function VField({
  label,
  value,
  mono,
  highlight,
  warn,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="p-2 rounded-lg bg-[#FFF8E9] border border-[#E7D9BC]/50 space-y-0.5">
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#9B8977]">
        {label}
      </div>
      <div
        className={`text-xs font-semibold leading-snug ${
          mono ? "font-mono" : ""
        } ${
          warn
            ? "text-amber-700"
            : highlight
            ? "text-emerald-700"
            : "text-[#231A14]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
