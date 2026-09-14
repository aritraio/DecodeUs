"use client";

import { SlideShell, type SlideProps } from "@/components/wrapped/slides/slide-shell";

/** Slide 03 — The Rhythm (24-column circadian clock). */
export function Slide03Rhythm({ metrics }: SlideProps): React.JSX.Element {
  const hours = metrics.temporal.hourlyDistribution;
  const max = Math.max(1, ...hours);
  return (
    <SlideShell index="03/06" kicker="THE RHYTHM">
      <div className="flex h-40 items-end gap-[3px] md:h-56" role="img" aria-label={`Peak messaging hour ${metrics.temporal.peakHour}:00`}>
        {hours.map((v, h) => (
          <div
            key={h}
            data-testid={h === metrics.temporal.peakHour ? "peak-bar" : `hour-bar-${h}`}
            title={`${String(h).padStart(2, "0")}:00 — ${v} msgs`}
            className={h === metrics.temporal.peakHour ? "flex-1 bg-swiss-accent" : "flex-1 bg-black"}
            style={{ height: `${Math.max(4, Math.round((v / max) * 100))}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-neutral-600">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
      <p className="mt-4 text-xl font-black uppercase tracking-tight">
        Peak window {String(metrics.temporal.peakHour).padStart(2, "0")}:00 · Busiest day{" "}
        {metrics.temporal.busiestDay}
      </p>
    </SlideShell>
  );
}
