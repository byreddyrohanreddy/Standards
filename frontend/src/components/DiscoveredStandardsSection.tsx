"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Globe,
  Loader2,
  ExternalLink,
  Search,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Radio,
} from "lucide-react";
import { DiscoverStandardsResponse, DiscoveredStandard } from "@/types";
import { discoverStandards } from "@/lib/api";

type DiscoverState = "idle" | "discovering" | "done" | "error";

interface DiscoveredStandardsSectionProps {
  query: string;
  className?: string;
}

export const DiscoveredStandardsSection: React.FC<DiscoveredStandardsSectionProps> = ({
  query,
  className = "",
}) => {
  const [state, setState] = useState<DiscoverState>("idle");
  const [response, setResponse] = useState<DiscoverStandardsResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const cachedQuery = useRef<string>("");
  const inflightRef = useRef(false);

  const handleDiscover = useCallback(async () => {
    if (inflightRef.current) return;
    if (!query || query.trim().length < 3) return;
    // Cache: if we already searched this query, don't re-search
    if (cachedQuery.current === query.trim() && state === "done") return;

    inflightRef.current = true;
    setState("discovering");
    setErrorMsg("");

    try {
      const data = await discoverStandards(query.trim(), 8);
      setResponse(data);
      cachedQuery.current = query.trim();
      setState("done");
    } catch (err: any) {
      setErrorMsg(err.message || "Discovery failed");
      setState("error");
    } finally {
      inflightRef.current = false;
    }
  }, [query, state]);

  return (
    <div className={`rounded-2xl border border-[#E7D9BC] bg-[#FFFAEF] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FC6C26]/15 to-[#D95218]/10 flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-[#D95218]" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#231A14]">
            Live BIS Discovery
          </span>
          {state === "done" && response && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-700">
              {response.discovered_standards.length} found
            </span>
          )}
        </div>

        {state === "idle" && (
          <button
            type="button"
            onClick={handleDiscover}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#D95218] bg-[#FC6C26]/10 hover:bg-[#FC6C26]/18 border border-[#FC6C26]/20 transition-colors cursor-pointer"
            aria-label="Discover standards on BIS portal"
          >
            <Search className="w-3 h-3" />
            Discover Live Standards
          </button>
        )}

        {state === "discovering" && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#D95218] bg-[#FC6C26]/10 border border-[#FC6C26]/20">
            <Loader2 className="w-3 h-3 animate-spin" />
            Discovering...
          </span>
        )}

        {state === "error" && (
          <button
            type="button"
            onClick={handleDiscover}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-rose-700 bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
          >
            <AlertCircle className="w-3 h-3" />
            Retry Discovery
          </button>
        )}
      </div>

      {/* Error */}
      {state === "error" && errorMsg && (
        <div className="px-4 pb-3">
          <p className="text-[11px] text-rose-700 bg-rose-50 rounded-lg p-2 border border-rose-200">
            {errorMsg || "Live BIS discovery is temporarily unavailable."}
          </p>
        </div>
      )}

      {/* Results */}
      {state === "done" && response && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#E7D9BC]/60">
          {response.discovered_standards.length === 0 ? (
            <p className="pt-3 text-[11px] text-[#6E5C4E]">
              No new standards were discovered on the BIS portal for this query.
            </p>
          ) : (
            <>
              <p className="pt-3 text-[11px] text-[#6E5C4E] font-medium">
                Live standards surfaced from the official BIS portal
              </p>
              <div className="space-y-1.5">
                {response.discovered_standards.map((std, i) => (
                  <DiscoveredCard key={`${std.is_number}-${i}`} standard={std} />
                ))}
              </div>
            </>
          )}

          {/* Analysis Summary */}
          {response.agent_analysis && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#FFF8E9] border border-[#E7D9BC]/50">
              <Sparkles className="w-3.5 h-3.5 text-[#FC6C26] mt-0.5 shrink-0" />
              <p className="text-[11px] text-[#6E5C4E] leading-relaxed">
                {response.agent_analysis}
              </p>
            </div>
          )}

          {/* Source Attribution */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-[10px] text-[#9B8977] font-mono pt-1 border-t border-[#E7D9BC]/40">
            <span>
              {response.total_found_on_portal} total on portal
              {" · "}
              {response.execution_time_ms.toFixed(0)}ms
            </span>
            <a
              href={response.portal_source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#D95218] hover:text-[#FC6C26] font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              BIS Portal
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

function DiscoveredCard({ standard }: { standard: DiscoveredStandard }) {
  return (
    <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-white/70 border border-[#E7D9BC]/50 hover:border-[#FC6C26]/30 transition-colors group">
      <div className="min-w-0 space-y-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold text-[#D95218]">
            {standard.is_number}
          </span>
          {standard.year && (
            <span className="text-[10px] font-mono text-[#9B8977]">
              ({standard.year})
            </span>
          )}
          {standard.is_in_local_catalog ? (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Local
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#FC6C26]/10 text-[#D95218] border border-[#FC6C26]/20">
              <Radio className="w-2.5 h-2.5" />
              Live
            </span>
          )}
        </div>
        <p className="text-[11px] text-[#231A14] leading-snug font-medium line-clamp-2">
          {standard.title}
        </p>
        {standard.relevance_note && (
          <p className="text-[10px] text-[#9B8977] leading-snug">
            {standard.relevance_note}
          </p>
        )}
      </div>
      {standard.portal_url && (
        <a
          href={standard.portal_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-1.5 rounded-md hover:bg-[#FC6C26]/10 transition-colors"
          aria-label={`Open ${standard.is_number} on BIS portal`}
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#9B8977] group-hover:text-[#D95218]" />
        </a>
      )}
    </div>
  );
}
