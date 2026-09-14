"use client";

import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";
import { SwissButton } from "@/components/ui/swiss-button";

function formatLatency(sec: number): string {
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.round(sec / 60)}m`;
  return `${Math.round((sec / 3600) * 10) / 10}h`;
}

/**
 * Instant deterministic stats preview — revealed the moment the worker
 * emits STATS_READY, while Gemini reasons in the background.
 */
export function InstantStatsPreview({ onAnalyze }: { onAnalyze: () => void }): React.JSX.Element {
  const { metadata, metrics, stage } = useAnalysis();
  const [analyzing, setAnalyzing] = React.useState(false);

  if (!metadata || !metrics) return <div />;

  const initA = Math.round(metrics.initiation.personA.percentage * 100);
  const initB = 100 - initA;
  const start = new Date(metadata.startDate).toLocaleDateString();
  const end = new Date(metadata.endDate).toLocaleDateString();

  const busyHour = metrics.temporal.peakHour;
  const hourLabel = `${String(busyHour).padStart(2, "0")}:00`;

  return (
    <div data-testid="instant-stats" className="rounded-none border-4 border-black bg-white">
      <div className="flex items-center justify-between border-b-2 border-black bg-black px-4 py-2 md:px-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-white">
          Instant local stats — zero server round-trip
        </p>
        <span className="h-2 w-2 bg-swiss-accent" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-2 gap-px bg-black md:grid-cols-4">
        {[
          [String(metrics.volume.totalMessages), "TOTAL MESSAGES"],
          [`${start} → ${end}`, "DATE RANGE"],
          [`${initA}% / ${initB}%`, "INITIATION A / B"],
          [
            `${formatLatency(metrics.responseSpeed.personA.medianSeconds)} / ${formatLatency(metrics.responseSpeed.personB.medianSeconds)}`,
            "MEDIAN REPLY A / B",
          ],
        ].map(([v, l]) => (
          <div key={l} className="bg-white p-4 md:p-6">
            <p className="text-xl font-black uppercase tracking-tight text-black md:text-2xl">{v}</p>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              {l}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-black bg-swiss-muted px-4 py-3 md:px-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-black">
          Peak hour {hourLabel} · Busiest day {metrics.temporal.busiestDay} ·{" "}
          {metrics.volume.averagePerDay} msgs/day
        </p>
      </div>
      {(stage === "stats" || stage === "analyzing") && (
        <div className="border-t-2 border-black p-4 md:p-6">
          <div className="h-2 w-full bg-swiss-muted" role="progressbar" aria-label="AI analysis progress">
            <div className="h-full animate-pulse bg-swiss-accent" style={{ width: "100%" }} />
          </div>
          <p className="mt-2 font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
            Generating deep behavioral intelligence with Gemini 2.5 Flash…
          </p>
          <SwissButton
            variant="accent"
            className="mt-4 w-full"
            disabled={analyzing}
            onClick={() => {
              setAnalyzing(true);
              onAnalyze();
            }}
          >
            {analyzing ? "Analyzing…" : "Generate deep analysis →"}
          </SwissButton>
        </div>
      )}
    </div>
  );
}
