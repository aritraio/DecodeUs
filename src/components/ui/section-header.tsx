import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index: string;
  title: string;
  meta?: string;
  className?: string;
}

/**
 * Architectural section heading: red numeral prefix + grotesk title.
 */
export function SectionHeader({ index, title, meta, className }: SectionHeaderProps): React.JSX.Element {
  return (
    <div className={cn("border-b-2 border-black pb-4", className)}>
      <p className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
        {index}
      </p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black md:text-4xl">
          {title}
        </h2>
        {meta && (
          <span className="border-2 border-black bg-swiss-muted px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
            {meta}
          </span>
        )}
      </div>
    </div>
  );
}
