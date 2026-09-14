"use client";

import { SlideShell, type SlideProps } from "@/components/wrapped/slides/slide-shell";

/** Slide 02 — The Initiation Split (monolithic vertical bars). */
export function Slide02Initiative({ metrics, metadata }: SlideProps): React.JSX.Element {
  const aPct = Math.round(metrics.initiation.personA.percentage * 100);
  const bPct = 100 - aPct;
  const total = metrics.initiation.totalSessions;
  return (
    <SlideShell index="02/06" kicker="THE INITIATIVE">
      <div className="flex items-end gap-6 md:gap-10">
        <div className="flex-1">
          <p className="text-8xl font-black tracking-tighter text-black">{aPct}%</p>
          <p className="mt-1 font-mono text-xs font-black uppercase tracking-widest">Person A</p>
          <div className="mt-3 border-2 border-black bg-black" style={{ height: `${Math.max(24, aPct * 2)}px` }} />
        </div>
        <div className="flex-1">
          <p className="text-8xl font-black tracking-tighter text-black">{bPct}%</p>
          <p className="mt-1 font-mono text-xs font-black uppercase tracking-widest">Person B</p>
          <div
            className="mt-3 rounded-none border-4 border-black bg-white"
            style={{ height: `${Math.max(24, bPct * 2)}px` }}
          />
        </div>
      </div>
      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-black">
        Out of {total} conversation starts over {metadata.totalDays} days, Person A initiated {aPct}%.
      </p>
    </SlideShell>
  );
}
