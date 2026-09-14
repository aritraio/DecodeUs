import * as React from "react";
import { cn } from "@/lib/utils";

interface SwissLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Master responsive Swiss layout frame — max width container with
 * visible structural rhythm. All corners forced to 0px globally.
 */
export function SwissLayout({ children, className, ...props }: SwissLayoutProps): React.JSX.Element {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 md:px-8", className)} {...props}>
      {children}
    </div>
  );
}
