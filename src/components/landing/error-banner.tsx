"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ErrorBannerProps {
  message: string;
  code?: string | null;
  onDismiss?: () => void;
  className?: string;
}

/**
 * High-contrast Swiss error banner: 4px red border, muted cell,
 * monospace code tag. Used across ingestion + analysis failures.
 */
export function ErrorBanner({ message, code, onDismiss, className }: ErrorBannerProps): React.JSX.Element {
  return (
    <div
      role="alert"
      className={cn("rounded-none border-4 border-swiss-accent bg-white p-4 md:p-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
            00. INGESTION FAULT{code ? ` — ${code}` : ""}
          </p>
          <p className="mt-2 text-sm font-bold uppercase tracking-wide text-black">{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="border-2 border-black bg-white px-2 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

/** Map parser error codes to friendly banner copy (workflow.md §3). */
export function friendlyErrorMessage(code: string | null, fallback: string): string {
  if (code === "SINGLE_PARTICIPANT_DETECTED") {
    return "Only 1 participant detected. DecodeUs requires a two-person conversation.";
  }
  if (code === "GROUP_CHAT_UNSUPPORTED") {
    return "Group chat detected. DecodeUs supports two-person conversations only.";
  }
  if (code === "UNPARSEABLE_CHAT" || code === "EMPTY_CHAT") {
    return "Unsupported file format. Please upload a WhatsApp .txt chat export.";
  }
  return fallback;
}
