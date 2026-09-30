"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Search,
  Shield,
  AlertCircle,
  Building2,
  Calendar,
  ExternalLink,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter
} from "lucide-react";
import { fetchQcoList } from "@/lib/api";
import { QCOListItem } from "@/types";

export default function QCOExplorerPage() {
  const [qcos, setQcos] = useState<QCOListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState("all");
  const [selectedScheme, setSelectedScheme] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchQcoList()
      .then((data) => {
        setQcos(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const ministries = ["all", ...Array.from(new Set(qcos.map((q) => q.issuing_ministry).filter(Boolean)))];
  const schemes = ["all", ...Array.from(new Set(qcos.map((q) => q.certification_scheme).filter(Boolean)))];

  const filtered = qcos.filter((q) => {
    const matchSearch =
      q.product_name.toLowerCase().includes(search.toLowerCase()) ||
      q.qco_id.toLowerCase().includes(search.toLowerCase()) ||
      (q.applicable_is_numbers && q.applicable_is_numbers.some((is) => is.toLowerCase().includes(search.toLowerCase())));

    const matchMin = selectedMinistry === "all" || q.issuing_ministry === selectedMinistry;
    const matchScheme = selectedScheme === "all" || q.certification_scheme === selectedScheme;
    const matchStatus = selectedStatus === "all" || q.enforcement_status === selectedStatus;

    return matchSearch && matchMin && matchScheme && matchStatus;
  });

  const mandatoryCount = qcos.filter((q) => q.enforcement_status === "mandatory").length;
  const upcomingCount = qcos.filter((q) => q.enforcement_status === "upcoming").length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FC6C26]/12 border border-[#FC6C26]/30 flex items-center justify-center text-[#D95218]">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#231A14] tracking-tight">Quality Control Orders (QCO)</h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#FC6C26]/12 text-[#D95218] border border-[#FC6C26]/30">
                  BIS ACT 2016 COMPLIANCE
                </span>
              </div>
              <p className="text-xs text-[#6E5C4E] font-medium mt-0.5">
                Real-time regulatory enforcement registry of mandatory Indian Standards notified under Government Gazette orders.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/recommend"
            className="tactile-btn-primary px-4 py-2 text-xs font-bold rounded-xl"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verify Spec in Workspace</span>
          </Link>
        </div>
      </div>

      {/* Statutory Legal Alert */}
      <div className="p-5 warm-glass border border-amber-500/40 bg-amber-50 rounded-2xl text-xs text-[#231A14] flex items-start gap-3.5 shadow-sm">
        <Shield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-sm text-amber-950">Statutory Requirement for Public Procurement (BIS Act 2016):</div>
          <p className="text-[#6E5C4E] leading-relaxed text-[11px]">
            Under Section 16 of the Bureau of Indian Standards Act, 2016, no person or government department shall manufacture, import, distribute, or procure goods under a QCO unless they conform to the notified Indian Standard and bear the standard mark under a valid BIS License. Procuring non-certified goods violates GFR 2017 Rule 144.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="warm-glass p-5 rounded-2xl border border-[#E7D9BC]">
          <div className="text-[10px] font-semibold text-[#6E5C4E] uppercase tracking-wider">Total Notified QCOs</div>
          <div className="text-2xl font-black text-[#231A14] font-mono mt-1">{qcos.length}</div>
          <div className="text-[10px] text-[#9B8977] font-medium mt-0.5">Central Government Orders</div>
        </div>

        <div className="warm-glass p-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/50">
          <div className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">Currently Enforced</div>
          <div className="text-2xl font-black text-emerald-800 font-mono mt-1">{mandatoryCount}</div>
          <div className="text-[10px] text-[#9B8977] font-medium mt-0.5">Strictly Mandatory Now</div>
        </div>

        <div className="warm-glass p-5 rounded-2xl border border-[#FC6C26]/30 bg-[#FC6C26]/5">
          <div className="text-[10px] font-semibold text-[#D95218] uppercase tracking-wider">Upcoming Enforcements</div>
          <div className="text-2xl font-black text-[#D95218] font-mono mt-1">{upcomingCount}</div>
          <div className="text-[10px] text-[#9B8977] font-medium mt-0.5">Gazetted with future cutoff</div>
        </div>

        <div className="warm-glass p-5 rounded-2xl border border-[#E7D9BC]">
          <div className="text-[10px] font-semibold text-[#6E5C4E] uppercase tracking-wider">Issuing Ministries</div>
          <div className="text-2xl font-black text-[#231A14] font-mono mt-1">{Math.max(0, ministries.length - 1)}</div>
          <div className="text-[10px] text-[#9B8977] font-medium mt-0.5">DPIIT, Steel, MeitY, MHI</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="warm-glass p-4 rounded-2xl border border-[#E7D9BC] space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#9B8977] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product (e.g. Electric Motor, Cables, Cement), QCO ID, or IS number..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E7D9BC] text-xs font-medium text-[#231A14] placeholder-[#9B8977] focus:outline-none focus:border-[#FC6C26] focus:ring-2 focus:ring-[#FC6C26]/10"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E7D9BC] text-xs font-semibold text-[#231A14] cursor-pointer focus:outline-none focus:border-[#FC6C26]"
            >
              <option value="all">All Ministries</option>
              {ministries.filter((m) => m !== "all").map((min) => (
                <option key={min} value={min}>
                  {min}
                </option>
              ))}
            </select>

            <select
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E7D9BC] text-xs font-semibold text-[#231A14] cursor-pointer focus:outline-none focus:border-[#FC6C26]"
            >
              <option value="all">All Schemes</option>
              {schemes.filter((s) => s !== "all").map((sch) => (
                <option key={sch} value={sch}>
                  {sch}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E7D9BC] text-xs font-semibold text-[#231A14] cursor-pointer focus:outline-none focus:border-[#FC6C26]"
            >
              <option value="all">All Statuses</option>
              <option value="mandatory">Mandatory (Enforced)</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-[#6E5C4E] font-medium">
          Showing <strong className="text-[#D95218] font-mono">{filtered.length}</strong> of {qcos.length} Quality Control Orders
        </div>
      </div>

      {/* QCO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isMandatory = item.enforcement_status === "mandatory";
          return (
            <div
              key={item.qco_id}
              className="warm-glass rounded-2xl p-5 border border-[#E7D9BC] hover:border-[#FC6C26]/50 transition flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#D95218] bg-[#FC6C26]/10 px-2.5 py-0.5 rounded-lg border border-[#FC6C26]/30">
                    {item.qco_id}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                    isMandatory
                      ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-900 border-amber-500/30"
                  }`}>
                    {item.status_label || (isMandatory ? "MANDATORY NOW" : "UPCOMING")}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-[#231A14]">
                  {item.product_name}
                </h2>

                <div className="text-xs text-[#6E5C4E] font-medium space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#FC6C26] shrink-0" />
                    <span><strong className="text-[#231A14]">Ministry:</strong> {item.issuing_ministry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#D95218] shrink-0" />
                    <span><strong className="text-[#231A14]">Scheme:</strong> {item.certification_scheme}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span><strong className="text-[#231A14]">Enforcement Date:</strong> {item.enforcement_date}</span>
                  </div>
                </div>

                {/* Applicable IS Numbers chips */}
                <div className="pt-2">
                  <div className="text-[10px] uppercase font-bold text-[#6E5C4E] tracking-wider mb-1.5">Applicable Indian Standards:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.applicable_is_numbers.map((isNum, idx) => (
                      <Link
                        key={idx}
                        href={`/standards/${encodeURIComponent(isNum)}`}
                        className="clay-chip font-mono text-[10px] font-bold text-[#D95218]"
                      >
                        {isNum}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E7D9BC]/60 flex items-center justify-between text-xs">
                <Link
                  href={`/recommend?q=${encodeURIComponent(item.product_name)}`}
                  className="text-[#D95218] hover:text-[#FC6C26] font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <span>Analyze Product Spec</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
