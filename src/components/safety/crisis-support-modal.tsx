"use client";

import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";

/**
 * Solemn crisis & domestic-safety off-ramp (task 10.4).
 * High-contrast, non-judgmental, with helplines + local actions.
 */
export function CrisisSupportModal({ onClose }: { onClose?: () => void }): React.JSX.Element {
  const { clearChatData } = useAnalysis();

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Safety and support notice"
      data-testid="crisis-modal"
      className="rounded-none border-4 border-black bg-white"
    >
      <div className="border-b-2 border-black bg-black px-4 py-3 md:px-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-white">
          Safety & support notice
        </p>
      </div>
      <div className="p-4 md:p-6">
        <p className="text-sm text-black md:text-base">
          DecodeUs has detected communication patterns that may involve emotional, verbal, or
          physical coercion. Your safety and well-being are paramount.
        </p>
        <p className="mt-3 text-sm text-black">
          If you or someone you know is feeling unsafe, support is available 24/7:
        </p>
        <ul className="mt-3 space-y-2 border-2 border-black bg-swiss-muted p-4 font-mono text-xs text-black md:text-sm">
          <li>• National Domestic Violence Hotline (US): 1-800-799-SAFE (7233) or text “START” to 88788</li>
          <li>• Crisis Text Line: Text “HOME” to 741741</li>
          <li>• International Helplines: findahelpline.com</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-none border-2 border-black bg-white px-4 py-2 font-mono text-xs font-black uppercase tracking-widest text-black hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent"
          >
            [Download local safe copy]
          </button>
          <button
            type="button"
            onClick={() => {
              clearChatData();
              onClose?.();
            }}
            className="rounded-none border-2 border-swiss-accent bg-swiss-accent px-4 py-2 font-mono text-xs font-black uppercase tracking-widest text-white hover:bg-black hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent"
          >
            [Clear all chat data now]
          </button>
        </div>
      </div>
    </div>
  );
}
