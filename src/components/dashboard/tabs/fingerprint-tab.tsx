"use client";

import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";
import { FingerprintRadar } from "@/components/dashboard/charts/radar-chart";
import { SectionHeader } from "@/components/ui/section-header";

const DIM_COPY: Record<string, string> = {
  communication: "Clarity, active listening, and openness in daily exchange.",
  emotionalReciprocity: "Bilateral validation and vulnerability matching.",
  conflictHandling: "De-escalation versus defensiveness and withdrawal.",
  effortBalance: "Initiation, planning, and continuation balance.",
  affection: "Affectionate phrasing, affirmations, and warmth.",
  consistency: "Predictability versus sporadic hot/cold texting.",
  boundaries: "Respect for personal space and time.",
};

/** Tab 01 — 7-pillar fingerprint matrix + overall balance. */
export function FingerprintTab(): React.JSX.Element {
  const { report } = useAnalysis();
  if (!report) return <div />;
  const fp = report.fingerprint;
  type DimKey = keyof Omit<typeof fp, "summary">;
  const dims = Object.keys(DIM_COPY) as DimKey[];
  const overall = Math.round(dims.reduce((a, k) => a + fp[k], 0) / dims.length);

  return (
    <div role="tabpanel" id="panel-fingerprint" aria-labelledby="tab-fingerprint">
      <SectionHeader index="01. FINGERPRINT" title="Relationship Fingerprint" meta={`OVERALL BALANCE: ${overall}`} />
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <FingerprintRadar fingerprint={fp} />
          <p className="mt-4 border-2 border-black bg-swiss-muted p-4 text-sm text-black">{fp.summary}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          {dims.map((k) => (
            <div key={k} className="rounded-none border-2 border-black bg-white p-4">
              <p className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
                {k}
              </p>
              <p className="mt-1 text-4xl font-black tracking-tight">{fp[k]}</p>
              <div className="mt-2 h-2 w-full border border-black bg-swiss-muted">
                <div className="h-full bg-black" style={{ width: `${fp[k]}%` }} />
              </div>
              <p className="mt-2 text-xs text-black">{DIM_COPY[k]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
