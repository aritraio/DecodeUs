import * as React from "react";
import { cn } from "@/lib/utils";

interface SwissCardProps extends React.HTMLAttributes<HTMLDivElement> {
  indexLabel?: string;
  variant?: "white" | "muted" | "alert";
  pattern?: "none" | "grid" | "dots" | "diagonal";
}

/**
 * Master Swiss structural container: 2px/4px black borders,
 * optional red index header, optional CSS texture. Zero radius.
 */
export const SwissCard = React.forwardRef<HTMLDivElement, SwissCardProps>(
  ({ className, indexLabel, variant = "white", pattern = "none", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-none border-2 border-black transition-colors duration-150",
          variant === "white" && "bg-white",
          variant === "muted" && "bg-swiss-muted",
          variant === "alert" && "border-4 border-swiss-accent bg-white",
          pattern === "grid" && "swiss-grid-pattern",
          pattern === "dots" && "swiss-dots",
          pattern === "diagonal" && "swiss-diagonal",
          className
        )}
        {...props}
      >
        {indexLabel && (
          <div className="flex items-center justify-between border-b-2 border-black bg-white px-4 py-2">
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
              {indexLabel}
            </span>
            <span className="h-2 w-2 bg-black" aria-hidden="true" />
          </div>
        )}
        <div className="p-6 md:p-8">{children}</div>
      </div>
    );
  }
);
SwissCard.displayName = "SwissCard";
