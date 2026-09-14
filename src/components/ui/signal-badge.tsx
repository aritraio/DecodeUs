import * as React from "react";
import { cn } from "@/lib/utils";

interface SignalBadgeProps {
  type: "green" | "red" | "mixed";
  title: string;
  occurrences?: number;
  className?: string;
}

/**
 * Geometric status badge: green flag / critical pattern / mixed signal.
 * Square identifiers only — no pills, no radius.
 */
export function SignalBadge({ type, title, occurrences, className }: SignalBadgeProps): React.JSX.Element {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-between gap-4 rounded-none border-2 border-black bg-white px-4 py-3",
        type === "red" && "border-l-8 border-l-swiss-accent",
        type === "mixed" && "bg-swiss-muted",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "h-3 w-3 flex-shrink-0 rounded-none",
            type === "green" && "bg-swiss-green",
            type === "red" && "bg-swiss-accent",
            type === "mixed" && "bg-swiss-amber"
          )}
        />
        <span className="text-xs font-black uppercase tracking-wide text-black">{title}</span>
      </div>
      {typeof occurrences === "number" && (
        <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-600">
          [{occurrences}× OBSERVED]
        </span>
      )}
    </div>
  );
}
