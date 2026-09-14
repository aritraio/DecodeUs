"use client";

import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";
import { SectionHeader } from "@/components/ui/section-header";
import { SwissButton } from "@/components/ui/swiss-button";

const PRESETS = [
  "Are they losing interest?",
  "Do we resolve arguments or drop them?",
  "Is initiation balanced?",
];

/** Tab 04 — assumption vs observed-data comparison matrix. */
export function RealityCheckTab(): React.JSX.Element {
  const { report, optionalConcern } = useAnalysis();
  const [custom, setCustom] = React.useState(optionalConcern || "");
  const [answer, setAnswer] = React.useState<string | null>(null);
  if (!report) return <div />;

  const checks = report.realityChecks;

  return (
    <div role="tabpanel" id="panel-reality" aria-labelledby="tab-reality">
      <SectionHeader index="04. REALITY CHECK" title="Assumption Lab" meta={`${checks.length} CHECKS`} />
      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setCustom(p);
              setAnswer(
                "Compare this assumption against initiation share, reply latency, and message depth in the fingerprint above. The observed metrics decide the verdict — not the worry."
              );
            }}
            className="rounded-none border-2 border-black bg-white px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent"
          >
            [{p}]
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          aria-label="Test a specific worry"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="TYPE A WORRY TO TEST — E.G. THEY NEVER LISTEN"
          className="w-full rounded-none border-2 border-black bg-white px-4 py-3 text-sm font-medium placeholder:text-neutral-400 placeholder:uppercase placeholder:text-xs placeholder:tracking-wider focus:border-swiss-accent focus:outline-none"
        />
        <SwissButton
          variant="primary"
          size="sm"
          onClick={() =>
            setAnswer(
              custom.trim()
                ? "Measured against initiation share, reply latency, and message depth: hold this worry next to the fingerprint scores and cited receipts before concluding."
                : "Type a worry first — the lab tests assumptions, not empty inputs."
            )
          }
        >
          Test
        </SwissButton>
      </div>
      {answer && (
        <p role="status" className="mt-3 border-2 border-black bg-swiss-muted p-3 text-sm">
          {answer}
        </p>
      )}
      <div className="mt-6 space-y-4">
        {checks.map((rc, i) => (
          <div key={i} className="rounded-none border-2 border-black bg-white">
            <div className="grid md:grid-cols-2">
              <div className="border-b-2 border-black p-4 md:border-b-0 md:border-r-2 md:p-6">
                <p className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
                  Your assumption
                </p>
                <p className="mt-2 text-sm font-bold text-black">“{rc.userAssumption}”</p>
              </div>
              <div className="bg-swiss-muted p-4 md:p-6">
                <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black">
                  Observed chat data
                </p>
                <p className="mt-2 font-mono text-sm text-black">{rc.observedData}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-black bg-black p-4">
              <p className="text-sm font-black uppercase tracking-wide text-white">
                Verdict: {rc.verdict.replace(/_/g, " ")}
              </p>
              <span className="bg-swiss-accent px-2 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-white">
                {rc.verdict}
              </span>
            </div>
            <p className="p-4 text-sm text-black md:px-6">{rc.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
