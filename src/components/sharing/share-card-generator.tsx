"use client";

import * as React from "react";
import { toPng } from "html-to-image";
import { ShareCardTemplate, type ShareAspect } from "@/components/sharing/share-card-template";
import { SwissButton } from "@/components/ui/swiss-button";

/**
 * Social share card exporter (task 10.3).
 * Renders the privacy-safe template off-screen and exports .png
 * via html-to-image. 9:16 story + 16:9 post.
 */
export function ShareCardGenerator(): React.JSX.Element {
  const [aspect, setAspect] = React.useState<ShareAspect>("story");
  const [busy, setBusy] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const download = React.useCallback(async () => {
    if (!ref.current || busy) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(ref.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.download = `decodeus-wrapped-${aspect}.png`;
      a.href = dataUrl;
      a.click();
    } finally {
      setBusy(false);
    }
  }, [aspect, busy]);

  return (
    <div className="mt-8 rounded-none border-2 border-black bg-white p-4 md:p-6" data-testid="share-generator">
      <p className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
        06. SHARE CARD — zero-PII export
      </p>
      <div className="mt-3 flex gap-2">
        {(["story", "wide"] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAspect(a)}
            aria-pressed={aspect === a}
            className={`rounded-none border-2 border-black px-3 py-2 font-mono text-[11px] font-black uppercase tracking-widest ${
              aspect === a ? "bg-black text-white" : "bg-white text-black hover:bg-swiss-muted"
            }`}
          >
            [{a === "story" ? "9:16 story" : "16:9 post"}]
          </button>
        ))}
      </div>
      <div ref={ref} className="mt-4 overflow-auto bg-swiss-muted p-4">
        <ShareCardTemplate aspect={aspect} />
      </div>
      <SwissButton variant="primary" className="mt-4 w-full" disabled={busy} onClick={() => void download()}>
        {busy ? "Rendering…" : "[Download PNG export]"}
      </SwissButton>
    </div>
  );
}
