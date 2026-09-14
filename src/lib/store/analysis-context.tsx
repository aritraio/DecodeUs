"use client";

/**
 * Global analysis state machine:
 * idle → parsing → stats → analyzing → ready (wrapped/dashboard) | error
 * All raw chat data lives in browser memory only. Never persisted.
 */
import * as React from "react";
import type { CanonicalMessage, ConversationMetadata, ContextExcerpt } from "@/types/chat";
import type { DeterministicMetrics } from "@/types/metrics";
import type { IntelligenceReport } from "@/types/report";

export type Stage = "idle" | "parsing" | "stats" | "analyzing" | "ready" | "error";

export interface AnalysisState {
  stage: Stage;
  progress: number;
  relationshipType: string;
  optionalConcern: string;
  messages: CanonicalMessage[];
  metadata: ConversationMetadata | null;
  metrics: DeterministicMetrics | null;
  excerpts: ContextExcerpt[];
  report: IntelligenceReport | null;
  advisory: string | null;
  error: string | null;
  errorCode: string | null;
  showWrapped: boolean;
  activeTab: string;
  setRelationshipType: (v: string) => void;
  setOptionalConcern: (v: string) => void;
  setProgress: (v: number) => void;
  setParsing: () => void;
  setStats: (data: {
    messages: CanonicalMessage[];
    metadata: ConversationMetadata;
    metrics: DeterministicMetrics;
    excerpts: ContextExcerpt[];
  }) => void;
  setAnalyzing: () => void;
  setReady: (report: IntelligenceReport, advisory?: string | null) => void;
  setError: (error: string, code?: string | null) => void;
  setShowWrapped: (v: boolean) => void;
  setActiveTab: (v: string) => void;
  reset: () => void;
  clearChatData: () => void;
}

const AnalysisContext = React.createContext<AnalysisState | null>(null);

const initial: Pick<
  AnalysisState,
  | "stage" | "progress" | "relationshipType" | "optionalConcern" | "messages"
  | "metadata" | "metrics" | "excerpts" | "report" | "advisory"
  | "error" | "errorCode" | "showWrapped" | "activeTab"
> = {
  stage: "idle",
  progress: 0,
  relationshipType: "romantic",
  optionalConcern: "",
  messages: [],
  metadata: null,
  metrics: null,
  excerpts: [],
  report: null,
  advisory: null,
  error: null,
  errorCode: null,
  showWrapped: false,
  activeTab: "fingerprint",
};

export function AnalysisProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [state, setState] = React.useState(initial);

  const value: AnalysisState = {
    ...state,
    setRelationshipType: (relationshipType) => setState((s) => ({ ...s, relationshipType })),
    setOptionalConcern: (optionalConcern) => setState((s) => ({ ...s, optionalConcern })),
    setProgress: (progress) => setState((s) => ({ ...s, progress })),
    setParsing: () =>
      setState((s) => ({ ...s, stage: "parsing", progress: 0, error: null, errorCode: null })),
    setStats: (data) =>
      setState((s) => ({ ...s, stage: "stats", progress: 100, ...data })),
    setAnalyzing: () => setState((s) => ({ ...s, stage: "analyzing" })),
    setReady: (report, advisory = null) =>
      setState((s) => ({ ...s, stage: "ready", report, advisory, showWrapped: true })),
    setError: (error, errorCode = null) =>
      setState((s) => ({ ...s, stage: "error", error, errorCode })),
    setShowWrapped: (showWrapped) => setState((s) => ({ ...s, showWrapped })),
    setActiveTab: (activeTab) => setState((s) => ({ ...s, activeTab })),
    reset: () => setState(initial),
    clearChatData: () =>
      setState((s) => ({
        ...s,
        messages: [],
        metadata: null,
        metrics: null,
        excerpts: [],
        report: null,
        stage: "idle",
        progress: 0,
        showWrapped: false,
      })),
  };

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis(): AnalysisState {
  const ctx = React.useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used within AnalysisProvider.");
  return ctx;
}
