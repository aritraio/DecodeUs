"use client";

import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";
import { cn } from "@/lib/utils";

export const DASHBOARD_TABS = [
  { id: "fingerprint", label: "01. FINGERPRINT" },
  { id: "signals", label: "02. SIGNALS & FLAGS" },
  { id: "patterns", label: "03. PATTERN REPLAY" },
  { id: "reality", label: "04. REALITY CHECK" },
  { id: "ask", label: "05. ASK CHAT" },
] as const;

/**
 * Sticky architectural tab bar with full keyboard navigation
 * (ArrowRight/Left/Home/End). Swiss Red active indicator.
 */
export function DashboardNav(): React.JSX.Element {
  const { activeTab, setActiveTab } = useAnalysis();
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: React.KeyboardEvent, idx: number): void => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (idx + 1) % DASHBOARD_TABS.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + DASHBOARD_TABS.length) % DASHBOARD_TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = DASHBOARD_TABS.length - 1;
    if (next !== null) {
      e.preventDefault();
      setActiveTab(DASHBOARD_TABS[next].id);
      refs.current[next]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Diagnostic sections"
      className="sticky top-14 z-40 flex overflow-x-auto border-2 border-black bg-white"
    >
      {DASHBOARD_TABS.map((t, i) => {
        const active = activeTab === t.id;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            aria-selected={active}
            aria-controls={`panel-${t.id}`}
            id={`tab-${t.id}`}
            onClick={() => setActiveTab(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-none border-r-2 border-black px-4 py-3 font-mono text-[11px] font-black uppercase tracking-widest last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-swiss-accent",
              active ? "bg-black text-white" : "bg-white text-black hover:bg-swiss-muted"
            )}
          >
            {active && <span className="mr-2 inline-block h-2 w-2 bg-swiss-accent" aria-hidden="true" />}
            [{t.label}]
          </button>
        );
      })}
    </div>
  );
}
