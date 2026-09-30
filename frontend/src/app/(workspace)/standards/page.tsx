"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Network,
  ExternalLink,
  Layers,
  ArrowRight,
  GitCompare,
  SlidersHorizontal
} from "lucide-react";
import { fetchStandards } from "@/lib/api";
import { StandardMetadata } from "@/types";
import { StandardDetailDrawer } from "@/components/StandardDetailDrawer";
import { StandardSkeleton, EmptyState } from "@/components/ui/Skeleton";
import { SegmentedControl } from "@/components/ui/Tabs";
import { VersionBadge } from "@/components/ui/StatusBadge";
import { SecondaryButton, Button } from "@/components/ui/Button";

export default function StandardsCatalogPage() {
  const router = useRouter();
  const [standards, setStandards] = useState<StandardMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<string>("grid");
  const [activeDrawerStandard, setActiveDrawerStandard] = useState<StandardMetadata | null>(null);

  useEffect(() => {
    fetchStandards()
      .then((data) => {
        setStandards(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const domains = [
    "all",
    ...Array.from(new Set(standards.map((s) => s.domain).filter(Boolean))),
  ];

  const filtered = standards.filter((s) => {
    const matchSearch =
      s.is_number.toLowerCase().includes(search.toLowerCase()) ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.keywords && s.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase())));

    const matchDomain = selectedDomain === "all" || s.domain === selectedDomain;
    const matchStatus =
      selectedStatus === "all" ||
      (selectedStatus === "current" && (s.status === "current" || s.status === "active")) ||
      (selectedStatus === "superseded" && (s.status === "superseded" || s.status === "withdrawn"));

    return matchSearch && matchDomain && matchStatus;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FC6C26]/12 border border-[#FC6C26]/30 flex items-center justify-center text-[#D95218]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#231A14] tracking-tight">Indian Standards Catalog</h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#FC6C26]/12 text-[#D95218] border border-[#FC6C26]/30 font-mono">
                  {standards.length} STANDARDS
                </span>
              </div>
              <p className="text-xs text-[#6E5C4E] font-medium mt-0.5">
                Bureau of Indian Standards specifications, scopes, testing methodologies, and supersession lineages.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/graph"
            className="tactile-btn-secondary px-4 py-2 text-xs font-bold rounded-xl"
          >
            <Network className="w-4 h-4 text-[#FC6C26]" />
            <span>Interactive Graph View</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="warm-glass p-4 rounded-2xl border border-[#E7D9BC] space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#9B8977] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by IS number (e.g. IS 12615), title keyword, or technical parameter..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E7D9BC] text-xs font-medium text-[#231A14] placeholder-[#9B8977] focus:outline-none focus:border-[#FC6C26] focus:ring-2 focus:ring-[#FC6C26]/10"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E7D9BC] text-xs font-semibold text-[#231A14] cursor-pointer focus:outline-none focus:border-[#FC6C26]"
            >
              <option value="all">All Domains ({standards.length})</option>
              {domains.filter((d) => d !== "all").map((dom) => (
                <option key={dom} value={dom}>
                  {dom}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E7D9BC] text-xs font-semibold text-[#231A14] cursor-pointer focus:outline-none focus:border-[#FC6C26]"
            >
              <option value="all">All Statuses</option>
              <option value="current">Current / Active Only</option>
              <option value="superseded">Superseded / Withdrawn Only</option>
            </select>

            <SegmentedControl
              options={[
                { value: "grid", label: "Grid" },
                { value: "table", label: "Table" },
              ]}
              value={viewMode}
              onChange={setViewMode}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#6E5C4E] font-medium pt-1">
          <span>Showing <strong className="text-[#D95218] font-mono">{filtered.length}</strong> of {standards.length} Indian Standards</span>
          {(search || selectedDomain !== "all" || selectedStatus !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedDomain("all");
                setSelectedStatus("all");
              }}
              className="text-[#D95218] hover:underline font-bold cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Loading Shimmer State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <StandardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filtered.length === 0 && (
        <EmptyState
          icon={<BookOpen className="w-6 h-6 text-[#FC6C26]" />}
          title="No Matching Standards Found"
          description="Try broadening your search query or reset the active domain and status filters."
          actionLabel="Reset All Filters"
          onAction={() => {
            setSearch("");
            setSelectedDomain("all");
            setSelectedStatus("all");
          }}
        />
      )}

      {/* Grid View */}
      {!isLoading && viewMode === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((std) => {
            const isSuperseded = std.status === "superseded" || std.status === "withdrawn";
            return (
              <div
                key={std.id}
                className="warm-glass rounded-2xl p-5 border border-[#E7D9BC] hover:border-[#FC6C26]/50 transition flex flex-col justify-between space-y-3 shadow-xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#D95218] bg-[#FC6C26]/12 px-2.5 py-0.5 rounded-lg border border-[#FC6C26]/30">
                      {std.is_number}
                    </span>
                    <VersionBadge isCurrent={!isSuperseded} year={std.year} />
                  </div>

                  <h2 className="text-xs font-bold text-[#231A14] line-clamp-2 leading-snug">
                    {std.title}
                  </h2>

                  <div className="text-[11px] text-[#6E5C4E] font-medium flex items-center gap-1.5">
                    <span className="text-[#231A14] font-semibold">{std.domain}</span>
                    <span>•</span>
                    <span className="font-mono">Year {std.year}</span>
                  </div>

                  <p className="text-[11px] text-[#6E5C4E] line-clamp-3 leading-relaxed">
                    {std.scope}
                  </p>

                  {std.superseded_by && (
                    <div className="p-2 bg-amber-50 rounded-lg text-[10px] text-amber-900 font-semibold border border-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                      <span>Superseded by {std.superseded_by}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#E7D9BC]/60 flex items-center justify-between text-xs gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveDrawerStandard(std)}
                    className="font-bold text-[#D95218] hover:text-[#FC6C26] flex items-center gap-1 cursor-pointer transition text-xs"
                  >
                    <span>Inspect Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    href={`/standards/${encodeURIComponent(std.is_number)}`}
                    className="text-[#6E5C4E] hover:text-[#231A14] text-[11px] transition"
                  >
                    Full Page
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="warm-glass rounded-2xl border border-[#E7D9BC] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF8E9] text-[#231A14] font-bold border-b border-[#E7D9BC]">
                <tr>
                  <th className="py-3 px-4">IS Standard</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7D9BC]/60 bg-white">
                {filtered.map((std) => (
                  <tr key={std.id} className="hover:bg-[#FFF8E9]/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#D95218]">
                      {std.is_number}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#231A14] max-w-md truncate">
                      {std.title}
                    </td>
                    <td className="py-3 px-4 text-[#6E5C4E] font-medium">{std.domain}</td>
                    <td className="py-3 px-4 text-[#6E5C4E] font-mono font-medium">{std.year}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                        std.status === "superseded"
                          ? "bg-amber-500/15 text-amber-900 border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
                      }`}>
                        {std.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/standards/${encodeURIComponent(std.is_number)}`}
                        className="text-[#D95218] hover:text-[#FC6C26] font-bold"
                      >
                        Inspect &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Standard Specification Detail Drawer */}
      <StandardDetailDrawer
        standard={activeDrawerStandard}
        onClose={() => setActiveDrawerStandard(null)}
      />
    </main>
  );
}
