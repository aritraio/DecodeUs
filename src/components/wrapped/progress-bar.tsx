"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 6-segment story progress bar. Active fills, past filled, future empty.
 */
export function WrappedProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}): React.JSX.Element {
  return (
    <div className="flex gap-2" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total} aria-label="Story progress">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          data-testid={i === current ? "progress-active" : `progress-${i}`}
          className={cn(
            "h-2 flex-1 rounded-none border border-black",
            i < current && "bg-black",
            i === current && "bg-swiss-accent",
            i > current && "bg-white"
          )}
        />
      ))}
    </div>
  );
}
