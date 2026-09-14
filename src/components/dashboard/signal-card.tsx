"use client";

import * as React from "react";
import type { BehavioralSignal } from "@/types/report";
import { SignalBadge } from "@/components/ui/signal-badge";
import { SwissButton } from "@/components/ui/swiss-button";

/**
 * Individual signal card: category pill, confidence, occurrences,
 * description, recommendation + receipts trigger.
 */
export function SignalCard({
  signal,
  onExamine,
}: {
  signal: BehavioralSignal;
  onExamine: (ids: string[]) => void;
}): React.JSX.Element {
  const badgeType = signal.type === "GREEN" ? "green" : signal.type === "RED" ? "red" : "mixed";
  return (
    <article className="rounded-none border-2 border-black bg-white p-4 md:p-6" aria-label={signal.title}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="border-2 border-black bg-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest text-white">
          {signal.category}
        </span>
        <span className="bg-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
          Evidence: {signal.confidence}
        </span>
      </div>
      <div className="mt-3">
        <SignalBadge type={badgeType} title={signal.title} occurrences={signal.occurrences} />
      </div>
      <p className="mt-3 text-sm text-black">{signal.description}</p>
      <p className="mt-2 border-l-8 border-l-swiss-accent bg-swiss-muted p-3 text-sm text-black">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest">Recommendation — </span>
        {signal.recommendation}
      </p>
      <SwissButton
        variant="secondary"
        size="sm"
        className="mt-3"
        onClick={() => onExamine(signal.evidenceExcerptIds)}
      >
        [Examine receipts ({signal.evidenceExcerptIds.length}) →]
      </SwissButton>
    </article>
  );
}
