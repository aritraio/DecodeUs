import * as React from "react";
import { cn } from "@/lib/utils";

interface SwissButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "default" | "lg";
}

/**
 * Mechanical color-inversion button. No springs, no radius.
 * primary: black → Swiss Red on hover. secondary: white → black.
 * accent: Swiss Red → black.
 */
export const SwissButton = React.forwardRef<HTMLButtonElement, SwissButtonProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-3 rounded-none border-2 border-black font-black uppercase tracking-wider transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          size === "sm" && "h-10 px-4 text-xs",
          size === "default" && "h-14 px-8 text-sm",
          size === "lg" && "h-16 px-10 text-base",
          variant === "primary" && "bg-black text-white hover:border-swiss-accent hover:bg-swiss-accent",
          variant === "secondary" && "bg-white text-black hover:bg-black hover:text-white",
          variant === "accent" && "border-swiss-accent bg-swiss-accent text-white hover:border-black hover:bg-black",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SwissButton.displayName = "SwissButton";
