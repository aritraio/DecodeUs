"use client";

import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";
import type { ContextExcerpt } from "@/types/chat";

/**
 * Mechanical evidence receipts drawer: monospaced dialogue lines with
 * timestamps, sender labels, and Swiss Red trigger highlights.
 * Accepts optional `customExcerpts` (e.g. live "Ask Your Chat" qexc_*
 * windows) which are merged with the session excerpts for lookup so
 * dynamically cited receipts can be inspected.
 */
export function EvidenceDrawer({
  excerptIds,
  onClose,
  customExcerpts = [],
}: {
  excerptIds: string[];
  onClose: () => void;
  customExcerpts?: ContextExcerpt[];
}): React.JSX.Element | null {
  const { excerpts } = useAnalysis();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const items = [...excerpts, ...customExcerpts].filter((e) => excerptIds.includes(e.id));
  if (excerptIds.length === 0) return null;

  const highlight = (text: string): React.ReactNode => {
    // Highlight trigger lexicon in Swiss Red
    const parts = text.split(/(\balways\b|\bnever\b|\blisten\b|\bsorry\b|\bupset\b|\bhurt\b|\bfault\b)/gi);
    return parts.map((p, i) =>
      /^(always|never|listen|sorry|upset|hurt|fault)$/i.test(p) ? (
        <mark key={i} className="bg-swiss-accent px-1 py-0.5 font-mono text-xs uppercase text-white">
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      )
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Evidence dossier"
      className="fixed inset-x-0 bottom-0 z-[90] max-h-[80vh] overflow-y-auto rounded-none border-t-4 border-black bg-white"
      data-testid="evidence-drawer"
    >
      <div className="sticky top-0 flex items-center justify-between border-b-2 border-black bg-black px-4 py-3 md:px-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-white">
          Evidence dossier — {items.length} excerpt(s)
        </p>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="border-2 border-white bg-black px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-white hover:bg-swiss-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent"
        >
          [ESC / Close receipt dossier]
        </button>
      </div>
      <div className="space-y-4 p-4 md:p-6">
        {items.map((e) => (
          <div key={e.id} className="rounded-none border-2 border-black">
            <p className="border-b border-swiss-muted-border bg-swiss-muted px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-widest">
              {e.id} — {new Date(e.startDate).toLocaleString()} · trigger: {e.triggerReason}
            </p>
            <div className="space-y-2 p-3">
              {e.dialogue.map((line, i) => (
                <p key={i} className="font-mono text-sm text-black">
                  <span className="text-neutral-500">
                    {new Date(line.timestamp).toLocaleTimeString()} | {line.sender}:
                  </span>{" "}
                  “{highlight(line.text)}”
                </p>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="font-mono text-xs uppercase tracking-widest">
            No excerpts matched these IDs in this session.
          </p>
        )}
      </div>
    </div>
  );
}
