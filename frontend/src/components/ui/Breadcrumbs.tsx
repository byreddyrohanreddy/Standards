"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export const Breadcrumbs: React.FC<{
  items: BreadcrumbItem[];
  className?: string;
}> = ({ items, className = "" }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs text-[#6E5C4E] ${className}`}>
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-[#6E5C4E] hover:text-[#FC6C26] transition-colors p-1 rounded hover:bg-[#231A14]/5"
        title="Dashboard"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1 || item.isCurrent;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight className="w-3 h-3 text-[#D4C4A8] shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-[#231A14] truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-[#6E5C4E] hover:text-[#FC6C26] transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
