"use client";

import React, { useState } from "react";
import {
  Layers,
  BookOpen,
  FlaskConical,
  Shield,
  Wrench,
  Link as LinkIcon,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { RelatedStandardsCategorized, StandardMetadata } from "@/types";

interface RelatedStandardsSectionProps {
  related: RelatedStandardsCategorized;
  onSelectStandard?: (std: StandardMetadata) => void;
}

type TabKey =
  | "normative"
  | "testing"
  | "safety"
  | "installation"
  | "products"
  | "superseded";

export const RelatedStandardsSection: React.FC<RelatedStandardsSectionProps> = ({
  related,
  onSelectStandard,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("normative");

  const categories = [
    {
      key: "normative" as TabKey,
      label: "Normative References",
      count: related.normative_references?.length || 0,
      icon: BookOpen,
      items: related.normative_references || [],
    },
    {
      key: "testing" as TabKey,
      label: "Test Standards",
      count: related.testing_standards?.length || 0,
      icon: FlaskConical,
      items: related.testing_standards || [],
    },
    {
      key: "safety" as TabKey,
      label: "Safety Codes",
      count: related.safety_standards?.length || 0,
      icon: Shield,
      items: related.safety_standards || [],
    },
    {
      key: "installation" as TabKey,
      label: "Installation Guides",
      count: related.installation_standards?.length || 0,
      icon: Wrench,
      items: related.installation_standards || [],
    },
    {
      key: "products" as TabKey,
      label: "Related Equipment",
      count: related.related_products?.length || 0,
      icon: Layers,
      items: related.related_products || [],
    },
    {
      key: "superseded" as TabKey,
      label: "Superseded History",
      count: related.superseded_standards?.length || 0,
      icon: LinkIcon,
      items: related.superseded_standards || [],
    },
  ];

  const currentCategory = categories.find((c) => c.key === activeTab);
  const items = currentCategory?.items || [];

  return (
    <div className="warm-glass rounded-2xl p-5 sm:p-6 border border-[#E7D9BC] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7D9BC]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FC6C26]/12 border border-[#FC6C26]/30 flex items-center justify-center text-[#D95218]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D95218]">
              Related Standards Knowledge Network
            </h3>
            <p className="text-[11px] text-[#6E5C4E] font-medium">
              Normative references, verification test methods, and installation codes
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#9B8977] hidden sm:inline">
          Knowledge Graph Traversal
        </span>
      </div>

      {/* Category Tabs Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeTab === cat.key;
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveTab(cat.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? "bg-[#FC6C26] text-white shadow-xs"
                  : "bg-[#FFF8E9] hover:bg-white text-[#6E5C4E] border border-[#E7D9BC]/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                isActive ? "bg-white/25 text-white" : "bg-black/5 text-[#9B8977]"
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="p-8 rounded-xl bg-[#FFF8E9]/60 border border-[#E7D9BC]/60 text-center text-xs text-[#9B8977]">
          No standards linked under {currentCategory?.label.toLowerCase()} for this equipment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((std: StandardMetadata, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white border border-[#E7D9BC] hover:border-[#FC6C26]/50 transition flex flex-col justify-between space-y-2.5 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#D95218] bg-[#FC6C26]/10 px-2 py-0.5 rounded-md">
                    {std.is_number}
                  </span>
                  <span className="text-[10px] font-mono font-medium text-[#9B8977]">
                    {std.year || "IS Standard"}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#231A14] line-clamp-2 leading-snug">
                  {std.title}
                </div>
                <div className="text-[10px] text-[#6E5C4E] truncate">
                  Domain: {std.domain || "Engineering"}
                </div>
              </div>

              {onSelectStandard && (
                <button
                  type="button"
                  onClick={() => onSelectStandard(std)}
                  className="w-full pt-2 border-t border-[#E7D9BC]/60 text-[11px] font-semibold text-[#D95218] hover:text-[#FC6C26] flex items-center justify-between transition cursor-pointer"
                >
                  <span>Inspect Specifications</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
