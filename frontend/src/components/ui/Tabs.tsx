"use client";

import React from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: "pill" | "underline";
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  className = "",
  variant = "pill",
}) => {
  if (variant === "underline") {
    return (
      <div className={`flex border-b border-[#E7D9BC] gap-6 ${className}`}>
        {items.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative pb-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "text-[#FC6C26] font-semibold"
                  : "text-[#6E5C4E] hover:text-[#231A14]"
              }`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive
                      ? "bg-[#FC6C26]/12 text-[#D95218]"
                      : "bg-[#231A14]/6 text-[#6E5C4E]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FC6C26] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-[#FFF6E3] border border-[#E7D9BC] gap-1 shadow-xs ${className}`}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-2 select-none ${
              isActive
                ? "bg-[#FFFAEF] text-[#231A14] font-semibold shadow-xs border border-[#E7D9BC]/80"
                : "text-[#6E5C4E] hover:text-[#231A14] hover:bg-[#FFFAEF]/40"
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive
                    ? "bg-[#FC6C26]/12 text-[#D95218]"
                    : "bg-[#231A14]/6 text-[#6E5C4E]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export interface SegmentedControlProps {
  options: Array<{ value: string; label: string; icon?: React.ReactNode }>;
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md";
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = "sm",
  className = "",
}) => {
  const sizeClasses = size === "sm" ? "p-0.5 text-xs" : "p-1 text-sm";
  const itemPadding = size === "sm" ? "px-2.5 py-1" : "px-3.5 py-1.5";

  return (
    <div
      className={`inline-flex items-center rounded-lg bg-[#FFF6E3] border border-[#E7D9BC] shadow-2xs ${sizeClasses} ${className}`}
      role="radiogroup"
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-1.5 rounded-md font-medium transition-all duration-150 cursor-pointer select-none ${itemPadding} ${
              isSelected
                ? "bg-[#FFFAEF] text-[#231A14] font-semibold shadow-xs border border-[#E7D9BC]/90"
                : "text-[#6E5C4E] hover:text-[#231A14] hover:bg-[#FFFAEF]/50"
            }`}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};
