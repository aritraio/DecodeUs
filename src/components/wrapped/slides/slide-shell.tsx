"use client";

import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";
import type { DeterministicMetrics } from "@/types/metrics";
import type { ConversationMetadata } from "@/types/chat";

/** Shared slide shell: exhibition poster frame. */
export function SlideShell({
  index,
  kicker,
  children,
}: {
  index: string;
  kicker: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="rounded-none border-4 border-black bg-white">
      <div className="flex items-center justify-between border-b-2 border-black px-4 py-2 md:px-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-swiss-accent">
          [{index}] {kicker}
        </p>
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-black">
          DECODEUS ARCHIVE &apos;26
        </p>
      </div>
      <div className="p-6 md:p-10">{children}</div>
    </div>
  );
}

export interface SlideProps {
  metrics: DeterministicMetrics;
  metadata: ConversationMetadata;
}

export function fmtInt(n: number): string {
  return n.toLocaleString("en-US");
}
