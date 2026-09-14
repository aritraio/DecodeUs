"use client";

/**
 * Full-screen 6-slide story viewer (task 08.1).
 * - 6-segment progress bar; Space/Right/tap-right → next; Left/tap-left → prev; Esc → dashboard.
 * - Rigid Framer Motion step displacement (x: 100% → 0%, 250ms mechanical).
 */
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalysis } from "@/lib/store/analysis-context";
import { WrappedProgressBar } from "@/components/wrapped/progress-bar";
import { Slide01Volume } from "@/components/wrapped/slides/slide-01-volume";
import { Slide02Initiative } from "@/components/wrapped/slides/slide-02-initiative";
import { Slide03Rhythm } from "@/components/wrapped/slides/slide-03-rhythm";
import { Slide04Lexicon } from "@/components/wrapped/slides/slide-04-lexicon";
import { Slide05Signals } from "@/components/wrapped/slides/slide-05-signals";
import { Slide06Archetype } from "@/components/wrapped/slides/slide-06-archetype";

export const WRAPPED_TOTAL = 6;

export function WrappedContainer(): React.JSX.Element {
  const { metrics, metadata, setShowWrapped } = useAnalysis();
  const [current, setCurrent] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  const next = React.useCallback(() => {
    setDirection(1);
    setCurrent((c) => Math.min(WRAPPED_TOTAL - 1, c + 1));
  }, []);
  const prev = React.useCallback(() => {
    setDirection(-1);
    setCurrent((c) => Math.max(0, c - 1));
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") {
        setShowWrapped(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, setShowWrapped]);

  if (!metrics || !metadata) return <div data-testid="wrapped-container" />;

  const slides = [
    <Slide01Volume key="s1" metrics={metrics} metadata={metadata} />,
    <Slide02Initiative key="s2" metrics={metrics} metadata={metadata} />,
    <Slide03Rhythm key="s3" metrics={metrics} metadata={metadata} />,
    <Slide04Lexicon key="s4" metrics={metrics} metadata={metadata} />,
    <Slide05Signals key="s5" metrics={metrics} metadata={metadata} />,
    <Slide06Archetype key="s6" metrics={metrics} metadata={metadata} />,
  ];

  return (
    <div data-testid="wrapped-container" className="mt-8 border-4 border-black bg-swiss-muted p-4 md:p-8">
      <WrappedProgressBar current={current} total={WRAPPED_TOTAL} />
      <div className="relative mt-4 overflow-hidden" data-testid="wrapped-slide" data-slide={current}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ x: direction >= 0 ? "100%" : "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: direction >= 0 ? "-100%" : "100%" }}
            transition={{ duration: 0.25, ease: [0.2, 0.0, 0.0, 1.0] }}
          >
            {slides[current]}
          </motion.div>
        </AnimatePresence>
        {/* Tap zones */}
        <button
          type="button"
          aria-label="Previous slide"
          data-testid="wrapped-prev-zone"
          onClick={prev}
          className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize opacity-0 focus:opacity-100"
        />
        <button
          type="button"
          aria-label="Next slide"
          data-testid="wrapped-next-zone"
          onClick={next}
          className="absolute inset-y-0 right-0 w-1/2 cursor-e-resize opacity-0 focus:opacity-100"
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={current === 0}
          className="rounded-none border-2 border-black bg-white px-4 py-2 font-mono text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white disabled:opacity-40"
        >
          [← Previous]
        </button>
        <span className="font-mono text-xs font-bold uppercase tracking-widest">
          {String(current + 1).padStart(2, "0")} / 06
        </span>
        {current < WRAPPED_TOTAL - 1 ? (
          <button
            type="button"
            onClick={next}
            className="rounded-none border-2 border-black bg-black px-4 py-2 font-mono text-xs font-black uppercase tracking-widest text-white hover:bg-swiss-accent"
          >
            [Next →]
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowWrapped(false)}
            className="rounded-none border-2 border-swiss-accent bg-swiss-accent px-4 py-2 font-mono text-xs font-black uppercase tracking-widest text-white hover:bg-black hover:border-black"
          >
            [Dashboard →]
          </button>
        )}
      </div>
    </div>
  );
}
