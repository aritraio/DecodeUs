"use client";

import { SlideShell, type SlideProps } from "@/components/wrapped/slides/slide-shell";

/** Slide 04 — The Lexicon & Emoji Signatures. */
export function Slide04Lexicon({ metrics }: SlideProps): React.JSX.Element {
  const { personA, personB } = metrics.lexical;
  return (
    <SlideShell index="04/06" kicker="THE LEXICON">
      <div className="grid gap-4 md:grid-cols-2">
        {(
          [
            ["Person A", personA],
            ["Person B", personB],
          ] as const
        ).map(([who, stats]) => (
          <div key={who} className="rounded-none border-2 border-black bg-white p-4">
            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
              {who}
            </p>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {stats.topEmojis.slice(0, 5).map((e) => (
                <div key={e.emoji} className="border border-swiss-muted-border bg-swiss-muted p-2 text-center">
                  <p className="text-2xl">{e.emoji}</p>
                  <p className="font-mono text-[10px] font-bold">×{e.count}</p>
                </div>
              ))}
              {stats.topEmojis.length === 0 && (
                <p className="col-span-5 font-mono text-xs uppercase tracking-widest text-neutral-500">
                  No emoji signature
                </p>
              )}
            </div>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-black">
              {stats.doubleTextCount} double-texts · {stats.questionsAsked} questions ·{" "}
              {stats.avgWordCount} words/msg
            </p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
