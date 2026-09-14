"use client";

import * as React from "react";
import confetti from "canvas-confetti";
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

  // Celebratory burst on archetype reveal (fires once per mount).
  // Probe for a real 2D canvas first so SSR / canvas-less runtimes
  // skip the decorative burst instead of throwing asynchronously.
  const celebrated = React.useRef(false);
  React.useEffect(() => {
    if (celebrated.current) return;
    celebrated.current = true;
    try {
      const probe = document
        .createElement("canvas")
        .getContext?.("2d");
      if (!probe) return;
      void confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.3 },
        colors: ["#FF3000", "#000000", "#ffffff"],
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti is decorative; never block the reveal.
    }
  }, []);

  const saveShareCard = React.useCallback(() => {
    setShowWrapped(false);
    // Dashboard mounts after the wrapped → dashboard transition;
    // scroll to the zero-PII share card exporter once it is in the DOM.
    window.setTimeout(() => {
      document
        .querySelector('[data-testid="share-generator"]')
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [setShowWrapped]);

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
        <SwissButton variant="secondary" onClick={saveShareCard}>
          [Save share card]
        </SwissButton>
      </div>
    </SlideShell>
  );
}
