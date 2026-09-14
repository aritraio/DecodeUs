import * as React from "react";

/** Rectangular step node with red monospaced step tag. */
export function PatternNode({ step, label }: { step: string; label: string }): React.JSX.Element {
  return (
    <div className="min-w-40 rounded-none border-2 border-black bg-white p-4">
      <p className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
        [{step}]
      </p>
      <p className="mt-1 text-sm font-black uppercase tracking-wide text-black">{label}</p>
    </div>
  );
}
