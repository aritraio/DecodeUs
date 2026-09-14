"use client";

import { SlideShell, type SlideProps } from "@/components/wrapped/slides/slide-shell";
import { SignalBadge } from "@/components/ui/signal-badge";
import { useAnalysis } from "@/lib/store/analysis-context";

/** Slide 05 — The Behavioral Signals (top green + top mixed). */
export function Slide05Signals(_props: SlideProps): React.JSX.Element {
  const { report } = useAnalysis();
  const green = report?.signals.find((s) => s.type === "GREEN");
  const mixed = report?.signals.find((s) => s.type === "AMBER");
  return (
    <SlideShell index="05/06" kicker="THE SIGNALS">
      <div className="space-y-4">
        {green ? (
          <div>
            <SignalBadge type="green" title={green.title} occurrences={green.occurrences} />
            <p className="mt-2 text-sm text-black">{green.description}</p>
          </div>
        ) : (
          <p className="font-mono text-xs uppercase tracking-widest">No green flag isolated.</p>
        )}
        {mixed ? (
          <div>
            <SignalBadge type="mixed" title={mixed.title} occurrences={mixed.occurrences} />
            <p className="mt-2 text-sm text-black">{mixed.description}</p>
          </div>
        ) : (
          <p className="font-mono text-xs uppercase tracking-widest">No mixed signal isolated.</p>
        )}
      </div>
    </SlideShell>
  );
}
