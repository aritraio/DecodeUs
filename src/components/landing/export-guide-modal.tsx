"use client";

import * as React from "react";
import { SwissButton } from "@/components/ui/swiss-button";

interface ExportGuideModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Tabbed iOS/Android export instructions modal.
 * Esc closes; 0px corners; focus trapped lightly via autoFocus.
 */
export function ExportGuideModal({ open, onClose }: ExportGuideModalProps): React.JSX.Element | null {
  const [tab, setTab] = React.useState<"ios" | "android">("ios");

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const steps =
    tab === "ios"
      ? [
          "Open the chat in WhatsApp on iPhone.",
          "Tap the contact name at the top.",
          "Scroll down and tap “Export Chat”.",
          "Choose “Without Media” when exporting.",
          "Save the .txt file and drop it into DecodeUs.",
        ]
      : [
          "Open the chat in WhatsApp on Android.",
          "Tap ⋮ (Menu) → More.",
          "Tap “Export Chat”.",
          "Choose “Without Media” when exporting.",
          "Save the .txt file and drop it into DecodeUs.",
        ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="How to export your WhatsApp chat"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-none border-4 border-black bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-black px-6 py-4">
          <p className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
            02. EXPORT GUIDE
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close export guide"
            autoFocus
            className="border-2 border-black bg-white px-3 py-1 font-mono text-xs font-black text-black hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent"
          >
            ESC ✕
          </button>
        </div>
        <div className="flex border-b-2 border-black">
          {(["ios", "android"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`flex-1 rounded-none px-6 py-3 font-mono text-xs font-black uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-swiss-accent ${
                tab === t ? "bg-black text-white" : "bg-white text-black hover:bg-swiss-muted"
              }`}
            >
              [{t === "ios" ? "iOS INSTRUCTIONS" : "ANDROID INSTRUCTIONS"}]
            </button>
          ))}
        </div>
        <ol className="space-y-3 p-6 md:p-8">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-4 border-2 border-black bg-white p-3">
              <span className="font-mono text-xs font-black text-swiss-accent">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span className="text-sm font-medium text-black">{s}</span>
            </li>
          ))}
        </ol>
        <div className="border-t-2 border-black bg-swiss-muted p-6">
          <SwissButton variant="primary" onClick={onClose} className="w-full">
            Got it — I have my .txt file
          </SwissButton>
        </div>
      </div>
    </div>
  );
}
