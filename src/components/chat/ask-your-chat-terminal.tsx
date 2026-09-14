"use client";

/**
 * Full "Ask Your Chat" terminal (task 10.2).
 * Monospaced `> QUERY:` input, 5 preset pills, grounded answers with
 * confidence badges + clickable excerpt citations, amber insufficient
 * evidence alert.
 */
import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";
import { retrieveRelevantExcerpts } from "@/lib/chat/retrieval";
import { EvidenceDrawer } from "@/components/dashboard/drawers/evidence-drawer";
import type { ContextExcerpt } from "@/types/chat";

const PRESETS = [
  "Who apologizes first?",
  "When did we talk the most?",
  "What topics cause silence?",
  "Are our reply times balanced?",
  "How has texting changed over time?",
];

interface AnswerState {
  answer: string;
  confidence: string;
  supportingExcerptIds: string[];
}

export function AskYourChatTerminal(): React.JSX.Element {
  const { messages, metadata, excerpts } = useAnalysis();
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AnswerState | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [drawerIds, setDrawerIds] = React.useState<string[]>([]);
  const [queryExcerpts, setQueryExcerpts] = React.useState<ContextExcerpt[]>([]);

  const submit = React.useCallback(
    async (q: string) => {
      const text = q.trim();
      if (!text || loading) return;
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        // Live retrieval over canonical messages, redacted client-side
        // with real participant names so no raw PII reaches /api/chat.
        const live = retrieveRelevantExcerpts(
          messages,
          text,
          5,
          metadata?.senderA.displayName ?? "",
          metadata?.senderB.displayName ?? ""
        );
        // Retain the live qexc_* windows so cited receipts can be
        // inspected in the EvidenceDrawer.
        setQueryExcerpts(live);
        const relevant = live.length > 0 ? live : [];
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: text,
            relevantExcerpts:
              relevant.length > 0
                ? relevant
                : excerpts.slice(0, 3).map((e, i) => ({ ...e, id: e.id })),
            conversationMetadata: {
              totalDays: metadata?.totalDays ?? 0,
              totalMessages: metadata?.totalMessages ?? 0,
            },
          }),
        });
        if (!res.ok) throw new Error(`Chat failed (${res.status}).`);
        const json = (await res.json()) as AnswerState;
        setResult(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Query failed.");
      } finally {
        setLoading(false);
      }
    },
    [messages, metadata, excerpts, loading]
  );

  const insufficient = result?.confidence === "INSUFFICIENT_EVIDENCE";

  return (
    <div role="tabpanel" id="panel-ask" aria-labelledby="tab-ask" data-testid="ask-chat-terminal">
      <div className="rounded-none border-2 border-black bg-white">
        <div className="border-b-2 border-black bg-black px-4 py-2">
          <p className="font-mono text-[10px] font-black uppercase tracking-widest text-white">
            &gt; Ask your chat — grounded terminal
          </p>
        </div>
        <div className="p-4 md:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit(query);
            }}
            className="flex gap-2"
          >
            <label htmlFor="ask-query" className="flex flex-1 items-center gap-2 rounded-none border-2 border-black bg-white px-3">
              <span aria-hidden="true" className="font-mono text-sm font-black text-swiss-accent">
                &gt;
              </span>
              <input
                id="ask-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="QUERY: WHO APOLOGIZES FIRST?"
                aria-label="Ask a question about your chat"
                className="w-full bg-transparent py-3 font-mono text-sm uppercase tracking-wide placeholder:text-neutral-400 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="rounded-none border-2 border-black bg-black px-5 font-mono text-xs font-black uppercase tracking-widest text-white hover:bg-swiss-accent disabled:opacity-50"
            >
              {loading ? "…" : "Ask"}
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Suggested queries">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setQuery(p);
                  void submit(p);
                }}
                className="rounded-none border-2 border-black bg-white px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent"
              >
                [{p}]
              </button>
            ))}
          </div>

          {error && (
            <p role="alert" className="mt-4 border-4 border-swiss-accent p-3 text-sm font-bold">
              {error}
            </p>
          )}

          {insufficient && result && (
            <p role="alert" className="mt-4 border-4 border-swiss-amber bg-white p-3 font-mono text-xs font-black uppercase tracking-widest">
              Insufficient evidence: chat history does not contain enough conflict excerpts.
            </p>
          )}

          {result && !insufficient && (
            <div className="mt-4 border-2 border-black bg-swiss-muted p-4">
              <div className="flex items-center gap-2">
                <span className="bg-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest text-white">
                  Confidence: {result.confidence}
                </span>
              </div>
              <p className="mt-2 text-sm text-black md:text-base">{result.answer}</p>
              {result.supportingExcerptIds.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.supportingExcerptIds.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setDrawerIds([id])}
                      className="rounded-none border-2 border-black bg-white px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white"
                    >
                      [{id} →]
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {drawerIds.length > 0 && (
        <EvidenceDrawer
          excerptIds={drawerIds}
          customExcerpts={queryExcerpts}
          onClose={() => setDrawerIds([])}
        />
      )}
    </div>
  );
}
