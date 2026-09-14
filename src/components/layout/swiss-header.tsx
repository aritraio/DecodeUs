import * as React from "react";
import Link from "next/link";

/**
 * Persistent Swiss top navigation frame.
 * Monospace logo + zero-knowledge privacy status pill.
 */
export function SwissHeader(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="font-mono text-xs font-bold uppercase tracking-widest text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent focus-visible:ring-offset-2"
        >
          DECODEUS <span className="text-swiss-accent">{"//"}</span> CONVERSATION INTELLIGENCE
        </Link>
        <div
          role="status"
          aria-label="Privacy status: zero knowledge active"
          className="border-2 border-black bg-black px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white"
        >
          <span className="mr-2 inline-block h-2 w-2 bg-swiss-accent" aria-hidden="true" />
          ZERO_KNOWLEDGE: ACTIVE
        </div>
      </div>
    </header>
  );
}
