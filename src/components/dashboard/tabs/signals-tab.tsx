"use client";

import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";
import { SignalCard } from "@/components/dashboard/signal-card";
import { SectionHeader } from "@/components/ui/section-header";
import type { SignalType } from "@/types/report";

type Filter = "ALL" | SignalType;

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "ALL", label: "[ALL]" },
  { id: "GREEN", label: "[GREEN SIGNALS]" },
  { id: "RED", label: "[CRITICAL PATTERNS]" },
  { id: "AMBER", label: "[MIXED SIGNALS]" },
];

/** Tab 02 — filterable behavioral signals matrix. */
export function SignalsTab({ onExamine }: { onExamine: (ids: string[]) => void }): React.JSX.Element {
  const { report } = useAnalysis();
  const [filter, setFilter] = React.useState<Filter>("ALL");
  if (!report) return <div />;
  const visible = report.signals.filter((s) => filter === "ALL" || s.type === filter);

  return (
    <div role="tabpanel" id="panel-signals" aria-labelledby="tab-signals">
      <SectionHeader index="02. SIGNALS & FLAGS" title="Behavioral Signals" meta={`${visible.length} SHOWN`} />
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Signal filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`rounded-none border-2 border-black px-3 py-2 font-mono text-[11px] font-black uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent ${
              filter === f.id ? "bg-black text-white" : "bg-white text-black hover:bg-swiss-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {visible.map((s) => (
          <SignalCard key={s.id} signal={s} onExamine={onExamine} />
        ))}
        {visible.length === 0 && (
          <p className="font-mono text-xs uppercase tracking-widest">No signals in this category.</p>
        )}
      </div>
    </div>
  );
}
