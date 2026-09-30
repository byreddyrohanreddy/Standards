"use client";

import React, { useState } from "react";
import { Cpu, Zap, Shield, Layers, Activity, Sparkles } from "lucide-react";
import { ExtractedRequirements } from "@/types";
import { ParameterChip } from "../ui/ParameterChip";

export interface ParameterClusterProps {
  requirements: ExtractedRequirements;
  className?: string;
  onHoverParameter?: (paramName: string | null) => void;
}

export const ParameterCluster: React.FC<ParameterClusterProps> = ({
  requirements,
  className = "",
  onHoverParameter,
}) => {
  const [activeHover, setActiveHover] = useState<string | null>(null);

  const handleMouseEnter = (label: string) => {
    setActiveHover(label);
    if (onHoverParameter) onHoverParameter(label);
  };

  const handleMouseLeave = () => {
    setActiveHover(null);
    if (onHoverParameter) onHoverParameter(null);
  };

  const groups = [
    {
      category: "Electrical & Ratings",
      icon: <Zap className="w-3.5 h-3.5 text-[#FC6C26]" />,
      items: [
        requirements.voltage && { label: "Voltage", value: requirements.voltage },
        requirements.frequency && { label: "Frequency", value: requirements.frequency },
        requirements.phase && { label: "Phase", value: requirements.phase },
        requirements.power && { label: "Power", value: requirements.power },
        requirements.current && { label: "Current", value: requirements.current },
        requirements.efficiency && { label: "Efficiency Class", value: requirements.efficiency },
      ].filter(Boolean),
    },
    {
      category: "Mechanical & Enclosure",
      icon: <Cpu className="w-3.5 h-3.5 text-amber-600" />,
      items: [
        requirements.ip_rating && { label: "IP Protection", value: requirements.ip_rating },
        requirements.duty && { label: "Duty Cycle", value: requirements.duty },
        requirements.capacity && { label: "Capacity", value: requirements.capacity },
        requirements.dimensions && { label: "Dimensions", value: requirements.dimensions },
        requirements.pressure && { label: "Pressure", value: requirements.pressure },
      ].filter(Boolean),
    },
    {
      category: "Safety & Materials",
      icon: <Shield className="w-3.5 h-3.5 text-emerald-600" />,
      items: [
        requirements.materials?.length > 0 && { label: "Materials", value: requirements.materials.join(", ") },
        requirements.temperature && { label: "Temperature Class", value: requirements.temperature },
        requirements.safety_requirements?.length > 0 && { label: "Safety Code", value: requirements.safety_requirements[0] },
      ].filter(Boolean),
    },
  ];

  return (
    <div
      className={`rounded-2xl border border-[#E7D9BC] bg-[#FFFAEF] p-5 shadow-xs space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#E7D9BC]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FC6C26]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#231A14]">
            Extracted Technical Parameters ({requirements.product || "Specification Scope"})
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#8D7B68]">
          Hover chip to highlight clause alignment
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map((grp, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#6E5C4E]">
              {grp.icon}
              <span>{grp.category}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {grp.items.length > 0 ? (
                grp.items.map((item: any, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                    className="transition-transform duration-100"
                  >
                    <ParameterChip
                      label={item.label}
                      value={item.value}
                      matched={true}
                      variant="clay"
                      className={
                        activeHover === item.label
                          ? "ring-2 ring-[#FC6C26] bg-[#FFF2DE] border-[#FC6C26]"
                          : ""
                      }
                    />
                  </div>
                ))
              ) : (
                <span className="text-[11px] font-mono text-[#9B8977]">Standard ratings applied</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
