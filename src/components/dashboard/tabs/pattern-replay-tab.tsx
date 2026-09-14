"use client";

import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";
import { PatternNode } from "@/components/dashboard/pattern-node";
import { SectionHeader } from "@/components/ui/section-header";

/** Tab 03 — orthogonal step-by-step pattern replay engine. */
export function PatternReplayTab(): React.JSX.Element {
  const { report } = useAnalysis();
  if (!report) return <div />;
  return (
    <div role="tabpanel" id="panel-patterns" aria-labelledby="tab-patterns">
      <SectionHeader index="03. PATTERN REPLAY" title="Recurring Loops" meta={`${report.patternLoops.length} LOOPS`} />
      <div className="mt-6 space-y-6">
        {report.patternLoops.map((loop, li) => (
          <div key={loop.id} className="rounded-none border-2 border-black bg-white p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
              <p className="text-lg font-black uppercase tracking-tight">
                Loop {String(li + 1).padStart(2, "0")}: {loop.name}
              </p>
              <span className="bg-black px-2 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-white">
                Detected: {loop.occurrencesCount} times
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-stretch gap-2">
              {loop.sequence.map((step, i) => (
                <React.Fragment key={i}>
                  <PatternNode step={`STEP ${String(i + 1).padStart(2, "0")}`} label={step} />
                  {i < loop.sequence.length - 1 && (
                    <span aria-hidden="true" className="self-center text-2xl font-black">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="mt-4 bg-swiss-muted p-3 text-sm text-black">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest">
                Typical resolution —{" "}
              </span>
              {loop.typicalResolution}
            </p>
          </div>
        ))}
        {report.patternLoops.length === 0 && (
          <p className="font-mono text-xs uppercase tracking-widest">No recurring loops isolated.</p>
        )}
      </div>
    </div>
  );
}
