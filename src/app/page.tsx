"use client";

import * as React from "react";
import { AnalysisProvider, useAnalysis } from "@/lib/store/analysis-context";
import { HeroSection } from "@/components/landing/hero-section";
import { InstantStatsPreview } from "@/components/landing/instant-stats-preview";
import { SwissLayout } from "@/components/layout/swiss-layout";
import { WrappedContainer } from "@/components/wrapped/wrapped-container";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CrisisSupportModal } from "@/components/safety/crisis-support-modal";
import { scanForCrisis } from "@/lib/safety/crisis-detector";

function AnalyzeBridge(): React.JSX.Element {
  const { stage, metrics, excerpts, relationshipType, optionalConcern, setAnalyzing, setReady, setError } =
    useAnalysis();

  const runAnalysis = React.useCallback(async () => {
    if (!metrics) return;
    setAnalyzing();
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relationshipType,
          optionalConcern: optionalConcern || undefined,
          deterministicMetrics: metrics,
          contextExcerpts: excerpts,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || `Analysis failed (${res.status}).`);
      }
      const report = await res.json();
      setReady(report, (report as { _meta?: { advisory?: string } })._meta?.advisory ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.", "ANALYZE_FAILED");
    }
  }, [metrics, excerpts, relationshipType, optionalConcern, setAnalyzing, setReady, setError]);

  if (stage === "idle" || stage === "parsing" || stage === "error") return <div />;
  return (
    <div className="mt-8">
      <RelationshipInputs />
      <InstantStatsPreview onAnalyze={runAnalysis} />
    </div>
  );
}

function RelationshipInputs(): React.JSX.Element {
  const { relationshipType, setRelationshipType, optionalConcern, setOptionalConcern, stage } =
    useAnalysis();
  if (stage !== "stats" && stage !== "analyzing") return <div />;
  return (
    <div className="mb-4 grid gap-4 rounded-none border-2 border-black bg-white p-4 md:grid-cols-2 md:p-6">
      <label className="block">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
          Relationship type
        </span>
        <select
          aria-label="Relationship type"
          value={relationshipType}
          onChange={(e) => setRelationshipType(e.target.value)}
          className="mt-2 w-full rounded-none border-2 border-black bg-white px-4 py-3 text-sm font-medium focus:border-swiss-accent focus:outline-none"
        >
          {["romantic", "dating", "friendship", "family", "other"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
          What are you worried about? (optional)
        </span>
        <input
          aria-label="Optional concern"
          value={optionalConcern}
          onChange={(e) => setOptionalConcern(e.target.value)}
          placeholder="E.G. I FEEL LIKE THEY ARE PULLING AWAY"
          maxLength={2000}
          className="mt-2 w-full rounded-none border-2 border-black bg-white px-4 py-3 text-sm font-medium placeholder:text-neutral-400 placeholder:uppercase placeholder:text-xs placeholder:tracking-wider focus:border-swiss-accent focus:outline-none"
        />
      </label>
    </div>
  );
}

function StageRouter(): React.JSX.Element {
  const { stage, showWrapped, report, messages } = useAnalysis();
  const [crisisDismissed, setCrisisDismissed] = React.useState(false);
  if (stage === "ready" && report) {
    const crisis = scanForCrisis(messages);
    if (crisis.flagged && !crisisDismissed) {
      return (
        <div className="mt-8 space-y-4">
          <CrisisSupportModal onClose={() => setCrisisDismissed(true)} />
          <DashboardLayout />
        </div>
      );
    }
    if (showWrapped) return <WrappedContainer />;
    return <DashboardLayout />;
  }
  return <div />;
}

export default function Home(): React.JSX.Element {
  return (
    <AnalysisProvider>
      <SwissLayout>
        <div className="py-10 md:py-16">
          <HeroSection />
          <AnalyzeBridge />
          <StageRouter />
        </div>
      </SwissLayout>
    </AnalysisProvider>
  );
}
