"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  BookOpen,
  GitBranch,
  ShieldAlert,
  FileCheck,
  History,
  GitCompare,
  Home,
  Info,
  Command,
  ArrowRight,
  X,
  FileUp,
} from "lucide-react";

export interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Actions" | "Standards";
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: "nav-recommend",
      title: "Analyze Requirement / Run Recommendation",
      category: "Actions",
      shortcut: "G R",
      icon: <Sparkles className="w-4 h-4 text-[#FC6C26]" />,
      action: () => {
        router.push("/recommend");
        onClose();
      },
    },
    {
      id: "nav-standards",
      title: "Search Standards Library (113 Standards)",
      category: "Navigation",
      shortcut: "G S",
      icon: <BookOpen className="w-4 h-4 text-amber-600" />,
      action: () => {
        router.push("/standards");
        onClose();
      },
    },
    {
      id: "nav-qco",
      title: "View Mandatory QCO Orders & Enforcement Dates",
      category: "Navigation",
      shortcut: "G Q",
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      action: () => {
        router.push("/qco");
        onClose();
      },
    },
    {
      id: "nav-graph",
      title: "Open Interactive Standards Relationship Graph",
      category: "Navigation",
      shortcut: "G G",
      icon: <GitBranch className="w-4 h-4 text-indigo-600" />,
      action: () => {
        router.push("/graph");
        onClose();
      },
    },
    {
      id: "nav-audit",
      title: "Tender Clause Compliance Audit & Gap Analysis",
      category: "Actions",
      shortcut: "G A",
      icon: <FileCheck className="w-4 h-4 text-emerald-600" />,
      action: () => {
        router.push("/audit");
        onClose();
      },
    },
    {
      id: "nav-compare",
      title: "Side-by-Side Standards Comparison Tool",
      category: "Navigation",
      shortcut: "G C",
      icon: <GitCompare className="w-4 h-4 text-cyan-600" />,
      action: () => {
        router.push("/compare");
        onClose();
      },
    },
    {
      id: "nav-history",
      title: "View Recent Analysis & Audit History",
      category: "Navigation",
      shortcut: "G H",
      icon: <History className="w-4 h-4 text-stone-600" />,
      action: () => {
        router.push("/history");
        onClose();
      },
    },
    {
      id: "nav-dashboard",
      title: "Return to Executive Dashboard Overview",
      category: "Navigation",
      shortcut: "G D",
      icon: <Home className="w-4 h-4 text-[#8D7B68]" />,
      action: () => {
        router.push("/dashboard");
        onClose();
      },
    },
    {
      id: "nav-home",
      title: "Go to Public Landing Page",
      category: "Navigation",
      shortcut: "G P",
      icon: <Command className="w-4 h-4 text-[#FC6C26]" />,
      action: () => {
        router.push("/");
        onClose();
      },
    },
    {
      id: "std-12615",
      title: "IS 12615:2018 — Energy Efficient Induction Motors (IE2/IE3/IE4)",
      category: "Standards",
      icon: <BookOpen className="w-4 h-4 text-[#FC6C26]" />,
      action: () => {
        router.push("/standards/IS%2012615:2018");
        onClose();
      },
    },
    {
      id: "std-694",
      title: "IS 694:2010 — PVC Insulated Cables for Working Voltages up to 1100V",
      category: "Standards",
      icon: <BookOpen className="w-4 h-4 text-[#FC6C26]" />,
      action: () => {
        router.push("/standards/IS%20694:2010");
        onClose();
      },
    },
  ];

  const filteredCommands = query.trim()
    ? commands.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length
        );
      } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#231A14]/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#FFFAEF] border border-[#E7D9BC] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E7D9BC] bg-[#FFF8EC]">
          <Search className="w-5 h-5 text-[#FC6C26] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search standards (e.g. 'motor', 'cable', 'audit')..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#231A14] placeholder-[#8D7B68] focus:outline-none"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#8D7B68] bg-[#E7D9BC]/40 border border-[#E7D9BC] rounded">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#8D7B68] hover:text-[#231A14] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#E7D9BC]/40">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-[#231A14]">
                No matching commands found
              </p>
              <p className="text-xs text-[#6E5C4E] mt-1">
                Try searching for keywords like "recommend", "qco", "graph", or "IS 12615"
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredCommands.map((command, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={command.id}
                    onClick={command.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-100 ${
                      isSelected
                        ? "bg-[#FC6C26]/12 border border-[#FC6C26]/25 text-[#231A14]"
                        : "hover:bg-[#231A14]/4 border border-transparent text-[#6E5C4E]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? "bg-[#FFFAEF] border-[#FC6C26]/30 shadow-xs"
                            : "bg-[#FFF6E3] border-[#E7D9BC]"
                        }`}
                      >
                        {command.icon}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isSelected ? "text-[#231A14]" : "text-[#231A14]"
                          }`}
                        >
                          {command.title}
                        </span>
                        <span className="text-[10px] text-[#8D7B68] font-mono uppercase">
                          {command.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {command.shortcut && (
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#8D7B68] bg-[#E7D9BC]/30 border border-[#E7D9BC] rounded">
                          {command.shortcut}
                        </kbd>
                      )}
                      <ArrowRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected
                            ? "text-[#FC6C26] translate-x-0.5"
                            : "text-[#D4C4A8]"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-[#FFF8EC] border-t border-[#E7D9BC] flex items-center justify-between text-[11px] text-[#8D7B68] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <div className="flex items-center gap-1 text-[#FC6C26]">
            <span>BIS-SpecAI Command Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
