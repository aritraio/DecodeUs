import * as React from "react";

const CELLS: Array<[string, string]> = [
  ["PARSING", "100% IN-BROWSER"],
  ["STORAGE", "ZERO PERSISTENCE"],
  ["DIAGNOSTIC POLICY", "NO CLINICAL LABELS"],
  ["AI SCOPE", "REDACTED EXCERPTS ONLY"],
];

/**
 * 4-cell technical privacy manifest table (design.md §5.1).
 */
export function PrivacyManifestTable(): React.JSX.Element {
  return (
    <div className="rounded-none border-2 border-black bg-white">
      <div className="border-b-2 border-black bg-black px-4 py-2">
        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-white">
          Privacy by design — manifest
        </p>
      </div>
      <dl>
        {CELLS.map(([k, v]) => (
          <div key={k} className="grid grid-cols-2 border-b border-swiss-muted-border last:border-b-0">
            <dt className="bg-swiss-muted px-4 py-3 font-mono text-[10px] font-black uppercase tracking-widest text-black">
              {k}
            </dt>
            <dd className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
