"use client";

import { SlideShell, type SlideProps } from "@/components/wrapped/slides/slide-shell";
import { SwissButton } from "@/components/ui/swiss-button";
import { useAnalysis } from "@/lib/store/analysis-context";

/** Slide 06 — The Relationship Archetype Dossier + dashboard CTA. */
export function Slide06Archetype(_props: SlideProps): React.JSX.Element {
  const { report, setShowWrapped } = useAnalysis();
  const vibe = report?.wrappedHighlights.relationshipVibeTitle ?? "The Uncharted Exchange";
  const takeaway = report?.wrappedHighlights.communicationTakeaway ?? "";
  const dims = report?.fingerprint;
  const preview = dims
    ? (Object.entries(dims) as Array<[string, number | string]>)
        .filter(([, v]) => typeof v === "number")
        .slice(0, 7)
    : [];

  return (
    <SlideShell index="06/06" kicker="THE ARCHETYPE">
      <p className="text-4xl font-black uppercase leading-none tracking-tighter text-black md:text-6xl">
        {vibe}
      </p>
      {takeaway && <p className="mt-3 max-w-2xl text-base text-black">{takeaway}</p>}
      {preview.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-px border-2 border-black bg-black md:grid-cols-4">
          {preview.map(([k, v]) => (
            <div key={k} className="bg-white p-3">
              <p className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
                {k}
              </p>
              <p className="text-2xl font-black">{v}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <SwissButton variant="accent" onClick={() => setShowWrapped(false)}>
          [Explore deep diagnostic dashboard →]
        </SwissButton>
      </div>
    </SlideShell>
  );
}
