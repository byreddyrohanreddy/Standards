"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
  BookOpen,
  ShieldCheck,
  FileText,
  AlertCircle,
  Bot,
  User,
  ChevronDown,
} from "lucide-react";
import { ChatMessage, AnalysisResponse, StandardMetadata } from "@/types";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult?: AnalysisResponse | null;
  className?: string;
}

function buildChatContext(result: AnalysisResponse | null | undefined) {
  if (!result) return undefined;
  const p = result.primary_standard;
  const ctx: Record<string, any> = {};
  if (result.query) ctx.requirement = result.query.slice(0, 300);
  if (p) {
    ctx.primaryStandard = {
      is_number: p.is_number,
      title: p.title,
      year: p.year,
      domain: p.domain,
      scope: p.scope?.slice(0, 400),
      status: p.status,
    };
    const score = p.ai_relevance_score ?? (p as any).score;
    if (score != null) ctx.relevanceScore = score > 1 ? score : score * 100;
  }
  if (result.version_alerts && result.version_alerts.length > 0) {
    ctx.versionStatus = result.version_alerts
      .map((a) => `${a.referenced_standard}: ${a.status}`)
      .join("; ");
  }
  if (result.qco_results && result.qco_results.length > 0) {
    ctx.qcoSummary = result.qco_results
      .map((q) => `${q.qco_id} (${q.certification_scheme}) – ${q.status?.enforcement_status}`)
      .join("; ");
  }
  if (result.related_standards) {
    const rel = result.related_standards;
    const parts: string[] = [];
    if (rel.normative_references?.length)
      parts.push(`Normative: ${rel.normative_references.map((s) => s.is_number).join(", ")}`);
    if (rel.testing_standards?.length)
      parts.push(`Testing: ${rel.testing_standards.map((s) => s.is_number).join(", ")}`);
    if (rel.safety_standards?.length)
      parts.push(`Safety: ${rel.safety_standards.map((s) => s.is_number).join(", ")}`);
    if (parts.length > 0) ctx.relatedStandards = parts.join(" | ");
  }
  if (result.summary_explanation) {
    ctx.evidenceSummary = result.summary_explanation.slice(0, 400);
  }
  return ctx;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  analysisResult,
  className = "",
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = useCallback(
    async (customMessage?: string) => {
      const text = (customMessage ?? input).trim();
      if (!text || isLoading) return;

      setInput("");
      setApiError(null);

      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        sender: "user",
        text,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const context = buildChatContext(analysisResult);
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userMessage: text,
            history: messages.slice(-10),
            context,
          }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          const errText = data.message || "Failed to get response";
          setApiError(errText);
          setMessages((prev) => [
            ...prev,
            {
              id: `err_${Date.now()}`,
              sender: "assistant",
              text: errText,
              timestamp: new Date().toLocaleTimeString(),
              isError: true,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `asst_${Date.now()}`,
              sender: "assistant",
              text: data.text,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      } catch (err: any) {
        const errText = err.message || "Network error";
        setApiError(errText);
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            sender: "assistant",
            text: `Connection error: ${errText}`,
            timestamp: new Date().toLocaleTimeString(),
            isError: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, analysisResult]
  );

  const primaryStd = analysisResult?.primary_standard;

  const quickActions = primaryStd
    ? [
        "Why was this standard recommended?",
        "Is this standard current?",
        "What QCO applies?",
        "What standards are related?",
        "Explain the evidence",
        "Draft a tender clause",
      ]
    : [
        "What is IS 12615:2018?",
        "Difference between IE2 and IE3 motors",
        "Earthing codes IS 3043",
        "What is a Quality Control Order?",
      ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[380px] lg:w-[360px] flex flex-col bg-[#FFFAEF] border-l border-[#E7D9BC] shadow-2xl shadow-[#D95218]/10 ${className}`}
        role="complementary"
        aria-label="BIS-SpecAI Intelligence Assistant"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#FC6C26] to-[#D95218] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block leading-tight">
                Intelligence Assistant
              </span>
              <span className="text-[10px] text-white/70 font-medium">
                BIS-SpecAI • Powered by Gemini
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Context Strip */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#FFF8E9] border-b border-[#E7D9BC] shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-[#FC6C26]" />
            <span className="font-semibold text-[#231A14]">Context:</span>
            {primaryStd ? (
              <span className="font-mono text-[11px] font-bold text-[#D95218] bg-[#FC6C26]/10 px-1.5 py-0.5 rounded">
                {primaryStd.is_number}
              </span>
            ) : (
              <span className="text-[11px] text-[#9B8977] italic">
                No active analysis
              </span>
            )}
          </div>
          {primaryStd?.ai_relevance_score != null && (
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              {(primaryStd.ai_relevance_score > 1
                ? primaryStd.ai_relevance_score
                : primaryStd.ai_relevance_score * 100
              ).toFixed(1)}
              % Match
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[#FFFAEF]">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#FC6C26]/15 to-[#D95218]/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#D95218]" />
              </div>
              <p className="text-xs text-[#6E5C4E] font-medium max-w-[240px] mx-auto leading-relaxed">
                Ask about Indian Standards, testing codes, QCO compliance, supersession history, or tender specifications.
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"} items-end`}
              >
                <div
                  className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center ${
                    isUser
                      ? "bg-[#FC6C26]"
                      : msg.isError
                      ? "bg-rose-100"
                      : "bg-[#FFF6E3] border border-[#E7D9BC]"
                  }`}
                >
                  {isUser ? (
                    <User className="w-3 h-3 text-white" />
                  ) : msg.isError ? (
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                  ) : (
                    <Bot className="w-3 h-3 text-[#D95218]" />
                  )}
                </div>
                <div
                  className={`max-w-[82%] px-3 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
                    isUser
                      ? "bg-[#FC6C26] text-white rounded-2xl rounded-br-sm"
                      : msg.isError
                      ? "bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl rounded-bl-sm"
                      : "bg-white text-[#231A14] border border-[#E7D9BC] rounded-2xl rounded-bl-sm shadow-xs"
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[10px] mt-1.5 ${
                      isUser ? "text-white/50" : msg.isError ? "text-rose-400" : "text-[#9B8977]"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2 items-end">
              <div className="w-6 h-6 rounded-full bg-[#FFF6E3] border border-[#E7D9BC] flex items-center justify-center">
                <Bot className="w-3 h-3 text-[#D95218]" />
              </div>
              <div className="px-3 py-2.5 bg-white border border-[#E7D9BC] rounded-2xl rounded-bl-sm flex items-center gap-2">
                <Loader2 className="w-3 h-3 text-[#FC6C26] animate-spin" />
                <span className="text-[12px] text-[#9B8977]">Thinking…</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-3 py-2 bg-[#FFF8E9] border-t border-[#E7D9BC] shrink-0">
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#9B8977] uppercase tracking-wider shrink-0">
              <Sparkles className="w-3 h-3 text-[#FC6C26]" />
              Try:
            </span>
            {quickActions.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(action)}
                disabled={isLoading}
                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#D95218] bg-[#FC6C26]/8 hover:bg-[#FC6C26]/15 border border-[#FC6C26]/15 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-3 py-2.5 bg-[#FFFAEF] border-t border-[#E7D9BC] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                primaryStd
                  ? `Ask about ${primaryStd.is_number}…`
                  : "Ask about any Indian Standard…"
              }
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-white border border-[#E7D9BC] rounded-xl text-[13px] text-[#231A14] placeholder:text-[#9B8977] focus:border-[#FC6C26] focus:outline-none font-[inherit] transition-colors"
              aria-label="Chat message input"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                input.trim()
                  ? "bg-[#FC6C26] text-white hover:bg-[#D95218]"
                  : "bg-[#E7D9BC]/50 text-[#9B8977] cursor-not-allowed"
              }`}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};
