"use client";

import { SlideShell, fmtInt, type SlideProps } from "@/components/wrapped/slides/slide-shell";

/** Slide 01 — The Volume & Endurance. */
export function Slide01Volume({ metrics, metadata }: SlideProps): React.JSX.Element {
  const start = new Date(metadata.startDate).toLocaleDateString();
  const end = new Date(metadata.endDate).toLocaleDateString();
  return (
    <SlideShell index="01/06" kicker="THE VOLUME">
      <p className="text-[4rem] font-black leading-none tracking-tighter text-black md:text-[10rem]">
        {fmtInt(metrics.volume.totalMessages)}
      </p>
      <p className="mt-2 text-xl font-black uppercase tracking-tight md:text-2xl">
        messages across {metadata.totalDays} days
      </p>
      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-neutral-600">
        {start} → {end} · {metrics.volume.averagePerDay} msgs/day · longest silence{" "}
        {Math.max(
          metrics.responseSpeed.personA.longestSilenceHours,
          metrics.responseSpeed.personB.longestSilenceHours
        )}
        h
      </p>
    </SlideShell>
  );
}
