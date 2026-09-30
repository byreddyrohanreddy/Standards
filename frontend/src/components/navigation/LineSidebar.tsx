"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import "./LineSidebar.css";

const FALLOFF_CURVES: Record<string, (p: number) => number> = {
  linear: (p) => p,
  smooth: (p) => p * p * (3 - 2 * p),
  sharp: (p) => p * p * p,
};

export interface LineSidebarItemObject {
  label: string;
  href?: string;
  sublabel?: string;
  badge?: string;
  icon?: React.ElementType;
}

export type LineSidebarItem = string | LineSidebarItemObject;

export interface LineSidebarProps {
  items?: LineSidebarItem[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: "linear" | "smooth" | "sharp";
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  defaultActive?: number | null;
  active?: number | null;
  onItemClick?: (index: number, label: string, item?: LineSidebarItem) => void;
  className?: string;
}

const DEFAULT_ITEMS: string[] = [
  "Overview",
  "Components",
  "Animations",
  "Backgrounds",
  "Showcase",
];

export const LineSidebar: React.FC<LineSidebarProps> = ({
  items = DEFAULT_ITEMS,
  accentColor = "#FC6C26",
  textColor = "#6E5C4E",
  markerColor = "#D4C4A8",
  showIndex = true,
  showMarker = true,
  proximityRadius = 90,
  maxShift = 18,
  falloff = "smooth",
  markerLength = 36,
  markerGap = 8,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 14,
  fontSize = 0.875,
  smoothing = 90,
  defaultActive = null,
  active = null,
  onItemClick,
  className = "",
}) => {
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);
  
  const [internalActive, setInternalActive] = useState<number | null>(defaultActive);
  const currentActiveIndex = active !== undefined && active !== null ? active : internalActive;

  const activeRef = useRef<number | null>(currentActiveIndex);
  const smoothingRef = useRef<number>(smoothing);

  activeRef.current = currentActiveIndex;
  smoothingRef.current = smoothing;

  // Single rAF loop that eases every item's --effect toward its target using
  // frame-rate independent exponential smoothing, so color, shift and scale
  // all move together without staggering CSS transitions.
  const runFrame = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothingRef.current, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let moving = false;
    const itemEls = itemRefs.current;
    for (let i = 0; i < itemEls.length; i++) {
      const el = itemEls[i];
      if (!el) continue;
      const target = Math.max(
        targetsRef.current[i] || 0,
        activeRef.current === i ? 1 : 0
      );
      const cur = currentRef.current[i] || 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[i] = value;
      el.style.setProperty("--effect", value.toFixed(4));
      if (!settled) moving = true;
    }

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
    }
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLUListElement>) => {
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const pointerY = e.clientY - rect.top;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
      const itemEls = itemRefs.current;
      for (let i = 0; i < itemEls.length; i++) {
        const el = itemEls[i];
        if (!el) continue;
        const center = el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(pointerY - center);
        targetsRef.current[i] = ease(
          Math.max(0, 1 - distance / proximityRadius)
        );
      }
      startLoop();
    },
    [falloff, proximityRadius, startLoop]
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  const handleClick = useCallback(
    (index: number, label: string, rawItem: LineSidebarItem) => {
      setInternalActive(index);
      onItemClick?.(index, label, rawItem);
    },
    [onItemClick]
  );

  useEffect(() => {
    startLoop();
  }, [currentActiveIndex, startLoop]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  return (
    <nav
      className={`line-sidebar${showMarker ? " line-sidebar--markers" : ""}${
        scaleTick ? " line-sidebar--scale-tick" : ""
      }${className ? ` ${className}` : ""}`}
      style={{
        ["--accent-color" as string]: accentColor,
        ["--text-color" as string]: textColor,
        ["--marker-color" as string]: markerColor,
        ["--marker-length" as string]: `${markerLength}px`,
        ["--marker-gap" as string]: `${markerGap}px`,
        ["--tick-scale" as string]: tickScale,
        ["--max-shift" as string]: `${maxShift}px`,
        ["--item-gap" as string]: `${itemGap}px`,
        ["--font-size" as string]: `${fontSize}rem`,
        ["--smoothing" as string]: `${smoothing}ms`,
      }}
    >
      <ul
        ref={listRef}
        className="line-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {items.map((item, index) => {
          const label = typeof item === "string" ? item : item.label;
          const href = typeof item === "object" ? item.href : undefined;
          const badge = typeof item === "object" ? item.badge : undefined;
          const Icon = typeof item === "object" ? item.icon : undefined;
          const isItemActive = currentActiveIndex === index;

          const content = (
            <>
              {showMarker && (
                <span className="line-sidebar__marker" aria-hidden="true" />
              )}
              <span className="line-sidebar__label">
                {showIndex && (
                  <span className="line-sidebar__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                {Icon && (
                  <Icon
                    className={`w-4 h-4 mr-2 shrink-0 transition-colors ${
                      isItemActive ? "text-[#FC6C26]" : "text-[#9B8977]"
                    }`}
                  />
                )}
                <span className="line-sidebar__text">{label}</span>
                {badge && (
                  <span className="ml-2 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#FC6C26]/12 border border-[#FC6C26]/30 text-[#D95218]">
                    {badge}
                  </span>
                )}
              </span>
            </>
          );

          // Use <Link> for items with href to enable Next.js prefetching
          return href ? (
            <li
              key={`${label}-${index}`}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="line-sidebar__item"
              aria-current={isItemActive ? "true" : undefined}
            >
              <Link
                href={href}
                prefetch={true}
                onClick={() => handleClick(index, label, item)}
                style={{ display: "contents" }}
              >
                {content}
              </Link>
            </li>
          ) : (
            <li
              key={`${label}-${index}`}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="line-sidebar__item"
              aria-current={isItemActive ? "true" : undefined}
              onClick={() => handleClick(index, label, item)}
            >
              {content}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default LineSidebar;
