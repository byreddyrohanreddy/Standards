"use client";

import React, { useState, forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "outline"
  | "soft";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loadingText?: string;
  immediateFeedback?: boolean; // immediately shows loading state on click before async handler resolves
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#FC6C26] to-[#D95218] hover:from-[#E45B1A] hover:to-[#C44610] text-white shadow-sm shadow-[#FC6C26]/25 border border-[#FC6C26]/30 active:scale-[0.98]",
  secondary:
    "bg-[#FFFAEF] hover:bg-[#FFF6E3] text-[#231A14] border border-[#E7D9BC] shadow-xs active:scale-[0.98]",
  soft:
    "bg-[#FC6C26]/10 hover:bg-[#FC6C26]/18 text-[#D95218] border border-[#FC6C26]/20 active:scale-[0.98]",
  outline:
    "bg-transparent hover:bg-[#FC6C26]/5 text-[#6E5C4E] hover:text-[#231A14] border border-[#E7D9BC] active:scale-[0.98]",
  ghost:
    "bg-transparent hover:bg-[#231A14]/5 text-[#6E5C4E] hover:text-[#231A14] border border-transparent active:scale-[0.98]",
  danger:
    "bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 border border-rose-300 active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg font-medium",
  md: "h-9 px-4 text-xs sm:text-sm gap-2 rounded-lg font-medium",
  lg: "h-11 px-5 text-sm sm:text-base gap-2.5 rounded-xl font-semibold",
  icon: "h-8 w-8 p-0 rounded-lg items-center justify-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      loadingText,
      immediateFeedback = false,
      onClick,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const [isInternalLoading, setIsInternalLoading] = useState(false);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading || isInternalLoading) return;
      if (immediateFeedback) {
        setIsInternalLoading(true);
      }
      try {
        if (onClick) {
          await onClick(e);
        }
      } finally {
        if (immediateFeedback) {
          setIsInternalLoading(false);
        }
      }
    };

    const activeLoading = isLoading || isInternalLoading;

    return (
      <button
        ref={ref}
        disabled={disabled || activeLoading}
        onClick={handleClick}
        className={`inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[#FC6C26]/40 focus:ring-offset-1 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {activeLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {loadingText && <span>{loadingText}</span>}
            {!loadingText && children}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// Convenience wrappers for explicit naming requested in specifications
export const PrimaryButton: React.FC<ButtonProps> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<ButtonProps> = (props) => (
  <Button variant="secondary" {...props} />
);

export const GhostButton: React.FC<ButtonProps> = (props) => (
  <Button variant="ghost" {...props} />
);

export const DangerButton: React.FC<ButtonProps> = (props) => (
  <Button variant="danger" {...props} />
);

export interface IconButtonProps extends Omit<ButtonProps, "size"> {
  "aria-label": string;
  tooltip?: string;
  size?: "sm" | "md" | "lg";
}

export const IconButton: React.FC<IconButtonProps> = ({
  size = "md",
  className = "",
  tooltip,
  children,
  ...props
}) => {
  const iconSizeClass =
    size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";

  return (
    <button
      type="button"
      title={tooltip || props["aria-label"]}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-[#E7D9BC]/80 bg-[#FFFAEF] hover:bg-[#FFF6E3] hover:border-[#D4C4A8] text-[#6E5C4E] hover:text-[#231A14] active:scale-95 ${iconSizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const ButtonGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`inline-flex rounded-lg border border-[#E7D9BC] bg-[#FFFAEF] p-0.5 shadow-xs ${className}`}
      role="group"
    >
      {children}
    </div>
  );
};
