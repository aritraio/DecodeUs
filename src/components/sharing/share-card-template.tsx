"use client";

import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";

/**
 * Privacy-safe share card template (task 10.3).
 * Statistics + archetype only. NEVER names, phones, or dialogue.
 * Swiss exhibition poster: 4px frame, red stamp.
 */
export const SHARE_ASPECTS = {
  story: { width: 1080, height: 1920, label: "9:16 STORY" },
  wide: { width: 1600, height: 900, label: "16:9 POST" },
} as const;

export type ShareAspect = keyof typeof SHARE_ASPECTS;

export function ShareCardTemplate({
  aspect = "story",
}: {
  aspect?: ShareAspect;
}): React.JSX.Element {
  const { metrics, report } = useAnalysis();
  const total = metrics?.volume.totalMessages ?? 0;
  const initA = metrics ? Math.round(metrics.initiation.personA.percentage * 100) : 50;
  const vibe = report?.wrappedHighlights.relationshipVibeTitle ?? "The Uncharted Exchange";
  const green = report?.wrappedHighlights.topGreenFlag ?? "—";
  const mixed = report?.wrappedHighlights.topMixedSignal ?? "—";

  return (
    <div
      data-testid={`share-card-${aspect}`}
      style={{
        width: aspect === "story" ? 540 : 800,
        aspectRatio: aspect === "story" ? "9 / 16" : "16 / 9",
      }}
      className="flex flex-col justify-between rounded-none border-4 border-black bg-white p-8"
    >
      <div className="flex items-start justify-between">
        <p className="font-mono text-xs font-black uppercase tracking-widest">
          DECODEUS // WRAPPED
        </p>
        <span className="bg-swiss-accent px-2 py-1 font-mono text-xs font-black uppercase tracking-widest text-white">
          {total.toLocaleString()} MSGS
        </span>
      </div>
      <div>
        <p className="font-mono text-xs font-black uppercase tracking-widest text-swiss-accent">
          Relationship fingerprint
        </p>
        <p className="mt-2 text-5xl font-black uppercase leading-none tracking-tighter">{vibe}</p>
        <p className="mt-4 font-mono text-sm uppercase tracking-widest">
          {initA}% / {100 - initA}% initiation split
        </p>
        <div className="mt-4 space-y-2 border-2 border-black p-4">
          <p className="text-sm font-bold">GREEN FLAG: {green}</p>
          <p className="text-sm font-bold">MIXED SIGNAL: {mixed}</p>
        </div>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
        Analyze patterns, not people · zero PII · decodeus
      </p>
    </div>
  );
}
