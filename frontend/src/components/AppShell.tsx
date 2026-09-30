"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandRail } from "./CommandRail";
import { ContextToolbar } from "./ContextToolbar";
import { CommandPalette } from "./navigation/CommandPalette";
import { FloatingActionDock } from "./navigation/FloatingActionDock";
import { SideRays } from "./effects/SideRays";
import { ToastProvider } from "./ui/Toast";
import { Shield, CheckCircle2 } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  // Restore collapsed state from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bis_specai_rail_collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    } catch (_) {}
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("bis_specai_rail_collapsed", String(next));
      } catch (_) {}
      return next;
    });
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-[#FFF4D6] text-[#231A14] relative selection:bg-[#FC6C26]/20 selection:text-[#D95218]">
        {/* Continuous Environmental Layer: Warm Side Rays Shader */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <SideRays
            origin="top-right"
            speed={0.75}
            intensity={1.25}
            rayColor1="#FC6C26"
            rayColor2="#FFE0A3"
            spread={2.2}
            tilt={-12}
            opacity={0.38}
            falloff={1.6}
            saturation={1.2}
          />
        </div>

        {/* Background Ambient Mesh */}
        <div className="ambient-mesh" aria-hidden="true">
          <div className="ambient-blob ambient-blob-1" />
          <div className="ambient-blob ambient-blob-2" />
          <div className="ambient-blob ambient-blob-3" />
          <div className="ambient-blob ambient-blob-4" />
        </div>
        <div className="ambient-grid" aria-hidden="true" />

        {/* Global Vertical Command Rail */}
        <CommandRail
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main Workspace Area */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${
            collapsed ? "lg:pl-18" : "lg:pl-72"
          }`}
        >
          {/* Contextual Top Toolbar */}
          <ContextToolbar
            onOpenMobileRail={() => setMobileOpen(true)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />

          {/* Page Content Viewport */}
          <main className="flex-1 px-3 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto relative z-10">
            {children}
          </main>

          {/* Technical Footer */}
          <footer className="relative z-10 border-t border-[#E7D9BC]/15 bg-[#FFF8E9]/20 backdrop-blur-sm py-5 px-4 sm:px-6 lg:px-8 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E5C4E]">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#FC6C26] to-[#D95218] flex items-center justify-center text-white shadow-xs">
                  <Shield className="w-3 h-3" />
                </div>
                <span className="font-medium text-[#231A14]">
                  <strong className="font-bold tracking-tight">BIS-SpecAI</strong> • Smart India Hackathon 2026 PS #26108
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-800 font-mono font-medium">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  113 Standards Indexed
                </span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-[#6E5C4E] font-medium flex-wrap">
                <Link href="/about" className="hover:text-[#FC6C26] transition-colors">
                  System Architecture
                </Link>
                <span className="text-[#E7D9BC]">•</span>
                <Link href="/standards" className="hover:text-[#FC6C26] transition-colors">
                  Standards Catalog
                </Link>
                <span className="text-[#E7D9BC]">•</span>
                <Link href="/evaluation" className="hover:text-[#FC6C26] transition-colors">
                  Benchmark Metrics
                </Link>
                <span className="text-[#E7D9BC]">•</span>
                <Link href="/history" className="hover:text-[#FC6C26] transition-colors">
                  Audit History
                </Link>
              </div>
            </div>
          </footer>
        </div>

        {/* Floating Action Dock */}
        <FloatingActionDock onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

        {/* Global Command Palette (Ctrl+K) */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />
      </div>
    </ToastProvider>
  );
};
