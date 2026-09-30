"use client";

import React from "react";
import { Inbox, Search, FileQuestion, AlertCircle } from "lucide-react";
import { Button } from "./Button";

export const Skeleton: React.FC<{
  className?: string;
  width?: string | number;
  height?: string | number;
}> = ({ className = "", width, height }) => {
  return (
    <div
      style={{ width, height }}
      className={`animate-pulse bg-[#E7D9BC]/35 rounded-md ${className}`}
    />
  );
};

export const StandardSkeleton: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-[#FFFAEF] border border-[#E7D9BC] shadow-xs flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="flex gap-2 pt-2 border-t border-[#E7D9BC]/60">
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
    </div>
  );
};

export const CandidateSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFAEF] border border-[#E7D9BC]">
      <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
      </div>
      <Skeleton className="w-12 h-6 rounded-md shrink-0" />
    </div>
  );
};

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-[#FFFAEF]/80 border border-[#E7D9BC] ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#FC6C26]/10 border border-[#FC6C26]/20 flex items-center justify-center text-[#FC6C26] mb-3.5 shadow-xs">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-sm sm:text-base font-bold text-[#231A14] tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-[#6E5C4E] max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
