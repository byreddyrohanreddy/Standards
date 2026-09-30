"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";

/* ────────────────────────────────────────────────────────
 * SplitText — Staggered character/word reveal
 * Lightweight: uses IntersectionObserver + CSS transitions (no GSAP)
 * ──────────────────────────────────────────────────────── */

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;         // ms between each unit
  duration?: number;      // ms for each unit's transition
  splitBy?: "chars" | "words";
  direction?: "up" | "down" | "left" | "right" | "fade";
  tag?: React.ElementType;
  once?: boolean;
  threshold?: number;
  onComplete?: () => void;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 30,
  duration = 600,
  splitBy = "chars",
  direction = "up",
  tag: Tag = "span" as any,
  once = true,
  threshold = 0.2,
  onComplete,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const completeRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
          completeRef.current = false;
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const units = useMemo(() => {
    if (splitBy === "words") {
      return text.split(/(\s+)/).filter(Boolean);
    }
    return text.split("");
  }, [text, splitBy]);

  useEffect(() => {
    if (isVisible && onComplete && !completeRef.current) {
      const totalTime = delay * units.length + duration;
      const timer = setTimeout(() => {
        completeRef.current = true;
        onComplete();
      }, totalTime);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, delay, units.length, duration]);

  const getTransform = (visible: boolean) => {
    if (visible) return "translate3d(0,0,0)";
    switch (direction) {
      case "up":    return "translate3d(0, 24px, 0)";
      case "down":  return "translate3d(0, -24px, 0)";
      case "left":  return "translate3d(24px, 0, 0)";
      case "right": return "translate3d(-24px, 0, 0)";
      case "fade":  return "translate3d(0, 0, 0)";
    }
  };

  return (
    <Tag
      ref={containerRef}
      className={className}
      style={{ display: "inline-block", overflow: "hidden" }}
      aria-label={text}
    >
      {units.map((unit, i) => {
        const isSpace = /^\s+$/.test(unit);
        if (isSpace) {
          return <span key={i}>&nbsp;</span>;
        }

        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: "inline-block",
              opacity: isVisible ? 1 : 0,
              transform: getTransform(isVisible),
              transition: `opacity ${duration}ms cubic-bezier(0.19, 1, 0.22, 1) ${i * delay}ms, transform ${duration}ms cubic-bezier(0.19, 1, 0.22, 1) ${i * delay}ms`,
              willChange: "transform, opacity",
            }}
          >
            {unit}
          </span>
        );
      })}
    </Tag>
  );
};


/* ────────────────────────────────────────────────────────
 * BlurText — Staggered blur-in reveal
 * ──────────────────────────────────────────────────────── */

export interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  blurAmount?: number;
  tag?: React.ElementType;
  once?: boolean;
  threshold?: number;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = "",
  delay = 40,
  duration = 800,
  blurAmount = 12,
  tag: Tag = "span" as any,
  once = true,
  threshold = 0.2,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const words = useMemo(() => text.split(/(\s+)/).filter(Boolean), [text]);

  return (
    <Tag
      ref={containerRef}
      className={className}
      style={{ display: "inline" }}
      aria-label={text}
    >
      {words.map((word, i) => {
        const isSpace = /^\s+$/.test(word);
        if (isSpace) return <span key={i}> </span>;

        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: "inline-block",
              opacity: isVisible ? 1 : 0,
              filter: isVisible ? "blur(0px)" : `blur(${blurAmount}px)`,
              transform: isVisible ? "translateY(0)" : "translateY(8px)",
              transition: `opacity ${duration}ms cubic-bezier(0.19, 1, 0.22, 1) ${i * delay}ms, filter ${duration}ms cubic-bezier(0.19, 1, 0.22, 1) ${i * delay}ms, transform ${duration}ms cubic-bezier(0.19, 1, 0.22, 1) ${i * delay}ms`,
              willChange: "transform, opacity, filter",
            }}
          >
            {word}
          </span>
        );
      })}
    </Tag>
  );
};


/* ────────────────────────────────────────────────────────
 * CountUp — Animated number counter
 * ──────────────────────────────────────────────────────── */

export interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  once?: boolean;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  once = true,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(start);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();
    let raf: number;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setValue(current);

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, start, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
};


/* ────────────────────────────────────────────────────────
 * FadeIn — Simple scroll-triggered fade
 * ──────────────────────────────────────────────────────── */

export interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
  threshold?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 700,
  direction = "up",
  distance = 30,
  once = true,
  threshold = 0.15,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const getInitialTransform = () => {
    switch (direction) {
      case "up":    return `translateY(${distance}px)`;
      case "down":  return `translateY(-${distance}px)`;
      case "left":  return `translateX(${distance}px)`;
      case "right": return `translateX(-${distance}px)`;
      case "none":  return "none";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : getInitialTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.19, 1, 0.22, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.19, 1, 0.22, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};


/* ────────────────────────────────────────────────────────
 * GlowCard — Specular highlight card (inspired by SpecularButton)
 * ──────────────────────────────────────────────────────── */

export interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "rgba(252, 108, 38, 0.12)",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--glow-x", `${x}px`);
    el.style.setProperty("--glow-y", `${y}px`);
  }, []);

  return (
    <div
      ref={ref}
      className={`glow-card ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        "--glow-color": glowColor,
        position: "relative",
        overflow: "hidden",
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
